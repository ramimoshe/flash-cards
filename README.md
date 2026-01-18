# Flash Cards - English & Hebrew Vocabulary Learning

A modern vocabulary learning app with flashcards, auto-translation, and CEFR level tracking.

🌐 **[Live Demo](https://ramimoshe.github.io/flash-cards/)**

## ✨ Features

- 🎴 **Flash Cards** - Practice with interactive cards, flip to reveal translations
- 📚 **Word Management** - Add, edit, search, and organize your vocabulary
- 🤖 **Auto-Fill** - Automatically translate words, detect CEFR levels, and generate example sentences
- 🎯 **CEFR Levels** - Track word difficulty from A1 (beginner) to C2 (proficient)
- 🔊 **Text-to-Speech** - Hear correct pronunciation
- 💾 **Local Storage** - Your data stays private in your browser
- 🌍 **Bilingual** - English ↔ Hebrew with RTL support

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Open `http://localhost:5173` to start learning!

## 📖 How to Use

1. **Start Learning** - The app comes with 13 default vocabulary words
2. **Add Words** - Go to "Manage Words" and click "🤖 Auto-Fill from Internet" to automatically populate translations and sentences
3. **Practice** - Use the flash cards to test yourself
4. **Track Progress** - Mark words as "known" and filter by CEFR level

## 🎓 CEFR Levels

- **A1-A2**: Basic (hello, book, play)
- **B1-B2**: Intermediate (compromise, emerge, burden)
- **C1-C2**: Advanced (consciousness, sentient, derogatory)

## 🔧 Tech Stack

- React 18 + TypeScript + Vite
- Tailwind CSS
- Google Translate API (free)
- 172K+ words CEFR dataset
- LocalStorage for data persistence

## 📊 Data Format

Words are stored in JSON format:

```json
{
  "words": [
    {
      "id": "1",
      "word": "inevitable",
      "language": "en",
      "translations": ["בלתי נמנע"],
      "sentences": ["Change is inevitable in life."],
      "translatedSentences": ["שינוי הוא בלתי נמנע בחיים."],
      "isKnown": false,
      "level": "B2"
    }
  ]
}
```

## 🌐 API Services

- **Translation**: Google Translate (free, best quality)
- **Sentences**: Free Dictionary API
- **CEFR Dataset**: Words-CEFR-Dataset (MIT License, 172K+ words)
- **TTS**: Browser Speech API (built-in)

## 📱 Features in Detail

### Auto-Fill
Type a word and click "🤖 Auto-Fill from Internet" to automatically:
- Get multiple translations
- Detect CEFR level (A1-C2)
- Generate example sentences
- Translate sentences

### Flash Cards Game Modes
- **Practice Unknown** - Focus on words you're learning
- **Practice by Level** - Filter by CEFR level (A1-C2)
- **Practice All** - Review everything

### Import/Export
- Upload JSON files to import words
- Download your word bank as JSON
- Share word lists with others

## 🚀 Deployment

Configured for GitHub Pages with automatic deployment via GitHub Actions.

## 📄 License

MIT License

## 🙏 Credits

- [Words-CEFR-Dataset](https://github.com/Maximax67/Words-CEFR-Dataset) - CEFR classifications
- Google Translate API - Translations
- Free Dictionary API - Example sentences

---

**Happy Learning! 📚✨**
