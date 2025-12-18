/**
 * Wordle Page
 * Author: Kimberley Gonzalez
 * Created: December 2025
 * Current Task: 
 */

"use client";
import { useState, useEffect } from "react";

export default function Wordle() {

    const[value, setValue] = useState("initial value tester");
    const [secretWord, setSecretWord] = useState("HELLO");
    const[guesses,setGuesses] = useState([]);
    const[currentGuess,setCurrentGuess] = useState("");

    useEffect(() => {
        function handleKeyDown(event) {
            console.log(event.key);
            const key = event.key.toUpperCase();

            if (key === "BACKSPACE") {
                setCurrentGuess(currentGuess.slice(0, -1));
            } else if (key === "ENTER") {
                if (currentGuess.length === 5) {
                    setGuesses([...guesses, currentGuess]);
                    setCurrentGuess("");
                }
            } else if (key.length === 1 && key >= "A" && key <= "Z") {
                if (currentGuess.length < 5) {
                    setCurrentGuess(currentGuess + key);
                }
            }
        }

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };

    },[currentGuess, guesses]);

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
    </div>

    </>

  );
}