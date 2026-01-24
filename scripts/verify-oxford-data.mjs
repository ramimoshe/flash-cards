/**
 * Verify oxford-5000-words.json data completeness
 * Checks for missing translations, sentences, and placeholder content
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.join(__dirname, '../public/data/oxford-5000-words.json');

function verifyData() {
  console.log('=== Verifying Oxford 5000 Words Data ===\n');
  
  const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  const words = data.words;
  
  const issues = {
    missingTranslations: [],
    emptyTranslations: [],
    missingSentences: [],
    placeholderSentences: [],
    missingTranslatedSentences: [],
    placeholderTranslatedSentences: [],
    missingLevel: [],
    totalWords: words.length
  };
  
  words.forEach((word, index) => {
    // Check translations
    if (!word.translations || word.translations.length === 0) {
      issues.missingTranslations.push({ id: word.id, word: word.word, index });
    } else if (word.translations.some(t => !t || t.trim() === '' || t.includes('[Translation needed]'))) {
      issues.emptyTranslations.push({ id: word.id, word: word.word, translations: word.translations });
    }
    
    // Check sentences
    if (!word.sentences || word.sentences.length === 0) {
      issues.missingSentences.push({ id: word.id, word: word.word, index });
    } else if (word.sentences.some(s => 
      s.includes('Example sentence for') || 
      s.includes('Another example') ||
      s.includes('Example sentence with')
    )) {
      issues.placeholderSentences.push({ id: word.id, word: word.word, sentences: word.sentences });
    }
    
    // Check translatedSentences
    if (!word.translatedSentences || word.translatedSentences.length === 0) {
      issues.missingTranslatedSentences.push({ id: word.id, word: word.word, index });
    } else if (word.translatedSentences.some(t => t.includes('[Translation needed]'))) {
      issues.placeholderTranslatedSentences.push({ id: word.id, word: word.word, translatedSentences: word.translatedSentences });
    }
    
    // Check level
    if (!word.level) {
      issues.missingLevel.push({ id: word.id, word: word.word, index });
    }
  });
  
  console.log(`Total words: ${issues.totalWords}\n`);
  console.log('📊 Issues Found:');
  console.log(`  Missing translations: ${issues.missingTranslations.length}`);
  console.log(`  Empty/invalid translations: ${issues.emptyTranslations.length}`);
  console.log(`  Missing sentences: ${issues.missingSentences.length}`);
  console.log(`  Placeholder sentences: ${issues.placeholderSentences.length}`);
  console.log(`  Missing translatedSentences: ${issues.missingTranslatedSentences.length}`);
  console.log(`  Placeholder translatedSentences: ${issues.placeholderTranslatedSentences.length}`);
  console.log(`  Missing level: ${issues.missingLevel.length}`);
  
  const totalIssues = issues.missingTranslations.length + 
                      issues.emptyTranslations.length + 
                      issues.missingSentences.length + 
                      issues.placeholderSentences.length + 
                      issues.missingTranslatedSentences.length + 
                      issues.placeholderTranslatedSentences.length + 
                      issues.missingLevel.length;
  
  console.log(`\nTotal words with issues: ${totalIssues}`);
  console.log(`Words without issues: ${issues.totalWords - totalIssues}`);
  
  // Show samples
  if (issues.missingTranslations.length > 0) {
    console.log(`\n📝 Sample words with missing translations (first 10):`);
    issues.missingTranslations.slice(0, 10).forEach(w => console.log(`  - ${w.word} (${w.id})`));
  }
  
  if (issues.placeholderSentences.length > 0) {
    console.log(`\n📝 Sample words with placeholder sentences (first 10):`);
    issues.placeholderSentences.slice(0, 10).forEach(w => console.log(`  - ${w.word} (${w.id})`));
  }
  
  if (issues.placeholderTranslatedSentences.length > 0) {
    console.log(`\n📝 Sample words with placeholder translatedSentences (first 10):`);
    issues.placeholderTranslatedSentences.slice(0, 10).forEach(w => console.log(`  - ${w.word} (${w.id})`));
  }
  
  // Generate report
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalWords: issues.totalWords,
      wordsWithIssues: totalIssues,
      wordsWithoutIssues: issues.totalWords - totalIssues,
      missingTranslations: issues.missingTranslations.length,
      emptyTranslations: issues.emptyTranslations.length,
      missingSentences: issues.missingSentences.length,
      placeholderSentences: issues.placeholderSentences.length,
      missingTranslatedSentences: issues.missingTranslatedSentences.length,
      placeholderTranslatedSentences: issues.placeholderTranslatedSentences.length,
      missingLevel: issues.missingLevel.length
    },
    details: {
      missingTranslations: issues.missingTranslations,
      emptyTranslations: issues.emptyTranslations,
      missingSentences: issues.missingSentences,
      placeholderSentences: issues.placeholderSentences,
      missingTranslatedSentences: issues.missingTranslatedSentences,
      placeholderTranslatedSentences: issues.placeholderTranslatedSentences,
      missingLevel: issues.missingLevel
    }
  };
  
  const reportFile = path.join(__dirname, '../oxford-processing-report.json');
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
  console.log(`\n✓ Detailed report saved to: ${reportFile}`);
  
  // Final status
  if (totalIssues === 0) {
    console.log('\n✅ All words are complete! No issues found.');
  } else {
    console.log(`\n⚠️  Found ${totalIssues} words with issues. Review the report for details.`);
  }
  
  return report;
}

verifyData();
