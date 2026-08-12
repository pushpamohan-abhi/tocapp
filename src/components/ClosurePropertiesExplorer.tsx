import React, { useState } from 'react';
import { Layers, Play, CheckCircle2, ArrowRight } from 'lucide-react';

export const ClosurePropertiesExplorer: React.FC = () => {
  const [opType, setOpType] = useState<'union' | 'intersection' | 'complement' | 'reversal'>('union');
  const [executed, setExecuted] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Chapter 4 - Section 4.2</span>
            <h2 className="text-xl font-bold text-slate-900 mt-1">Closure Properties Explorer (Product Construction)</h2>
          </div>
          <div className="flex space-x-2 overflow-x-auto pb-1">
            {(['union', 'intersection', 'complement', 'reversal'] as const).map((op) => (
              <button
                key={op}
                onClick={() => { setOpType(op); setExecuted(false); }}
                className={`px-3 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider ${
                  opType === op ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {op}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4 bg-slate-50 p-6 rounded-xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>Automata Operation Builder</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Regular languages are closed under major set operations. For Union and Intersection, we use the <strong>Product Construction</strong> where states of the new machine are pairs <span className="font-mono">(p, q)</span> representing concurrent execution of DFA1 and DFA2.
            </p>

            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3 font-mono text-xs">
              <div className="text-indigo-600 font-bold">Operation Selected: {opType.toUpperCase()}</div>
              <div>DFA 1 States: Q1 = {'{A, B}'}, F1 = {'{B}'}</div>
              <div>DFA 2 States: Q2 = {'{X, Y}'}, F2 = {'{Y}'}</div>
              <div>Product States Q1 × Q2 = {'{(A,X), (A,Y), (B,X), (B,Y)}'}</div>
            </div>

            <button
              onClick={() => setExecuted(true)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl text-xs shadow-md flex items-center justify-center space-x-2"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Execute Product Construction</span>
            </button>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 flex flex-col justify-between space-y-4">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Construction Result & Accepting States</h4>
              {!executed ? (
                <p className="text-xs text-slate-400 italic">Click Execute Product Construction to simulate state pairing and final state designation.</p>
              ) : (
                <div className="space-y-4">
                  <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-emerald-900 space-y-2">
                    <div className="flex items-center space-x-2 font-bold text-sm">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Successfully Built {opType.toUpperCase()} DFA</span>
                    </div>
                    <p className="text-xs">
                      {opType === 'union' && 'Accept states in product: {(p,q) | p ∈ F1 OR q ∈ F2}'}
                      {opType === 'intersection' && 'Accept states in product: {(p,q) | p ∈ F1 AND q ∈ F2}'}
                      {opType === 'complement' && 'Accept states: Q \\ F (swapping accepting and non-accepting states)'}
                      {opType === 'reversal' && 'Reversing all transitions and swapping initial/accept states via NFA conversion'}
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="text-xs text-slate-400 pt-4 border-t border-slate-100">
              <span className="text-indigo-600 font-semibold">Ullman 4.2 Guarantee:</span> Closure properties allow complex language proofs without constructing explicit machines every time.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
