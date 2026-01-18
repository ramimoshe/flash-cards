# Flash Cards - English & Hebrew Vocabulary Learning App

A modern, interactive vocabulary learning application built with React, TypeScript, and Tailwind CSS. Learn English and Hebrew through flash cards, manage your word bank, and track your progress with CEFR level classification.

## 🌟 Features

### 🎴 Flash Cards Game
- **Multiple Game Modes:**
  - Practice Unknown Words (default)
  - Practice by CEFR Level (A1-C2)
  - Practice All Words
- **Interactive Learning:**
  - Flip cards to reveal translations
  - Text-to-speech for pronunciation
  - Mark words as known/unknown
  - Progress tracking

### 📚 Word List & Search
- Search words and translations
- Filter by status (All/Learning/Known)
- Filter by CEFR level
- Expandable word details
- Quick actions (mark known, delete)

### ✏️ Word Bank Editor
- Add new words with ease
- **Auto-Fill Features:**
  - 🤖 Auto-Fill All: One-click automation
  - 🌐 Auto-translate words
  - 📊 Auto-detect CEFR level
  - 📝 Auto-generate example sentences
- Dynamic fields for multiple translations and sentences
- Duplicate word prevention
- Support for both English and Hebrew

### ⚙️ Settings
- **File Management:**
  - Upload JSON word lists
  - Download your word bank
  - Clear all data
- **API Configuration:**
  - Choose translation provider (MyMemory, LibreTranslate)
  - Choose sentence generator (Free Dictionary, Wordnik)
  - Choose TTS provider (Browser, Google)
  - Optional API keys for enhanced features

### 🎯 CEFR Level System
- Automatic level detection for English words
- Color-coded badges (A1-C2)
- Filter and practice by proficiency level
- Built-in CEFR dataset (120+ words)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ramimoshe/flash-cards.git
cd flash-cards
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 📊 JSON Data Format

Your word bank is stored in JSON format with the following structure:

```json
{
  "words": [
    {
      "id": "1",
      "word": "hello",
      "language": "en",
      "translations": ["שלום", "היי"],
      "sentences": [
        "Hello, how are you today?",
        "She said hello to everyone."
      ],
      "translatedSentences": [
        "שלום, מה שלומך היום?",
        "היא אמרה שלום לכולם."
      ],
      "isKnown": false,
      "level": "A1"
    }
  ]
}
```

### Field Descriptions

- `id` (string): Unique identifier for the word
- `word` (string): The word in its original language
- `language` (string): "en" for English, "he" for Hebrew
- `translations` (array): List of translations in the target language
- `sentences` (array): Example sentences in the original language
- `translatedSentences` (array): Translated example sentences
- `isKnown` (boolean): Whether you've marked this word as known
- `level` (string): CEFR level (A1, A2, B1, B2, C1, C2, Unknown)

## 🎓 CEFR Levels Explained

The Common European Framework of Reference for Languages (CEFR) classifies language proficiency:

- **A1** (Beginner): Basic words like "hello", "book", "eat"
- **A2** (Elementary): Simple everyday expressions
- **B1** (Intermediate): Common words for work, school, leisure
- **B2** (Upper Intermediate): Complex topics, abstract concepts
- **C1** (Advanced): Wide range of demanding texts
- **C2** (Proficient): Practically everything heard or read

## 🔧 Technology Stack

- **Frontend:** React 18 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **State Management:** React Context API
- **Storage:** LocalStorage API
- **Routing:** React Router v6
- **TTS:** Web Speech API / Google Cloud TTS
- **Deployment:** GitHub Pages

## 🏗️ Architecture

The application follows clean architecture principles with:

- **Service-based design:** Easy to swap API providers
- **Interface-first approach:** All services implement interfaces
- **Separation of concerns:** UI, business logic, and data access are separated
- **Dependency injection:** Services are injected via factory pattern
- **SOLID principles:** Maintainable and scalable code

### Project Structure

```
src/
├── components/          # UI components
│   ├── common/         # Reusable components (Button, Input, Badge)
│   └── ...
├── pages/              # Page components (FlashCards, WordList, etc.)
├── services/           # Business logic & external APIs
│   ├── interfaces/     # Service contracts
│   ├── implementations/# Concrete implementations
│   └── ServiceFactory.ts
├── hooks/              # Custom React hooks
├── context/            # React Context providers
├── types/              # TypeScript interfaces
├── utils/              # Helper functions
└── config/             # Configuration files
```

## 🌐 API Services

### Translation Services
- **MyMemory** (default): Free, no API key required
- **LibreTranslate**: Free, open-source alternative

### Sentence Generation
- **Free Dictionary API** (default): Free, no API key required
- **Wordnik API**: Better quality, requires free API key

### Text-to-Speech
- **Browser TTS** (default): Built-in, works offline
- **Google Cloud TTS**: Higher quality, requires API key

### CEFR Dataset
- **Words-CEFR-Dataset**: MIT licensed, bundled with app

## 📱 Features in Detail

### Duplicate Prevention
When adding a new word, the app checks for duplicates (case-insensitive, language-specific) and prevents you from adding the same word twice.

### Bidirectional Language Support
The app supports both English-to-Hebrew and Hebrew-to-English learning with automatic text direction detection (RTL for Hebrew).

### Offline Support
- All data stored locally in browser
- Works offline after initial load
- No server required

### Data Persistence
Your word bank is automatically saved to LocalStorage after every change. Your data persists across browser sessions.

## 🚀 Deployment

The app is configured for GitHub Pages deployment:

1. Push your code to GitHub
2. Enable GitHub Pages in repository settings
3. The GitHub Actions workflow will automatically build and deploy

The app will be available at: `https://[username].github.io/flash-cards/`

## 📝 Sample Data

A sample word list is included in `public/sample-words.json` with 10 words across different CEFR levels. You can upload this file in the Settings page to get started quickly.

## 🤝 Contributing

This is a personal learning project, but suggestions and feedback are welcome!

## 📄 License

MIT License - feel free to use this project for your own learning.

## 🙏 Credits

- **MyMemory Translation API** - Free translation service
- **Free Dictionary API** - Free dictionary and example sentences
- **Words-CEFR-Dataset** - CEFR level classifications (MIT License)
- **React** - UI framework
- **Tailwind CSS** - Styling framework
- **Vite** - Build tool

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

**Happy Learning! 📚✨**
