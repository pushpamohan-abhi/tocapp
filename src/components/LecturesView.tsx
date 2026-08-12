import React, { useState } from 'react';
import { CURRICULUM_SECTIONS } from '../data/curriculumData';
import { BookOpen, Lightbulb, Globe, Code, Layers, CheckCircle2, ChevronRight, GraduationCap } from 'lucide-react';

interface LecturesViewProps {
  onNavigateToSimulator: (sectionId: string) => void;
}

export const LecturesView: React.FC<LecturesViewProps> = ({ onNavigateToSimulator }) => {
  const [selectedId, setSelectedId] = useState<string>('3.1');
  const activeSection = CURRICULUM_SECTIONS.find(s => s.id === selectedId) || CURRICULUM_SECTIONS[0];

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      {/* Hero Intro Banner */}
      <div className="bg-[#F8F6F2] text-[#1A1A1A] rounded-sm p-8 shadow-sm border border-[#1A1A1A]/10 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 bg-[#991b1b] text-white px-2.5 py-1 rounded-sm text-[10px] font-bold uppercase tracking-widest font-mono">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Lectures & Manifolds (Module 2)</span>
          </div>
          <h2 className="font-serif italic text-3xl md:text-4xl text-[#1A1A1A]">
            Automata Theory & Computation Masterclass
          </h2>
          <p className="text-[#1A1A1A]/80 text-sm leading-relaxed">
            Explore core foundational sections (3.1, 3.2, 3.3, 4.1, 4.2, 4.4) through pedagogical lecturer methods, manifold representations, real-world engineering case studies, and live interactive simulations.
          </p>
        </div>
      </div>

      {/* Section Selection Tabs */}
      <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {CURRICULUM_SECTIONS.map((sec) => (
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
        {/* Left 2 Cols: Core Theory, Lecturer Methods, Key Concepts */}
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
              <button
                onClick={() => onNavigateToSimulator(activeSection.id)}
                className="inline-flex items-center space-x-2 bg-white text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-widest transition-all border border-[#1A1A1A]/20 shadow-sm"
              >
                <span>Interactive Simulator</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Summary */}
            <div className="space-y-2">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]/50">Core Summary</h4>
              <p className="text-[#1A1A1A]/90 leading-relaxed bg-white p-5 rounded-sm border border-[#1A1A1A]/10 text-sm font-sans">
                {activeSection.summary}
              </p>
            </div>

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
