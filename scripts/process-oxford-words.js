/**
 * Script to process Oxford 5000 words and generate JSON entries
 * Processes words in batches to avoid API rate limits
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Extract first 200 B2 words from Oxford 5000 list
const B2_WORDS_CHUNK_1 = [
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

console.log(`Processing ${B2_WORDS_CHUNK_1.length} B2 words...`);
console.log('Note: This script requires API services to be configured.');
console.log('For now, creating empty structure. Words will need to be processed via the app UI or with API keys configured.');

// Create empty structure for now
const words = B2_WORDS_CHUNK_1.map((word, index) => ({
  id: `oxford-b2-${index + 1}`,
  word: word.toLowerCase(),
  sourceLanguage: 'en',
  targetLanguage: 'he',
  translations: [],
  sentences: [],
  translatedSentences: [],
  isKnown: false,
  level: 'B2'
}));

const outputPath = path.join(__dirname, '../public/data/oxford-5000-words.json');
const data = { words };

fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
console.log(`Created file with ${words.length} word entries (empty translations/sentences)`);
console.log('Next step: Use the app\'s auto-fill feature or configure API services to populate translations and sentences.');
