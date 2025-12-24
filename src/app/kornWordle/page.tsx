/**
 * Korn Themed Wordle Page
 * Author: Kimberley Gonzalez
 * Created: December 2025
 * 
 */

"use client";
import { useState, useEffect } from "react";
import { fiveLetter } from "../kornWordleData";
import Link from "next/link";

export default function Wordle() {

    // Get random word that isn't the last played word
    function getRandomWord() {
        const lastWord = typeof window !== "undefined" ? localStorage.getItem("lastWord") : null;
        let availableWords = fiveLetter;
        
        if (lastWord && fiveLetter.length > 1) {
            availableWords = fiveLetter.filter((item) => item.word !== lastWord);
        }
        
        const randomWord = availableWords[Math.floor(Math.random() * availableWords.length)];
        
        if (typeof window !== "undefined") {
            localStorage.setItem("lastWord", randomWord.word);
        }
        
        return randomWord;
    }

    // Load stats from localStorage
    function loadStats() {
        if (typeof window === "undefined") {
            return { totalScore: 0, gamesPlayed: 0, gamesWon: 0, winStreak: 0, bestScore: 0 };
        }
        
        return {
            totalScore: parseInt(localStorage.getItem("totalScore") || "0"),
            gamesPlayed: parseInt(localStorage.getItem("gamesPlayed") || "0"),
            gamesWon: parseInt(localStorage.getItem("gamesWon") || "0"),
            winStreak: parseInt(localStorage.getItem("winStreak") || "0"),
            bestScore: parseInt(localStorage.getItem("bestScore") || "0")
        };
    }

    // Save stats to localStorage
    function saveStats(stats: { totalScore: number; gamesPlayed: number; gamesWon: number; winStreak: number; bestScore: number }) {
        if (typeof window === "undefined") return;
        
        localStorage.setItem("totalScore", stats.totalScore.toString());
        localStorage.setItem("gamesPlayed", stats.gamesPlayed.toString());
        localStorage.setItem("gamesWon", stats.gamesWon.toString());
        localStorage.setItem("winStreak", stats.winStreak.toString());
        localStorage.setItem("bestScore", stats.bestScore.toString());
    }

    const [wordData] = useState(getRandomWord);
    const [secretWord] = useState(wordData.word);
    const [guesses, setGuesses] = useState<string[]>([]);
    const [currentGuess, setCurrentGuess] = useState("");
    const [isChecking, setIsChecking] = useState(false);
    const [message, setMessage] = useState("");
    const [gameWon, setGameWon] = useState(false);
    const [gameLost, setGameLost] = useState(false);
    const [usedLetters, setUsedLetters] = useState<{ [key: string]: string }>({});
    const [hintUsed, setHintUsed] = useState(false);
    const [showHintOptions, setShowHintOptions] = useState(false);
    const [revealedLetters, setRevealedLetters] = useState<(string | null)[]>([null, null, null, null, null]);
    const [albumHint, setAlbumHint] = useState("");
    const [albumCoverHint, setAlbumCoverHint] = useState("");
    
    // Scoring state
    const [gameScore, setGameScore] = useState(100);
    const [hintPenalty, setHintPenalty] = useState(0);
    const [stats, setStats] = useState({ 
        totalScore: 0, 
        gamesPlayed: 0, 
        gamesWon: 0, 
        winStreak: 0, 
        bestScore: 0 
    });

    // Load stats from localStorage after component mounts
    useEffect(() => {
        const savedStats = loadStats();
        setStats(savedStats);
    }, []);

    // Hint score deductions
    const HINT_COST_HARD = 5;
    const HINT_COST_MEDIUM = 10;
    const HINT_COST_EASY = 15;

    // Get all valid words from word list
    const validWordList = fiveLetter.map((item) => item.word);

    // Keyboard layout
    const keyboardRows = [
        ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
        ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
        ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "DEL"]
    ];

    // Check if specific hint is affordable
    function canAffordHint(cost: number) {
        return stats.totalScore >= cost;
    }

    // Check if any hints are available
    function canUseAnyHint() {
        return stats.totalScore >= HINT_COST_HARD && !hintUsed && !gameWon && !gameLost;
    }

    // Calculate final score
    function calculateFinalScore(won: boolean, wrongGuesses: number, hintPenaltyAmount: number) {
        if (!won) {
            return 0 - hintPenaltyAmount;
        }
        const wrongGuessPenalty = wrongGuesses * 15;
        const finalScore = Math.max(0, 100 - wrongGuessPenalty - hintPenaltyAmount);
        return finalScore;
    }

    // Update stats when game ends
    function endGame(won: boolean, wrongGuesses: number) {
        const finalScore = calculateFinalScore(won, wrongGuesses, hintPenalty);
        setGameScore(finalScore);
        
        const newStats = {
            totalScore: stats.totalScore + finalScore,
            gamesPlayed: stats.gamesPlayed + 1,
            gamesWon: won ? stats.gamesWon + 1 : stats.gamesWon,
            winStreak: won ? stats.winStreak + 1 : 0,
            bestScore: finalScore > stats.bestScore ? finalScore : stats.bestScore
        };
        
        setStats(newStats);
        saveStats(newStats);
    }

    // Get colors for entire guess (handles duplicate letters)
    function getGuessColors(guess: string) {
        const colors = ["", "", "", "", ""];
        const secretLetters: (string | null)[] = secretWord.split("");
        
        for (let i = 0; i < 5; i++) {
            if (guess[i] === secretWord[i]) {
                colors[i] = "bg-green-600";
                secretLetters[i] = null;
            }
        }
        
        for (let i = 0; i < 5; i++) {
            if (colors[i] === "") {
                const availableIndex = secretLetters.indexOf(guess[i]);
                if (availableIndex !== -1) {
                    colors[i] = "bg-yellow-500";
                    secretLetters[availableIndex] = null;
                } else {
                    colors[i] = "bg-gray-600";
                }
            }
        }
        
        return colors;
    }

    // Update used letters after a guess
    function updateUsedLetters(guess: string) {
        const colors = getGuessColors(guess);
        const newUsedLetters: { [key: string]: string } = { ...usedLetters };
        
        for (let i = 0; i < 5; i++) {
            const letter = guess[i];
            const color = colors[i];
            
            if (color === "bg-green-600") {
                newUsedLetters[letter] = "bg-green-600";
            } else if (color === "bg-yellow-500" && newUsedLetters[letter] !== "bg-green-600") {
                newUsedLetters[letter] = "bg-yellow-500";
            } else if (!newUsedLetters[letter]) {
                newUsedLetters[letter] = "bg-gray-600";
            }
        }
        
        setUsedLetters(newUsedLetters);
    }

    // Get keyboard key color
    function getKeyColor(key: string) {
        if (key === "ENTER" || key === "DEL") return "bg-gray-400";
        return usedLetters[key] || "bg-gray-300";
    }

    // Handle keyboard click
    function handleKeyClick(key: string) {
        if (isChecking || gameWon || gameLost) return;
        
        if (key === "DEL") {
            setCurrentGuess(currentGuess.slice(0, -1));
            setMessage("");
        } else if (key === "ENTER") {
            submitGuess();
        } else {
            if (currentGuess.length < 5) {
                setCurrentGuess(currentGuess + key);
                setMessage("");
            }
        }
    }

    // Hint functions
    function useAlbumCoverHint() {
        if (!canAffordHint(HINT_COST_HARD)) return;
        setAlbumCoverHint(wordData.albumCover);
        setHintPenalty(HINT_COST_HARD);
        setHintUsed(true);
        setShowHintOptions(false);
    }

    function useAlbumNameHint() {
        if (!canAffordHint(HINT_COST_MEDIUM)) return;
        setAlbumHint(wordData.album);
        setHintPenalty(HINT_COST_MEDIUM);
        setHintUsed(true);
        setShowHintOptions(false);
    }

    function useLetterHint() {
        if (!canAffordHint(HINT_COST_EASY)) return;
        const availablePositions = [];
        for (let i = 0; i < 5; i++) {
            if (revealedLetters[i] === null) {
                availablePositions.push(i);
            }
        }
        
        if (availablePositions.length > 0) {
            const randomIndex = Math.floor(Math.random() * availablePositions.length);
            const position = availablePositions[randomIndex];
            
            const newRevealed = [...revealedLetters];
            newRevealed[position] = secretWord[position];
            setRevealedLetters(newRevealed);
        }
        
        setHintPenalty(HINT_COST_EASY);
        setHintUsed(true);
        setShowHintOptions(false);
    }

    // Check if word exists in dictionary
    async function checkWord(word: string) {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        return response.ok;
    }

    // Handle submitting a guess
    async function submitGuess() {
        if (currentGuess.length !== 5) return;

        if (guesses.includes(currentGuess)) {
            setMessage("You cannot guess the same word.");
            return;
        }

        // Check if word is in our word list first
        const isInWordList = validWordList.includes(currentGuess);

        // Only check dictionary if not in our word list
        if (!isInWordList) {
            setIsChecking(true);
            setMessage("Checking word...");

            const isValid = await checkWord(currentGuess.toLowerCase());

            if (!isValid) {
                setMessage("Not a valid word.");
                setIsChecking(false);
                return;
            }
        }

        updateUsedLetters(currentGuess);
        const newGuesses = [...guesses, currentGuess];
        setGuesses(newGuesses);
        
        if (currentGuess === secretWord) {
            setGameWon(true);
            const wrongGuesses = newGuesses.length - 1;
            endGame(true, wrongGuesses);
        } else if (newGuesses.length === 6) {
            setGameLost(true);
            endGame(false, 6);
        }
        
        setCurrentGuess("");
        setMessage("");
        setIsChecking(false);
    }

    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            const key = event.key.toUpperCase();

            if (isChecking || gameWon || gameLost || showHintOptions) return;

            if (key === "BACKSPACE") {
                setCurrentGuess(currentGuess.slice(0, -1));
                setMessage("");
            } else if (key === "ENTER") {
                submitGuess();
            } else if (key.length === 1 && key >= "A" && key <= "Z") {
                if (currentGuess.length < 5) {
                    setCurrentGuess(currentGuess + key);
                    setMessage("");
                }
            }
        }

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };

    },[currentGuess, guesses, isChecking, gameWon, gameLost, showHintOptions]);

  return (
    <>
    {/* Home Button */}
    <Link 
        href="/" 
        className="absolute top-4 left-4 bg-[#9B7BFF] text-white px-4 py-2 rounded hover:bg-gray-700"
    >
        Home
    </Link>

    {/* Score Display */}
    <div className="absolute top-4 right-4 text-white text-right">
        <p className="text-sm">Total Score: {stats.totalScore}</p>
        <p className="text-sm">Streak: {stats.winStreak}</p>
    </div>

    <header className="flex flex-col items-center mt-8">
        <img 
            src="/icon.png" 
            alt="icon" 
            className="rounded-full w-12 h-12 object-cover" 
          />
      </header>

    {/* Album Cover Hint Display */}
    {albumCoverHint && (
        <div className="mt-4 flex flex-col items-center">
            <p className="text-[#9B7BFF] mb-2">Song from the Album:</p>
            <img 
                src={albumCoverHint} 
                alt="Album cover hint" 
                className="rounded-full w-24 h-24 object-cover"
            />
        </div>
    )}

    {/* Album Name Hint Display */}
    {albumHint && (
        <p className="text-[#9B7BFF] mt-4">Album Name: {albumHint}</p>
    )}

    {/* Revealed Letters Display */}
    {revealedLetters.some(letter => letter !== null) && (
        <div className="flex gap-2 mt-4">
            {revealedLetters.map((letter, index) => (
                <div 
                    key={index}
                    className={`w-10 h-10 border-2 flex items-center justify-center text-white font-bold ${letter ? "border-green-500 bg-green-600" : "border-gray-500"}`}
                >
                    {letter || ""}
                </div>
            ))}
        </div>
    )}

    <div className="flex flex-col gap-2 mt-3">
        {[0, 1, 2, 3, 4, 5].map((rowIndex) => {
            const rowColors = guesses.length > rowIndex 
                ? getGuessColors(guesses[rowIndex]) 
                : [];

            return (
                <div key={rowIndex} className="flex gap-2">
                    {[0, 1, 2, 3, 4].map((boxIndex) => {
                        const isSubmitted = guesses.length > rowIndex;
                        const letter = isSubmitted 
                            ? guesses[rowIndex][boxIndex] 
                            : guesses.length === rowIndex 
                                ? currentGuess[boxIndex] 
                                : "";
                        
                        const colorClass = isSubmitted ? rowColors[boxIndex] : "";

                        return (
                            <div 
                                key={boxIndex} 
                                className={`w-14 h-14 border-2 border-gray-500 flex items-center justify-center text-white text-2xl font-bold ${colorClass}`}
                            >
                                {letter}
                            </div>
                        );
                    })}
                </div>
            );
        })}
    </div>

    <div className="text-[white] m-4">
      <p>{message}</p>
    </div>

    {/* On-screen Keyboard */}
    <div className="flex flex-col gap-2 mt-4">
        {keyboardRows.map((row, rowIndex) => {
            return (
                <div key={rowIndex} className="flex gap-1 justify-center">
                    {row.map((key) => {
                        const isWide = key === "ENTER" || key === "DEL";
                        return (
                            <button
                                key={key}
                                onClick={() => handleKeyClick(key)}
                                className={`${isWide ? "px-4" : "w-10"} h-14 rounded font-bold text-sm flex items-center justify-center ${getKeyColor(key)} hover:opacity-80`}
                            >
                                {key}
                            </button>
                        );
                    })}
                </div>
            );
        })}
    </div>

    {/* Hint Button - only shows if can afford at least the cheapest hint */}
    {canUseAnyHint() && (
        <button 
            onClick={() => setShowHintOptions(true)}
            className="mt-4 bg-[#9B7BFF] text-white px-4 py-2 rounded hover:bg-purple-700"
        >
            Use Hint
        </button>
    )}

    {/* No Hints Available Message */}
    {stats.totalScore < HINT_COST_HARD && !hintUsed && !gameWon && !gameLost && (
        <p className="mt-4 text-red-400 text-sm">No hints available (need at least {HINT_COST_HARD} points)</p>
    )}

    {/* Hint Options Popup */}
    {showHintOptions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-[#9B7BFF] text-black p-8 rounded-lg text-center max-w-sm">
                <h2 className="text-2xl font-bold mb-2">Choose Your Hint</h2>
                <p className="mb-2 text-gray-600">You can only use one hint per game!</p>
                <p className="mb-6 text-gray-600">Your points: {stats.totalScore}</p>
                <div className="flex flex-col gap-4">
                    <button 
                        onClick={useAlbumCoverHint}
                        disabled={!canAffordHint(HINT_COST_HARD)}
                        className={`px-6 py-3 rounded ${canAffordHint(HINT_COST_HARD) ? "bg-[#7D1538] text-white hover:bg-red-600" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
                    >
                        Hard: Album Cover (-{HINT_COST_HARD} pts)
                    </button>
                    <button 
                        onClick={useAlbumNameHint}
                        disabled={!canAffordHint(HINT_COST_MEDIUM)}
                        className={`px-6 py-3 rounded ${canAffordHint(HINT_COST_MEDIUM) ? "bg-[#C57B57] text-white hover:bg-yellow-600" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
                    >
                        Medium: Album Name (-{HINT_COST_MEDIUM} pts)
                    </button>
                    <button 
                        onClick={useLetterHint}
                        disabled={!canAffordHint(HINT_COST_EASY)}
                        className={`px-6 py-3 rounded ${canAffordHint(HINT_COST_EASY) ? "bg-[#1E555C] text-white hover:bg-green-600" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
                    >
                        Easy: Reveal a Letter (-{HINT_COST_EASY} pts)
                    </button>
                    <button 
                        onClick={() => setShowHintOptions(false)}
                        className="bg-gray-400 text-white px-6 py-3 rounded hover:bg-gray-500 mt-2"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )}

    {/* Win Popup */}
    {gameWon && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-[#9B7BFF] text-black p-8 rounded-lg text-center">
                <h2 className="text-3xl font-bold mb-4">Congratulations!</h2>
                <p className="text-xl mb-2">You guessed the word!</p>
                <p className="text-2xl font-bold text-green-600 mb-4">{secretWord}</p>
                <div className="mb-6 text-gray-700">
                    <p>Game Score: {gameScore}</p>
                    <p>Total Score: {stats.totalScore}</p>
                    <p>Win Streak: {stats.winStreak}</p>
                </div>
                <button 
                    onClick={() => window.location.reload()}
                    className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600"
                >
                    Play Again
                </button>
            </div>
        </div>
    )}

    {/* Game Over Popup */}
    {gameLost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-[#9B7BFF] text-black p-8 rounded-lg text-center">
                <h2 className="text-3xl font-bold mb-4">Game Over</h2>
                <p className="text-xl mb-2">The word was:</p>
                <p className="text-2xl font-bold text-red-600 mb-4">{secretWord}</p>
                <div className="mb-6 text-gray-700">
                    <p>Game Score: {gameScore}</p>
                    <p>Total Score: {stats.totalScore}</p>
                    <p>Win Streak: 0</p>
                </div>
                <button 
                    onClick={() => window.location.reload()}
                    className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600"
                >
                    Try Again
                </button>
            </div>
        </div>
    )}

    </>

  );
}