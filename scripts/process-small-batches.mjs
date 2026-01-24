/**
 * Process Oxford words in small batches of 50
 * Provides better progress tracking and control
 */

import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.join(__dirname, '../public/data/oxford-5000-words.json');
const BATCH_SIZE = 50;

function getWordsNeedingProcessing(type) {
  const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  
  if (type === 'b1') {
    return data.words.filter(w => 
      w.level === 'B1' && (!w.translations || w.translations.length === 0)
    );
  } else if (type === 'placeholders') {
    return data.words.filter(w => {
      const hasPlaceholderSentence = w.sentences?.some(s => 
        s.includes('Example sentence for') || 
        s.includes('Another example') ||
        s.includes('Example sentence with')
      );
      const hasPlaceholderTranslation = w.translatedSentences?.some(t => 
        t.includes('[Translation needed]')
      );
      return hasPlaceholderSentence || hasPlaceholderTranslation;
    });
  }
  return [];
}

function processBatch(type, startIndex, count) {
  return new Promise((resolve, reject) => {
    console.log(`\n📦 Processing ${type} batch: words ${startIndex + 1} to ${startIndex + count}`);
    
    const child = spawn('node', [
      'scripts/fix-oxford-metadata.mjs',
      `--type=${type}`,
      `--start=${startIndex}`,
      `--count=${count}`
    ], {
      cwd: path.join(__dirname, '..'),
      stdio: 'inherit'
    });
    
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Process exited with code ${code}`));
      }
    });
    
    child.on('error', (error) => {
      reject(error);
    });
  });
}

async function processAllBatches(type) {
  console.log(`\n=== Processing ${type.toUpperCase()} Words ===\n`);
  
  const wordsToProcess = getWordsNeedingProcessing(type);
  const totalWords = wordsToProcess.length;
  const totalBatches = Math.ceil(totalWords / BATCH_SIZE);
  
  console.log(`Found ${totalWords} words to process`);
  console.log(`Will process in ${totalBatches} batches of ${BATCH_SIZE} words each\n`);
  
  for (let batchNum = 0; batchNum < totalBatches; batchNum++) {
    const startIndex = batchNum * BATCH_SIZE;
    const count = Math.min(BATCH_SIZE, totalWords - startIndex);
    
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Batch ${batchNum + 1}/${totalBatches}`);
    console.log(`Processing words ${startIndex + 1} to ${startIndex + count}`);
    console.log(`${'='.repeat(60)}`);
    
    try {
      await processBatch(type, startIndex, count);
      
      // Quick status check
      const remaining = getWordsNeedingProcessing(type).length;
      const processed = totalWords - remaining;
      const progress = Math.round((processed / totalWords) * 100);
      
      console.log(`\n✓ Batch ${batchNum + 1} completed`);
      console.log(`Progress: ${processed}/${totalWords} (${progress}%)`);
      console.log(`Remaining: ${remaining} words\n`);
      
      // Small delay between batches
      if (batchNum < totalBatches - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } catch (error) {
      console.error(`\n❌ Error processing batch ${batchNum + 1}: ${error.message}`);
      console.log('You can resume by running this script again');
      process.exit(1);
    }
  }
  
  console.log(`\n🎉 All ${type} batches completed!`);
}

// Main execution
const type = process.argv[2] || 'b1';

if (type !== 'b1' && type !== 'placeholders') {
  console.error('Usage: node scripts/process-small-batches.mjs [b1|placeholders]');
  process.exit(1);
}

processAllBatches(type).catch(console.error);
