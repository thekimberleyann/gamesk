/**
 * Wordle Page
 * Author: Kimberley Gonzalez
 * Created: December 2025
 * Current Task: Dictionary API
 */

"use client";
import { useState, useEffect } from "react";

export default function Wordle() {

    const[value, setValue] = useState("initial value tester");
    const [secretWord, setSecretWord] = useState("HELLO");
    const[guesses,setGuesses] = useState([]);
    const[currentGuess,setCurrentGuess] = useState("");
    const [isChecking, setIsChecking] = useState(false);
    const [message, setMessage] = useState("");

    // Check if word exists in dictionary
    async function checkWord(word) {
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

        setIsChecking(true);
        setMessage("Checking word...");

        const isValid = await checkWord(currentGuess.toLowerCase());

        if (!isValid) {
            setMessage("Not a valid word.");
            setIsChecking(false);
            return;
        }

        setGuesses([...guesses, currentGuess]);
        setCurrentGuess("");
        setMessage("");
        setIsChecking(false);
    }

    useEffect(() => {
        function handleKeyDown(event) {
            console.log(event.key);
            const key = event.key.toUpperCase();

            if (isChecking) return; // Ignore input while checking

            if (key === "BACKSPACE") {
                setCurrentGuess(currentGuess.slice(0, -1));
                setMessage(""); // Clear any error message
            } else if (key === "ENTER") {
                submitGuess();
            } else if (key.length === 1 && key >= "A" && key <= "Z") {
                if (currentGuess.length < 5) {
                    setCurrentGuess(currentGuess + key);
                    setMessage(""); // Clear any error message
                }
            }
        }

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };

    },[currentGuess, guesses, isChecking]);

  return (
    <>
    <header className="flex flex-col object cover mt-8">
        <img 
            src="/icon.png" 
            alt="icon" 
            className="rounded-full w-12 h-12 object-cover" 
          />
      </header>

    <div className="flex flex-col gap-2 mt-3">
        {[0, 1, 2, 3, 4, 5].map((rowIndex) => {
            return (
                <div key={rowIndex} className="flex gap-2">
                    {[0, 1, 2, 3, 4].map((boxIndex) => {
                        return (
                            <div 
                                key={boxIndex} 
                                className="w-14 h-14 border-2 border-gray-500 flex items-center justify-center text-white text-2xl font-bold"
                            >
                                {guesses.length > rowIndex ? guesses[rowIndex][boxIndex] : guesses.length === rowIndex ? currentGuess[boxIndex] : ""}
                            </div>
                        );
                    })}
                </div>
            );
        })}
    </div>

    <div className="text-[white] m-8">
      <h1>Wordle Game: {value} </h1>
      <p>{currentGuess}</p>
      <p>{message}</p>
    </div>

    </>

  );
}