import React from 'react';

interface TopBarProps {
  onCreateNewSeries?: () => void;
  breadcrumbs?: string[];
  onNavigateLeft?: () => void;
  onNavigateRight?: () => void;
  showNavigation?: boolean;
  currentPosition?: string;
}

const TopBar: React.FC<TopBarProps> = ({
  onCreateNewSeries,
  breadcrumbs = [],
  onNavigateLeft,
  onNavigateRight,
  showNavigation = false,
  currentPosition
}) => {
  return (
    <div className="w-full max-w-4xl flex items-center justify-between mb-4 px-4">
      {/* Breadcrumbs */}
      <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={index}>
            <span>{crumb}</span>
            {index < breadcrumbs.length - 1 && <span>&gt;</span>}
          </React.Fragment>
        ))}
      </div>

      {/* Right side actions */}
      <div className="flex items-center space-x-2">
        {currentPosition && (
          <span className="text-sm text-slate-600 dark:text-slate-400 mr-2">
            {currentPosition}
          </span>
        )}
        {showNavigation && (
          <>
            <button
              onClick={onNavigateLeft}
              className="p-2 rounded-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 transition-colors"
              aria-label="Previous"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={onNavigateRight}
              className="p-2 rounded-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 transition-colors"
              aria-label="Next"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
        {onCreateNewSeries && (
          <button
            onClick={onCreateNewSeries}
            className="bg-pk-red text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 ease-in-out hover:bg-red-500 transform hover:scale-105"
          >
            New Series
          </button>
        )}
      </div>
    </div>
  );
};

export default TopBar;
