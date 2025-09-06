import React from 'react';

export const Header: React.FC = () => {
    return (
        <header className="w-full max-w-4xl text-center animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pk-yellow to-pk-blue dark:from-pk-yellow dark:to-blue-400 pb-2 drop-shadow-md" style={{ WebkitTextStroke: '2px #2a75bb' }}>
                Chop Chop Booster
            </h1>
            <p className="text-md md:text-lg text-slate-700 dark:text-slate-400 mt-2 font-semibold">
                Your goals, now a collectible card game!
            </p>
        </header>
    );
};