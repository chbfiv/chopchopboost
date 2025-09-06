import React from 'react';
import { Milestone } from '../types';

interface BoosterPackCardProps {
  milestone: Milestone;
  index: number;
  currentIndex: number;
  onSelect: () => void;
}

// Add global styles for the holo effect once
const holoStyleId = 'holo-style';
if (!document.getElementById(holoStyleId)) {
  const style = document.createElement('style');
  style.id = holoStyleId;
  style.innerHTML = `
    .holo-shine {
      --x: 50%;
      --y: 50%;
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: radial-gradient(
        circle farthest-corner at var(--x) var(--y),
        rgba(255, 255, 255, 0.6) 0%,
        rgba(255, 255, 255, 0.1) 20%,
        rgba(255, 255, 255, 0) 80%
      );
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    .group:hover .holo-shine {
      opacity: 1;
    }
  `;
  document.head.appendChild(style);
}

const BoosterPackCard: React.FC<BoosterPackCardProps> = ({ milestone, index, currentIndex, onSelect }) => {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const offset = index - currentIndex;
  const isCurrent = offset === 0;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--x', `${(x / rect.width) * 100}%`);
    card.style.setProperty('--y', `${(y / rect.height) * 100}%`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleSelect();
    }
  };

  const handleSelect = () => {
    if (isCurrent && !milestone.isCompleted) {
      onSelect();
    }
  };
  
  const cardStyle: React.CSSProperties = {
    transform: `
      rotate(${offset * 3}deg) 
      translateX(${offset * 25}px) 
      scale(${isCurrent ? 1 : 0.9})
    `,
    zIndex: 10 - Math.abs(offset),
    opacity: Math.abs(offset) < 3 ? 1 : 0,
    pointerEvents: 'auto', // Allow clicks on all visible cards
  };

  return (
    <div
      className="absolute w-full h-full max-w-sm aspect-[3/4.2] transition-all duration-300 ease-out"
      style={cardStyle}
      onClick={handleSelect}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onKeyPress={handleKeyPress}
        className={`w-full h-full rounded-2xl shadow-xl overflow-hidden border-4 border-pk-blue/50 dark:border-pk-yellow/50 relative group transition-all duration-300
          ${isCurrent ? (milestone.isCompleted ? 'cursor-default' : 'hover:shadow-2xl hover:border-pk-yellow dark:hover:border-pk-yellow') : 'cursor-default opacity-80'}
          ${milestone.isCompleted ? 'grayscale' : ''}
        `}
        role="button"
        tabIndex={isCurrent && !milestone.isCompleted ? 0 : -1}
        aria-label={`Booster: ${milestone.title}${milestone.isCompleted ? ' (Collected)' : ''}`}
        aria-disabled={!isCurrent || milestone.isCompleted}
      >
        <img src={milestone.imageUrl} alt={milestone.title} className="absolute top-0 left-0 w-full h-full object-cover" />
        <div className="holo-shine"></div>
        
        {milestone.isCompleted && (
           <div className="absolute top-3 right-3 font-bold text-xs text-pk-blue bg-pk-yellow rounded-full px-3 py-1 drop-shadow-lg border-2 border-pk-blue">COLLECTED</div>
        )}

        <div className="absolute bottom-0 left-0 w-full h-2/5 bg-gradient-to-t from-black/80 via-black/60 to-transparent p-4 flex flex-col justify-end text-center">
          <h3 className="text-2xl font-bold text-white leading-tight drop-shadow-lg">
              {milestone.title}
          </h3>
          <div className={`mt-2 font-bold text-lg rounded-lg px-4 py-1 transition-opacity duration-300
            ${isCurrent ? 'opacity-100' : 'opacity-0'}
          `}>
             {milestone.isCompleted ? 
                <span className="bg-pk-blue text-pk-yellow rounded-md px-4 py-1 border-2 border-pk-yellow/50">COLLECTED</span> : 
                <span className="bg-pk-yellow text-pk-blue rounded-md px-4 py-1 border-2 border-pk-blue">OPEN BOOSTER</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoosterPackCard;