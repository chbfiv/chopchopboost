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
  currentCardIndex: number;
  onCardIndexChange: (index: number) => void;
}

const CardViewerView: React.FC<CardViewerViewProps> = ({ milestone, milestoneIndex, onBack, onComplete, isLoadingTasks, error, currentCardIndex, onCardIndexChange }) => {
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
            onCardIndexChange(newIndex);
        }
    };
    
    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [currentCardIndex, onCardIndexChange]);

  // Update scroll on index change
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const cardWidth = container.offsetWidth;
    container.scrollLeft = currentCardIndex * cardWidth;
  }, [currentCardIndex]);

  if (isHeroRevealed) {
    return <HeroCardView milestone={milestone} onBack={onBack} />;
  }
  
  return (
  <div className="w-full h-full max-w-md mx-auto flex flex-col justify-center items-center animate-fade-in overflow-hidden">
      {/* Header removed, using TopBar breadcrumbs */}

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

      {/* Card Swiper Only */}
      {!isLoadingTasks && milestone.tasks && milestone.tasks.length > 0 && (
        <>
          <div ref={scrollContainerRef} className="flex-grow flex overflow-x-auto snap-x snap-mandatory scrollbar-hide items-center justify-center h-full">
            {milestone.tasks.map((task, index) => (
              <div key={index} className="flex-shrink-0 w-full snap-center flex items-center justify-center p-2 h-full">
                  <InstructionCard task={task} />
              </div>
            ))}
          </div>
          {/* Dots Indicator */}
          <div className="flex justify-center items-center mt-2 mb-2 gap-2">
            {milestone.tasks.map((_, idx) => (
              <span
                key={idx}
                className={`w-3 h-3 rounded-full transition-all duration-300 border border-pk-blue ${idx === currentCardIndex ? 'bg-pk-blue scale-125' : 'bg-yellow-200 opacity-60'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CardViewerView;