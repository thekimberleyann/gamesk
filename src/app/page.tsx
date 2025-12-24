/**
 * Chad's Christmas Gift Game 2025
 * Author: Kimberley Gonzalez
 * Created: December 2025
 * Version: 1.0
 * Current Task: useState
 */

import Link from "next/link";

function KornWordleButton(){
  return(
    
    <Link href="/kornWordle" className="bg-[#9B7BFF] hover:bg-gray-700 text-[white] px-4 py-2 rounded w-48 text-center">
        Korn Themed Wordle
    </Link>
  );
}

function ClassicWordleButton(){
  return(
    <Link href="/wordle" className="bg-[#9B7BFF] hover:bg-gray-700 text-[white] px-4 py-2 rounded w-48 text-center">
        Classic Wordle
    </Link>
  );
}




export default function Home() {
  return (
    <main>
      <header className="flex flex-col items-center justify-center object cover mt-8">
        {/* Circular Icon */}
        <img 
            src="/icon.png" 
            alt="icon" 
            className="rounded-full w-48 h-48 object-cover" 
          />
      </header>

      <nav className="flex flex-col items-center justify-center gap-6 mt-8">  
        {/* navigation container */}
        <KornWordleButton/>
        <ClassicWordleButton/>
      </nav>


    </main>
      
  );
}
