import React, { useState } from 'react';
import { CURRICULUM_SECTIONS } from '../data/curriculumData';
import { BookOpen, Lightbulb, Globe, Code, Layers, CheckCircle2, ChevronRight, GraduationCap, Play } from 'lucide-react';

export const Module1TextbookView: React.FC = () => {
  const module1Sections = CURRICULUM_SECTIONS.filter(s => ['1.1', '1.5', '2.2', '2.3', '2.4', '2.5'].includes(s.id));
  const [selectedId, setSelectedId] = useState<string>('1.5');
  const activeSection = module1Sections.find(s => s.id === selectedId) || module1Sections[1];

  // Interactive DFA State (Section 1.5: ends with "01")
  const [dfaInput, setDfaInput] = useState('10101');
  const [dfaSteps, setDfaSteps] = useState<{ step: number; char: string; state: string; desc: string }[]>([]);
  const [dfaAccepted, setDfaAccepted] = useState<boolean | null>(null);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);

  const runDfaSimulation = () => {
    let currentState = 'q0';
    const steps = [{ step: 0, char: 'Start', state: 'q0', desc: 'Initial state q0' }];
    
    for (let i = 0; i < dfaInput.length; i++) {
      const c = dfaInput[i];
      let nextState = currentState;
      let desc = '';

      if (currentState === 'q0') {
        if (c === '0') { nextState = 'q1'; desc = 'Read 0: Transition from q0 to q1'; }
        else { nextState = 'q0'; desc = 'Read 1: Stay in q0'; }
      } else if (currentState === 'q1') {
        if (c === '1') { nextState = 'q2'; desc = 'Read 1: Transition from q1 to q2 (Accepting state!)'; }
        else if (c === '0') { nextState = 'q1'; desc = 'Read 0: Stay in q1'; }
        else { nextState = 'q0'; desc = 'Invalid char, reset'; }
      } else if (currentState === 'q2') {
        if (c === '0') { nextState = 'q1'; desc = 'Read 0: Transition from q2 to q1'; }
        else { nextState = 'q0'; desc = 'Read 1: Transition from q2 to q0'; }
      }

      currentState = nextState;
      steps.push({ step: i + 1, char: c, state: currentState, desc });
    }

    setDfaSteps(steps);
    setDfaAccepted(currentState === 'q2');
    setCurrentStepIdx(steps.length - 1);
  };

  const activeDfaState = dfaSteps.length > 0 && currentStepIdx < dfaSteps.length ? dfaSteps[currentStepIdx].state : 'q0';

  // Interactive NFA Simulator (Section 2.2: NFA accepting strings containing "101")
  const [nfaInput, setNfaInput] = useState('0101');
  const [nfaPaths, setNfaPaths] = useState<{ states: string[]; accepted: boolean }>({ states: [], accepted: false });

  const runNfaSimulation = () => {
    let currentStates: string[] = ['q0'];
    for (let i = 0; i < nfaInput.length; i++) {
      const c = nfaInput[i];
      const nextStates = new Set<string>();
      currentStates.forEach(st => {
        if (st === 'q0') {
          nextStates.add('q0');
          if (c === '1') nextStates.add('q1');
        } else if (st === 'q1') {
          if (c === '0') nextStates.add('q2');
        } else if (st === 'q2') {
          if (c === '1') nextStates.add('q3');
        } else if (st === 'q3') {
          nextStates.add('q3');
        }
      });
      currentStates = Array.from(nextStates);
      if (currentStates.length === 0) break;
    }
    const accepted = currentStates.includes('q3');
    setNfaPaths({ states: currentStates, accepted });
  };

  // Interactive Subset Construction Simulator (Section 2.3)
  const [subsetStep, setSubsetStep] = useState(1);

  // Interactive Epsilon-Closure Sandbox (Section 2.4)
  const [epsilonState, setEpsilonState] = useState('q0');
  const [epsilonResult, setEpsilonResult] = useState<string[]>(['q0', 'q1', 'q3']);

  const computeEpsilonClosure = (state: string) => {
    setEpsilonState(state);
    if (state === 'q0') setEpsilonResult(['q0', 'q1', 'q3']);
    else if (state === 'q1') setEpsilonResult(['q1', 'q2']);
    else if (state === 'q2') setEpsilonResult(['q2']);
    else setEpsilonResult([state]);
  };

  // Interactive DFA Minimization Table Simulator (Section 2.5)
  const [minTableClicked, setMinTableClicked] = useState<Record<string, boolean>>({
    'p2_p0': true,
    'p3_p0': true,
    'p4_p1': true,
  });

  const toggleTableCell = (pair: string) => {
    setMinTableClicked(prev => ({ ...prev, [pair]: !prev[pair] }));
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      {/* Hero Intro Banner */}
      <div className="bg-[#F8F6F2] text-[#1A1A1A] rounded-sm p-8 shadow-sm border border-[#1A1A1A]/10 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 bg-[#991b1b] text-white px-2.5 py-1 rounded-sm text-[10px] font-bold uppercase tracking-widest font-mono">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Lectures & Manifolds (Module 1)</span>
          </div>
          <h2 className="font-serif italic text-3xl md:text-4xl text-[#1A1A1A]">
            Automata Theory & Computation Masterclass
          </h2>
          <p className="text-[#1A1A1A]/80 text-sm leading-relaxed">
            Explore foundational sections (1.1, 1.5, 2.2, 2.3, 2.4, 2.5) through pedagogical lecturer methods, manifold representations, real-world engineering case studies, and live interactive simulations.
          </p>
        </div>
      </div>

      {/* Section Selection Tabs */}
      <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {module1Sections.map((sec) => (
          <button
            key={sec.id}
            onClick={() => setSelectedId(sec.id)}
            className={`px-4 py-3 rounded-sm text-xs md:text-sm font-medium whitespace-nowrap transition-all duration-200 flex items-center space-x-2 ${
              selectedId === sec.id
                ? 'bg-[#1A1A1A] text-white shadow-sm'
                : 'bg-[#F8F6F2] text-[#1A1A1A]/80 hover:bg-[#1A1A1A]/5 border border-[#1A1A1A]/10'
            }`}
          >
            <span className="w-6 h-6 rounded-sm bg-[#1A1A1A]/10 flex items-center justify-center font-mono text-xs">
              {sec.number}
            </span>
            <span>{sec.title}</span>
          </button>
        ))}
      </div>

      {/* Main Content Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Core Theory, Lecturer Methods, Key Concepts & Live Simulator */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#F8F6F2] rounded-sm p-8 shadow-sm border border-[#1A1A1A]/10 space-y-6">
            <div className="flex items-center justify-between border-b border-[#1A1A1A]/10 pb-4">
              <div>
                <span className="text-[10px] font-bold text-[#991b1b] tracking-widest uppercase font-mono">
                  {activeSection.ullmanChapter}
                </span>
                <h3 className="font-serif italic text-2xl text-[#1A1A1A] mt-1">
                  {activeSection.number}. {activeSection.title}
                </h3>
              </div>
            </div>

            {/* Summary */}
            <div className="space-y-2">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]/50">Core Summary</h4>
              <p className="text-[#1A1A1A]/90 leading-relaxed bg-white p-5 rounded-sm border border-[#1A1A1A]/10 text-sm font-sans">
                {activeSection.summary}
              </p>
            </div>

            {/* Interactive Live Simulator embedded per Section */}
            {activeSection.id === '1.5' && (
              <div className="bg-[#1A1A1A] text-white p-6 rounded-sm space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-widest text-[#991b1b]">Interactive DFA Simulator (Ends with "01")</span>
                  <span className="bg-white/10 px-2 py-0.5 rounded text-[10px] font-mono">Live Simulation</span>
                </div>
                
                {/* SVG DFA State Diagram */}
                <div className="flex justify-center bg-black/40 p-3 rounded border border-white/10 overflow-x-auto">
                  <svg width="440" height="130" viewBox="0 0 440 130" className="font-mono text-xs">
                    <defs>
                      <marker id="arrow-m1" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 1 L 10 5 L 0 9 z" fill="#ffffff" />
                      </marker>
                    </defs>
                    <line x1="15" y1="65" x2="55" y2="65" stroke="#ffffff" strokeWidth="2" markerEnd="url(#arrow-m1)" />
                    <text x="22" y="55" fontSize="10" fill="#ffffff">Start</text>

                    {/* q0 */}
                    <g transform="translate(80, 65)">
                      <circle cx="0" cy="0" r="22" fill={activeDfaState === 'q0' ? '#991b1b' : '#262626'} stroke="#ffffff" strokeWidth="2" />
                      <text x="0" y="4" textAnchor="middle" fill="#ffffff" fontWeight="bold">q0</text>
                    </g>
                    {/* q1 */}
                    <g transform="translate(220, 65)">
                      <circle cx="0" cy="0" r="22" fill={activeDfaState === 'q1' ? '#991b1b' : '#262626'} stroke="#ffffff" strokeWidth="2" />
                      <text x="0" y="4" textAnchor="middle" fill="#ffffff" fontWeight="bold">q1</text>
                    </g>
                    {/* q2 */}
                    <g transform="translate(360, 65)">
                      <circle cx="0" cy="0" r="22" fill={activeDfaState === 'q2' ? '#991b1b' : '#262626'} stroke="#ffffff" strokeWidth="2" />
                      <circle cx="0" cy="0" r="18" fill="none" stroke="#ffffff" strokeWidth="1.5" />
                      <text x="0" y="4" textAnchor="middle" fill="#ffffff" fontWeight="bold">q2</text>
                    </g>

                    <path d="M 102 65 Q 150 35 198 65" fill="none" stroke="#ffffff" strokeWidth="1.5" markerEnd="url(#arrow-m1)" />
                    <text x="150" y="40" textAnchor="middle" fill="#ffffff" fontSize="10">0</text>
                    <path d="M 70 45 Q 80 15 90 43" fill="none" stroke="#ffffff" strokeWidth="1.5" markerEnd="url(#arrow-m1)" />
                    <text x="80" y="12" textAnchor="middle" fill="#ffffff" fontSize="10">1</text>

                    <path d="M 242 65 Q 290 35 338 65" fill="none" stroke="#ffffff" strokeWidth="1.5" markerEnd="url(#arrow-m1)" />
                    <text x="290" y="40" textAnchor="middle" fill="#ffffff" fontSize="10">1</text>
                    <path d="M 210 45 Q 220 15 230 43" fill="none" stroke="#ffffff" strokeWidth="1.5" markerEnd="url(#arrow-m1)" />
                    <text x="220" y="12" textAnchor="middle" fill="#ffffff" fontSize="10">0</text>

                    <path d="M 338 80 Q 290 110 242 80" fill="none" stroke="#ffffff" strokeWidth="1.5" markerEnd="url(#arrow-m1)" />
                    <text x="290" y="108" textAnchor="middle" fill="#ffffff" fontSize="10">0</text>
                  </svg>
                </div>

                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={dfaInput}
                    onChange={(e) => setDfaInput(e.target.value)}
                    className="bg-black/50 border border-white/20 px-3 py-1.5 rounded text-xs text-white font-mono flex-1 focus:outline-none focus:border-[#991b1b]"
                    placeholder="e.g. 10101"
                  />
                  <button
                    onClick={runDfaSimulation}
                    className="bg-[#991b1b] hover:bg-[#7f1d1d] text-white px-4 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-1"
                  >
                    <Play className="w-3 h-3" />
                    <span>Run</span>
                  </button>
                </div>

                <div className="bg-black/50 p-3 rounded border border-white/10 space-y-2 text-xs font-mono">
                  <div className="flex justify-between items-center">
                    <span className="text-white/60">Active State: <strong className="text-[#991b1b]">{activeDfaState}</strong></span>
                    {dfaAccepted !== null && (
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${dfaAccepted ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                        {dfaAccepted ? 'Accepted' : 'Rejected'}
                      </span>
                    )}
                  </div>
                  <div className="space-y-1 max-h-28 overflow-y-auto text-[11px]">
                    {dfaSteps.map((s, idx) => (
                      <div key={idx} onClick={() => setCurrentStepIdx(idx)} className={`flex justify-between px-2 py-0.5 rounded cursor-pointer ${currentStepIdx === idx ? 'bg-[#991b1b]/40 text-white' : 'text-white/70 hover:bg-white/5'}`}>
                        <span>Step {s.step}: '{s.char}'</span>
                        <span>→ {s.state}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeSection.id === '2.2' && (
              <div className="bg-[#1A1A1A] text-white p-6 rounded-sm space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-widest text-[#991b1b]">NFA Multi-Path Simulator (Substring "101")</span>
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={nfaInput}
                    onChange={(e) => setNfaInput(e.target.value)}
                    className="bg-black/50 border border-white/20 px-3 py-1.5 rounded text-xs text-white font-mono flex-1"
                    placeholder="e.g. 0101"
                  />
                  <button
                    onClick={runNfaSimulation}
                    className="bg-[#991b1b] text-white px-4 py-1.5 rounded text-xs font-bold uppercase tracking-wider"
                  >
                    Run NFA
                  </button>
                </div>
                <div className="bg-black/50 p-3 rounded border border-white/10 font-mono text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-white/65">Active State Subset:</span>
                    <span className="text-emerald-400 font-bold">{'{ ' + nfaPaths.states.join(', ') + ' }'}</span>
                  </div>
                  <div className="flex justify-between border-t border-white/10 pt-2">
                    <span className="text-white/65">Verdict:</span>
                    <span className={nfaPaths.accepted ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                      {nfaPaths.accepted ? 'ACCEPTED' : 'REJECTED'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeSection.id === '2.3' && (
              <div className="bg-[#1A1A1A] text-white p-6 rounded-sm space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-widest text-[#991b1b]">Subset Construction Step Sandbox</span>
                  <div className="flex space-x-1">
                    {[1, 2, 3].map((s) => (
                      <button key={s} onClick={() => setSubsetStep(s)} className={`px-2 py-1 rounded text-xs font-mono font-bold ${subsetStep === s ? 'bg-[#991b1b] text-white' : 'bg-white/10 text-white/70'}`}>
                        Step {s}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="bg-black/50 p-3 rounded border border-white/10 text-xs font-mono text-white/90">
                  {subsetStep === 1 && <p>Step 1: Start state is <span className="text-[#991b1b]">{'{q0}'}</span>.</p>}
                  {subsetStep === 2 && <p>Step 2: On input '1', state <span className="text-[#991b1b]">{'{q0}'}</span> expands to <span className="text-[#991b1b]">{'{q0, q1}'}</span>.</p>}
                  {subsetStep === 3 && <p>Step 3: Powerset table complete with accepting states containing <span className="text-[#991b1b]">q3</span>.</p>}
                </div>
              </div>
            )}

            {activeSection.id === '2.4' && (
              <div className="bg-[#1A1A1A] text-white p-6 rounded-sm space-y-4">
                <span className="text-xs font-mono uppercase tracking-widest text-[#991b1b]">Interactive ε-Closure Calculator</span>
                <div className="flex space-x-2">
                  {['q0', 'q1', 'q2'].map((st) => (
                    <button key={st} onClick={() => computeEpsilonClosure(st)} className={`px-3 py-1.5 rounded text-xs font-mono font-bold ${epsilonState === st ? 'bg-[#991b1b] text-white' : 'bg-white/10 text-white/70'}`}>
                      State {st}
                    </button>
                  ))}
                </div>
                <div className="bg-black/50 p-3 rounded border border-white/10 font-mono text-xs text-emerald-400">
                  ECL({epsilonState}) = {'{ ' + epsilonResult.join(', ') + ' }'}
                </div>
              </div>
            )}

            {activeSection.id === '2.5' && (
              <div className="bg-[#1A1A1A] text-white p-6 rounded-sm space-y-4">
                <span className="text-xs font-mono uppercase tracking-widest text-[#991b1b]">Table-Filling Minimization Matrix</span>
                <div className="grid grid-cols-5 gap-1 font-mono text-xs text-center">
                  <span></span><span>p1</span><span>p2</span><span>p3</span><span>p4</span>
                  {[
                    { state: 'p0', pairs: ['p1_p0', 'p2_p0', 'p3_p0', 'p4_p0'] },
                    { state: 'p1', pairs: ['p2_p1', 'p3_p1', 'p4_p1'] },
                    { state: 'p2', pairs: ['p3_p2', 'p4_p2'] },
                    { state: 'p3', pairs: ['p4_p3'] },
                  ].map((row, ridx) => (
                    <React.Fragment key={ridx}>
                      <span className="font-bold text-white">{row.state}</span>
                      {row.pairs.map(p => (
                        <button key={p} onClick={() => toggleTableCell(p)} className={`h-8 rounded font-bold ${minTableClicked[p] ? 'bg-[#991b1b] text-white' : 'bg-white/10 text-white/60'}`}>
                          {minTableClicked[p] ? '×' : '—'}
                        </button>
                      ))}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}

            {/* Lecturer Pedagogical Methods (L) */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-[#1A1A1A] font-bold text-xs uppercase tracking-widest">
                <Lightbulb className="w-4 h-4 text-[#991b1b]" />
                <span>Pedagogical Teaching Methods (Lecturer Approach)</span>
              </div>
              <ul className="space-y-2">
                {activeSection.lecturerMethods.map((method, idx) => (
                  <li key={idx} className="flex items-start space-x-3 text-sm text-[#1A1A1A]/80 bg-white p-3.5 rounded-sm border border-[#1A1A1A]/10">
                    <CheckCircle2 className="w-4 h-4 text-[#991b1b] shrink-0 mt-0.5" />
                    <span>{method}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Key Concepts & Analogies */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]/50">Fundamental Concepts & Analogies</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeSection.keyConcepts.map((concept, idx) => (
                  <div key={idx} className="bg-white p-5 rounded-sm border border-[#1A1A1A]/10 space-y-2">
                    <h5 className="font-serif italic text-base text-[#1A1A1A] flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-[#991b1b]" />
                      <span>{concept.term}</span>
                    </h5>
                    <p className="text-xs text-[#1A1A1A]/70 leading-relaxed">{concept.definition}</p>
                    <div className="bg-[#F8F6F2] p-2.5 rounded-sm border border-[#1A1A1A]/10 text-[11px] text-[#1A1A1A] font-medium">
                      💡 Analogy: {concept.analogy}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Manifold Representations & Real-World Applications */}
        <div className="space-y-6">
          {/* Manifold Representations Card */}
          <div className="bg-[#F8F6F2] rounded-sm p-6 shadow-sm border border-[#1A1A1A]/10 space-y-4">
            <div className="flex items-center space-x-2 text-[#1A1A1A] font-bold text-xs uppercase tracking-widest border-b border-[#1A1A1A]/10 pb-3">
              <Layers className="w-4 h-4 text-[#991b1b]" />
              <span>Manifold Representations</span>
            </div>
            <p className="text-xs text-[#1A1A1A]/60">
              Concepts in Automata theory are understood across multiple formal viewpoints:
            </p>

            <div className="space-y-3">
              <div className="bg-white p-3.5 rounded-sm border border-[#1A1A1A]/10">
                <span className="text-[10px] font-bold text-[#1A1A1A]/40 uppercase tracking-widest block mb-1">Algebraic Form</span>
                <code className="text-xs font-mono text-[#991b1b] bg-[#F8F6F2] px-2 py-1 rounded-sm border border-[#1A1A1A]/10 block overflow-x-auto">
                  {activeSection.manifold.algebraic}
                </code>
              </div>

              <div className="bg-white p-3.5 rounded-sm border border-[#1A1A1A]/10">
                <span className="text-[10px] font-bold text-[#1A1A1A]/40 uppercase tracking-widest block mb-1">Set-Builder Notation</span>
                <code className="text-xs font-mono text-[#1A1A1A] bg-[#F8F6F2] px-2 py-1 rounded-sm border border-[#1A1A1A]/10 block overflow-x-auto">
                  {activeSection.manifold.setBuilder}
                </code>
              </div>

              <div className="bg-white p-3.5 rounded-sm border border-[#1A1A1A]/10">
                <span className="text-[10px] font-bold text-[#1A1A1A]/40 uppercase tracking-widest block mb-1">Formal Tuples / Grammar</span>
                <p className="text-xs text-[#1A1A1A]/80 font-mono">{activeSection.manifold.formalTuple}</p>
              </div>

              <div className="bg-white p-3.5 rounded-sm border border-[#1A1A1A]/10">
                <span className="text-[10px] font-bold text-[#1A1A1A]/40 uppercase tracking-widest block mb-1">Descriptive Semantics</span>
                <p className="text-xs text-[#1A1A1A]/70">{activeSection.manifold.description}</p>
              </div>
            </div>
          </div>

          {/* Real-World Applications Card */}
          <div className="bg-[#1A1A1A] text-white rounded-sm p-6 shadow-sm border border-[#1A1A1A] space-y-4">
            <div className="flex items-center space-x-2 font-bold text-xs uppercase tracking-widest border-b border-white/10 pb-3">
              <Globe className="w-4 h-4 text-[#991b1b]" />
              <span>Real-World Engineering Applications</span>
            </div>
            <ul className="space-y-3">
              {activeSection.realWorldApps.map((app, idx) => (
                <li key={idx} className="flex items-start space-x-3 text-xs text-white/80 bg-white/5 p-3.5 rounded-sm border border-white/10">
                  <Code className="w-4 h-4 text-[#991b1b] shrink-0 mt-0.5" />
                  <span>{app}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
