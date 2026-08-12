import React, { useState } from 'react';
import { Play, RotateCcw, Check, X, ArrowRight, Code, Sparkles, Terminal } from 'lucide-react';

export const AnimRegExToNFADFASimulator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'regex' | 'thompson' | 'elimination' | 'lexer'>('regex');
  
  // RegEx Tester State
  const [regexStr, setRegexStr] = useState('(0+1)*1(0+1)');
  const [testString, setTestString] = useState('10110');
  const [matchResult, setMatchResult] = useState<boolean | null>(null);

  // Thompson NFA State
  const [thompsonStep, setThompsonStep] = useState(0);

  // State Elimination State
  const [eliminationStep, setEliminationStep] = useState(0);

  // Lexer Scanner State
  const [sourceCode, setSourceCode] = useState('let 1x = 42 + y;');
  const [tokens, setTokens] = useState<{ type: string; value: string; error?: string }[]>([]);
  const [lexerExplanation, setLexerExplanation] = useState<string>('');

  const handleTestRegex = () => {
    try {
      let pattern = regexStr;
      // If there are no character classes like [0-9] or quantifiers like {10}, treat + as union (|)
      if (!pattern.includes('[') && !pattern.includes('{')) {
        pattern = pattern.replace(/\+/g, '|');
      }
      const re = new RegExp(pattern);
      setMatchResult(re.test(testString));
    } catch {
      setMatchResult(false);
    }
  };

  const handleRunLexer = () => {
    // Dynamic Lexer / Scanner (Maximal Munch algorithm simulation)
    const result: { type: string; value: string; error?: string }[] = [];
    let i = 0;
    const src = sourceCode;

    while (i < src.length) {
      const char = src[i];

      // Skip whitespace
      if (/\s/.test(char)) {
        i++;
        continue;
      }

      // Punctuation / Operators
      if (/[\+\-\*\/\=\(\)\{\};,]/.test(char)) {
        result.push({ type: 'OPERATOR/PUNCTUATION', value: char });
        i++;
        continue;
      }

      // Numbers
      if (/[0-9]/.test(char)) {
        let numStr = '';
        while (i < src.length && /[0-9]/.test(src[i])) {
          numStr += src[i];
          i++;
        }
        // Check if immediately followed by letters (e.g., 1x)
        if (i < src.length && /[a-zA-Z]/.test(src[i])) {
          // Lexical anomaly / error warning according to Ullman Chapter 3
          let identPart = '';
          while (i < src.length && /[a-zA-Z0-9]/.test(src[i])) {
            identPart += src[i];
            i++;
          }
          result.push({ type: 'LEXICAL_ERROR', value: numStr + identPart, error: `Invalid lexeme "${numStr + identPart}": identifiers cannot start with digits (Ullman 3.3).` });
        } else {
          result.push({ type: 'NUMBER', value: numStr });
        }
        continue;
      }

      // Identifiers & Keywords
      if (/[a-zA-Z_]/.test(char)) {
        let idStr = '';
        while (i < src.length && /[a-zA-Z0-9_]/.test(src[i])) {
          idStr += src[i];
          i++;
        }
        const keywords = ['let', 'var', 'const', 'if', 'else', 'while', 'return', 'function'];
        if (keywords.includes(idStr)) {
          result.push({ type: 'KEYWORD', value: idStr });
        } else {
          result.push({ type: 'IDENTIFIER', value: idStr });
        }
        continue;
      }

      // Unknown character
      result.push({ type: 'UNKNOWN', value: char, error: `Unrecognized character "${char}" in input alphabet.` });
      i++;
    }

    setTokens(result);
    if (src.includes('1x')) {
      setLexerExplanation('Note on "let 1x = 42 + y;": The Lexical Analyzer (Scanner) breaks the stream into tokens. When it encounters "1x", a scanner either splits it into NUMBER (1) and IDENTIFIER (x), or flags "1x" as a lexical error because identifiers cannot start with numbers. Full syntax grammar checks (like variable naming rules) are handled in Chapter 4 by the Parser!');
    } else {
      setLexerExplanation('Scanner completed maximal munch tokenization successfully according to regular definitions.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-100 pb-4 mb-6">
          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Chapter 3 Interactive Simulators</span>
            <h2 className="text-xl font-bold text-slate-900 mt-1">Regular Expressions, Automata & Lexers</h2>
          </div>
          <div className="flex space-x-2 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveTab('regex')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === 'regex' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              3.1 RegEx Engine
            </button>
            <button
              onClick={() => setActiveTab('thompson')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === 'thompson' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              3.2 Thompson NFA
            </button>
            <button
              onClick={() => setActiveTab('elimination')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === 'elimination' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              3.2 State Elimination
            </button>
            <button
              onClick={() => setActiveTab('lexer')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === 'lexer' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              3.3 Lexical Analyzer
            </button>
          </div>
        </div>

        {/* Tab 1: RegEx Engine */}
        {activeTab === 'regex' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4 bg-slate-50 p-5 rounded-xl border border-slate-200">
                <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>Regular Expression Pattern Tester (Section 3.1)</span>
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Regular Expression (e.g., (0+1)*10)</label>
                    <input
                      type="text"
                      value={regexStr}
                      onChange={(e) => setRegexStr(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Test Input String over Σ = {'{0, 1}'}</label>
                    <input
                      type="text"
                      value={testString}
                      onChange={(e) => setTestString(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={handleTestRegex}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl text-xs shadow-md shadow-indigo-600/30 flex items-center justify-center space-x-2 transition-all"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Evaluate Match</span>
                  </button>
                </div>
              </div>

              <div className="bg-slate-900 text-white p-6 rounded-xl flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Matching Verdict</h4>
                  {matchResult === null ? (
                    <p className="text-sm text-slate-400 italic">Enter a pattern and test string, then click Evaluate Match.</p>
                  ) : matchResult ? (
                    <div className="flex items-center space-x-3 text-emerald-400 bg-emerald-950/60 p-4 rounded-xl border border-emerald-500/30">
                      <Check className="w-6 h-6 shrink-0" />
                      <div>
                        <p className="font-bold text-sm">String Accepted!</p>
                        <p className="text-xs text-emerald-300/80">"{testString}" matches regular expression {regexStr}.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3 text-rose-400 bg-rose-950/60 p-4 rounded-xl border border-rose-500/30">
                      <X className="w-6 h-6 shrink-0" />
                      <div>
                        <p className="font-bold text-sm">String Rejected</p>
                        <p className="text-xs text-rose-300/80">"{testString}" does not match regular expression {regexStr}.</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-slate-400">
                  <span className="text-indigo-400 font-semibold">Ullman 3.1 Rule:</span> Operators include union (+), concatenation (·), and Kleene star (*).
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Thompson NFA Construction */}
        {activeTab === 'thompson' && (
          <div className="space-y-6">
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Thompson Construction Simulation (RegEx → NFA)</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setThompsonStep((prev) => Math.max(0, prev - 1))}
                    disabled={thompsonStep === 0}
                    className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold disabled:opacity-50"
                  >
                    Previous Step
                  </button>
                  <button
                    onClick={() => setThompsonStep((prev) => Math.min(3, prev + 1))}
                    disabled={thompsonStep === 3}
                    className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold disabled:opacity-50"
                  >
                    Next Step
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {['Base Symbol a', 'Union (r + s)', 'Concatenation (r · s)', 'Kleene Star (r*)'].map((stepName, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border transition-all ${
                      thompsonStep === idx
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20'
                        : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    <span className="text-[10px] font-bold opacity-80 uppercase block mb-1">Step {idx + 1}</span>
                    <h4 className="font-bold text-sm">{stepName}</h4>
                  </div>
                ))}
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
                <h4 className="text-sm font-bold text-slate-950">
                  {thompsonStep === 0 && 'Base Case: Single Character NFA'}
                  {thompsonStep === 1 && 'Recursive Case: Union (r + s)'}
                  {thompsonStep === 2 && 'Recursive Case: Concatenation (r · s)'}
                  {thompsonStep === 3 && 'Recursive Case: Kleene Closure (r*)'}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {thompsonStep === 0 && 'Creates a start state q0 and accept state q1 connected by transition a with no ε-loops.'}
                  {thompsonStep === 1 && 'Introduces a new start state with ε-transitions branching to both NFA(r) and NFA(s), and merging into a common accept state.'}
                  {thompsonStep === 2 && 'Chains the accept state of NFA(r) to the start state of NFA(s) via an ε-transition.'}
                  {thompsonStep === 3 && 'Adds new start and accept states with ε-transitions bypassing the sub-machine and looping back from accept to start.'}
                </p>
                <div className="bg-slate-900 text-emerald-400 p-4 rounded-xl font-mono text-xs overflow-x-auto">
                  {thompsonStep === 0 && 'NFA = ({q0, q1}, {a}, δ, q0, {q1})'}
                  {thompsonStep === 1 && 'NFA_union = start_new → {ε} → [NFA_r] or [NFA_s] → {ε} → accept_new'}
                  {thompsonStep === 2 && 'NFA_concat = start_r → ... → accept_r/start_s → ... → accept_s'}
                  {thompsonStep === 3 && 'NFA_star = start_new → {ε, NFA_r.start}, NFA_r.accept → {ε, NFA_r.start}'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: State Elimination */}
        {activeTab === 'elimination' && (
          <div className="space-y-6">
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">State Elimination Method (GNFA → RegEx)</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEliminationStep((prev) => Math.max(0, prev - 1))}
                    disabled={eliminationStep === 0}
                    className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setEliminationStep((prev) => Math.min(2, prev + 1))}
                    disabled={eliminationStep === 2}
                    className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['1. Augment GNFA', '2. Eliminate Intermediate States', '3. Final 2-State Expression'].map((sName, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border ${
                      eliminationStep === idx ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    <h4 className="font-bold text-xs">{sName}</h4>
                  </div>
                ))}
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-3">
                <p className="text-xs text-slate-700">
                  {eliminationStep === 0 && 'Add a new start state with an ε-transition to old q0, and a new accept state with ε-transitions from all old accept states.'}
                  {eliminationStep === 1 && 'Successively remove intermediate state q_k. For every pair of incoming state q_i and outgoing state q_j, replace transition with R1 R2* R3.'}
                  {eliminationStep === 2 && 'When only start and accept remain, the label on the edge between them is the exact equivalent Regular Expression!'}
                </p>
                <div className="bg-slate-900 text-indigo-300 p-4 rounded-xl font-mono text-xs">
                  {eliminationStep === 0 && 'GNFA States = {q_start, q0, q1, q_accept}'}
                  {eliminationStep === 1 && 'Eliminating state q1... updating edge formula R_ij = R_ij + R_i1 (R_11)* R_1j'}
                  {eliminationStep === 2 && 'Result RegEx: R = (0 + 1)*1(0 + 1)'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Lexical Analyzer */}
        {activeTab === 'lexer' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4 bg-slate-50 p-5 rounded-xl border border-slate-200">
                <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                  <Terminal className="w-4 h-4 text-indigo-600" />
                  <span>Lexical Analyzer Scanner (Section 3.3)</span>
                </h3>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Source Code Input</label>
                  <textarea
                    rows={4}
                    value={sourceCode}
                    onChange={(e) => setSourceCode(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <button
                  onClick={handleRunLexer}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl text-xs shadow-md flex items-center justify-center space-x-2"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Run Tokenizer (Maximal Munch)</span>
                </button>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Generated Token Stream & Lexer Analysis</h4>
                {tokens.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">Click Run Tokenizer to scan the source code stream.</p>
                ) : (
                  <div className="space-y-3">
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {tokens.map((tok, idx) => (
                        <div key={idx} className={`flex flex-col p-2.5 rounded-lg border text-xs font-mono ${tok.error ? 'bg-rose-50 border-rose-200 text-rose-900' : 'bg-slate-50 border-slate-200'}`}>
                          <div className="flex items-center justify-between">
                            <span className={`font-bold ${tok.error ? 'text-rose-600' : 'text-indigo-600'}`}>{tok.type}</span>
                            <span className="bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-800">{tok.value}</span>
                          </div>
                          {tok.error && <p className="text-[11px] text-rose-700 mt-1 font-sans">{tok.error}</p>}
                        </div>
                      ))}
                    </div>
                    {lexerExplanation && (
                      <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100 text-xs text-indigo-900 leading-relaxed font-sans">
                        💡 <strong>Ullman 3.3 Insight:</strong> {lexerExplanation}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
