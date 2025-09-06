import React from 'react';
import { Task } from '../types';

interface InstructionCardProps {
  task: Task;
}

const InstructionCard: React.FC<InstructionCardProps> = ({ task }) => {
  return (
    <div className="w-full max-w-sm aspect-[3/4.2] bg-pk-yellow p-2 rounded-2xl shadow-xl border-4 border-pk-blue">
      <div className="w-full h-full bg-yellow-50 rounded-lg p-3 flex flex-col overflow-hidden">
        {/* Card Art */}
        <div className="w-full aspect-video rounded-lg overflow-hidden border-2 border-pk-blue/50">
            <img className="w-full h-full object-cover" src={task.imageUrl} alt={task.title} />
        </div>

        {/* Card Title */}
        <div className="text-center my-2">
            <h4 className="text-lg font-bold text-pk-blue">
                {task.title}
            </h4>
        </div>
        
        {/* Card Details */}
        <div className="flex-grow overflow-y-auto pr-2 bg-white/50 rounded p-2 border border-pk-blue/30">
            <ul className="space-y-2">
                {task.details.map((detail, index) => (
                    <li key={index} className="flex items-start">
                        <svg className="h-5 w-5 mt-0.5 flex-shrink-0 text-pk-blue" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                        <p className="ml-2 text-sm text-slate-700">
                            {detail}
                        </p>
                    </li>
                ))}
            </ul>
        </div>
        
        {/* Card Footer */}
        <div className="text-center mt-2 pt-2">
             <p className="text-xs font-bold uppercase tracking-wider text-pk-blue/70">
                CARD
            </p>
        </div>
      </div>
    </div>
  );
};

export default InstructionCard;