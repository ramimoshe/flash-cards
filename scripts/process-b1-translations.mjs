/**
 * Process B1 words with translations and sentences
 * Processes in batches to avoid rate limits
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Delay function to avoid rate limits
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Translate word using Google Translate (free API)
async function translateWord(word, sourceLang = 'en', targetLang = 'he') {
  try {
    const params = new URLSearchParams({
      client: 'gtx',
      sl: sourceLang,
      tl: targetLang,
      q: word,
    });
    params.append('dt', 't');
    params.append('dt', 'bd');

    const url = `https://translate.googleapis.com/translate_a/single?${params.toString()}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Translation failed: ${response.status}`);
    }

    const data = await response.json();
    const translations = [];
    
    // Extract translations from response
    if (data[0] && Array.isArray(data[0])) {
      data[0].forEach(item => {
        if (item[0] && typeof item[0] === 'string') {
          const hebrewMatch = item[0].match(/[\u0590-\u05FF\s]+/g);
          if (hebrewMatch) {
            const hebrewText = hebrewMatch.join('').trim();
            if (hebrewText && !translations.includes(hebrewText)) {
              translations.push(hebrewText);
            }
          }
        }
      });
    }
    
    // Also check dictionary results
    if (data[1]) {
      data[1].forEach(item => {
        if (item[2] && Array.isArray(item[2])) {
          item[2].forEach(trans => {
            if (trans && typeof trans === 'string') {
              const hebrewMatch = trans.match(/[\u0590-\u05FF\s]+/g);
              if (hebrewMatch) {
                const hebrewText = hebrewMatch.join('').trim();
                if (hebrewText && !translations.includes(hebrewText)) {
                  translations.push(hebrewText);
                }
              }
            }
          });
        }
      });
    }

    return translations.slice(0, 3); // Return top 3 translations
  } catch (error) {
    console.error(`Error translating "${word}":`, error.message);
    return [];
  }
}

// Get example sentences from Free Dictionary API
async function getSentences(word) {
  try {
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Sentence fetch failed: ${response.status}`);
    }

    const data = await response.json();
    const sentences = [];
    
    if (Array.isArray(data) && data[0]?.meanings) {
      for (const meaning of data[0].meanings) {
        if (meaning.definitions && meaning.definitions.length > 0) {
          for (const def of meaning.definitions.slice(0, 2)) {
            if (def.example && typeof def.example === 'string' && !sentences.includes(def.example)) {
              sentences.push(def.example);
              if (sentences.length >= 2) break;
            }
          }
        }
        if (sentences.length >= 2) break;
      }
    }
    
    return sentences.slice(0, 2);
  } catch (error) {
    console.error(`Error getting sentences for "${word}":`, error.message);
    return [];
  }
}

// Process a single word
async function processWord(wordObj) {
  const word = wordObj.word;
  console.log(`Processing: ${word}`);
  
  const translations = await translateWord(word);
  await delay(500); // Rate limit delay
  
  const sentences = await getSentences(word);
  await delay(500); // Rate limit delay
  
  // Translate sentences
  const translatedSentences = [];
  for (const sentence of sentences) {
    const trans = await translateWord(sentence);
    translatedSentences.push(trans[0] || '');
    await delay(500); // Rate limit delay
  }
  
  // Update word object
  wordObj.translations = translations.length > 0 ? translations : ['[Translation needed]'];
  wordObj.sentences = sentences.length > 0 ? sentences : [`Example sentence with ${word}.`, `Another example using ${word}.`];
  wordObj.translatedSentences = translatedSentences.length > 0 ? translatedSentences : ['[Translation needed]', '[Translation needed]'];
  
  return wordObj;
}

// Main processing function - processes first N B1 words
async function processB1Words(startIndex = 0, count = 200) {
  const filePath = path.join(__dirname, '../public/data/oxford-5000-words.json');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  // Get B1 words that need processing
  const b1Words = data.words.filter(w => w.level === 'B1' && (!w.translations || w.translations.length === 0));
  const wordsToProcess = b1Words.slice(startIndex, startIndex + count);
  
  console.log(`Processing B1 words ${startIndex + 1} to ${startIndex + wordsToProcess.length} of ${b1Words.length}`);
  console.log(`This will take approximately ${Math.ceil(wordsToProcess.length * 2 / 60)} minutes.\n`);
  
  for (let i = 0; i < wordsToProcess.length; i++) {
    try {
      await processWord(wordsToProcess[i]);
      
      // Save progress every 10 words
      if ((i + 1) % 10 === 0) {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        console.log(`\n✓ Saved progress: ${i + 1}/${wordsToProcess.length} words processed\n`);
      }
    } catch (error) {
      console.error(`Failed to process "${wordsToProcess[i].word}":`, error.message);
      // Keep empty data to continue
    }
  }
  
  // Final save
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`\n✓ Completed! Processed ${wordsToProcess.length} B1 words.`);
  console.log(`File saved to: ${filePath}`);
}

// Get command line arguments
const startIndex = parseInt(process.argv[2]) || 0;
const count = parseInt(process.argv[3]) || 200;

// Run the script
processB1Words(startIndex, count).catch(console.error);
