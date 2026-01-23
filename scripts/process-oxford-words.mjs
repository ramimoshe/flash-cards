/**
 * Script to process Oxford 5000 words with translations and sentences
 * Processes words in batches with rate limiting
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// First 200 B2 words from Oxford 5000
const B2_WORDS = [
  'absorb', 'abstract', 'accent', 'accidentally', 'accommodate',
  'accommodation', 'accomplish', 'accountant', 'accuracy', 'accurately',
  'acid', 'acre', 'activate', 'addiction', 'additionally',
  'adequate', 'adequately', 'adjust', 'affordable', 'aged',
  'agriculture', 'AIDS', 'alien', 'alongside', 'altogether',
  'ambitious', 'ambulance', 'amusing', 'analyst', 'ancestor',
  'animation', 'annually', 'anticipate', 'anxiety', 'apology',
  'applicant', 'appropriately', 'arrow', 'artwork', 'asset',
  'assign', 'assistance', 'assumption', 'assure', 'astonishing',
  'athletic', 'attachment', 'audio', 'awareness', 'awkward',
  'badge', 'balanced', 'ballet', 'balloon', 'barely',
  'bargain', 'basement', 'basket', 'bat', 'beneficial',
  'beside', 'besides', 'bias', 'bid', 'biological',
  'blanket', 'blow', 'bold', 'bombing', 'boost',
  'bound', 'brick', 'briefly', 'broadcaster', 'broadly',
  'buck', 'bug', 'cabin', 'canal', 'candle',
  'carbon', 'castle', 'casual', 'cave', 'certainty',
  'certificate', 'challenging', 'championship', 'charming', 'chase',
  'cheek', 'cheer', 'chop', 'circuit', 'civilization',
  'clarify', 'classify', 'cliff', 'clinic', 'clip',
  'coincidence', 'collector', 'colony', 'colorful', 'comic',
  'commander', 'comparative', 'completion', 'compose', 'composer',
  'compound', 'comprehensive', 'comprise', 'compulsory', 'concrete',
  'confess', 'confusion', 'consequently', 'conservation', 'considerable',
  'considerably', 'consistently', 'conspiracy', 'consult', 'consultant',
  'consumption', 'controversial', 'controversy', 'convenience', 'convention',
  'conventional', 'convey', 'convincing', 'cop', 'cope',
  'corporation', 'corridor', 'counter', 'coverage', 'cowboy',
  'crack', 'craft', 'creativity', 'critically', 'cruise',
  'cue', 'curious', 'curriculum', 'cute', 'dairy',
  'dare', 'darkness', 'database', 'deadline', 'deadly',
  'dealer', 'deck', 'defender', 'delete', 'delighted',
  'democracy', 'democratic', 'demonstration', 'depart', 'dependent',
  'deposit', 'depression', 'derive', 'desperately', 'destruction',
  'determination', 'devote', 'differ', 'dime', 'disability',
  'disabled', 'disagreement', 'disappoint', 'disappointment', 'discourage',
  'disorder', 'distant', 'distinct', 'distinguish', 'distract',
  'disturb', 'dive', 'diverse', 'diversity', 'divorce',
  'dominant', 'donation', 'dot', 'dramatically', 'drought',
  'dull', 'dump', 'duration', 'dynamic', 'eager',
  'economics', 'economist', 'editorial', 'efficiently', 'elbow',
  'electronics', 'elegant', 'elementary', 'eliminate', 'embrace',
  'emission', 'emotionally', 'empire', 'enjoyable', 'entertaining',
  'entrepreneur', 'envelope', 'equip', 'equivalent', 'era',
  'erupt', 'essentially', 'ethic', 'ethnic', 'evaluation',
  'evident', 'evolution', 'evolve', 'exceed', 'exception',
  'excessive', 'exclude', 'exotic', 'expansion', 'expedition',
  'expertise', 'exploit', 'exposure', 'extension', 'extensive',
  'extensively', 'extract', 'fabric', 'fabulous', 'faculty',
  'failed', 'fake', 'fame', 'fantasy', 'fare',
  'firefighter', 'firework', 'firm', 'firmly', 'flavor',
  'fond', 'fool', 'forbid', 'forecast', 'format',
  'formation', 'formerly', 'fortunate', 'forum', 'fossil',
  'foundation', 'founder', 'fraction', 'fragment', 'framework',
  'fraud', 'freely', 'frequent', 'fulfill', 'full-time',
  'fundamentally', 'furious', 'gallon', 'gaming', 'gay',
  'gender', 'gene', 'genetic', 'genius', 'genuine',
  'genuinely', 'gesture', 'globalization', 'globe', 'golden',
  'goodness', 'gorgeous', 'graphic', 'graphics', 'greatly',
  'greenhouse', 'guideline', 'habitat', 'harbor', 'headquarters',
  'heal', 'healthcare', 'helmet', 'hence', 'herb',
  'hidden', 'hilarious', 'hip', 'historian', 'homeless',
  'honesty', 'honey', 'hook', 'hopefully', 'hunger',
  'hypothesis'
];

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
        if (item[0]) translations.push(item[0]);
      });
    }
    
    // Also check dictionary results
    if (data[1]) {
      data[1].forEach(item => {
        if (item[2] && Array.isArray(item[2])) {
          item[2].forEach(trans => {
            if (trans && !translations.includes(trans)) {
              translations.push(trans);
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
            if (def.example && !sentences.includes(def.example)) {
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
async function processWord(word, index) {
  console.log(`Processing ${index + 1}/200: ${word}`);
  
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
  
  return {
    id: `oxford-b2-${index + 1}`,
    word: word.toLowerCase(),
    sourceLanguage: 'en',
    targetLanguage: 'he',
    translations: translations.length > 0 ? translations : ['[Translation needed]'],
    sentences: sentences.length > 0 ? sentences : [`Example sentence for ${word}.`, `Another example with ${word}.`],
    translatedSentences: translatedSentences.length > 0 ? translatedSentences : ['[Translation needed]', '[Translation needed]'],
    isKnown: false,
    level: 'B2'
  };
}

// Main processing function
async function processAllWords() {
  const outputPath = path.join(__dirname, '../public/data/oxford-5000-words.json');
  const words = [];
  
  console.log(`Starting to process ${B2_WORDS.length} words...`);
  console.log('This will take approximately 10-15 minutes due to rate limiting.');
  console.log('Progress will be saved incrementally.\n');
  
  for (let i = 0; i < B2_WORDS.length; i++) {
    try {
      const wordData = await processWord(B2_WORDS[i], i);
      words.push(wordData);
      
      // Save progress every 10 words
      if ((i + 1) % 10 === 0) {
        const data = { words };
        fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
        console.log(`\n✓ Saved progress: ${i + 1}/${B2_WORDS.length} words processed\n`);
      }
    } catch (error) {
      console.error(`Failed to process "${B2_WORDS[i]}":`, error.message);
      // Add word with empty data to continue
      words.push({
        id: `oxford-b2-${i + 1}`,
        word: B2_WORDS[i].toLowerCase(),
        sourceLanguage: 'en',
        targetLanguage: 'he',
        translations: ['[Failed to translate]'],
        sentences: [`Example sentence for ${B2_WORDS[i]}.`, `Another example with ${B2_WORDS[i]}.`],
        translatedSentences: ['[Failed to translate]', '[Failed to translate]'],
        isKnown: false,
        level: 'B2'
      });
    }
  }
  
  // Final save
  const data = { words };
  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
  console.log(`\n✓ Completed! Processed ${words.length} words.`);
  console.log(`File saved to: ${outputPath}`);
}

// Run the script
processAllWords().catch(console.error);
