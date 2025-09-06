import React from 'react';
import { Milestone } from '../types';

interface HeroCardViewProps {
  milestone: Milestone;
  onBack: () => void;
}

// Add some global styles for the holographic effect
const style = document.createElement('style');
style.innerHTML = `
  @keyframes holoShine {
    0% { transform: rotate(0deg); opacity: 0.2; }
    50% { transform: rotate(180deg); opacity: 0.5; }
    100% { transform: rotate(360deg); opacity: 0.2; }
  }
  .holo-effect::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background-image: conic-gradient(
      from 180deg at 50% 50%,
      #21c3e9 0deg,
      #3af0a3 60deg,
      #e8f387 120deg,
      #f9b265 180deg,
      #f66767 240deg,
      #a95ae2 300deg,
      #21c3e9 360deg
    );
    animation: holoShine 8s linear infinite;
    z-index: 1;
  }
`;
document.head.appendChild(style);

const HeroCardView: React.FC<HeroCardViewProps> = ({ milestone, onBack }) => {
  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center animate-fade-in p-4 text-center">
        <h2 className="text-3xl font-bold text-pk-blue drop-shadow-lg mb-4" style={{ WebkitTextStroke: '2px #ffcb05' }}>HOLO CARD UNLOCKED!</h2>
        
        {/* The Card */}
        <div className="w-full max-w-sm aspect-[3/4.2] rounded-2xl shadow-2xl border-4 border-pk-yellow p-2 flex flex-col overflow-hidden relative holo-effect">
            {/* The content sits above the holo effect */}
            <div className="relative z-10 w-full h-full bg-white dark:bg-slate-800 rounded-lg p-3 flex flex-col">
                {/* Card Art */}
                <div className="w-full aspect-video rounded-lg overflow-hidden border-2 border-pk-blue/50 dark:border-pk-yellow/50">
                    <img className="w-full h-full object-cover" src={milestone.imageUrl} alt={milestone.title} />
                </div>

                {/* Card Title */}
                <div className="text-center my-3">
                    <h4 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pk-blue to-blue-400">
                        {milestone.title}
                    </h4>
                </div>
                
                {/* Card Details */}
                <div className="flex-grow overflow-y-auto pr-2 text-left bg-slate-100/50 dark:bg-slate-700/50 p-2 rounded">
                     <p className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
                        {milestone.description}
                    </p>
                </div>
                
                {/* Card Footer */}
                <div className="text-center mt-3 border-t-2 border-pk-yellow pt-2">
                     <p className="text-xs font-bold uppercase tracking-wider text-pk-yellow" style={{ WebkitTextStroke: '1px #2a75bb' }}>
                        HOLO CARD
                    </p>
                </div>
            </div>
        </div>

        <button 
            onClick={onBack}
            className="mt-8 w-full max-w-xs py-3 px-8 text-white font-bold rounded-lg transition-all duration-300 ease-in-out bg-pk-blue hover:bg-blue-600 transform hover:scale-105"
        >
          Back to My Series
        </button>
    </div>
  );
};

export default HeroCardView;
