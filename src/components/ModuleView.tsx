import React, { useState, useRef, useEffect } from 'react';
import { CURRICULUM_SECTIONS } from '../data/curriculumData';
import { VTU_QUESTION_BANKS, MODULE_QUIZZES } from '../data/vtuData';
import { UserProfile, QuizScoreRecord } from '../types';
import { BookOpen, Lightbulb, Globe, Code, Layers, CheckCircle2, GraduationCap, Play, Download, HelpCircle, Award, Lock, Unlock, ShieldAlert, FileSpreadsheet, Check, UserCheck, FileText } from 'lucide-react';
import { jsPDF } from 'jspdf';

interface ModuleViewProps {
  moduleNumber: 1 | 2 | 3 | 4 | 5;
  currentUser: UserProfile;
  qbAnswersAllowed: boolean;
  onToggleQbAnswers: (allowed: boolean) => void;
}

export const ModuleView: React.FC<ModuleViewProps> = ({
  moduleNumber,
  currentUser,
  qbAnswersAllowed,
  onToggleQbAnswers,
}) => {
  let sectionIds: string[] = [];
  let moduleTitle = '';
  let ullmanSubtitle = '';

  if (moduleNumber === 1) {
    sectionIds = ['1.0', '1.1', '1.5', '2.2', '2.3', '2.4', '2.5'];
    moduleTitle = 'Lectures & Manifolds (Module 1)';
    ullmanSubtitle = 'Padma Reddy & Ullman Chapters 1 & 2 • Set Theory Prerequisites, DFA, NFA, ε-NFA, Subset Construction, Minimization';
  } else if (moduleNumber === 2) {
    sectionIds = ['3.1', '3.2', '3.3', '4.1', '4.2', '4.4'];
    moduleTitle = 'Lectures & Manifolds (Module 2)';
    ullmanSubtitle = 'Ullman Chapters 3 & 4 • Regular Expressions, Pumping Lemma, Closure Properties';
  } else if (moduleNumber === 3) {
    sectionIds = ['5.1', '5.2', '5.4', '6.1', '6.2', '6.3.1', '6.4'];
    moduleTitle = 'Lectures & Manifolds (Module 3)';
    ullmanSubtitle = 'Ullman Chapters 5 & 6 • Context-Free Grammars, Parse Trees, PDA, CNF';
  } else if (moduleNumber === 4) {
    sectionIds = ['7.1', '7.2', '7.3'];
    moduleTitle = 'Lectures & Manifolds (Module 4)';
    ullmanSubtitle = 'Ullman Chapter 7 • Turing Machines, Programming Techniques, Extensions';
  } else {
    sectionIds = ['7.1', '7.2', '7.3'];
    moduleTitle = 'Lectures & Manifolds (Module 5)';
    ullmanSubtitle = 'Ullman Chapters 8 & 9 • Undecidability, Recursive & Recursively Enumerable Languages';
  }

  const moduleSections = CURRICULUM_SECTIONS.filter(s => sectionIds.includes(s.id));
  const [selectedId, setSelectedId] = useState<string>(sectionIds[0]);
  const activeSection = moduleSections.find(s => s.id === selectedId) || moduleSections[0];

  const [activeTab, setActiveTab] = useState<'lectures' | 'vtu' | 'quiz'>('lectures');
  const contentRef = useRef<HTMLDivElement>(null);

  // Quiz state & single attempt tracking
  const moduleQuizzes = MODULE_QUIZZES[moduleNumber] || [];
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [submittedQuiz, setSubmittedQuiz] = useState(false);
  const [existingAttemptRecord, setExistingAttemptRecord] = useState<QuizScoreRecord | null>(null);

  // Check if student has already attempted this module quiz
  useEffect(() => {
    try {
      const stored = localStorage.getItem('vtu_quiz_scores');
      if (stored) {
        const scores: QuizScoreRecord[] = JSON.parse(stored);
        const record = scores.find(s => s.userId === currentUser.id && s.moduleNumber === moduleNumber);
        if (record) {
          setExistingAttemptRecord(record);
          setSelectedAnswers(record.userAnswers || {});
          setSubmittedQuiz(true);
        } else {
          setExistingAttemptRecord(null);
          setSelectedAnswers({});
          setSubmittedQuiz(false);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentUser.id, moduleNumber]);

  const handleSelectSection = (id: string) => {
    setSelectedId(id);
    setActiveTab('lectures');
    if (contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const downloadStudyNotes = () => {
    let content = `# ${moduleTitle}\n${ullmanSubtitle}\n\n`;
    moduleSections.forEach(sec => {
      content += `## Section ${sec.number}: ${sec.title}\n`;
      content += `Ullman Chapter: ${sec.ullmanChapter}\n\n`;
      content += `### Summary\n${sec.summary}\n\n`;
      content += `### Lecturer Teaching Methods\n`;
      sec.lecturerMethods.forEach(m => content += `- ${m}\n`);
      content += `\n### Fundamental Concepts & Analogies\n`;
      sec.keyConcepts.forEach(c => {
        content += `- **${c.term}**: ${c.definition} (Analogy: ${c.analogy})\n`;
      });
      content += `\n### Manifold Representations\n`;
      content += `- Algebraic: ${sec.manifold.algebraic}\n`;
      content += `- Set-Builder: ${sec.manifold.setBuilder}\n`;
      content += `- Formal Tuple: ${sec.manifold.formalTuple}\n`;
      content += `- Description: ${sec.manifold.description}\n\n`;
      content += `### Real-World Engineering Applications\n`;
      sec.realWorldApps.forEach(app => content += `- ${app}\n`);
      
      if (sec.padmaReddyExamples && sec.padmaReddyExamples.length > 0) {
        content += `\n### Dr. A.M. Padma Reddy Textbook — Step-by-Step Solved Numerical Examples\n`;
        sec.padmaReddyExamples.forEach((ex, idx) => {
          content += `\n#### Example ${idx + 1}: ${ex.title}\n`;
          content += `**Problem Statement:**\n${ex.problem}\n\n`;
          content += `**Step-by-Step Numerical Walkthrough:**\n`;
          ex.stepByStepSolution.forEach(step => {
            content += `- ${step}\n`;
          });
          content += `\n**Final Solution / Result:** ${ex.finalAnswer}\n`;
        });
      }

      content += `\n----------------------------------------------------\n\n`;
    });

    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Automata_${moduleTitle.replace(/\s+/g, '_')}_Study_Notes.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const openQBankMarkdownAndPrintPdf = (withAnswers: boolean) => {
    if (withAnswers && !canViewAnswers) {
      alert("Faculty permission is required to view Question Bank with answers.");
      return;
    }
    const questions = VTU_QUESTION_BANKS[moduleNumber] || [];
    let content = `# VTU EXAMINATION QUESTION BANK - ${moduleTitle}\n${ullmanSubtitle}\n`;
    content += `Mode: ${withAnswers ? 'With Detailed Answer Keys' : 'Questions Only (Without Answers)'}\n\n`;
    
    questions.forEach((q, idx) => {
      content += `### Q${idx + 1}. [Marks: ${q.marks}]\n${q.question}\n\n`;
      if (withAnswers) {
        content += `**Detailed Answer / Solution Key:**\n${q.answerKey}\n\n`;
      }
      content += `----------------------------------------------------\n\n`;
    });

    const printWin = window.open('', '_blank');
    if (printWin) {
      printWin.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>VTU Q-Bank Module ${moduleNumber} (${withAnswers ? 'With Answers' : 'No Answers'}) - Print PDF</title>
            <style>
              body { font-family: 'Courier New', Courier, monospace; padding: 40px; background: #fff; color: #111; line-height: 1.6; white-space: pre-wrap; font-size: 13px; }
              h1 { font-size: 20px; border-bottom: 2px solid #991b1b; padding-bottom: 10px; color: #991b1b; }
              h3 { font-size: 14px; margin-top: 15px; color: #333; font-weight: bold; }
              @media print { body { padding: 15px; } }
            </style>
          </head>
          <body>${content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}
            <script>window.onload = function() { window.print(); };</script>
          </body>
        </html>
      `);
      printWin.document.close();
    }
  };

  const openQuizMarkdownAndPrintPdf = (overrideRecord?: QuizScoreRecord | null) => {
    const activeRec = overrideRecord !== undefined ? overrideRecord : existingAttemptRecord;
    let content = `# VTU QUIZ ATTEMPT & QUESTION REPORT - ${moduleTitle}\n`;
    content += `Student/Faculty: ${currentUser.name} (${currentUser.role})\n`;
    content += `ID / USN: ${currentUser.id}\n`;
    content += `Timestamp: ${activeRec ? activeRec.timestamp : 'Not Attempted'}\n`;
    content += `Score: ${activeRec ? `${activeRec.score} / ${moduleQuizzes.length} (${activeRec.percentage}%)` : '0 / 0 (0%)'}\n\n`;
    content += `==================================================\n\n`;

    moduleQuizzes.forEach((q, idx) => {
      content += `### Q${idx + 1}: ${q.question}\n`;
      const studentAnsIdx = activeRec?.userAnswers ? activeRec.userAnswers[q.id] : undefined;
      q.options.forEach((opt, oIdx) => {
        const isUserChoice = Number(studentAnsIdx) === oIdx;
        const isCorrect = q.correctIndex === oIdx;
        
        let statusText = '';
        if (isUserChoice) {
          statusText = isCorrect ? ' - [✓ YOUR ANSWER: CORRECT]' : ' - [✗ YOUR ANSWER: INCORRECT]';
        } else if (isCorrect) {
          statusText = ' - [→ CORRECT ANSWER KEY]';
        }

        const marker = isUserChoice ? '[X]' : '[ ]';
        content += `  ${marker} ${opt}${statusText}\n`;
      });
      content += `\n`;
    });

    const printWin = window.open('', '_blank');
    if (printWin) {
      printWin.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Quiz Report - ${moduleTitle} - Print PDF</title>
            <style>
              body { font-family: 'Courier New', Courier, monospace; padding: 40px; background: #fff; color: #111; line-height: 1.6; white-space: pre-wrap; font-size: 13px; }
              h1 { font-size: 20px; border-bottom: 2px solid #991b1b; padding-bottom: 10px; color: #991b1b; }
              h3 { font-size: 14px; margin-top: 15px; color: #333; font-weight: bold; }
              @media print { body { padding: 15px; } }
            </style>
          </head>
          <body>${content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}
            <script>window.onload = function() { window.print(); };</script>
          </body>
        </html>
      `);
      printWin.document.close();
    }
  };

  const openMarkdownAndPrintPdf = () => {
    let content = `# ${moduleTitle}\n${ullmanSubtitle}\n\n`;
    moduleSections.forEach(sec => {
      content += `## Section ${sec.number}: ${sec.title}\n`;
      content += `Ullman Chapter: ${sec.ullmanChapter}\n\n`;
      content += `### Summary\n${sec.summary}\n\n`;
      content += `### Lecturer Teaching Methods\n`;
      sec.lecturerMethods.forEach(m => content += `- ${m}\n`);
      content += `\n### Fundamental Concepts & Analogies\n`;
      sec.keyConcepts.forEach(c => {
        content += `- **${c.term}**: ${c.definition} (Analogy: ${c.analogy})\n`;
      });
      content += `\n### Manifold Representations\n`;
      content += `- Algebraic: ${sec.manifold.algebraic}\n`;
      content += `- Set-Builder: ${sec.manifold.setBuilder}\n`;
      content += `- Formal Tuple: ${sec.manifold.formalTuple}\n`;
      content += `- Description: ${sec.manifold.description}\n\n`;
      content += `### Real-World Engineering Applications\n`;
      sec.realWorldApps.forEach(app => content += `- ${app}\n`);
      
      if (sec.padmaReddyExamples && sec.padmaReddyExamples.length > 0) {
        content += `\n### Dr. A.M. Padma Reddy Textbook — Step-by-Step Solved Numerical Examples\n`;
        sec.padmaReddyExamples.forEach((ex, idx) => {
          content += `\n#### Example ${idx + 1}: ${ex.title}\n`;
          content += `**Problem Statement:**\n${ex.problem}\n\n`;
          content += `**Step-by-Step Numerical Walkthrough:**\n`;
          ex.stepByStepSolution.forEach(step => {
            content += `- ${step}\n`;
          });
          content += `\n**Final Solution / Result:** ${ex.finalAnswer}\n`;
        });
      }

      content += `\n\n`;
    });

    const printWin = window.open('', '_blank');
    if (printWin) {
      printWin.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${moduleTitle} - Study Notes (.md View & Print)</title>
            <style>
              body { font-family: 'Courier New', Courier, monospace; padding: 40px; background: #fff; color: #111; line-height: 1.6; white-space: pre-wrap; font-size: 13px; }
              h1 { font-size: 20px; border-bottom: 2px solid #991b1b; padding-bottom: 10px; color: #991b1b; }
              h2 { font-size: 16px; margin-top: 30px; color: #111; border-bottom: 1px dashed #ccc; padding-bottom: 4px; }
              h3 { font-size: 14px; margin-top: 15px; color: #333; font-weight: bold; }
              h4 { font-size: 13px; margin-top: 10px; color: #666; }
              @media print {
                body { padding: 15px; }
              }
            </style>
          </head>
          <body>${content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}
            <script>
              window.onload = function() {
                window.print();
              };
            </script>
          </body>
        </html>
      `);
      printWin.document.close();
    }
  };

  const downloadPdfStudyNotes = () => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      let y = 15;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.setTextColor(153, 27, 27); // #991b1b
      doc.text(`VTU Study Notes - ${moduleTitle}`, pageWidth / 2, y, { align: "center" });
      
      y += 8;
      doc.setFontSize(9);
      doc.setTextColor(80, 80, 80);
      doc.text(ullmanSubtitle, pageWidth / 2, y, { align: "center", maxWidth: pageWidth - 30 });

      y += 15;

      moduleSections.forEach((sec, sIdx) => {
        if (y > 240) { doc.addPage(); y = 15; }
        
        // Section Header
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(153, 27, 27);
        doc.text(`Section ${sec.number}: ${sec.title}`, 15, y);
        y += 5;

        doc.setFont("helvetica", "italic");
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.text(`Ullman Chapter: ${sec.ullmanChapter}`, 15, y);
        y += 6;

        // Summary
        if (y > 250) { doc.addPage(); y = 15; }
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(30, 30, 30);
        doc.text("Summary:", 15, y);
        y += 5;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        const summaryLines = doc.splitTextToSize(sec.summary, pageWidth - 30);
        doc.text(summaryLines, 15, y);
        y += summaryLines.length * 4 + 6;

        // Lecturer Methods
        if (sec.lecturerMethods && sec.lecturerMethods.length > 0) {
          if (y > 250) { doc.addPage(); y = 15; }
          doc.setFont("helvetica", "bold");
          doc.setFontSize(10);
          doc.text("Lecturer Teaching Methods:", 15, y);
          y += 5;
          doc.setFont("helvetica", "normal");
          sec.lecturerMethods.forEach(m => {
            if (y > 270) { doc.addPage(); y = 15; }
            const mLines = doc.splitTextToSize(`• ${m}`, pageWidth - 35);
            doc.text(mLines, 18, y);
            y += mLines.length * 4 + 3;
          });
          y += 3;
        }

        // Key Concepts & Analogies
        if (sec.keyConcepts && sec.keyConcepts.length > 0) {
          if (y > 250) { doc.addPage(); y = 15; }
          doc.setFont("helvetica", "bold");
          doc.setFontSize(10);
          doc.text("Key Concepts & Analogies:", 15, y);
          y += 5;
          doc.setFont("helvetica", "normal");
          sec.keyConcepts.forEach(c => {
            if (y > 270) { doc.addPage(); y = 15; }
            const cLines = doc.splitTextToSize(`• ${c.term}: ${c.definition} (Analogy: ${c.analogy})`, pageWidth - 35);
            doc.text(cLines, 18, y);
            y += cLines.length * 4 + 3;
          });
          y += 3;
        }

        // Manifold Representations
        if (sec.manifold) {
          if (y > 250) { doc.addPage(); y = 15; }
          doc.setFont("helvetica", "bold");
          doc.setFontSize(10);
          doc.text("Manifold Representations:", 15, y);
          y += 5;
          doc.setFont("helvetica", "normal");
          const manLines = doc.splitTextToSize(`• Algebraic: ${sec.manifold.algebraic}\n• Set-Builder: ${sec.manifold.setBuilder}\n• Formal Tuple: ${sec.manifold.formalTuple}\n• Description: ${sec.manifold.description}`, pageWidth - 35);
          doc.text(manLines, 18, y);
          y += manLines.length * 4 + 5;
        }

        // Real-World Applications
        if (sec.realWorldApps && sec.realWorldApps.length > 0) {
          if (y > 250) { doc.addPage(); y = 15; }
          doc.setFont("helvetica", "bold");
          doc.setFontSize(10);
          doc.text("Real-World Engineering Applications:", 15, y);
          y += 5;
          doc.setFont("helvetica", "normal");
          sec.realWorldApps.forEach(app => {
            if (y > 270) { doc.addPage(); y = 15; }
            const aLines = doc.splitTextToSize(`• ${app}`, pageWidth - 35);
            doc.text(aLines, 18, y);
            y += aLines.length * 4 + 3;
          });
          y += 3;
        }

        // Padma Reddy Numerical Examples
        if (sec.padmaReddyExamples && sec.padmaReddyExamples.length > 0) {
          if (y > 240) { doc.addPage(); y = 15; }
          doc.setFont("helvetica", "bold");
          doc.setFontSize(10);
          doc.setTextColor(153, 27, 27);
          doc.text("Dr. A.M. Padma Reddy Textbook — Solved Numerical Examples:", 15, y);
          y += 5;
          doc.setTextColor(30, 30, 30);

          sec.padmaReddyExamples.forEach((ex, exIdx) => {
            if (y > 250) { doc.addPage(); y = 15; }
            doc.setFont("helvetica", "bold");
            doc.setFontSize(9);
            doc.text(`Example ${exIdx + 1}: ${ex.title}`, 18, y);
            y += 4;
            doc.setFont("helvetica", "normal");
            const probLines = doc.splitTextToSize(`Problem: ${ex.problem}`, pageWidth - 40);
            doc.text(probLines, 18, y);
            y += probLines.length * 4 + 3;

            doc.setFont("helvetica", "bold");
            doc.text("Step-by-Step Walkthrough:", 18, y);
            y += 4;
            doc.setFont("helvetica", "normal");
            ex.stepByStepSolution.forEach(step => {
              if (y > 270) { doc.addPage(); y = 15; }
              const sLines = doc.splitTextToSize(`- ${step}`, pageWidth - 45);
              doc.text(sLines, 21, y);
              y += sLines.length * 4 + 2;
            });

            if (y > 265) { doc.addPage(); y = 15; }
            doc.setFont("helvetica", "bold");
            doc.text(`Final Answer: ${ex.finalAnswer}`, 18, y);
            y += 6;
          });
        }

        y += 8;
      });

      doc.save(`Automata_Module_${moduleNumber}_Comprehensive_Study_Notes.pdf`);
    } catch (e) {
      console.error(e);
      alert("Error generating PDF. Please try again.");
    }
  };

  const canViewAnswers = currentUser.role === 'faculty' || qbAnswersAllowed;

  const downloadVtuQuestionBank = (withAnswers: boolean) => {
    if (withAnswers && !canViewAnswers) {
      alert("Faculty permission is required to download Question Bank with answers. Downloading Questions Only version.");
      withAnswers = false;
    }

    const questions = VTU_QUESTION_BANKS[moduleNumber] || [];
    let content = `# VTU EXAMINATION QUESTION BANK - ${moduleTitle}\n${ullmanSubtitle}\n`;
    content += `Mode: ${withAnswers ? 'With Detailed Answer Keys' : 'Questions Only (Without Answers)'}\n\n`;
    
    questions.forEach((q, idx) => {
      content += `### Q${idx + 1}. [Marks: ${q.marks}]\n${q.question}\n\n`;
      if (withAnswers) {
        content += `**Detailed Answer / Solution Key:**\n${q.answerKey}\n\n`;
      }
      content += `----------------------------------------------------\n\n`;
    });

    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `VTU_Question_Bank_Module_${moduleNumber}_${withAnswers ? 'With_Answers' : 'Without_Answers'}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Submit Quiz Action (Generates CSV Record & Locks Attempt)
  const handleSubmitQuiz = () => {
    if (Object.keys(selectedAnswers).length < moduleQuizzes.length) {
      if (!window.confirm("You have unattempted questions. Are you sure you want to submit your quiz attempt now?")) {
        return;
      }
    }

    // Compute raw score
    let score = 0;
    moduleQuizzes.forEach(q => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        score++;
      }
    });

    const total = moduleQuizzes.length;
    const percentage = Math.round((score / total) * 100);
    const dateStr = new Date().toISOString().slice(0, 10);

    const record: QuizScoreRecord = {
      id: `score_${currentUser.id}_mod${moduleNumber}_${Date.now()}`,
      faculty: currentUser.assignedFaculty || 'Prof. Dr. Pushpa Mohan',
      className: currentUser.sem || 'CSE-A',
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      assessment: `Module ${moduleNumber} Quiz`,
      moduleNumber: moduleNumber,
      score: score,
      totalQuestions: total,
      percentage: percentage,
      timestamp: dateStr,
      userAnswers: selectedAnswers
    };

    // Save into localStorage and POST to Vercel/server score API (Only for students)
    try {
      setExistingAttemptRecord(record);
      setSubmittedQuiz(true);

      if (currentUser.role === 'faculty') {
        // Faculty quiz scores are not saved to student scores CSV/database
        return;
      }

      const stored = localStorage.getItem('vtu_quiz_scores');
      const existingScores: QuizScoreRecord[] = stored ? JSON.parse(stored) : [];
      const targetUserId = (record.userId || '').trim().toLowerCase();
      const targetAssessment = (record.assessment || '').trim().toLowerCase();
      const matchIdx = existingScores.findIndex(
        s => (s.userId || '').trim().toLowerCase() === targetUserId &&
             (s.assessment || '').trim().toLowerCase() === targetAssessment
      );
      if (matchIdx >= 0) {
        existingScores[matchIdx] = record;
      } else {
        existingScores.push(record);
      }
      localStorage.setItem('vtu_quiz_scores', JSON.stringify(existingScores));

      // Persist to server API (/api/scores)
      fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record)
      }).catch(err => console.error('Failed to sync score to server API:', err));

      // Note: Score is saved directly to portal database & local storage.
      // CSV Export is reserved for Faculty members in the Scores Result Dashboard.
    } catch (e) {
      console.error(e);
    }
  };

  const downloadSingleScoreCSV = (record: QuizScoreRecord) => {
    let csvContent = "Faculty,Class,Student ID,Student Name,Assessment,Score,Total,Percentage,Date\n";
    csvContent += `"${record.faculty}","${record.className}","${record.userId}","${record.userName}","${record.assessment}",${record.score},${record.totalQuestions},"${record.percentage}%","${record.timestamp}"\n`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `VTU_Quiz_Score_Mod${record.moduleNumber}_${record.userId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8" ref={contentRef}>
      {/* Faculty Portal Notice Banner */}
      {currentUser.role === 'faculty' && (
        <div className="bg-red-50 border-2 border-red-200 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-[#991b1b] text-white rounded-lg">
              <UserCheck className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <span className="font-mono font-extrabold text-xs text-[#991b1b] uppercase block">
                Faculty Portal Mode • {currentUser.name}
              </span>
              <p className="text-sm font-serif font-bold text-[#0F172A]">
                Manage question bank answer permissions or analyze student performance records.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              const ev = new CustomEvent('switch-section', { detail: 'scores' });
              window.dispatchEvent(ev);
            }}
            className="bg-[#991b1b] hover:bg-[#7f1d1d] text-white px-4 py-2.5 rounded-lg text-xs md:text-sm font-mono font-extrabold uppercase tracking-wider flex items-center space-x-2 shadow-xs shrink-0"
          >
            <FileSpreadsheet className="w-4 h-4 text-amber-300" />
            <span>STUDENT RESULTS</span>
          </button>
        </div>
      )}

      {/* Hero Banner */}
      <div className="bg-white text-[#0F172A] rounded-xl p-6 md:p-8 shadow-md border-2 border-slate-200 relative flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="relative z-10 max-w-3xl space-y-2">
            <div className="inline-flex items-center space-x-2 bg-[#991b1b] text-white px-3 py-1.5 rounded-md text-xs font-extrabold uppercase tracking-widest font-mono shadow-xs">
              <GraduationCap className="w-4 h-4 text-amber-300" />
              <span>{moduleTitle}</span>
            </div>
            <h2 className="font-serif italic text-2xl md:text-4xl text-[#0F172A] font-extrabold">
              Automata Theory & Computation Masterclass
            </h2>
            <p className="text-[#dc2626] font-extrabold text-xs md:text-sm uppercase tracking-wider font-mono">
              {ullmanSubtitle}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2.5 pt-2 border-t border-slate-100">
          <button
            onClick={openMarkdownAndPrintPdf}
            className="bg-[#0F172A] hover:bg-black text-white px-3.5 py-2.5 rounded-lg text-xs font-extrabold uppercase tracking-widest transition-all flex items-center space-x-1.5 shadow-sm"
            title="Open Study Notes as .md and Print / Save PDF"
          >
            <FileText className="w-4 h-4 text-amber-300" />
            <span>Study Notes (.md & PDF)</span>
          </button>
          
          <button
            onClick={() => openQBankMarkdownAndPrintPdf(false)}
            className="bg-[#334155] hover:bg-[#1e293b] text-white px-3.5 py-2.5 rounded-lg text-xs font-extrabold uppercase tracking-widest transition-all flex items-center space-x-1.5 shadow-sm"
            title="Q-Bank Without Answers (.md & Print PDF)"
          >
            <FileText className="w-4 h-4 text-amber-300" />
            <span>Q-Bank No Ans (.md & PDF)</span>
          </button>

          <button
            onClick={() => openQBankMarkdownAndPrintPdf(true)}
            className={`px-3.5 py-2.5 rounded-lg text-xs font-extrabold uppercase tracking-widest transition-all flex items-center space-x-1.5 shadow-sm ${
              canViewAnswers
                ? 'bg-[#991b1b] hover:bg-[#7f1d1d] text-white'
                : 'bg-slate-300 text-slate-700 cursor-not-allowed'
            }`}
            title={canViewAnswers ? "Q-Bank With Answers (.md & Print PDF)" : "Faculty permission required"}
          >
            {!canViewAnswers ? <Lock className="w-4 h-4 text-amber-600" /> : <FileText className="w-4 h-4 text-amber-300" />}
            <span>Q-Bank With Ans (.md & PDF)</span>
          </button>

          <button
            onClick={openQuizMarkdownAndPrintPdf}
            className="bg-[#1e293b] hover:bg-black text-white px-3.5 py-2.5 rounded-lg text-xs font-extrabold uppercase tracking-widest transition-all flex items-center space-x-1.5 shadow-sm"
            title="Open Quiz Report as .md and Print / Save PDF"
          >
            <Award className="w-4 h-4 text-amber-300" />
            <span>Quiz Report (.md & PDF)</span>
          </button>
        </div>
      </div>

      {/* Module-Wise Quick Jump Bar */}
      <div className="bg-[#0F172A] text-white p-4 rounded-xl flex items-center justify-between overflow-x-auto gap-3 shadow-sm border-2 border-slate-800">
        <span className="text-xs md:text-sm font-mono uppercase tracking-wider text-red-400 font-extrabold shrink-0">Module Switcher:</span>
        <div className="flex space-x-2">
          {[1, 2, 3, 4, 5].map((m) => (
            <a
              key={m}
              href={`#mod${m}`}
              onClick={(e) => {
                e.preventDefault();
                const event = new CustomEvent('switch-module', { detail: m });
                window.dispatchEvent(event);
              }}
              className={`px-4 py-2 rounded-md text-xs md:text-sm font-mono font-extrabold transition-all ${
                moduleNumber === m ? 'bg-[#991b1b] text-white shadow-xs' : 'bg-white/15 text-white hover:bg-white/30'
              }`}
            >
              Mod {m}
            </a>
          ))}
        </div>
      </div>

      {/* Primary Tab Bar: Lectures vs VTU Question Bank vs Quiz Assignment */}
      <div className="flex flex-wrap gap-2.5 border-b-2 border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('lectures')}
          className={`px-5 py-3 rounded-lg text-xs md:text-sm font-extrabold uppercase tracking-wider transition-all flex items-center space-x-2.5 ${
            activeTab === 'lectures' ? 'bg-[#0F172A] text-white shadow-md' : 'bg-white text-[#0F172A] hover:bg-slate-100 border-2 border-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4 text-emerald-400" />
          <span>Lectures & Manifolds</span>
        </button>
        <button
          onClick={() => setActiveTab('vtu')}
          className={`px-5 py-3 rounded-lg text-xs md:text-sm font-extrabold uppercase tracking-wider transition-all flex items-center space-x-2.5 ${
            activeTab === 'vtu' ? 'bg-[#991b1b] text-white shadow-md' : 'bg-white text-[#0F172A] hover:bg-slate-100 border-2 border-slate-200'
          }`}
        >
          <HelpCircle className="w-4 h-4 text-amber-400" />
          <span>VTU Question Bank</span>
          {!canViewAnswers && <Lock className="w-4 h-4 text-amber-500 ml-1" />}
        </button>
        <button
          onClick={() => setActiveTab('quiz')}
          className={`px-5 py-3 rounded-lg text-xs md:text-sm font-extrabold uppercase tracking-wider transition-all flex items-center space-x-2.5 ${
            activeTab === 'quiz' ? 'bg-[#0F172A] text-white shadow-md' : 'bg-white text-[#0F172A] hover:bg-slate-100 border-2 border-slate-200'
          }`}
        >
          <Award className="w-4 h-4 text-amber-300" />
          <span>Attempt Quiz (1-Attempt Rule)</span>
          {existingAttemptRecord && <CheckCircle2 className="w-4 h-4 text-emerald-400 ml-1" />}
        </button>
      </div>

      {/* Tab 1: Lectures & Manifolds */}
      {activeTab === 'lectures' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Col: Section Selector & Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Section Pills */}
            <div className="flex flex-wrap gap-2 bg-slate-100 p-2.5 rounded-lg border border-slate-300">
              {moduleSections.map(s => (
                <button
                  key={s.id}
                  onClick={() => handleSelectSection(s.id)}
                  className={`px-4 py-2 rounded-md text-xs md:text-sm font-extrabold font-mono transition-all ${
                    selectedId === s.id
                      ? 'bg-[#0F172A] text-white shadow-md'
                      : 'bg-white text-slate-800 hover:bg-slate-200 border border-slate-300'
                  }`}
                >
                  Sec {s.number}
                </button>
              ))}
            </div>

            {/* Selected Section Detail Card */}
            <div className="bg-white rounded-xl p-7 shadow-md border-2 border-slate-200 space-y-6">
              <div className="border-b border-slate-200 pb-4 space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-mono font-extrabold uppercase tracking-wider text-[#991b1b] bg-red-50 px-2.5 py-1 rounded border border-red-200">
                    Section {activeSection.number} • Ullman {activeSection.ullmanChapter}
                  </span>
                </div>
                <h3 className="font-serif italic text-2xl md:text-3xl font-extrabold text-[#0F172A]">
                  {activeSection.title}
                </h3>
                <p className="text-sm md:text-base text-slate-800 leading-relaxed font-sans font-medium">
                  {activeSection.summary}
                </p>
              </div>

              {/* Teaching Methods */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-[#0F172A] font-extrabold text-xs md:text-sm uppercase tracking-widest">
                  <Lightbulb className="w-5 h-5 text-[#dc2626]" />
                  <span>Lecturer Teaching Methods</span>
                </div>
                <ul className="space-y-2.5">
                  {activeSection.lecturerMethods.map((m, idx) => (
                    <li key={idx} className="flex items-start space-x-2.5 text-sm md:text-base font-medium text-slate-900 bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-[#dc2626] shrink-0 mt-0.5" />
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Key Concepts */}
              <div className="space-y-3">
                <span className="text-xs md:text-sm font-extrabold uppercase tracking-widest text-[#0F172A] block">
                  Fundamental Concepts & Analogies
                </span>
                <div className="grid grid-cols-1 gap-3.5">
                  {activeSection.keyConcepts.map((c, idx) => (
                    <div key={idx} className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-1.5">
                      <span className="font-mono text-sm md:text-base font-extrabold text-[#dc2626]">{c.term}</span>
                      <p className="text-sm md:text-base text-slate-900 font-medium">{c.definition}</p>
                      <div className="text-xs md:text-sm text-slate-700 italic font-serif pt-1.5 border-t border-slate-200">
                        Analogy: {c.analogy}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Padma Reddy Step-by-Step Solved Examples */}
              {activeSection.padmaReddyExamples && activeSection.padmaReddyExamples.length > 0 && (
                <div className="space-y-4 pt-4 border-t-2 border-slate-200">
                  <div className="flex items-center space-x-2 text-[#991b1b] font-extrabold text-xs md:text-sm uppercase tracking-widest bg-red-50 p-2.5 rounded-lg border border-red-200">
                    <GraduationCap className="w-5 h-5" />
                    <span>Dr. A.M. Padma Reddy Textbook — Step-by-Step Solved Numerical Examples</span>
                  </div>

                  <div className="space-y-4">
                    {activeSection.padmaReddyExamples.map((ex, idx) => (
                      <div key={idx} className="bg-slate-50 p-5 rounded-lg border-l-4 border-l-[#dc2626] border-y border-r border-slate-300 space-y-3.5 shadow-sm">
                        <h5 className="font-serif italic text-lg md:text-xl font-extrabold text-[#0F172A]">
                          {ex.title}
                        </h5>
                        <div className="bg-amber-50 p-3.5 rounded-md border border-amber-300 text-xs md:text-sm font-mono whitespace-pre-wrap text-slate-900 font-bold">
                          <strong className="text-[#dc2626] font-extrabold">Problem Statement:</strong> {ex.problem}
                        </div>
                        <div className="space-y-2">
                          <span className="text-xs font-extrabold uppercase tracking-widest text-slate-600 block">Step-by-Step Numerical Walkthrough:</span>
                          {ex.stepByStepSolution.map((step, sIdx) => (
                            <p key={sIdx} className="text-xs md:text-sm text-amber-200 font-mono leading-relaxed bg-slate-900 p-3 rounded-md border border-slate-700 whitespace-pre-wrap">
                              {step}
                            </p>
                          ))}
                        </div>
                        <div className="bg-emerald-100 border border-emerald-300 p-3 rounded-md text-xs md:text-sm font-mono text-emerald-950 font-extrabold">
                          ✅ Solution / Final Result: {ex.finalAnswer}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Col: Manifold Representations & Real-World Apps */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-md border-2 border-slate-200 space-y-4">
              <div className="flex items-center space-x-2 text-[#0F172A] font-extrabold text-xs md:text-sm uppercase tracking-widest border-b border-slate-200 pb-3">
                <Layers className="w-5 h-5 text-[#dc2626]" />
                <span>Manifold Representations</span>
              </div>
              <p className="text-xs md:text-sm text-slate-700 font-medium">
                Formal viewpoints for Section {activeSection.number}:
              </p>

              <div className="space-y-3">
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <span className="text-xs font-extrabold text-slate-600 uppercase tracking-wider block mb-1">Algebraic Form</span>
                  <code className="text-xs md:text-sm font-mono text-[#dc2626] bg-white p-2 rounded-md border border-slate-300 block overflow-x-auto font-bold">
                    {activeSection.manifold.algebraic}
                  </code>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <span className="text-xs font-extrabold text-slate-600 uppercase tracking-wider block mb-1">Set-Builder Notation</span>
                  <code className="text-xs md:text-sm font-mono text-slate-900 bg-white p-2 rounded-md border border-slate-300 block overflow-x-auto font-bold">
                    {activeSection.manifold.setBuilder}
                  </code>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <span className="text-xs font-extrabold text-slate-600 uppercase tracking-wider block mb-1">Formal Tuples / Grammar</span>
                  <p className="text-xs md:text-sm text-slate-900 font-mono font-bold">{activeSection.manifold.formalTuple}</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <span className="text-xs font-extrabold text-slate-600 uppercase tracking-wider block mb-1">Descriptive Semantics</span>
                  <p className="text-xs md:text-sm text-slate-900 font-medium">{activeSection.manifold.description}</p>
                </div>
              </div>
            </div>

            <div className="bg-[#0F172A] text-white rounded-xl p-6 shadow-md border-2 border-slate-800 space-y-4">
              <div className="flex items-center space-x-2 font-extrabold text-xs md:text-sm uppercase tracking-widest border-b border-white/10 pb-3">
                <Globe className="w-5 h-5 text-red-400" />
                <span>Real-World Engineering Applications</span>
              </div>
              <ul className="space-y-3">
                {activeSection.realWorldApps.map((app, idx) => (
                  <li key={idx} className="flex items-start space-x-3 text-xs md:text-sm text-slate-100 bg-white/10 p-3.5 rounded-lg border border-white/10 font-medium">
                    <Code className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <span>{app}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: VTU Question Bank (Permission-Controlled) */}
      {activeTab === 'vtu' && (
        <div className="bg-white rounded-xl p-8 shadow-md border-2 border-slate-200 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <span className="text-xs font-extrabold text-[#991b1b] tracking-widest uppercase font-mono bg-red-50 px-2.5 py-1 rounded">VTU Examination Question Bank</span>
              <h3 className="font-serif italic text-2xl md:text-3xl font-extrabold text-[#0F172A] mt-2">Module {moduleNumber} Exam Questions & Solutions</h3>
            </div>

            <div className="flex flex-wrap gap-2 items-center">
              {currentUser.role === 'faculty' && (
                <div className="bg-amber-100 border border-amber-300 p-2.5 rounded-lg text-xs md:text-sm flex items-center space-x-2 font-mono">
                  <span className="font-extrabold text-amber-950">Faculty Permission Toggle:</span>
                  <button
                    onClick={() => onToggleQbAnswers(!qbAnswersAllowed)}
                    className={`px-3 py-1.5 rounded-md text-xs font-extrabold font-mono transition-all flex items-center space-x-1.5 shadow-xs ${
                      qbAnswersAllowed ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-white'
                    }`}
                  >
                    {qbAnswersAllowed ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                    <span>{qbAnswersAllowed ? 'Answers OPEN for Students' : 'Answers LOCKED for Students'}</span>
                  </button>
                </div>
              )}

              <button
                onClick={() => downloadVtuQuestionBank(false)}
                className="bg-[#0F172A] hover:bg-black text-white px-4 py-2.5 rounded-lg text-xs md:text-sm font-extrabold uppercase tracking-widest flex items-center space-x-2 shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>Download (Questions Only)</span>
              </button>

              <button
                onClick={() => downloadVtuQuestionBank(true)}
                disabled={!canViewAnswers}
                className={`px-4 py-2.5 rounded-lg text-xs md:text-sm font-extrabold uppercase tracking-widest flex items-center space-x-2 shadow-sm ${
                  canViewAnswers
                    ? 'bg-[#991b1b] hover:bg-[#7f1d1d] text-white'
                    : 'bg-slate-200 text-slate-500 cursor-not-allowed opacity-60'
                }`}
              >
                {!canViewAnswers ? <Lock className="w-4 h-4 text-amber-600" /> : <Download className="w-4 h-4" />}
                <span>Download (With Answers)</span>
              </button>
            </div>
          </div>

          {!canViewAnswers && (
            <div className="bg-amber-50 border-2 border-amber-300 p-4 rounded-lg flex items-center space-x-3 text-amber-950 text-xs md:text-sm font-mono">
              <ShieldAlert className="w-6 h-6 text-amber-700 shrink-0" />
              <div>
                <strong className="block font-extrabold text-sm md:text-base text-amber-900">Answer Keys Hidden for Student Mode:</strong>
                <p className="text-xs md:text-sm text-amber-900 font-sans font-medium mt-0.5">
                  Questions are freely accessible. Detailed answer keys are hidden until granted permission by Faculty. Log in as Faculty to unlock or toggle permission.
                </p>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {(VTU_QUESTION_BANKS[moduleNumber] || []).map((q, idx) => (
              <div key={q.id} className="bg-slate-50 p-6 rounded-xl border border-slate-300 space-y-4 shadow-sm">
                <div className="flex justify-between items-start">
                  <span className="bg-[#0F172A] text-white px-3 py-1 rounded-md text-xs font-mono font-extrabold">
                    Question {idx + 1} [VTU Pattern]
                  </span>
                  <span className="bg-[#991b1b] text-white px-3 py-1 rounded-md text-xs font-mono font-extrabold shadow-xs">
                    {q.marks} Marks
                  </span>
                </div>
                <h4 className="font-serif text-lg md:text-xl font-extrabold text-[#0F172A]">{q.question}</h4>

                {canViewAnswers ? (
                  <div className="bg-amber-50 p-4 rounded-lg border-l-4 border-l-amber-600 border-y border-r border-amber-300 space-y-2">
                    <span className="text-xs font-extrabold text-amber-900 uppercase tracking-wider block font-mono">
                      Detailed Solution & Answer Key
                    </span>
                    <p className="text-xs md:text-sm text-slate-900 font-sans font-medium leading-relaxed whitespace-pre-wrap">{q.answerKey}</p>
                  </div>
                ) : (
                  <div className="bg-slate-100 border border-slate-300 p-4 rounded-lg flex items-center space-x-2 text-slate-700 text-xs md:text-sm italic font-mono font-bold">
                    <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Answer key locked. Permission required from Faculty to view detailed solution.</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Module Quiz (Without Answers Upfront, 1 Attempt Only, CSV Storage) */}
      {activeTab === 'quiz' && (
        <div className="bg-white rounded-xl p-8 shadow-md border-2 border-slate-200 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <span className="text-xs font-extrabold text-[#991b1b] tracking-widest uppercase font-mono bg-red-50 px-2.5 py-1 rounded">
                Module {moduleNumber} Quiz Evaluation
              </span>
              <h3 className="font-serif italic text-2xl md:text-3xl font-extrabold text-[#0F172A] mt-2">Single-Attempt Module Quiz</h3>
              <p className="text-xs md:text-sm text-slate-700 font-mono font-bold mt-1">
                User: <strong className="text-[#0F172A]">{currentUser.name}</strong> ({currentUser.id}) • Role: <strong className="text-[#991b1b]">{currentUser.role.toUpperCase()}</strong>
              </p>
            </div>

            {existingAttemptRecord && (
              <button
                onClick={() => downloadSingleScoreCSV(existingAttemptRecord)}
                className="bg-[#991b1b] hover:bg-[#7f1d1d] text-white px-5 py-3 rounded-lg text-xs md:text-sm font-extrabold font-mono uppercase tracking-widest flex items-center space-x-2 shadow-sm"
              >
                <FileSpreadsheet className="w-5 h-5" />
                <span>Export Attempt CSV</span>
              </button>
            )}
          </div>

          {/* Banner if already attempted */}
          {existingAttemptRecord ? (
            <div className="bg-amber-50 border-2 border-amber-300 p-5 rounded-lg space-y-2 text-[#0F172A]">
              <div className="flex items-center space-x-2 text-amber-950 font-extrabold font-mono text-xs md:text-sm">
                <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0" />
                <span>⚠️ QUIZ ATTEMPT COMPLETED — ONLY 1 ATTEMPT PERMITTED</span>
              </div>
              <p className="text-xs md:text-sm text-slate-800 font-sans font-medium">
                You have already submitted your official attempt for <strong>Module {moduleNumber} Quiz</strong> on <strong>{existingAttemptRecord.timestamp}</strong>. Your recorded score has been saved in the system CSV database.
              </p>
              <div className="flex flex-wrap gap-4 pt-2 font-mono text-xs md:text-sm font-extrabold border-t border-amber-200">
                <span>Score: <strong className="text-[#dc2626]">{existingAttemptRecord.score} / {existingAttemptRecord.totalQuestions}</strong></span>
                <span>Percentage: <strong className="text-emerald-700">{existingAttemptRecord.percentage}%</strong></span>
                <span>USN/ID: <strong>{existingAttemptRecord.userId}</strong></span>
              </div>
            </div>
          ) : (
            <div className="bg-blue-50 border-2 border-blue-200 p-4 rounded-lg text-xs md:text-sm font-mono text-blue-950 space-y-1.5">
              <strong className="block font-extrabold text-sm md:text-base">📝 Quiz Rules & Constraints:</strong>
              <ul className="list-disc list-inside space-y-1 text-xs md:text-sm text-blue-900 font-semibold">
                <li>Answer all questions below. Answers & explanations are <strong>hidden</strong> until you submit.</li>
                <li><strong>Strict 1 Attempt Limit:</strong> Your score will be stored in the CSV database immediately upon submission.</li>
              </ul>
            </div>
          )}

          {/* Quiz Questions List */}
          <div className="space-y-6">
            {moduleQuizzes.map((q, idx) => (
              <div key={q.id} className="bg-slate-50 p-6 rounded-xl border border-slate-300 space-y-4 shadow-sm">
                <h4 className="font-serif text-lg md:text-xl font-extrabold text-[#0F172A]">
                  Q{idx + 1}. {q.question}
                </h4>

                <div className="space-y-2.5">
                  {q.options.map((opt, oIdx) => {
                    const isSelected = selectedAnswers[q.id] === oIdx;
                    const isCorrect = q.correctIndex === oIdx;

                    let btnStyle = 'bg-white border-slate-300 text-slate-900 hover:bg-slate-100 font-medium';
                    if (submittedQuiz) {
                      if (isCorrect) {
                        btnStyle = 'bg-emerald-100 border-2 border-emerald-600 text-emerald-950 font-extrabold';
                      } else if (isSelected && !isCorrect) {
                        btnStyle = 'bg-rose-100 border-2 border-rose-600 text-rose-950 font-extrabold';
                      } else {
                        btnStyle = 'bg-white border-slate-200 text-slate-500 opacity-70';
                      }
                    } else if (isSelected) {
                      btnStyle = 'bg-[#0F172A] text-white border-2 border-[#0F172A] font-extrabold shadow-sm';
                    }

                    return (
                      <button
                        key={oIdx}
                        disabled={submittedQuiz}
                        onClick={() => setSelectedAnswers(prev => ({ ...prev, [q.id]: oIdx }))}
                        className={`w-full text-left p-4 rounded-lg border text-xs md:text-sm transition-all flex items-center justify-between space-x-3 ${btnStyle}`}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center font-mono text-xs font-extrabold shrink-0">
                            {String.fromCharCode(65 + oIdx)}
                          </span>
                          <span className="text-xs md:text-sm font-semibold">{opt}</span>
                        </div>

                        {submittedQuiz && isCorrect && (
                          <span className="text-xs bg-emerald-300 text-emerald-950 font-mono font-extrabold px-2.5 py-1 rounded">
                            Correct Answer
                          </span>
                        )}
                        {submittedQuiz && isSelected && !isCorrect && (
                          <span className="text-xs bg-rose-300 text-rose-950 font-mono font-extrabold px-2.5 py-1 rounded">
                            Your Choice
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanations visible ONLY after submission */}
                {submittedQuiz && (
                  <div className="bg-amber-50 p-4 rounded-lg border border-amber-300 text-xs md:text-sm font-sans space-y-1">
                    <span className="font-extrabold text-[#dc2626] font-mono text-xs md:text-sm uppercase tracking-wider block">Explanation:</span>
                    <p className="text-slate-900 font-medium leading-relaxed">{q.explanation}</p>
                  </div>
                )}
              </div>
            ))}

            {/* Submission Action */}
            <div className="flex justify-end pt-4">
              {!submittedQuiz ? (
                <button
                  onClick={handleSubmitQuiz}
                  className="bg-[#0F172A] hover:bg-black text-white px-8 py-4 rounded-lg text-xs md:text-sm font-extrabold font-mono uppercase tracking-widest shadow-lg flex items-center space-x-2 transition-all"
                >
                  <Check className="w-5 h-5 text-emerald-400" />
                  <span>Submit Quiz Attempt & Export CSV</span>
                </button>
              ) : (
                <div className="flex items-center space-x-3">
                  <span className="text-xs md:text-sm font-mono text-emerald-800 font-extrabold flex items-center space-x-1.5 bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Attempt Recorded & Saved to CSV</span>
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
