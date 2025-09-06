import React, { useEffect, useState } from 'react';

const slugLines = [
    "Powered by Gemini Nano Banana 🍌",
    "Careful. Bananas are a limited resource...",
    "Boosting productivity, one banana at a time!",
    "Warning: May contain traces of potassium.",
    "No monkeys were harmed in the making of this app.",
    "Banana-powered since 2025.",
    "Peel the future, boost your goals!",
    "If you can read this, you deserve a banana.",
    "Banana jokes are a-peeling, right?",
    "Keep calm and eat a banana."
];

export const Footer: React.FC = () => {
    const [index, setIndex] = useState(0);
    const [pop, setPop] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex(i => {
                let next;
                do {
                    next = Math.floor(Math.random() * slugLines.length);
                } while (next === i);
                return next;
            });
            setPop(true);
        }, Math.floor(Math.random() * 2000) + 3000); // 3-5 seconds
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (pop) {
            const timeout = setTimeout(() => setPop(false), 400);
            return () => clearTimeout(timeout);
        }
    }, [pop]);

    return (
        <footer className="w-full text-center p-4">
                            <p
                                className={`text-sm inline-block transition-all duration-200 ${pop ? 'scale-110 text-white animate-pop-glow' : 'scale-100 text-slate-500 dark:text-slate-400'}`}
                                        style={{
                                            transition: 'transform 0.2s cubic-bezier(.42,1.65,.27,.99), color 0.2s, filter 0.2s',
                                            filter: pop ? 'drop-shadow(0 0 6px #fff) drop-shadow(0 0 12px #ffe066)' : 'none',
                                        }}
                            >
                                {slugLines[index]}
                            </p>
        </footer>
    );
};