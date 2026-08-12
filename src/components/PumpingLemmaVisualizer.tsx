import React, { useState } from 'react';
import { Cpu, Play, AlertCircle, CheckCircle2, RefreshCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

export const PumpingLemmaVisualizer: React.FC = () => {
  const [selectedLang, setSelectedLang] = useState<'anbn' | 'palindrome'>('anbn');
  const [nVal, setNVal] = useState<number>(3);
  const [pumpI, setPumpI] = useState<number>(2);
  const [proofSubmitted, setProofSubmitted] = useState(false);

  const handleTestPump = () => {
    setProofSubmitted(true);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Chapter 4 - Section 4.1</span>
            <h2 className="text-xl font-bold text-slate-900 mt-1">Pumping Lemma Interactive Visualizer & Game</h2>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => { setSelectedLang('anbn'); setProofSubmitted(false); }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold ${
                selectedLang === 'anbn' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700'
              }`}
            >
              L1 = {'{a^n b^n}'}
            </button>
            <button
              onClick={() => { setSelectedLang('palindrome'); setProofSubmitted(false); }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold ${
                selectedLang === 'palindrome' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700'
              }`}
            >
              L2 = Palindromes
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Theory & Parameters */}
          <div className="space-y-4 bg-slate-50 p-6 rounded-xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-indigo-600" />
              <span>Pumping Lemma Game Setup</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              The Pumping Lemma states that for any regular language L, there exists a pumping length <span className="font-mono font-bold">n</span> such that any string <span className="font-mono font-bold">w ∈ L</span> with <span className="font-mono font-bold">|w| ≥ n</span> can be split into <span className="font-mono font-bold">w = xyz</span> satisfying three conditions: (1) <span className="font-mono font-bold">|xy| ≤ n</span>, (2) <span className="font-mono font-bold">|y| ≥ 1</span>, and (3) <span className="font-mono font-bold">∀ i ≥ 0, xy^i z ∈ L</span>.
            </p>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Pumping Length n = <span className="font-mono text-indigo-600">{nVal}</span>
                </label>
                <input
                  type="range"
                  min={2}
                  max={6}
                  value={nVal}
                  onChange={(e) => { setNVal(Number(e.target.value)); setProofSubmitted(false); }}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Pumping Factor i = <span className="font-mono text-indigo-600">{pumpI}</span> (Try i=0 or i=2)
                </label>
                <input
                  type="range"
                  min={0}
                  max={4}
                  value={pumpI}
                  onChange={(e) => { setPumpI(Number(e.target.value)); setProofSubmitted(false); }}
                  className="w-full accent-indigo-600"
                />
              </div>

              <button
                onClick={handleTestPump}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl text-xs shadow-md flex items-center justify-center space-x-2"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Test Pump Operation</span>
              </button>
            </div>
          </div>

          {/* Right: Visual String Breakdown & Verdict */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 flex flex-col justify-between space-y-4">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">String Split & Pump Visualization</h4>
              
              {selectedLang === 'anbn' ? (
                <div className="space-y-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                    <span className="text-xs font-bold text-slate-700">Chosen String w = a^{nVal} b^{nVal}</span>
                    <div className="flex font-mono text-sm tracking-widest overflow-x-auto py-2">
                      <span className="bg-indigo-100 text-indigo-900 px-2 py-1 rounded font-bold">{'a'.repeat(nVal)}</span>
                      <span className="bg-emerald-100 text-emerald-900 px-2 py-1 rounded font-bold">{'b'.repeat(nVal)}</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Adversary splits w = xyz where x = ε, y = a^k (1 ≤ k ≤ {nVal}), z = a^(n-k) b^n.
                    </p>
                  </div>

                  {proofSubmitted && (
                    <div className={`p-4 rounded-xl border ${
                      pumpI !== 1 ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-amber-50 border-amber-200 text-amber-900'
                    }`}>
                      <div className="flex items-center space-x-2 font-bold text-sm mb-1">
                        {pumpI !== 1 ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-amber-600" />}
                        <span>Pump Result (i = {pumpI}): a^{nVal + (pumpI - 1) * 1} b^{nVal}</span>
                      </div>
                      <p className="text-xs leading-relaxed">
                        {pumpI !== 1 
                          ? `Success! With i = ${pumpI}, the number of a's no longer equals the number of b's. The pumped string is NOT in L! Thus L is proven NOT regular.`
                          : `With i = 1, x y^1 z = w, which remains in L. To prove non-regularity, try pumping i = 0 or i = 2!`}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                    <span className="text-xs font-bold text-slate-700">Chosen String w = 0^{nVal} 1 0^{nVal}</span>
                    <div className="flex font-mono text-sm tracking-widest overflow-x-auto py-2">
                      <span className="bg-indigo-100 text-indigo-900 px-2 py-1 rounded font-bold">{'0'.repeat(nVal)}</span>
                      <span className="bg-slate-200 text-slate-800 px-2 py-1 rounded font-bold">1</span>
                      <span className="bg-emerald-100 text-emerald-900 px-2 py-1 rounded font-bold">{'0'.repeat(nVal)}</span>
                    </div>
                  </div>

                  {proofSubmitted && (
                    <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900">
                      <div className="flex items-center space-x-2 font-bold text-sm mb-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Contradiction Achieved (i = {pumpI})</span>
                      </div>
                      <p className="text-xs leading-relaxed">
                        Pumping y (consisting of 0s) changes the left block of 0s without altering the right block, destroying the palindrome symmetry. Non-regularity proven!
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 text-xs text-slate-400">
              <span className="text-indigo-600 font-semibold">Pedagogical Note:</span> The pumping lemma game teaches students adversarial reasoning and proof by contradiction.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
