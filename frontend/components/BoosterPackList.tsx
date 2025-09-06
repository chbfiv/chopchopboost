import React, { useState, useRef } from 'react';
import { Milestone } from '../types';
import BoosterPackCard from './BoosterPackCard';

interface BoosterPackListProps {
  milestones: Milestone[];
  onStartOver: () => void;
  onMilestoneSelect: (index: number) => void;
}

const BoosterPackList: React.FC<BoosterPackListProps> = ({ milestones, onStartOver, onMilestoneSelect }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    handleSwipe(touchEndX);
  };
  
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    touchStartX.current = e.clientX;
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    const touchEndX = e.clientX;
    handleSwipe(touchEndX);
  };
  
  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
    }
  };

  const handleSwipe = (endX: number) => {
    const deltaX = endX - touchStartX.current;
    if (Math.abs(deltaX) > 50) { // Swipe threshold
      if (deltaX < 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }
  };

  const goToNext = () => {
    setCurrentIndex(prev => Math.min(prev + 1, milestones.length - 1));
  };
  
  const goToPrev = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  };

  return (
    <div className="w-full flex flex-col items-center animate-fade-in">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200">Your Boosters</h2>
        <p className="text-slate-600 dark:text-slate-400 mt-1">Swipe or use the arrows to navigate. Select a pack to open it!</p>
      </div>
      
      {/* Swiper Container */}
      <div 
        className="relative w-full max-w-sm h-[450px] md:h-[500px] flex items-center justify-center cursor-grab active:cursor-grabbing"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {milestones.map((milestone, index) => {
          return (
            <BoosterPackCard 
              key={index} 
              milestone={milestone} 
              index={index}
              currentIndex={currentIndex}
              onSelect={() => onMilestoneSelect(index)}
            />
          );
        })}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-center space-x-4 mt-6">
          <button 
              onClick={goToPrev} 
              disabled={currentIndex === 0}
              className="p-3 rounded-full bg-slate-200 dark:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity hover:bg-slate-300"
              aria-label="Previous Pack"
          >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <p className="font-bold text-lg text-slate-700 dark:text-slate-300 w-20 text-center">
             {currentIndex + 1} / {milestones.length}
          </p>
          <button 
              onClick={goToNext} 
              disabled={currentIndex === milestones.length - 1}
              className="p-3 rounded-full bg-slate-200 dark:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity hover:bg-slate-300"
              aria-label="Next Pack"
          >
              <svg xmlns="http://www.w.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
          </button>
      </div>
      
      <button
        onClick={onStartOver}
        className="mt-10 bg-pk-red text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 ease-in-out hover:bg-red-500 transform hover:scale-105"
      >
        Start a New Series
      </button>
    </div>
  );
};

export default BoosterPackList;