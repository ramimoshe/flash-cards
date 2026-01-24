/**
 * Fix missing translations and metadata in oxford-5000-words.json
 * Supports batch processing, progress tracking, and resume capability
 * 
 * Usage:
 *   node scripts/fix-oxford-metadata.mjs --type=b1 --start=0 --count=200
 *   node scripts/fix-oxford-metadata.mjs --type=placeholders
 *   node scripts/fix-oxford-metadata.mjs --type=all
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.join(__dirname, '../public/data/oxford-5000-words.json');
const PROGRESS_FILE = path.join(__dirname, '../oxford-processing-progress.json');
const LOG_FILE = path.join(__dirname, '../oxford-processing.log');

// Delay function to avoid rate limits
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Logging function
function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}`;
  console.log(message);
  fs.appendFileSync(LOG_FILE, logMessage + '\n');
}

// Translate word using Google Translate (free API)
async function translateWord(word, sourceLang = 'en', targetLang = 'he', retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
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
        if (response.status === 429 && attempt < retries) {
          // Rate limited, wait longer
          await delay(2000 * attempt);
          continue;
        }
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
      if (attempt === retries) {
        log(`Error translating "${word}": ${error.message}`);
        return [];
      }
      await delay(1000 * attempt);
    }
  }
  return [];
}

// Get example sentences from Free Dictionary API
async function getSentences(word, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        if (response.status === 429 && attempt < retries) {
          await delay(2000 * attempt);
          continue;
        }
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
      if (attempt === retries) {
        log(`Error getting sentences for "${word}": ${error.message}`);
        return [];
      }
      await delay(1000 * attempt);
    }
  }
  return [];
}

// Check if word has placeholder content
function hasPlaceholder(wordObj) {
  const hasPlaceholderSentence = wordObj.sentences?.some(s => 
    s.includes('Example sentence for') || 
    s.includes('Another example') ||
    s.includes('Example sentence with')
  );
  const hasPlaceholderTranslation = wordObj.translatedSentences?.some(t => 
    t.includes('[Translation needed]')
  );
  return hasPlaceholderSentence || hasPlaceholderTranslation;
}

// Check if word needs processing (missing data)
function needsProcessing(wordObj) {
  const missingTranslations = !wordObj.translations || wordObj.translations.length === 0;
  const missingSentences = !wordObj.sentences || wordObj.sentences.length === 0;
  const missingTranslatedSentences = !wordObj.translatedSentences || wordObj.translatedSentences.length === 0;
  return missingTranslations || missingSentences || missingTranslatedSentences;
}

// Process a single word
async function processWord(wordObj, isPlaceholder = false) {
  const word = wordObj.word;
  log(`Processing: ${word}${isPlaceholder ? ' (placeholder)' : ''}`);
  
  let translations = wordObj.translations || [];
  let sentences = wordObj.sentences || [];
  let translatedSentences = wordObj.translatedSentences || [];
  
  // Fetch translations if missing or if placeholder
  if (translations.length === 0 || translations.some(t => t.includes('[Translation needed]'))) {
    translations = await translateWord(word);
    await delay(500);
  }
  
  // Fetch sentences if missing or placeholder
  if (sentences.length === 0 || hasPlaceholder({ sentences })) {
    sentences = await getSentences(word);
    await delay(500);
  }
  
  // Translate sentences if missing or placeholder
  if (translatedSentences.length === 0 || translatedSentences.some(t => t.includes('[Translation needed]'))) {
    translatedSentences = [];
    for (const sentence of sentences) {
      const trans = await translateWord(sentence);
      translatedSentences.push(trans[0] || '');
      await delay(500);
    }
  }
  
  // Update word object
  wordObj.translations = translations.length > 0 ? translations : ['[Translation needed]'];
  wordObj.sentences = sentences.length > 0 ? sentences : [`Example sentence with ${word}.`, `Another example using ${word}.`];
  wordObj.translatedSentences = translatedSentences.length > 0 ? translatedSentences : ['[Translation needed]', '[Translation needed]'];
  
  return wordObj;
}

// Save progress
function saveProgress(type, processed, total) {
  const progress = {
    type,
    processed,
    total,
    timestamp: new Date().toISOString()
  };
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
}

// Load progress
function loadProgress() {
  try {
    if (fs.existsSync(PROGRESS_FILE)) {
      return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8'));
    }
  } catch (error) {
    log(`Error loading progress: ${error.message}`);
  }
  return null;
}

// Main processing function
async function processWords(type, startIndex = 0, count = 200) {
  log(`\n=== Starting ${type} processing ===`);
  log(`Start index: ${startIndex}, Count: ${count}`);
  
  const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  let wordsToProcess = [];
  
  // Filter words based on type
  if (type === 'b1') {
    wordsToProcess = data.words.filter(w => 
      w.level === 'B1' && needsProcessing(w)
    );
  } else if (type === 'placeholders') {
    wordsToProcess = data.words.filter(w => hasPlaceholder(w));
  } else if (type === 'all') {
    wordsToProcess = data.words.filter(w => needsProcessing(w) || hasPlaceholder(w));
  } else {
    throw new Error(`Unknown type: ${type}. Use 'b1', 'placeholders', or 'all'`);
  }
  
  // Apply batch limits
  const batch = wordsToProcess.slice(startIndex, startIndex + count);
  
  log(`Found ${wordsToProcess.length} words to process`);
  log(`Processing batch: ${batch.length} words (${startIndex + 1} to ${startIndex + batch.length})`);
  log(`Estimated time: ~${Math.ceil(batch.length * 2 / 60)} minutes\n`);
  
  let processed = 0;
  let failed = 0;
  
  for (let i = 0; i < batch.length; i++) {
    const wordObj = batch[i];
    const isPlaceholder = hasPlaceholder(wordObj);
    
    try {
      await processWord(wordObj, isPlaceholder);
      processed++;
      
      // Save progress every 10 words
      if ((i + 1) % 10 === 0) {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
        saveProgress(type, startIndex + i + 1, wordsToProcess.length);
        log(`✓ Saved progress: ${i + 1}/${batch.length} words processed (${processed} successful, ${failed} failed)\n`);
      }
    } catch (error) {
      failed++;
      log(`✗ Failed to process "${wordObj.word}": ${error.message}`);
    }
  }
  
  // Final save
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  saveProgress(type, startIndex + batch.length, wordsToProcess.length);
  
  log(`\n=== Completed ${type} processing ===`);
  log(`Processed: ${processed} words`);
  log(`Failed: ${failed} words`);
  log(`File saved to: ${DATA_FILE}\n`);
}

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const config = {
    type: 'b1',
    start: 0,
    count: 200,
    resume: false
  };
  
  for (const arg of args) {
    if (arg.startsWith('--type=')) {
      config.type = arg.split('=')[1];
    } else if (arg.startsWith('--start=')) {
      config.start = parseInt(arg.split('=')[1]) || 0;
    } else if (arg.startsWith('--count=')) {
      config.count = parseInt(arg.split('=')[1]) || 200;
    } else if (arg === '--resume') {
      config.resume = true;
    }
  }
  
  // Resume from progress if requested
  if (config.resume) {
    const progress = loadProgress();
    if (progress && progress.type === config.type) {
      config.start = progress.processed;
      log(`Resuming from progress: ${config.start} words already processed`);
    }
  }
  
  return config;
}

// Run the script
const config = parseArgs();
processWords(config.type, config.start, config.count).catch(error => {
  log(`Fatal error: ${error.message}`);
  console.error(error);
  process.exit(1);
});
