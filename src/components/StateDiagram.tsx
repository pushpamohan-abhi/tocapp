import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface DiagramProps {
  states: string[];
  transitions: string[];
  explanation: string;
}

export const StateDiagram: React.FC<DiagramProps> = ({ states, transitions, explanation }) => {
  const [activeState, setActiveState] = useState(states[0]);

  return (
    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
      <h4 className="font-bold text-slate-800 mb-4">Interactive State Diagram</h4>
      <div className="flex justify-center gap-4 mb-6">
        {states.map((state) => (
          <motion.div
            key={state}
            className={`px-4 py-2 rounded-full border-2 ${
              activeState === state ? 'bg-indigo-600 text-white border-indigo-700' : 'bg-white text-slate-700 border-slate-300'
            }`}
            animate={{ scale: activeState === state ? 1.1 : 1 }}
          >
            {state}
          </motion.div>
        ))}
      </div>
      <div className="text-sm text-slate-600 mb-4 italic">Transitions: {transitions.join(', ')}</div>
      <p className="text-sm text-slate-700 bg-slate-100 p-3 rounded">{explanation}</p>
      <div className="mt-4 flex gap-2">
        {states.map((_, i) => (
            <button key={i} onClick={() => setActiveState(states[i])} className="text-xs px-2 py-1 bg-indigo-100 rounded hover:bg-indigo-200">Set {states[i]}</button>
        ))}
      </div>
    </div>
  );
};
