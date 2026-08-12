import React from 'react';
import { SectionId, UserProfile, UserRole } from '../types';
import { BookOpen, PlayCircle, HelpCircle, Briefcase, Users, Bot, Sparkles, Cpu, FileText, Download, UserCheck, ShieldCheck, FileSpreadsheet, Lock, Unlock, GraduationCap, User, LogOut } from 'lucide-react';
import { VTU_QUESTION_BANKS } from '../data/vtuData';
import { DEFAULT_STUDENT, DEFAULT_FACULTY } from './AuthModal';

interface NavbarProps {
  activeSection: SectionId;
  onSelectSection: (id: SectionId) => void;
  currentUser: UserProfile;
  onOpenAuthModal: (initialRole?: UserRole) => void;
  onQuickSwitchUser: (user: UserProfile) => void;
  onGoToLoginPage: () => void;
  qbAnswersAllowed: boolean;
  onToggleQbAnswers: (allowed: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  onSelectSection,
  currentUser,
  onOpenAuthModal,
  onQuickSwitchUser,
  onGoToLoginPage,
  qbAnswersAllowed,
  onToggleQbAnswers,
}) => {
  const downloadAllModules = (withAnswers: boolean) => {
    if (withAnswers && currentUser.role === 'student' && !qbAnswersAllowed) {
      alert("Faculty permission is required to download Question Bank with answers. Downloading Questions Only version.");
      withAnswers = false;
    }

    let content = `# VTU EXAMINATION COMPLETE QUESTION BANK (BCS503 & 10CS56)\n`;
    content += `Automata Theory and Computation - All Modules 1 to 5\n`;
    content += `Mode: ${withAnswers ? 'With Detailed Answer Keys' : 'Questions Only (Without Answers)'}\n\n`;
    content += `====================================================\n\n`;

    for (let mod = 1; mod <= 5; mod++) {
      const questions = VTU_QUESTION_BANKS[mod] || [];
      content += `## MODULE ${mod}\n\n`;
      questions.forEach((q, idx) => {
        content += `### Q${idx + 1}. [Marks: ${q.marks}]\n${q.question}\n\n`;
        if (withAnswers) {
          content += `**Detailed Answer / Solution Key:**\n${q.answerKey}\n\n`;
        }
        content += `----------------------------------------------------\n\n`;
      });
    }

    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `VTU_BCS503_10CS56_All_Modules_${withAnswers ? 'With_Answers' : 'Without_Answers'}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const navItems: { id: SectionId; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'module1', label: 'Lectures & Manifolds (Module 1)', icon: <BookOpen className="w-4 h-4" />, badge: 'Mod 1' },
    { id: 'module2', label: 'Lectures & Manifolds (Module 2)', icon: <BookOpen className="w-4 h-4" />, badge: 'Mod 2' },
    { id: 'module3', label: 'Lectures & Manifolds (Module 3)', icon: <BookOpen className="w-4 h-4" />, badge: 'Mod 3' },
    { id: 'module4', label: 'Lectures & Manifolds (Module 4)', icon: <BookOpen className="w-4 h-4" />, badge: 'Mod 4' },
    { id: 'module5', label: 'Lectures & Manifolds (Module 5)', icon: <BookOpen className="w-4 h-4" />, badge: 'Mod 5' },
    { id: 'scores', label: 'Scores & CSV Logs', icon: <FileSpreadsheet className="w-4 h-4" />, badge: 'CSV Data' },
    { id: '3.2', label: 'Visual Simulators', icon: <PlayCircle className="w-4 h-4" />, badge: 'Interactive' },
    { id: '4.1', label: 'Pumping Lemma Game', icon: <Cpu className="w-4 h-4" /> },
    { id: '4.4', label: 'DFA Minimization', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'ppt', label: 'Study Deck PPT', icon: <FileText className="w-4 h-4" />, badge: 'Export' },
    { id: 'hot', label: 'HOT Questions', icon: <HelpCircle className="w-4 h-4" />, badge: 'Critique' },
    { id: 'pbl', label: 'PBL Challenges', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'collab', label: 'Group Learning', icon: <Users className="w-4 h-4" /> },
    { id: 'tutor', label: 'AI Tutor', icon: <Bot className="w-4 h-4" />, badge: 'Gemini' },
  ];

  return (
    <header className="bg-white text-[#0F172A] border-b-2 border-slate-200 sticky top-0 z-50 shadow-xs">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded bg-[#0F172A] flex items-center justify-center text-white font-serif italic text-xl font-bold shadow-sm">
              U
            </div>
            <div>
              <h1 className="font-serif italic text-2xl md:text-3xl tracking-tight text-[#0F172A] font-extrabold">
                Automata Theory & Computation (BCS503 / 10CS56)
              </h1>
              <p className="text-xs md:text-sm uppercase tracking-wider text-[#dc2626] font-mono font-extrabold">
                Ullman Modules 1 to 5 • Padma Reddy Syllabus Edition
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Direct Dual Login Quick Buttons */}
            <div className="flex items-center space-x-1.5 bg-slate-100 p-1.5 rounded-md border-2 border-slate-200 shadow-2xs">
              <span className="text-xs font-mono font-extrabold uppercase tracking-wider text-[#0F172A] px-1">
                Login:
              </span>
              <button
                onClick={() => onQuickSwitchUser(DEFAULT_STUDENT)}
                className={`px-3 py-1.5 rounded text-xs md:text-sm font-mono font-extrabold flex items-center space-x-2 transition-all ${
                  currentUser.role === 'student'
                    ? 'bg-[#0F172A] text-white shadow-xs'
                    : 'text-[#0F172A] hover:bg-slate-200'
                }`}
                title="Quick Login as Student (Rahul Sharma)"
              >
                <GraduationCap className="w-4 h-4 text-emerald-400" />
                <span>Student</span>
              </button>
              <button
                onClick={() => onQuickSwitchUser(DEFAULT_FACULTY)}
                className={`px-3 py-1.5 rounded text-xs md:text-sm font-mono font-extrabold flex items-center space-x-2 transition-all ${
                  currentUser.role === 'faculty'
                    ? 'bg-[#991b1b] text-white shadow-xs'
                    : 'text-[#991b1b] hover:bg-red-100'
                }`}
                title="Quick Login as Faculty (Prof. Dr. Pushpa Mohan)"
              >
                <User className="w-4 h-4 text-amber-300" />
                <span>Faculty</span>
              </button>
            </div>

            {/* User Profile Custom Badge */}
            <button
              onClick={() => onOpenAuthModal(currentUser.role)}
              className={`px-3.5 py-2 rounded-md text-xs md:text-sm font-mono font-extrabold flex items-center space-x-2 border-2 shadow-2xs transition-all ${
                currentUser.role === 'faculty'
                  ? 'bg-[#991b1b] text-white border-[#991b1b] hover:bg-[#7f1d1d]'
                  : 'bg-white text-[#0F172A] border-slate-300 hover:bg-slate-50'
              }`}
              title="Click to enter custom student or faculty credentials"
            >
              <UserCheck className="w-4 h-4 text-bright-blue" />
              <span>
                {currentUser.role === 'faculty' ? 'Faculty:' : 'Student:'} {currentUser.name}
              </span>
              <span className="text-xs bg-black/20 px-1.5 py-0.5 rounded font-mono uppercase">Custom ID</span>
            </button>

            {/* Dedicated Logout / Portal Page Button */}
            <button
              onClick={onGoToLoginPage}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-[#0F172A] border-2 border-slate-300 rounded-md text-xs md:text-sm font-mono font-extrabold flex items-center space-x-2 transition-colors shadow-2xs"
              title="Go to Full-Screen Login Page / Logout"
            >
              <LogOut className="w-4 h-4 text-red-600" />
              <span>Login Page</span>
            </button>

            {/* Quick Q-Bank Permissions status */}
            {currentUser.role === 'faculty' && (
              <button
                onClick={() => onToggleQbAnswers(!qbAnswersAllowed)}
                className={`px-3 py-2 rounded-md text-xs md:text-sm font-mono font-extrabold flex items-center space-x-1.5 border-2 ${
                  qbAnswersAllowed
                    ? 'bg-emerald-100 text-emerald-900 border-emerald-400'
                    : 'bg-amber-100 text-amber-900 border-amber-400'
                }`}
                title="Click to toggle whether students can view Q-Bank answer keys"
              >
                {qbAnswersAllowed ? <Unlock className="w-4 h-4 text-emerald-700" /> : <Lock className="w-4 h-4 text-amber-700" />}
                <span>Q-Bank Ans: {qbAnswersAllowed ? 'Open' : 'Locked'}</span>
              </button>
            )}

            <div className="flex gap-2 items-center">
              {/* Question Bank Download - Questions Only (No Answers) */}
              <button
                onClick={() => downloadAllModules(false)}
                className="bg-[#0F172A] hover:bg-black text-white px-3.5 py-2 rounded-md text-xs md:text-sm font-extrabold uppercase tracking-wider flex items-center space-x-1.5 shadow-sm"
                title="Download All Modules Question Bank (Questions Only - No Answers)"
              >
                <Download className="w-4 h-4" />
                <span>Q-Bank (No Ans)</span>
              </button>

              {/* Question Bank Download - With Answers (Faculty Always / Student if Unlocked) */}
              {currentUser.role === 'faculty' || qbAnswersAllowed ? (
                <button
                  onClick={() => downloadAllModules(true)}
                  className="bg-[#991b1b] hover:bg-[#7f1d1d] text-white px-3.5 py-2 rounded-md text-xs md:text-sm font-extrabold uppercase tracking-wider flex items-center space-x-1.5 shadow-sm"
                  title="Download All Modules Question Bank With Detailed Solution Keys"
                >
                  <Download className="w-4 h-4" />
                  <span>Q-Bank (With Ans)</span>
                </button>
              ) : (
                <button
                  onClick={() => downloadAllModules(true)}
                  className="bg-slate-200 text-slate-800 hover:bg-slate-300 border-2 border-slate-300 px-3.5 py-2 rounded-md text-xs md:text-sm font-extrabold uppercase tracking-wider flex items-center space-x-1.5 shadow-2xs"
                  title="Answer key locked for Students. Switch to Faculty Mode to download with answers."
                >
                  <Lock className="w-4 h-4 text-amber-600" />
                  <span>Q-Bank (With Ans - Faculty Only)</span>
                </button>
              )}
            </div>
          </div>
        </div>

        <nav className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none pt-1 border-t border-slate-100">
          {navItems.map((item) => {
            const isActive = activeSection === item.id || (activeSection === '4.2' && item.id === '3.2');
            return (
              <button
                key={item.id}
                onClick={() => onSelectSection(item.id)}
                className={`flex items-center space-x-2 px-3.5 py-2.5 rounded-md text-xs md:text-sm font-extrabold whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-[#0F172A] text-white shadow-md'
                    : 'text-[#0F172A] hover:bg-slate-100 hover:text-black border border-transparent hover:border-slate-200'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`text-xs px-2 py-0.5 rounded-full font-mono font-extrabold uppercase tracking-wider ${
                    isActive ? 'bg-[#dc2626] text-white' : 'bg-slate-200 text-slate-900'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
