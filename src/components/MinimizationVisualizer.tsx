import React, { useState } from 'react';
import { Sparkles, Play, RotateCcw, CheckCircle2 } from 'lucide-react';

export const MinimizationVisualizer: React.FC = () => {
  const [step, setStep] = useState<number>(0);
  const states = ['A', 'B', 'C', 'D', 'E'];
  const acceptStates = ['C', 'E'];

  // Base step marks: pairs where one is accept and other is not
  // Induction step marks: pairs transitioning to marked pairs

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Chapter 4 - Section 4.4</span>
            <h2 className="text-xl font-bold text-slate-900 mt-1">DFA Minimization: Table-Filling Algorithm</h2>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setStep(0)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold ${step === 0 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'}`}
            >
              1. Base Step (Accept vs Non-Accept)
            </button>
            <button
              onClick={() => setStep(1)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold ${step === 1 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'}`}
            >
              2. Induction Step (Transitions)
            </button>
            <button
              onClick={() => setStep(2)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold ${step === 2 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'}`}
            >
              3. Minimized DFA
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Matrix Grid */}
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Distinguishable State Matrix (Triangle Table)</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {step === 0 && 'Base Step: Mark with X all pairs (p, q) where exactly one state is in Accept states F.'}
              {step === 1 && 'Induction Step: Check remaining unmarked pairs. If transition under symbol a leads to an already marked pair, mark this pair.'}
              {step === 2 && 'Merge all unmarked pairs (e.g. {A, D}) into single canonical equivalence classes!'}
            </p>

            <div className="overflow-x-auto bg-white p-4 rounded-xl border border-slate-200">
              <table className="w-full text-center font-mono text-xs">
                <thead>
                  <tr>
                    <th className="p-2 border-b"></th>
                    {states.slice(0, 4).map(s => <th key={s} className="p-2 border-b font-bold text-slate-700">{s}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {states.slice(1).map((rowState, rIdx) => (
                    <tr key={rowState}>
                      <td className="p-2 font-bold text-slate-700 border-r">{rowState}</td>
                      {states.slice(0, rIdx + 1).map((colState) => {
                        const isAcceptPair = acceptStates.includes(rowState) !== acceptStates.includes(colState);
                        const isMarked = step > 0 || isAcceptPair;
                        return (
                          <td key={colState} className={`p-3 border font-bold ${
                            isMarked ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}>
                            {isMarked ? 'X' : '≡'}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right: Explanation & Result */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 flex flex-col justify-between space-y-4">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Algorithmic Analysis</h4>
              <div className="space-y-3">
                {step === 0 && (
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-2">
                    <span className="font-bold text-indigo-600">Base Marking:</span> Pairs like (A, C) where A ∉ F and C ∈ F are immediately marked distinguishable because string ε distinguishes them.
                  </div>
                )}
                {step === 1 && (
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-2">
                    <span className="font-bold text-indigo-600">Induction Propagation:</span> Checking transitions δ(p,0) and δ(q,0). If they land in a marked box, (p,q) is now marked with reason code.
                  </div>
                )}
                {step === 2 && (
                  <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 text-emerald-900 space-y-2">
                    <div className="flex items-center space-x-2 font-bold text-sm">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Minimization Complete</span>
                    </div>
                    <p className="text-xs">
                      Equivalent state classes: {'{A, D}'}, {'{B}'}, {'{C, E}'}. Reduced from 5 states to 3 states with identical language recognition!
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 text-xs text-slate-400">
              <span className="text-indigo-600 font-semibold">Ullman 4.4 Theorem:</span> The resulting minimized DFA is unique up to isomorphism.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
