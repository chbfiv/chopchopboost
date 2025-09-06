import React, { useState, useRef, useEffect } from 'react';
import { Milestone } from '../types';
import InstructionCard from './InstructionCard';
import HeroCardView from './HeroCardView';

interface CardViewerViewProps {
  milestone: Milestone;
  milestoneIndex: number;
  onBack: () => void;
  onComplete: (index: number) => void;
  isLoadingTasks: boolean;
  error: string | null;
}

const CardViewerView: React.FC<CardViewerViewProps> = ({ milestone, milestoneIndex, onBack, onComplete, isLoadingTasks, error }) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isHeroRevealed, setIsHeroRevealed] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleRevealHero = () => {
    onComplete(milestoneIndex);
    setIsHeroRevealed(true);
  };

  // Update index on scroll
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
        const scrollLeft = container.scrollLeft;
        const cardWidth = container.offsetWidth;
        const newIndex = Math.round(scrollLeft / cardWidth);
        if (newIndex !== currentCardIndex) {
            setCurrentCardIndex(newIndex);
        }
    };
    
    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [currentCardIndex]);

  if (isHeroRevealed) {
    return <HeroCardView milestone={milestone} onBack={onBack} />;
  }
  
  return (
    <div className="w-full h-full max-w-md mx-auto flex flex-col animate-fade-in">
      {/* Header */}
      <div className="mb-4">
         <div className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            <span onClick={onBack} className="hover:text-pk-blue cursor-pointer transition-colors">
                My Series
            </span>
            <span className="mx-2">/</span>
            <span className="text-slate-800 dark:text-slate-200">{milestone.title}</span>
        </div>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
            Swipe through your Cards!
        </p>
      </div>

      {isLoadingTasks && (
         <div className="flex flex-col items-center justify-center text-center p-8 flex-grow">
              <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-pk-blue dark:border-pk-yellow"></div>
              <p className="text-md font-semibold text-slate-700 dark:text-slate-300 mt-4">
                  Drawing cards...
              </p>
          </div>
      )}
      {error && !isLoadingTasks && (
          <div className="text-center text-pk-red bg-red-100 dark:bg-red-900/20 p-4 rounded-lg font-semibold">
              <p>{error}</p>
          </div>
      )}

      {/* Card Swiper */}
      {!isLoadingTasks && milestone.tasks && milestone.tasks.length > 0 && (
        <>
        <div ref={scrollContainerRef} className="flex-grow flex overflow-x-auto snap-x snap-mandatory scrollbar-hide">
          {milestone.tasks.map((task, index) => (
            <div key={index} className="flex-shrink-0 w-full snap-center flex items-center justify-center p-2">
                <InstructionCard task={task} />
            </div>
          ))}
        </div>
        
        {/* Progress & Navigation */}
        <div className="flex flex-col items-center mt-4">
            <p className="font-bold text-slate-700 dark:text-slate-300">
                Card {currentCardIndex + 1} of {milestone.tasks.length}
            </p>
            {currentCardIndex === milestone.tasks.length - 1 ? (
                <button 
                    onClick={handleRevealHero}
                    className="mt-4 w-full max-w-xs py-3 px-8 text-pk-blue font-bold rounded-lg transition-all duration-300 ease-in-out bg-pk-yellow hover:bg-yellow-300 transform hover:scale-105 shadow-lg border-2 border-pk-blue"
                >
                    Reveal Holo Card!
                </button>
            ) : (
                <p className="text-sm text-slate-500 mt-1">Swipe to continue</p>
            )}
        </div>
        </>
      )}
    </div>
  );
};

export default CardViewerView;