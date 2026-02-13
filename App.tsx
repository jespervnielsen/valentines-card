
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Heart, Stars, Music, Volume2, VolumeX } from 'lucide-react';
import confetti from 'canvas-confetti';
import { generateSweetNote } from './services/geminiService';

// --- Components ---

const FloatingHearts = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-bounce text-pink-300 opacity-40"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${3 + Math.random() * 5}s`
          }}
        >
          <Heart size={20 + Math.random() * 30} fill="currentColor" />
        </div>
      ))}
    </div>
  );
};

const SuccessView: React.FC<{ message: string }> = ({ message }) => {
  useEffect(() => {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 animate-in fade-in zoom-in duration-500">
      <div className="bg-white rounded-3xl p-8 shadow-2xl border-8 border-pink-200 text-center max-w-md w-full relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-400 via-red-400 to-pink-400"></div>
        
        <img 
          src="https://media.giphy.com/media/OfkGZ5H2H3f8Y/giphy.gif" 
          alt="Celebrating Bears" 
          className="w-64 h-64 mx-auto mb-6 rounded-2xl object-cover shadow-lg"
        />
        
        <h1 className="text-4xl font-pacifico text-pink-600 mb-4 animate-bounce">
          Yay! Happy Valentine's! 💖
        </h1>
        
        <p className="text-xl text-gray-700 font-semibold mb-6">
          {message}
        </p>

        <div className="flex justify-center gap-4">
          <Heart className="text-red-500 animate-pulse fill-red-500" size={32} />
          <Stars className="text-yellow-400 animate-spin" size={32} />
          <Heart className="text-red-500 animate-pulse fill-red-500" size={32} />
        </div>
      </div>
    </div>
  );
};

const ValentineCard: React.FC<{ onAccept: () => void }> = ({ onAccept }) => {
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const [isDodging, setIsDodging] = useState(false);
  const noButtonRef = useRef<HTMLButtonElement>(null);

  const moveNoButton = useCallback(() => {
    if (!noButtonRef.current) return;
    
    const rect = noButtonRef.current.getBoundingClientRect();
    const btnWidth = rect.width;
    const btnHeight = rect.height;

    setNoPosition(prev => {
      // Calculate initial position relative to viewport (where it was before translation)
      const initialX = rect.left - prev.x;
      const initialY = rect.top - prev.y;

      // Define allowed translation range to keep button on screen
      const minTransX = -initialX + 20;
      const maxTransX = window.innerWidth - initialX - btnWidth - 20;
      const minTransY = -initialY + 20;
      const maxTransY = window.innerHeight - initialY - btnHeight - 20;

      // Jump distance: "half of what it does now"
      // Previous was roughly screen-wide. Let's limit it to a 250px jump.
      const jumpRange = 250; 
      let nextX = prev.x + (Math.random() - 0.5) * jumpRange * 2;
      let nextY = prev.y + (Math.random() - 0.5) * jumpRange * 2;

      // Ensure it doesn't move outside the viewport
      nextX = Math.max(minTransX, Math.min(maxTransX, nextX));
      nextY = Math.max(minTransY, Math.min(maxTransY, nextY));
      
      return { x: nextX, y: nextY };
    });
    
    setIsDodging(true);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 relative z-10">
      <div className="bg-white rounded-3xl p-8 shadow-2xl border-8 border-pink-200 text-center max-w-md w-full animate-in slide-in-from-bottom-10 duration-700">
        <img 
          src="https://media.giphy.com/media/WK7omsLop0431tZjXb/giphy.gif" 
          alt="Cute Valentine" 
          className="w-48 h-48 mx-auto mb-6 rounded-full border-4 border-pink-100 shadow-inner"
        />
        
        <h2 className="text-3xl font-pacifico text-pink-600 mb-2">My Dearest...</h2>
        <h1 className="text-4xl font-bold text-gray-800 mb-8 leading-tight">
          Will you be my <br/>
          <span className="text-red-500 decoration-pink-300 underline underline-offset-4">Valentine?</span>
        </h1>

        <div className="relative h-24 flex items-center justify-center gap-6">
          <button
            onClick={onAccept}
            className="px-10 py-4 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-full shadow-lg transform hover:scale-110 active:scale-95 transition-all text-xl z-20"
          >
            YES! 💖
          </button>

          <button
            ref={noButtonRef}
            onMouseEnter={moveNoButton}
            onClick={moveNoButton}
            style={{
              transform: isDodging ? `translate(${noPosition.x}px, ${noPosition.y}px)` : 'none',
              transition: 'transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
            className="px-10 py-4 bg-gray-200 text-gray-500 font-bold rounded-full shadow-md text-xl cursor-default select-none touch-none"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [isAccepted, setIsAccepted] = useState(false);
  const [customNote, setCustomNote] = useState("Loading your special note...");

  useEffect(() => {
    const fetchNote = async () => {
      const note = await generateSweetNote();
      setCustomNote(note);
    };
    fetchNote();
  }, []);

  const handleAccept = () => {
    setIsAccepted(true);
  };

  return (
    <main className="min-h-screen bg-pink-50 text-gray-900 relative">
      {/* Background Decor */}
      <FloatingHearts />
      
      {/* Dynamic Content */}
      {isAccepted ? (
        <SuccessView message={customNote} />
      ) : (
        <ValentineCard onAccept={handleAccept} />
      )}

      {/* Footer Info */}
      <div className="fixed bottom-4 right-4 text-pink-300 font-medium text-xs pointer-events-none z-50">
        Made with 💖 just for you
      </div>
    </main>
  );
}
