/**
 * Classic Wordle Page
 * Author: Kimberley Gonzalez
 * Created: December 2025
 * Current Task: Classic Wordle with 2 letter hints
 */

"use client";
import { useState, useEffect } from "react";
import { classicWords } from "../classicWordleData";
import Link from "next/link";

export default function ClassicWordle() {

    // Get random word that isn't the last played word
    function getRandomWord() {
        const lastWord = typeof window !== "undefined" ? localStorage.getItem("lastClassicWord") : null;
        let availableWords = classicWords;
        
        if (lastWord && classicWords.length > 1) {
            availableWords = classicWords.filter((word) => word !== lastWord);
        }
        
        const randomWord = availableWords[Math.floor(Math.random() * availableWords.length)];
        
        if (typeof window !== "undefined") {
            localStorage.setItem("lastClassicWord", randomWord);
        }
        
        return randomWord;
    }

    // Load stats from localStorage (shared with Korn Wordle)
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

    const [secretWord] = useState(getRandomWord);
    const [guesses, setGuesses] = useState<string[]>([]);
    const [currentGuess, setCurrentGuess] = useState("");
    const [isChecking, setIsChecking] = useState(false);
    const [message, setMessage] = useState("");
    const [gameWon, setGameWon] = useState(false);
    const [gameLost, setGameLost] = useState(false);
    const [usedLetters, setUsedLetters] = useState<{ [key: string]: string }>({});
    const [hintsUsed, setHintsUsed] = useState(0);
    const [showHintOptions, setShowHintOptions] = useState(false);
    const [revealedLetters, setRevealedLetters] = useState<(string | null)[]>([null, null, null, null, null]);
    
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

    // Hint costs
    const HINT_COST_FIRST = 10;
    const HINT_COST_SECOND = 15;
    const MAX_HINTS = 2;

    // Keyboard layout
    const keyboardRows = [
        ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
        ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
        ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "DEL"]
    ];

    // Get current hint cost
    function getCurrentHintCost() {
        if (hintsUsed === 0) return HINT_COST_FIRST;
        if (hintsUsed === 1) return HINT_COST_SECOND;
        return 0;
    }

    // Check if can afford hint
    function canAffordHint(cost: number) {
        return stats.totalScore >= getCurrentHintCost() && hintsUsed < MAX_HINTS && !gameWon && !gameLost;
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

    // Use letter hint
    function useLetterHint() {
        const cost = getCurrentHintCost();
        if (!canAffordHint(getCurrentHintCost())) return;
        
        const availablePositions: number[] = [];
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
        
        setHintPenalty(hintPenalty + cost);
        setHintsUsed(hintsUsed + 1);
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
        const isInWordList = classicWords.includes(currentGuess);

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
        <h1 className="text-white text-2xl font-bold mb-4">Classic Wordle</h1>
    </header>

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

    {/* Hint Button */}
    {canAffordHint(getCurrentHintCost()) && (
        <button 
            onClick={() => setShowHintOptions(true)}
            className="mt-4 bg-[#9B7BFF] text-white px-4 py-2 rounded hover:bg-purple-700"
        >
            Use Hint ({hintsUsed}/{MAX_HINTS})
        </button>
    )}

    {/* No Hints Available Message */}
    {hintsUsed >= MAX_HINTS && !gameWon && !gameLost && (
        <p className="mt-4 text-gray-400 text-sm">No hints remaining</p>
    )}

    {stats.totalScore < getCurrentHintCost() && hintsUsed < MAX_HINTS && !gameWon && !gameLost && (
        <p className="mt-4 text-[#7D1538] text-sm">Not enough points for hint (need {getCurrentHintCost()})</p>
    )}

    {/* Hint Options Popup */}
    {showHintOptions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-[#9B7BFF] text-black p-8 rounded-lg text-center max-w-sm">
                <h2 className="text-2xl font-bold mb-2">Reveal a Letter</h2>
                <p className="mb-2 text-gray-600">Hints used: {hintsUsed}/{MAX_HINTS}</p>
                <p className="mb-6 text-gray-600">Your points: {stats.totalScore}</p>
                <div className="flex flex-col gap-4">
                    <button 
                        onClick={useLetterHint}
                        className="bg-[#1E555C] text-white px-6 py-3 rounded hover:bg-green-600"
                    >
                        Reveal Letter (-{getCurrentHintCost()} pts)
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