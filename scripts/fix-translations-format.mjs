/**
 * Fix translations format in oxford-5000-words.json
 * Convert from nested arrays to simple string array like default-words.json
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, '../public/data/oxford-5000-words.json');

// Extract Hebrew strings from mixed translation data
function extractHebrewTranslations(translations) {
  if (!Array.isArray(translations)) {
    return ['[Translation needed]'];
  }
  
  const cleaned = [];
  const hebrewRegex = /[\u0590-\u05FF]+/;
  const seen = new Set();
  
  // Recursive function to extract Hebrew strings from nested structures
  function extractHebrew(item) {
    if (typeof item === 'string') {
      // If it's a string, check if it contains Hebrew
      if (hebrewRegex.test(item)) {
        // Extract only Hebrew parts (remove any English mixed in)
        const hebrewParts = item.match(/[\u0590-\u05FF\s]+/g);
        if (hebrewParts) {
          const hebrewText = hebrewParts.join('').trim();
          if (hebrewText && !seen.has(hebrewText)) {
            seen.add(hebrewText);
            cleaned.push(hebrewText);
          }
        }
      }
    } else if (Array.isArray(item)) {
      // Recursively process arrays
      for (const subItem of item) {
        extractHebrew(subItem);
        // Stop if we have enough translations
        if (cleaned.length >= 5) break;
      }
    }
  }
  
  // Process all items in translations array
  for (const item of translations) {
    extractHebrew(item);
    if (cleaned.length >= 5) break;
  }
  
  // Remove duplicates and limit to reasonable number (max 5 translations)
  return [...new Set(cleaned)].slice(0, 5);
}

// Main fix function
function fixTranslationsFormat() {
  console.log('Reading oxford-5000-words.json...');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  console.log(`Processing ${data.words.length} words...`);
  
  let fixed = 0;
  
  for (const word of data.words) {
    const originalTranslations = JSON.stringify(word.translations);
    
    // Fix translations format
    word.translations = extractHebrewTranslations(word.translations);
    
    // Check if format changed
    if (originalTranslations !== JSON.stringify(word.translations)) {
      fixed++;
    }
    
    // Ensure we have at least one translation (even if placeholder)
    if (word.translations.length === 0) {
      word.translations = ['[Translation needed]'];
    }
  }
  
  // Save fixed data
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  
  console.log(`✓ Fixed ${fixed} words`);
  console.log(`✓ Saved fixed data to ${filePath}`);
  
  // Show sample
  console.log('\nSample fixed word:');
  console.log(JSON.stringify(data.words[0], null, 2));
}

fixTranslationsFormat();
