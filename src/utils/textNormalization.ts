export function isRTL(text: string): boolean {
  // Check if text contains Hebrew characters
  const hebrewRegex = /[\u0590-\u05FF]/;
  return hebrewRegex.test(text);
}

export function getTextDirection(text: string): 'ltr' | 'rtl' {
  return isRTL(text) ? 'rtl' : 'ltr';
}

export function formatTextForDisplay(text: string): string {
  return text.trim();
}
