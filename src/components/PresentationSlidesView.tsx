import React, { useState } from 'react';
import { CURRICULUM_SECTIONS } from '../data/curriculumData';
import { ChevronLeft, ChevronRight, Printer, LayoutGrid, Presentation, BookOpen, Layers, Lightbulb, Globe, CheckCircle2 } from 'lucide-react';

export const PresentationSlidesView: React.FC = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'single' | 'grid'>('single');

  // We can create slides: Intro slide + 6 curriculum sections + Summary slide = 8 slides
  const totalSlides = CURRICULUM_SECTIONS.length + 2;

  const handlePrev = () => {
    setCurrentSlideIndex((prev) => (prev > 0 ? prev - 1 : totalSlides - 1));
  };

  const handleNext = () => {
    setCurrentSlideIndex((prev) => (prev < totalSlides - 1 ? prev + 1 : 0));
  };

  const handlePrint = () => {
    setViewMode('grid');
    setTimeout(() => {
      window.print();
    }, 300);
  };

  const handleDownloadMarkdown = () => {
    let mdContent = `# Automata Theory & Computation - Study Deck (Ullman Chapters 3 & 4)\n\n`;
    mdContent += `## Slide 01: Course Overview\n`;
    mdContent += `- Rigorous pedagogical framework covering Regular Expressions, NFA/DFA conversions, Pumping Lemma, and DFA Minimization.\n\n`;

    CURRICULUM_SECTIONS.forEach((sec, idx) => {
      mdContent += `## Slide ${String(idx + 2).padStart(2, '0')}: Section ${sec.number} - ${sec.title}\n`;
      mdContent += `**Ullman Chapter:** ${sec.ullmanChapter}\n\n`;
      mdContent += `### Summary\n${sec.summary}\n\n`;
      mdContent += `### Manifold Representations\n`;
      mdContent += `- Algebraic: \`${sec.manifold.algebraic}\`\n`;
      mdContent += `- Set-Builder: \`${sec.manifold.setBuilder}\`\n`;
      mdContent += `- Formal Tuple: ${sec.manifold.formalTuple}\n\n`;
      mdContent += `### Key Concepts\n`;
      sec.keyConcepts.forEach((kc) => {
        mdContent += `- **${kc.term}**: ${kc.definition} (Analogy: ${kc.analogy})\n`;
      });
      mdContent += `\n### Pedagogical Teaching Methods\n`;
      sec.lecturerMethods.forEach((m) => {
        mdContent += `- ${m}\n`;
      });
      mdContent += `\n### Real-World Applications\n`;
      sec.realWorldApps.forEach((app) => {
        mdContent += `- ${app}\n`;
      });
      mdContent += `\n---\n\n`;
    });

    mdContent += `## Final Slide: Exam Preparation & Core Theorems\n`;
    mdContent += `- Regular Expressions & Thompson's construction\n`;
    mdContent += `- Pumping Lemma adversary game for regular languages\n`;
    mdContent += `- Table-filling algorithm for DFA minimization\n`;

    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Automata_Theory_Study_Deck.md');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
      {/* Top Bar for Presentation Controls */}
      <div className="bg-[#F8F6F2] border border-[#1A1A1A]/10 rounded-sm p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-sm print:hidden">
        <div>
          <div className="inline-flex items-center space-x-2 bg-[#991b1b] text-white px-2.5 py-1 rounded-sm text-[10px] font-bold uppercase tracking-widest mb-2 font-mono">
            <Presentation className="w-3.5 h-3.5" />
            <span>Study Deck PPT & Lecture Slides</span>
          </div>
          <h2 className="font-serif italic text-2xl md:text-3xl text-[#1A1A1A]">
            Automata Theory Masterclass Deck
          </h2>
          <p className="text-xs text-[#1A1A1A]/70">
            Clean, clear, high-contrast slide deck based on Hopcroft, Motwani & Ullman (Chapters 3 & 4). Optimized for studying and PDF/PPT printing.
          </p>
        </div>

        <div className="flex items-center space-x-3 flex-wrap gap-y-2">
          <div className="flex items-center space-x-1 bg-white border border-[#1A1A1A]/10 rounded-sm p-1">
            <button
              onClick={() => setViewMode('single')}
              className={`px-3 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-all ${
                viewMode === 'single' ? 'bg-[#1A1A1A] text-white shadow-sm' : 'text-[#1A1A1A]/70 hover:bg-[#1A1A1A]/5'
              }`}
            >
              Slide View
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-1.5 ${
                viewMode === 'grid' ? 'bg-[#1A1A1A] text-white shadow-sm' : 'text-[#1A1A1A]/70 hover:bg-[#1A1A1A]/5'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>All Slides Grid</span>
            </button>
          </div>

          <button
            onClick={handleDownloadMarkdown}
            className="inline-flex items-center space-x-2 bg-white text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-widest transition-all border border-[#1A1A1A]/20 shadow-sm"
          >
            <Printer className="w-4 h-4 text-[#991b1b]" />
            <span>Download MD Notes</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center space-x-2 bg-[#1A1A1A] text-white hover:bg-[#991b1b] px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-widest transition-all shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>Export / Print PDF Deck</span>
          </button>
        </div>
      </div>

      {/* Grid Mode */}
      {viewMode === 'grid' ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#1A1A1A]/10 pb-3">
            <h3 className="font-serif italic text-xl text-[#1A1A1A]">All Slide Thumbnails & Overview</h3>
            <span className="text-xs font-mono text-[#1A1A1A]/60">Total Slides: {totalSlides}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Slide 0: Title Slide */}
            <div
              onClick={() => { setCurrentSlideIndex(0); setViewMode('single'); }}
              className="bg-white border border-[#1A1A1A]/20 hover:border-[#991b1b] rounded-sm p-6 cursor-pointer shadow-sm transition-all space-y-3 group"
            >
              <span className="text-[10px] font-bold font-mono uppercase tracking-widest text-[#991b1b]">Slide 01</span>
              <h4 className="font-serif italic text-lg text-[#1A1A1A] group-hover:text-[#991b1b] transition-colors">
                Automata Theory & Computation Course Overview
              </h4>
              <p className="text-xs text-[#1A1A1A]/70 line-clamp-3">
                Comprehensive study guide covering regular expressions, NFA/DFA conversions, pumping lemma proofs, and DFA minimization.
              </p>
            </div>

            {/* Curriculum Slides */}
            {CURRICULUM_SECTIONS.map((sec, idx) => (
              <div
                key={sec.id}
                onClick={() => { setCurrentSlideIndex(idx + 1); setViewMode('single'); }}
                className="bg-white border border-[#1A1A1A]/20 hover:border-[#991b1b] rounded-sm p-6 cursor-pointer shadow-sm transition-all space-y-3 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold font-mono uppercase tracking-widest text-[#991b1b]">Slide {String(idx + 2).padStart(2, '0')}</span>
                  <span className="text-[10px] font-mono text-[#1A1A1A]/50">{sec.ullmanChapter}</span>
                </div>
                <h4 className="font-serif italic text-lg text-[#1A1A1A] group-hover:text-[#991b1b] transition-colors">
                  {sec.number}. {sec.title}
                </h4>
                <p className="text-xs text-[#1A1A1A]/70 line-clamp-3">
                  {sec.summary}
                </p>
              </div>
            ))}

            {/* Last Slide: Summary & Exam Prep */}
            <div
              onClick={() => { setCurrentSlideIndex(totalSlides - 1); setViewMode('single'); }}
              className="bg-white border border-[#1A1A1A]/20 hover:border-[#991b1b] rounded-sm p-6 cursor-pointer shadow-sm transition-all space-y-3 group"
            >
              <span className="text-[10px] font-bold font-mono uppercase tracking-widest text-[#991b1b]">Slide {String(totalSlides).padStart(2, '0')}</span>
              <h4 className="font-serif italic text-lg text-[#1A1A1A] group-hover:text-[#991b1b] transition-colors">
                Exam Preparation & Key Takeaways
              </h4>
              <p className="text-xs text-[#1A1A1A]/70 line-clamp-3">
                Summary of equivalence theorems, Myhill-Nerode theorem, pumping lemma adversary games, and DFA minimization complexity.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Single Slide Presentation View */
        <div className="space-y-6">
          {/* Slide Navigation Bar */}
          <div className="bg-[#F8F6F2] border border-[#1A1A1A]/10 rounded-sm p-4 flex items-center justify-between print:hidden">
            <button
              onClick={handlePrev}
              className="inline-flex items-center space-x-1.5 bg-white text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-wider border border-[#1A1A1A]/20 transition-all shadow-sm"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Slide</span>
            </button>

            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs font-bold text-[#991b1b]">
                Slide {currentSlideIndex + 1} of {totalSlides}
              </span>
              <span className="text-xs text-[#1A1A1A]/40">•</span>
              <span className="font-serif italic text-xs text-[#1A1A1A]/80">
                {currentSlideIndex === 0
                  ? 'Title & Course Introduction'
                  : currentSlideIndex <= CURRICULUM_SECTIONS.length
                  ? `Section ${CURRICULUM_SECTIONS[currentSlideIndex - 1].number}: ${CURRICULUM_SECTIONS[currentSlideIndex - 1].title}`
                  : 'Exam Preparation & Review'}
              </span>
            </div>

            <button
              onClick={handleNext}
              className="inline-flex items-center space-x-1.5 bg-white text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-wider border border-[#1A1A1A]/20 transition-all shadow-sm"
            >
              <span>Next Slide</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Actual Slide Card (Optimized for Clean Print & Study) */}
          <div className="bg-white border-2 border-[#1A1A1A]/20 rounded-sm p-8 md:p-12 shadow-md space-y-8 min-h-[580px] flex flex-col justify-between print:border-none print:shadow-none print:p-0 print:min-h-0">
            {currentSlideIndex === 0 ? (
              /* SLIDE 0: TITLE SLIDE */
              <div className="space-y-8 my-auto text-center py-12">
                <div className="inline-flex items-center space-x-2 bg-[#991b1b] text-white px-3 py-1 rounded-sm text-xs font-bold uppercase tracking-widest font-mono">
                  <span>Hopcroft, Motwani & Ullman Textbook Suite</span>
                </div>
                <h1 className="font-serif italic text-4xl md:text-6xl text-[#1A1A1A] leading-tight max-w-4xl mx-auto">
                  Automata Theory & Computation Masterclass
                </h1>
                <p className="text-base text-[#1A1A1A]/70 max-w-2xl mx-auto leading-relaxed font-sans">
                  A rigorous pedagogical framework covering Chapters 3 & 4: Regular Expressions, Finite Automata, NFA-to-DFA Subsets, Pumping Lemma for Regular Languages, and DFA Minimization.
                </p>
                <div className="pt-6 border-t border-[#1A1A1A]/10 flex flex-wrap justify-center gap-6 text-xs font-mono text-[#1A1A1A]/60">
                  <span>• Formal Languages & Grammars</span>
                  <span>• State Transitions & Manifolds</span>
                  <span>• Interactive Simulators</span>
                </div>
              </div>
            ) : currentSlideIndex <= CURRICULUM_SECTIONS.length ? (
              /* SLIDES 1-6: CURRICULUM SECTIONS */
              (() => {
                const sec = CURRICULUM_SECTIONS[currentSlideIndex - 1];
                return (
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#1A1A1A]/10 pb-4 gap-2">
                      <div>
                        <div className="text-[10px] font-bold font-mono text-[#991b1b] uppercase tracking-widest">
                          {sec.ullmanChapter}
                        </div>
                        <h2 className="font-serif italic text-3xl text-[#1A1A1A] mt-1">
                          {sec.number}. {sec.title}
                        </h2>
                      </div>
                      <div className="bg-[#F8F6F2] border border-[#1A1A1A]/10 px-3 py-1.5 rounded-sm text-xs font-mono text-[#1A1A1A]">
                        Section {sec.number} Overview
                      </div>
                    </div>

                    {/* Summary */}
                    <div className="bg-[#F8F6F2] border-l-4 border-[#991b1b] p-5 rounded-sm space-y-1">
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]/50 font-mono">Core Summary</h4>
                      <p className="text-sm text-[#1A1A1A] leading-relaxed font-sans">
                        {sec.summary}
                      </p>
                    </div>

                    {/* Two Column Layout: Manifold & Concepts */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Manifold Representations */}
                      <div className="bg-white border border-[#1A1A1A]/15 rounded-sm p-5 space-y-3">
                        <div className="flex items-center space-x-2 font-bold text-xs uppercase tracking-widest text-[#1A1A1A] border-b border-[#1A1A1A]/10 pb-2">
                          <Layers className="w-4 h-4 text-[#991b1b]" />
                          <span>Manifold Representation</span>
                        </div>
                        <div className="space-y-2 text-xs font-mono">
                          <div className="bg-[#F8F6F2] p-2.5 rounded-sm border border-[#1A1A1A]/10">
                            <span className="text-[9px] uppercase tracking-wider text-[#1A1A1A]/50 block mb-0.5">Algebraic Form</span>
                            <span className="text-[#991b1b] font-bold">{sec.manifold.algebraic}</span>
                          </div>
                          <div className="bg-[#F8F6F2] p-2.5 rounded-sm border border-[#1A1A1A]/10">
                            <span className="text-[9px] uppercase tracking-wider text-[#1A1A1A]/50 block mb-0.5">Set-Builder</span>
                            <span>{sec.manifold.setBuilder}</span>
                          </div>
                          <div className="bg-[#F8F6F2] p-2.5 rounded-sm border border-[#1A1A1A]/10">
                            <span className="text-[9px] uppercase tracking-wider text-[#1A1A1A]/50 block mb-0.5">Formal Tuple / Grammar</span>
                            <span className="text-[#1A1A1A]/80">{sec.manifold.formalTuple}</span>
                          </div>
                        </div>
                      </div>

                      {/* Key Concepts */}
                      <div className="bg-white border border-[#1A1A1A]/15 rounded-sm p-5 space-y-3">
                        <div className="flex items-center space-x-2 font-bold text-xs uppercase tracking-widest text-[#1A1A1A] border-b border-[#1A1A1A]/10 pb-2">
                          <BookOpen className="w-4 h-4 text-[#991b1b]" />
                          <span>Key Definitions & Analogies</span>
                        </div>
                        <div className="space-y-3">
                          {sec.keyConcepts.map((kc, kidx) => (
                            <div key={kidx} className="space-y-1">
                              <h5 className="font-serif italic text-sm text-[#1A1A1A] font-bold flex items-center space-x-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#991b1b]" />
                                <span>{kc.term}</span>
                              </h5>
                              <p className="text-xs text-[#1A1A1A]/80 leading-snug">{kc.definition}</p>
                              <p className="text-[11px] text-[#991b1b] italic">Analogy: {kc.analogy}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Lecturer Methods & Real World Apps */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                      <div className="bg-[#F8F6F2] p-4 rounded-sm border border-[#1A1A1A]/10 space-y-2">
                        <div className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-[#1A1A1A]">
                          <Lightbulb className="w-3.5 h-3.5 text-[#991b1b]" />
                          <span>Pedagogical Teaching Approaches</span>
                        </div>
                        <ul className="space-y-1.5">
                          {sec.lecturerMethods.map((m, midx) => (
                            <li key={midx} className="flex items-start space-x-2 text-xs text-[#1A1A1A]/80">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#991b1b] shrink-0 mt-0.5" />
                              <span>{m}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-[#1A1A1A] text-white p-4 rounded-sm space-y-2">
                        <div className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-white">
                          <Globe className="w-3.5 h-3.5 text-[#991b1b]" />
                          <span>Real-World Engineering Use Cases</span>
                        </div>
                        <ul className="space-y-1.5">
                          {sec.realWorldApps.map((app, aidx) => (
                            <li key={aidx} className="flex items-start space-x-2 text-xs text-white/80">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#991b1b] shrink-0 mt-1.5" />
                              <span>{app}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })()
            ) : (
              /* LAST SLIDE: EXAM PREP & SUMMARY */
              <div className="space-y-8 my-auto py-8">
                <div className="border-b border-[#1A1A1A]/10 pb-4">
                  <div className="text-[10px] font-bold font-mono text-[#991b1b] uppercase tracking-widest">
                    Final Review & Synthesis
                  </div>
                  <h2 className="font-serif italic text-3xl text-[#1A1A1A] mt-1">
                    Exam Preparation & Core Theorems
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-[#F8F6F2] p-5 rounded-sm border border-[#1A1A1A]/10 space-y-2">
                    <h4 className="font-serif italic font-bold text-base text-[#1A1A1A]">1. Regular Expressions & NFA/DFA</h4>
                    <p className="text-xs text-[#1A1A1A]/70 leading-relaxed">
                      Every regular expression can be converted to an NFA with ε-transitions (Thompson's construction) and subsequently to a DFA via subset construction.
                    </p>
                  </div>

                  <div className="bg-[#F8F6F2] p-5 rounded-sm border border-[#1A1A1A]/10 space-y-2">
                    <h4 className="font-serif italic font-bold text-base text-[#1A1A1A]">2. The Pumping Lemma</h4>
                    <p className="text-xs text-[#1A1A1A]/70 leading-relaxed">
                      Used to prove languages (like <code className="font-mono text-[#991b1b]">a^n b^n</code>) are NOT regular. Master the 4-step adversary game and string splitting into <code className="font-mono text-[#991b1b]">xyz</code>.
                    </p>
                  </div>

                  <div className="bg-[#F8F6F2] p-5 rounded-sm border border-[#1A1A1A]/10 space-y-2">
                    <h4 className="font-serif italic font-bold text-base text-[#1A1A1A]">3. DFA Minimization</h4>
                    <p className="text-xs text-[#1A1A1A]/70 leading-relaxed">
                      Using table-filling algorithm (distinguishability matrix) to merge equivalent states and construct the unique canonical minimal DFA.
                    </p>
                  </div>
                </div>

                <div className="bg-white border border-[#1A1A1A]/20 p-6 rounded-sm text-center space-y-2">
                  <h4 className="font-serif italic text-lg text-[#1A1A1A]">Ready to test your knowledge?</h4>
                  <p className="text-xs text-[#1A1A1A]/70">
                    Use the interactive simulators, Pumping Lemma Adversary Game, DFA Minimization Table, and Gemini AI Tutor built into this lab suite.
                  </p>
                </div>
              </div>
            )}

            {/* Footer inside slide */}
            <div className="pt-6 border-t border-[#1A1A1A]/10 flex items-center justify-between text-[11px] font-mono text-[#1A1A1A]/50">
              <span>Automata Theory & Computation Lab • Editorial Edition</span>
              <span>Slide {currentSlideIndex + 1} / {totalSlides}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
