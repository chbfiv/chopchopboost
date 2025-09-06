import React, { useState, useRef } from 'react';
import { Milestone } from '../types';
import BoosterPackCard from './BoosterPackCard';

interface BoosterPackListProps {
  milestones: Milestone[];
  onMilestoneSelect: (index: number) => void;
  currentIndex?: number;
  onIndexChange?: (index: number) => void;
}

const BoosterPackList: React.FC<BoosterPackListProps> = ({ milestones, onMilestoneSelect, currentIndex = 0, onIndexChange }) => {
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
    const newIndex = Math.min(currentIndex + 1, milestones.length - 1);
    onIndexChange?.(newIndex);
  };
  
  const goToPrev = () => {
    const newIndex = Math.max(currentIndex - 1, 0);
    onIndexChange?.(newIndex);
  };

  return (
    <div className="w-full flex flex-col items-center animate-fade-in">
      
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
    </div>
  );
};

export default BoosterPackList;