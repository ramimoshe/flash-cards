/**
 * Process all remaining B1 words in batches
 * Continues until all words are processed
 */

import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROGRESS_FILE = path.join(__dirname, '../oxford-processing-progress.json');
const BATCH_SIZE = 200;

function getCurrentProgress() {
  try {
    if (fs.existsSync(PROGRESS_FILE)) {
      return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8'));
    }
  } catch (error) {
    console.error('Error reading progress:', error.message);
  }
  return { processed: 0, total: 0 };
}

function processNextBatch(startIndex) {
  return new Promise((resolve, reject) => {
    console.log(`\n🚀 Starting batch from index ${startIndex}...`);
    
    const child = spawn('node', [
      'scripts/fix-oxford-metadata.mjs',
      '--type=b1',
      `--start=${startIndex}`,
      `--count=${BATCH_SIZE}`
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

async function processAllBatches() {
  console.log('=== Processing All Remaining B1 Words ===\n');
  
  let startIndex = 0;
  const progress = getCurrentProgress();
  
  if (progress.processed > 0) {
    startIndex = progress.processed;
    console.log(`Resuming from index ${startIndex} (${progress.processed}/${progress.total} processed)`);
  }
  
  const totalBatches = Math.ceil((progress.total - startIndex) / BATCH_SIZE);
  console.log(`Will process ${totalBatches} batches of ${BATCH_SIZE} words each\n`);
  
  let batchNumber = Math.floor(startIndex / BATCH_SIZE) + 1;
  
  while (true) {
    const currentProgress = getCurrentProgress();
    
    if (currentProgress.processed >= currentProgress.total) {
      console.log('\n✅ All words processed!');
      break;
    }
    
    console.log(`\n📦 Batch ${batchNumber}/${totalBatches}`);
    console.log(`Processing words ${currentProgress.processed + 1} to ${Math.min(currentProgress.processed + BATCH_SIZE, currentProgress.total)}`);
    
    try {
      await processNextBatch(currentProgress.processed);
      batchNumber++;
      
      // Wait a bit before next batch
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(`\n❌ Error processing batch: ${error.message}`);
      console.log('You can resume by running this script again');
      process.exit(1);
    }
  }
  
  console.log('\n🎉 All batches completed!');
}

processAllBatches().catch(console.error);
