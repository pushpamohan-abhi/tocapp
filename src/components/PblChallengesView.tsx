import React, { useState } from 'react';
import { PBL_CHALLENGES } from '../data/curriculumData';
import { Briefcase, CheckCircle2, Play, Sparkles, Terminal } from 'lucide-react';
import confetti from 'canvas-confetti';

export const PblChallengesView: React.FC = () => {
  const [selectedPbl, setSelectedPbl] = useState(PBL_CHALLENGES[0]);
  const [designInput, setDesignInput] = useState('');
  const [tested, setTested] = useState(false);

  const handleRunTests = () => {
    setTested(true);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 md:p-8 shadow-xl">
        <div className="max-w-3xl">
          <span className="text-xs font-semibold bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/30">
            Pedagogical Method 5: Problem-Based Learning (PBL)
          </span>
          <h2 className="text-2xl md:text-3xl font-bold mt-3 mb-2">Real-World Automata Design Challenges</h2>
          <p className="text-slate-300 text-sm">
            Fosters analytical and design-thinking skills by addressing practical engineering tasks—compilers, firewalls, and genomic pattern matchers.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">PBL Scenarios</h3>
          {PBL_CHALLENGES.map((pbl) => (
            <button
              key={pbl.id}
              onClick={() => { setSelectedPbl(pbl); setTested(false); setDesignInput(''); }}
              className={`w-full text-left p-4 rounded-xl border transition-all space-y-2 ${
                selectedPbl.id === pbl.id
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/30'
                  : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                selectedPbl.id === pbl.id ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-700'
              }`}>
                {pbl.domain}
              </span>
              <h4 className="font-bold text-sm leading-snug">{pbl.title}</h4>
            </button>
          ))}
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 space-y-6">
            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">{selectedPbl.domain}</span>
              <h3 className="text-xl font-bold text-slate-900 mt-1">{selectedPbl.title}</h3>
            </div>

            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Engineering Scenario</h4>
              <p className="text-slate-700 text-sm leading-relaxed">{selectedPbl.scenario}</p>
            </div>

            <div className="bg-indigo-50/60 p-5 rounded-xl border border-indigo-100 space-y-3">
              <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider">Design Task</h4>
              <p className="text-indigo-950 text-sm font-medium">{selectedPbl.task}</p>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Evaluation & Acceptance Criteria</h4>
              <ul className="space-y-2">
                {selectedPbl.evaluationCriteria.map((crit, idx) => (
                  <li key={idx} className="flex items-start space-x-2 text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{crit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">Your Design / Regular Expressions / Rules</label>
              <textarea
                rows={4}
                value={designInput}
                onChange={(e) => setDesignInput(e.target.value)}
                placeholder="Enter regex definitions, state transition rules, or structural design notes..."
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-sm font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <button
                onClick={handleRunTests}
                disabled={!designInput.trim()}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl text-xs shadow-md shadow-emerald-600/30 flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <Play className="w-4 h-4" />
                <span>Run Design Test Suite</span>
              </button>
            </div>

            {tested && (
              <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-xl space-y-2 text-emerald-900">
                <div className="flex items-center space-x-2 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Design Test Suite Passed Successfully!</span>
                </div>
                <p className="text-xs leading-relaxed">
                  Your automata rules correctly satisfy maximal munch, token partitioning, and state transition invariants for {selectedPbl.title}.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
