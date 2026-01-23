import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useWords } from '@/context/WordsContext';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { Word } from '@/types/Word';
import { shuffleArray } from '@/utils/arrayHelpers';
import { getTextDirection } from '@/utils/textNormalization';

interface QuizQuestion {
  word: Word;
  correctAnswer: string;
  choices: string[];
  userAnswer: string | null;
  isCorrect: boolean | null;
}

export function QuizPlay(): React.ReactElement {
  const { words } = useWords();
  const navigate = useNavigate();
  const location = useLocation();
  const quizWords: Word[] | undefined = location.state?.quizWords;

  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/21affb94-aeb9-4b62-a8f3-52065d026c05',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'QuizPlay.tsx:20',message:'Component mount',data:{hasQuizWords:!!quizWords,quizWordsLength:quizWords?.length,wordsLength:words.length},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H1,H4'})}).catch(()=>{});
  // #endregion

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [startTime] = useState(Date.now());
  const [endTime, setEndTime] = useState<number | null>(null);
  
  // Use ref to track if we've generated questions for current quizWords
  const generatedForWordsRef = useRef<Word[] | null>(null);

  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/21affb94-aeb9-4b62-a8f3-52065d026c05',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'QuizPlay.tsx:34',message:'State initialized',data:{questionsLength:questions.length,hasGeneratedRef:generatedForWordsRef.current !== null},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H2',runId:'post-fix'})}).catch(()=>{});
  // #endregion

  // Generate wrong answers for a question
  const generateWrongAnswers = (correctWord: Word, allWords: Word[], count: number): string[] => {
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/21affb94-aeb9-4b62-a8f3-52065d026c05',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'QuizPlay.tsx:38',message:'generateWrongAnswers entry',data:{correctWordId:correctWord.id,allWordsLength:allWords.length,requestedCount:count},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H3,H4'})}).catch(()=>{});
    // #endregion
    
    // Filter out the correct word
    const otherWords = allWords.filter(w => w.id !== correctWord.id);
    
    // Shuffle and take 'count' translations
    const shuffled = shuffleArray(otherWords);
    const wrongAnswers: string[] = [];
    
    for (const word of shuffled) {
      if (wrongAnswers.length >= count) break;
      // Pick a random translation from this word
      const randomTranslation = word.translations[Math.floor(Math.random() * word.translations.length)];
      if (randomTranslation && !wrongAnswers.includes(randomTranslation)) {
        wrongAnswers.push(randomTranslation);
      }
    }
    
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/21affb94-aeb9-4b62-a8f3-52065d026c05',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'QuizPlay.tsx:56',message:'generateWrongAnswers exit',data:{wrongAnswersLength:wrongAnswers.length,wrongAnswers},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H3'})}).catch(()=>{});
    // #endregion
    
    return wrongAnswers;
  };

  useEffect(() => {
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/21affb94-aeb9-4b62-a8f3-52065d026c05',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'QuizPlay.tsx:67',message:'useEffect entry',data:{hasQuizWords:!!quizWords,wordsLength:words.length,alreadyGeneratedForThese:generatedForWordsRef.current === quizWords},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H1,H2,H6',runId:'post-fix-v2'})}).catch(()=>{});
    // #endregion
    
    if (!quizWords) {
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/21affb94-aeb9-4b62-a8f3-52065d026c05',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'QuizPlay.tsx:73',message:'No quizWords - redirecting',data:{},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H1',runId:'post-fix-v2'})}).catch(()=>{});
      // #endregion
      // Redirect to setup if no words are found
      navigate('/games/quiz');
      return;
    }

    // Wait for words context to load before generating questions
    if (words.length === 0) {
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/21affb94-aeb9-4b62-a8f3-52065d026c05',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'QuizPlay.tsx:83',message:'Words context not loaded yet - waiting',data:{},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H6',runId:'post-fix-v2'})}).catch(()=>{});
      // #endregion
      return;
    }

    // Only generate questions once for this specific quizWords array
    if (generatedForWordsRef.current === quizWords) {
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/21affb94-aeb9-4b62-a8f3-52065d026c05',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'QuizPlay.tsx:92',message:'Questions already generated for these words - skipping',data:{},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H2',runId:'post-fix-v2'})}).catch(()=>{});
      // #endregion
      return;
    }

    // Generate questions with choices from the pre-shuffled words
    const generatedQuestions: QuizQuestion[] = quizWords.map((word) => {
      // Pick a random correct translation
      const correctAnswer = word.translations[Math.floor(Math.random() * word.translations.length)] || '';
      
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/21affb94-aeb9-4b62-a8f3-52065d026c05',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'QuizPlay.tsx:101',message:'Before generateWrongAnswers',data:{wordId:word.id,correctAnswer,wordsAvailable:words.length},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H3,H4,H6',runId:'post-fix-v2'})}).catch(()=>{});
      // #endregion
      
      // Generate 3 wrong answers from all available words
      const wrongAnswers = generateWrongAnswers(word, words, 3);
      
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/21affb94-aeb9-4b62-a8f3-52065d026c05',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'QuizPlay.tsx:109',message:'After generateWrongAnswers',data:{wrongAnswersCount:wrongAnswers.length},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H3,H6',runId:'post-fix-v2'})}).catch(()=>{});
      // #endregion
      
      // Combine and shuffle choices
      const choices = shuffleArray([correctAnswer, ...wrongAnswers]);
      
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/21affb94-aeb9-4b62-a8f3-52065d026c05',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'QuizPlay.tsx:117',message:'After shuffle choices',data:{choicesLength:choices.length,choices},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H5,H6',runId:'post-fix-v2'})}).catch(()=>{});
      // #endregion
      
      return {
        word,
        correctAnswer,
        choices,
        userAnswer: null,
        isCorrect: null,
      };
    });

    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/21affb94-aeb9-4b62-a8f3-52065d026c05',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'QuizPlay.tsx:133',message:'Setting questions',data:{generatedQuestionsLength:generatedQuestions.length,firstQuestionChoicesLength:generatedQuestions[0]?.choices.length},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H5,H6',runId:'post-fix-v2'})}).catch(()=>{});
    // #endregion

    setQuestions(generatedQuestions);
    setCurrentIndex(0);
    setAnswered(false);
    setQuizCompleted(false);
    
    // Mark that we've generated questions for this quizWords array
    generatedForWordsRef.current = quizWords;
  }, [quizWords, words, navigate]);

  const currentQuestion = questions[currentIndex];

  const handleAnswerSelect = (choice: string): void => {
    if (answered || !currentQuestion) return;

    const isCorrect = choice === currentQuestion.correctAnswer;
    
    // Update the current question
    const updatedQuestions = [...questions];
    updatedQuestions[currentIndex] = {
      ...currentQuestion,
      userAnswer: choice,
      isCorrect,
    };
    setQuestions(updatedQuestions);
    setAnswered(true);
  };

  const handleNext = (): void => {
    if (currentIndex + 1 >= questions.length) {
      // Quiz completed
      setEndTime(Date.now());
      setQuizCompleted(true);
    } else {
      setCurrentIndex((prev) => prev + 1);
      setAnswered(false);
    }
  };

  const handlePrevious = (): void => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      // Check if previous question was already answered
      setAnswered(questions[currentIndex - 1]?.userAnswer !== null);
    }
  };

  const handlePlayAgain = (): void => {
    navigate('/games/quiz', { replace: true });
  };

  const handleBackToGames = (): void => {
    navigate('/games');
  };

  // Calculate score
  const correctCount = questions.filter(q => q.isCorrect === true).length;
  const totalQuestions = questions.length;
  const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const timeTaken = endTime ? Math.round((endTime - startTime) / 1000) : 0;

  // No words available
  if (questions.length === 0 && !quizCompleted) {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Quiz Game</h1>
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600 mb-4">No words available for this mode.</p>
          <Button onClick={handlePlayAgain}>Back to Setup</Button>
        </div>
      </div>
    );
  }

  // Quiz completed screen
  if (quizCompleted) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">📝 Quiz Results</h1>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">
              {percentage >= 90 ? '🏆' : percentage >= 70 ? '🎉' : percentage >= 50 ? '👍' : '💪'}
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {percentage >= 90 ? 'Excellent!' : percentage >= 70 ? 'Great Job!' : percentage >= 50 ? 'Good Effort!' : 'Keep Practicing!'}
            </h2>
            <p className="text-xl text-gray-600">
              You scored <span className="font-bold text-primary">{correctCount}</span> out of <span className="font-bold">{totalQuestions}</span>
            </p>
            <p className="text-3xl font-bold text-primary mt-4">{percentage}%</p>
            <p className="text-gray-600 mt-2">Time taken: {timeTaken} seconds</p>
          </div>

          {/* Question Review */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Review Your Answers</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {questions.map((q, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-lg border-2 ${
                    q.isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <span className="font-medium text-gray-900">Q{idx + 1}: {q.word.word}</span>
                      {q.isCorrect ? (
                        <span className="ml-2 text-green-600">✓ Correct</span>
                      ) : (
                        <span className="ml-2 text-red-600">✗ Incorrect</span>
                      )}
                    </div>
                    {q.word.level && <Badge level={q.word.level} />}
                  </div>
                  {!q.isCorrect && (
                    <div className="mt-2 text-sm">
                      <p className="text-gray-600">
                        Your answer: <span className="text-red-600 font-medium">{q.userAnswer}</span>
                      </p>
                      <p className="text-gray-600">
                        Correct answer: <span className="text-green-600 font-medium">{q.correctAnswer}</span>
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <Button onClick={handlePlayAgain} variant="primary" size="lg">
              Play Again
            </Button>
            <Button onClick={handleBackToGames} variant="secondary" size="lg">
              Back to Games
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <Button onClick={handleBackToGames} variant="ghost" size="sm">
          ← Exit Quiz
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">📝 Quiz</h1>
        <div></div> {/* Spacer for alignment */}
      </div>

      {/* Progress */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm text-gray-600">
            Question {currentIndex + 1} of {questions.length}
          </p>
          <p className="text-sm text-gray-600">
            Score: {correctCount} / {currentIndex + (answered ? 1 : 0)}
          </p>
        </div>
        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Quiz Question */}
      {currentQuestion && (
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <div className="flex justify-between items-start mb-6">
            {currentQuestion.word.level && <Badge level={currentQuestion.word.level} />}
            <div className="text-sm text-gray-500">
              {currentQuestion.word.language === 'en' ? 'English → Hebrew' : 'Hebrew → English'}
            </div>
          </div>

          <div className={`text-center mb-8 ${getTextDirection(currentQuestion.word.word) === 'rtl' ? 'rtl' : ''}`}>
            <h2 className="text-4xl font-bold text-gray-900 mb-2">{currentQuestion.word.word}</h2>
            <p className="text-lg text-gray-600">Select the correct translation:</p>
          </div>

          {/* Answer Choices */}
          <div className="grid grid-cols-1 gap-4 mb-6">
            {currentQuestion.choices.map((choice, idx) => {
              const isSelected = currentQuestion.userAnswer === choice;
              const isCorrect = choice === currentQuestion.correctAnswer;
              const showFeedback = answered;

              let buttonClass = 'w-full p-4 text-left text-lg rounded-lg border-2 transition-all duration-200 ';
              
              if (showFeedback) {
                if (isCorrect) {
                  buttonClass += 'bg-green-100 border-green-500 text-green-900 font-semibold';
                } else if (isSelected && !isCorrect) {
                  buttonClass += 'bg-red-100 border-red-500 text-red-900 font-semibold';
                } else {
                  buttonClass += 'bg-gray-100 border-gray-300 text-gray-600';
                }
              } else {
                buttonClass += 'bg-white border-gray-300 hover:bg-gray-50 hover:border-primary cursor-pointer';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleAnswerSelect(choice)}
                  disabled={answered}
                  className={buttonClass}
                >
                  <div className="flex items-center justify-between">
                    <span className={getTextDirection(choice) === 'rtl' ? 'text-right w-full' : ''}>
                      {choice}
                    </span>
                    {showFeedback && isCorrect && <span className="text-2xl">✓</span>}
                    {showFeedback && isSelected && !isCorrect && <span className="text-2xl">✗</span>}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Feedback Message */}
          {answered && (
            <div className={`p-4 rounded-lg mb-6 ${
              currentQuestion.isCorrect 
                ? 'bg-green-50 border border-green-200 text-green-800'
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              <p className="font-semibold">
                {currentQuestion.isCorrect ? '✓ Correct!' : '✗ Incorrect'}
              </p>
              {!currentQuestion.isCorrect && (
                <p className="text-sm mt-1">
                  The correct answer is: <span className="font-semibold">{currentQuestion.correctAnswer}</span>
                </p>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-center gap-4">
            <Button 
              onClick={handlePrevious} 
              disabled={currentIndex === 0}
              className="bg-gray-100 text-gray-700 border-2 border-gray-400 hover:bg-gray-200 font-medium"
            >
              ← Previous
            </Button>
            <Button 
              onClick={handleNext}
              disabled={!answered}
              variant="primary"
            >
              {currentIndex + 1 >= questions.length ? 'Finish Quiz' : 'Next Question →'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
