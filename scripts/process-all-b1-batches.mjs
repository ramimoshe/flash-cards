/**
 * Helper script to process all B1 word batches sequentially
 * This will process all remaining B1 words in batches of 200
 */

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BATCH_SIZE = 200;
const TOTAL_B1_WORDS = 2680; // Approximate, will be adjusted based on actual count

async function processBatch(startIndex) {
  return new Promise((resolve, reject) => {
    console.log(`\n🚀 Starting batch: words ${startIndex} to ${startIndex + BATCH_SIZE - 1}`);
    
    const scriptPath = path.join(__dirname, 'fix-oxford-metadata.mjs');
    const process = spawn('node', [scriptPath, '--type=b1', `--start=${startIndex}`, `--count=${BATCH_SIZE}`, '--resume'], {
      stdio: 'inherit',
      shell: true
    });
    
    process.on('close', (code) => {
      if (code === 0) {
        console.log(`✓ Batch ${startIndex}-${startIndex + BATCH_SIZE - 1} completed successfully`);
        resolve();
      } else {
        console.error(`✗ Batch ${startIndex}-${startIndex + BATCH_SIZE - 1} failed with code ${code}`);
        reject(new Error(`Batch failed with code ${code}`));
      }
    });
    
    process.on('error', (error) => {
      console.error(`✗ Error starting batch: ${error.message}`);
      reject(error);
    });
  });
}

async function processAllBatches() {
  console.log('=== Processing All B1 Word Batches ===\n');
  console.log(`Batch size: ${BATCH_SIZE} words`);
  console.log(`Estimated batches: ${Math.ceil(TOTAL_B1_WORDS / BATCH_SIZE)}`);
  console.log(`Estimated total time: ~${Math.ceil(TOTAL_B1_WORDS * 2 / 60)} minutes\n`);
  
  const batches = [];
  for (let i = 0; i < TOTAL_B1_WORDS; i += BATCH_SIZE) {
    batches.push(i);
  }
  
  console.log(`Will process ${batches.length} batches:\n`);
  batches.forEach((start, index) => {
    console.log(`  Batch ${index + 1}: words ${start} to ${Math.min(start + BATCH_SIZE - 1, TOTAL_B1_WORDS - 1)}`);
  });
  
  console.log('\n⚠️  This will take approximately 90-100 minutes total.');
  console.log('You can stop and resume anytime - progress is saved every 10 words.\n');
  
  // Process batches sequentially
  for (let i = 0; i < batches.length; i++) {
    try {
      await processBatch(batches[i]);
      
      // Small delay between batches
      if (i < batches.length - 1) {
        console.log('\n⏳ Waiting 5 seconds before next batch...\n');
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    } catch (error) {
      console.error(`\n✗ Failed to process batch starting at ${batches[i]}`);
      console.error(`Error: ${error.message}`);
      console.log('\nYou can resume by running:');
      console.log(`node scripts/fix-oxford-metadata.mjs --type=b1 --start=${batches[i]} --count=${BATCH_SIZE} --resume`);
      process.exit(1);
    }
  }
  
  console.log('\n✅ All batches completed successfully!');
  console.log('Run verification: node scripts/verify-oxford-data.mjs');
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  processAllBatches().catch(console.error);
}

export { processAllBatches };
