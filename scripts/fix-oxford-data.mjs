/**
 * Script to fix and clean the Oxford 5000 words data
 * - Flattens nested translation arrays
 * - Ensures clean string arrays
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, '../public/data/oxford-5000-words.json');

// Clean translations array - extract only Hebrew strings
function cleanTranslations(translations) {
  const cleaned = [];
  const hebrewRegex = /[\u0590-\u05FF]+/g;
  
  for (const item of translations) {
    if (typeof item === 'string' && item.trim()) {
      // Extract Hebrew words from string (might contain English mixed in)
      const hebrewMatches = item.match(hebrewRegex);
      if (hebrewMatches) {
        // Take the first Hebrew word/phrase
        const hebrewText = hebrewMatches.join(' ').trim();
        if (hebrewText && !cleaned.includes(hebrewText)) {
          cleaned.push(hebrewText);
        }
      } else if (/[\u0590-\u05FF]/.test(item)) {
        // Pure Hebrew string
        const trimmed = item.trim();
        if (trimmed && !cleaned.includes(trimmed)) {
          cleaned.push(trimmed);
        }
      }
    } else if (Array.isArray(item) && item.length > 0) {
      // Extract first element if it's a string
      if (typeof item[0] === 'string') {
        const hebrewMatches = item[0].match(hebrewRegex);
        if (hebrewMatches) {
          const hebrewText = hebrewMatches.join(' ').trim();
          if (hebrewText && !cleaned.includes(hebrewText)) {
            cleaned.push(hebrewText);
          }
        } else if (/[\u0590-\u05FF]/.test(item[0])) {
          const trimmed = item[0].trim();
          if (trimmed && !cleaned.includes(trimmed)) {
            cleaned.push(trimmed);
          }
        }
      }
    }
  }
  
  // Remove duplicates and limit to 3
  return [...new Set(cleaned)].slice(0, 3);
}

// Clean sentences - remove placeholders
function cleanSentences(sentences, word) {
  const cleaned = [];
  
  for (const sentence of sentences) {
    if (typeof sentence === 'string' && 
        sentence.trim() && 
        !sentence.includes('[Translation needed]') &&
        !sentence.includes('Example sentence for') &&
        !sentence.includes('Another example with')) {
      cleaned.push(sentence.trim());
    }
  }
  
  // If no real sentences, add placeholders that will need manual fixing
  if (cleaned.length === 0) {
    cleaned.push(`Example sentence with ${word}.`);
    cleaned.push(`Another example using ${word}.`);
  }
  
  return cleaned.slice(0, 2);
}

// Main cleanup function
function cleanupData() {
  console.log('Reading data file...');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  console.log(`Processing ${data.words.length} words...`);
  
  let fixed = 0;
  
  for (const word of data.words) {
    const originalTranslations = word.translations;
    const originalSentences = word.sentences;
    
    // Clean translations
    word.translations = cleanTranslations(word.translations);
    
    // Clean sentences
    word.sentences = cleanSentences(word.sentences, word.word);
    
    // Clean translated sentences
    word.translatedSentences = cleanSentences(word.translatedSentences, word.word);
    
    // Check if anything changed
    if (JSON.stringify(originalTranslations) !== JSON.stringify(word.translations) ||
        JSON.stringify(originalSentences) !== JSON.stringify(word.sentences)) {
      fixed++;
    }
  }
  
  // Save cleaned data
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  
  console.log(`✓ Fixed ${fixed} words`);
  console.log(`✓ Saved cleaned data to ${filePath}`);
}

cleanupData();
