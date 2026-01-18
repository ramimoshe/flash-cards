/**
 * Common English-Hebrew translations fallback dictionary
 * Used when translation APIs return incomplete or incorrect results
 */

interface TranslationMap {
  [key: string]: {
    he: string[]; // Hebrew translations
  };
}

export const commonTranslations: TranslationMap = {
  // Common verbs with multiple meanings
  play: {
    he: ['לשחק', 'לנגן', 'משחק'],
  },
  run: {
    he: ['לרוץ', 'להפעיל', 'לנהל'],
  },
  work: {
    he: ['לעבוד', 'עבודה', 'לפעול'],
  },
  read: {
    he: ['לקרוא'],
  },
  write: {
    he: ['לכתוב'],
  },
  eat: {
    he: ['לאכול'],
  },
  drink: {
    he: ['לשתות'],
  },
  sleep: {
    he: ['לישון'],
  },
  walk: {
    he: ['ללכת', 'לטייל'],
  },
  talk: {
    he: ['לדבר', 'שיחה'],
  },
  listen: {
    he: ['להקשיב'],
  },
  watch: {
    he: ['לצפות', 'לראות', 'שעון'],
  },
  learn: {
    he: ['ללמוד'],
  },
  teach: {
    he: ['ללמד'],
  },
  study: {
    he: ['ללמוד', 'לחקור'],
  },
  think: {
    he: ['לחשוב'],
  },
  know: {
    he: ['לדעת', 'להכיר'],
  },
  understand: {
    he: ['להבין'],
  },
  speak: {
    he: ['לדבר'],
  },
  help: {
    he: ['לעזור', 'עזרה'],
  },
  like: {
    he: ['לאהוב', 'כמו'],
  },
  love: {
    he: ['לאהוב', 'אהבה'],
  },
  want: {
    he: ['לרצות'],
  },
  need: {
    he: ['לצרוך', 'צורך'],
  },
  make: {
    he: ['לעשות', 'ליצור'],
  },
  take: {
    he: ['לקחת'],
  },
  give: {
    he: ['לתת'],
  },
  get: {
    he: ['לקבל', 'להשיג'],
  },
  come: {
    he: ['לבוא'],
  },
  go: {
    he: ['ללכת', 'לנסוע'],
  },
  see: {
    he: ['לראות'],
  },
  look: {
    he: ['להסתכל', 'לחפש'],
  },
  find: {
    he: ['למצוא'],
  },
  feel: {
    he: ['להרגיש'],
  },
  try: {
    he: ['לנסות'],
  },
  leave: {
    he: ['לעזוב', 'להשאיר'],
  },
  call: {
    he: ['להתקשר', 'לקרוא'],
  },
  ask: {
    he: ['לשאול', 'לבקש'],
  },
  tell: {
    he: ['לספר', 'להגיד'],
  },
  say: {
    he: ['לומר'],
  },
  show: {
    he: ['להראות', 'מופע'],
  },
  use: {
    he: ['להשתמש', 'שימוש'],
  },
  start: {
    he: ['להתחיל', 'התחלה'],
  },
  begin: {
    he: ['להתחיל'],
  },
  stop: {
    he: ['לעצור', 'תחנה'],
  },
  end: {
    he: ['לסיים', 'סוף'],
  },
  finish: {
    he: ['לסיים'],
  },
  open: {
    he: ['לפתוח', 'פתוח'],
  },
  close: {
    he: ['לסגור', 'סגור'],
  },
  sit: {
    he: ['לשבת'],
  },
  stand: {
    he: ['לעמוד'],
  },
  buy: {
    he: ['לקנות'],
  },
  sell: {
    he: ['למכור'],
  },
  pay: {
    he: ['לשלם'],
  },
  win: {
    he: ['לנצח'],
  },
  lose: {
    he: ['להפסיד', 'לאבד'],
  },
  send: {
    he: ['לשלוח'],
  },
  receive: {
    he: ['לקבל'],
  },
  bring: {
    he: ['להביא'],
  },
  carry: {
    he: ['לשאת', 'לסחוב'],
  },
  hold: {
    he: ['להחזיק'],
  },
  keep: {
    he: ['לשמור', 'להמשיך'],
  },
  put: {
    he: ['לשים'],
  },
  turn: {
    he: ['לפנות', 'להפוך'],
  },
  move: {
    he: ['לזוז', 'להעביר'],
  },
  live: {
    he: ['לחיות', 'לגור'],
  },
  die: {
    he: ['למות'],
  },
  grow: {
    he: ['לגדול', 'לצמוח'],
  },
  change: {
    he: ['לשנות', 'שינוי'],
  },
  happen: {
    he: ['לקרות'],
  },
  wait: {
    he: ['לחכות'],
  },
  meet: {
    he: ['לפגוש', 'להיפגש'],
  },
  remember: {
    he: ['לזכור'],
  },
  forget: {
    he: ['לשכוח'],
  },
  hope: {
    he: ['לקוות', 'תקווה'],
  },
  believe: {
    he: ['להאמין'],
  },

  // Common nouns
  book: {
    he: ['ספר'],
  },
  house: {
    he: ['בית'],
  },
  car: {
    he: ['מכונית', 'רכב'],
  },
  food: {
    he: ['אוכל', 'מזון'],
  },
  water: {
    he: ['מים'],
  },
  time: {
    he: ['זמן'],
  },
  day: {
    he: ['יום'],
  },
  year: {
    he: ['שנה'],
  },
  person: {
    he: ['אדם', 'אישיות'],
  },
  child: {
    he: ['ילד', 'ילדה'],
  },
  man: {
    he: ['גבר', 'איש'],
  },
  woman: {
    he: ['אישה'],
  },
  friend: {
    he: ['חבר', 'חברה'],
  },
  family: {
    he: ['משפחה'],
  },
  school: {
    he: ['בית ספר'],
  },
  teacher: {
    he: ['מורה'],
  },
  student: {
    he: ['תלמיד', 'סטודנט'],
  },
  music: {
    he: ['מוזיקה'],
  },
  song: {
    he: ['שיר'],
  },
  movie: {
    he: ['סרט'],
  },
  game: {
    he: ['משחק'],
  },
  phone: {
    he: ['טלפון'],
  },
  computer: {
    he: ['מחשב'],
  },
  table: {
    he: ['שולחן'],
  },
  chair: {
    he: ['כיסא'],
  },
  door: {
    he: ['דלת'],
  },
  window: {
    he: ['חלון'],
  },
  city: {
    he: ['עיר'],
  },
  country: {
    he: ['מדינה', 'ארץ'],
  },
  world: {
    he: ['עולם'],
  },
  place: {
    he: ['מקום'],
  },
  street: {
    he: ['רחוב'],
  },
  hand: {
    he: ['יד'],
  },
  eye: {
    he: ['עין'],
  },
  head: {
    he: ['ראש'],
  },
  heart: {
    he: ['לב'],
  },
  money: {
    he: ['כסף'],
  },
  question: {
    he: ['שאלה'],
  },
  answer: {
    he: ['תשובה'],
  },
  problem: {
    he: ['בעיה'],
  },
  idea: {
    he: ['רעיון'],
  },
  story: {
    he: ['סיפור'],
  },
  word: {
    he: ['מילה'],
  },
  language: {
    he: ['שפה'],
  },
  name: {
    he: ['שם'],
  },
  number: {
    he: ['מספר'],
  },
  color: {
    he: ['צבע'],
  },
  animal: {
    he: ['חיה', 'בעל חיים'],
  },
  dog: {
    he: ['כלב'],
  },
  cat: {
    he: ['חתול'],
  },
  bird: {
    he: ['ציפור'],
  },
  fish: {
    he: ['דג'],
  },
  tree: {
    he: ['עץ'],
  },
  flower: {
    he: ['פרח'],
  },
  sun: {
    he: ['שמש'],
  },
  moon: {
    he: ['ירח'],
  },
  star: {
    he: ['כוכב'],
  },
  rain: {
    he: ['גשם'],
  },
  wind: {
    he: ['רוח'],
  },
  fire: {
    he: ['אש'],
  },
  air: {
    he: ['אוויר'],
  },
  earth: {
    he: ['אדמה', 'כדור הארץ'],
  },

  // Common adjectives
  good: {
    he: ['טוב', 'טובה'],
  },
  bad: {
    he: ['רע', 'גרוע'],
  },
  big: {
    he: ['גדול', 'גדולה'],
  },
  small: {
    he: ['קטן', 'קטנה'],
  },
  new: {
    he: ['חדש', 'חדשה'],
  },
  old: {
    he: ['ישן', 'זקן'],
  },
  happy: {
    he: ['שמח', 'שמחה'],
  },
  sad: {
    he: ['עצוב', 'עצובה'],
  },
  hot: {
    he: ['חם', 'חמה'],
  },
  cold: {
    he: ['קר', 'קרה'],
  },
  fast: {
    he: ['מהיר', 'מהירה'],
  },
  slow: {
    he: ['איטי', 'איטית'],
  },
  easy: {
    he: ['קל', 'קלה'],
  },
  hard: {
    he: ['קשה', 'קשה'],
  },
  beautiful: {
    he: ['יפה', 'יפה'],
  },
  ugly: {
    he: ['מכוער', 'מכוערת'],
  },
  strong: {
    he: ['חזק', 'חזקה'],
  },
  weak: {
    he: ['חלש', 'חלשה'],
  },
  long: {
    he: ['ארוך', 'ארוכה'],
  },
  short: {
    he: ['קצר', 'קצרה'],
  },
  high: {
    he: ['גבוה', 'גבוהה'],
  },
  low: {
    he: ['נמוך', 'נמוכה'],
  },
  right: {
    he: ['נכון', 'ימין'],
  },
  wrong: {
    he: ['לא נכון', 'שגוי'],
  },
  true: {
    he: ['אמיתי', 'נכון'],
  },
  false: {
    he: ['שקרי', 'לא נכון'],
  },
  full: {
    he: ['מלא', 'מלאה'],
  },
  empty: {
    he: ['ריק', 'ריקה'],
  },
  clean: {
    he: ['נקי', 'נקייה'],
  },
  dirty: {
    he: ['מלוכלך', 'מלוכלכת'],
  },
  rich: {
    he: ['עשיר', 'עשירה'],
  },
  poor: {
    he: ['עני', 'עניה'],
  },
  young: {
    he: ['צעיר', 'צעירה'],
  },
  free: {
    he: ['חופשי', 'חינם'],
  },
  ready: {
    he: ['מוכן', 'מוכנה'],
  },
  important: {
    he: ['חשוב', 'חשובה'],
  },
  different: {
    he: ['שונה', 'שונה'],
  },
  same: {
    he: ['אותו', 'זהה'],
  },
  possible: {
    he: ['אפשרי', 'אפשרית'],
  },
  necessary: {
    he: ['הכרחי', 'נחוץ'],
  },
};

/**
 * Get common translations for a word if available
 * @param word - The English word to translate
 * @param targetLang - Target language (currently only 'he' supported)
 * @returns Array of translations or empty array if not found
 */
export function getCommonTranslations(word: string, targetLang: 'he' = 'he'): string[] {
  const normalizedWord = word.toLowerCase().trim();
  const entry = commonTranslations[normalizedWord];
  
  if (entry && entry[targetLang]) {
    return entry[targetLang];
  }
  
  return [];
}
