import React, { useState, useEffect } from 'react';

const loadingMessages = [
  "Shuffling the deck...",
  "Designing your cards...",
  "Printing the boosters...",
  "Getting the holo foils just right...",
  "Building your new series...",
];

const LoadingView: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 animate-fade-in">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-pk-blue dark:border-pk-yellow"></div>
        <p className="text-lg font-semibold text-slate-700 dark:text-slate-300 mt-6 transition-opacity duration-500">
            {loadingMessages[messageIndex]}
        </p>
    </div>
  );
};

export default LoadingView;