/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { SectionId, UserProfile } from './types';
import { Navbar } from './components/Navbar';
import { ModuleView } from './components/ModuleView';
import { ScoresView } from './components/ScoresView';
import { AuthModal, DEFAULT_STUDENT } from './components/AuthModal';
import { LoginPage } from './components/LoginPage';
import { AnimRegExToNFADFASimulator } from './components/AnimRegExToNFADFASimulator';
import { PumpingLemmaVisualizer } from './components/PumpingLemmaVisualizer';
import { ClosurePropertiesExplorer } from './components/ClosurePropertiesExplorer';
import { MinimizationVisualizer } from './components/MinimizationVisualizer';
import { HotQuestionsView } from './components/HotQuestionsView';
import { PblChallengesView } from './components/PblChallengesView';
import { CollaborativeHub } from './components/CollaborativeHub';
import { AiTutorChat } from './components/AiTutorChat';
import { PresentationSlidesView } from './components/PresentationSlidesView';

export default function App() {
  const [activeSection, setActiveSection] = useState<SectionId>('module1');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Initialize user profile from localStorage or default
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    try {
      const stored = localStorage.getItem('vtu_user_profile');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_STUDENT;
  });

  // Q-Bank answer key visibility state controlled by Faculty
  const [qbAnswersAllowed, setQbAnswersAllowed] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('vtu_qb_answers_allowed');
      if (stored !== null) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return false; // Default: locked for students until Faculty enables
  });

  const recordStudentLogin = (user: UserProfile) => {
    if (user.role === 'student') {
      try {
        const logins = JSON.parse(localStorage.getItem('vtu_student_logins') || '[]');
        const entry = {
          userId: user.id,
          name: user.name,
          faculty: user.assignedFaculty || 'Prof. Dr. Pushpa Mohan',
          timestamp: new Date().toISOString()
        };
        const existingIdx = logins.findIndex((l: any) => l.userId.toLowerCase() === user.id.toLowerCase());
        if (existingIdx >= 0) {
          logins[existingIdx].timestamp = new Date().toISOString();
          logins[existingIdx].faculty = user.assignedFaculty || logins[existingIdx].faculty;
        } else {
          logins.push(entry);
        }
        localStorage.setItem('vtu_student_logins', JSON.stringify(logins));
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleLogin = (user: UserProfile) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    recordStudentLogin(user);
    if (user.role === 'student') {
      setActiveSection('module1');
    } else if (user.role === 'faculty') {
      setActiveSection('scores');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    try {
      localStorage.setItem('vtu_user_profile', JSON.stringify(user));
    } catch (e) {
      console.error(e);
    }
  };

  const handleSelectUser = (user: UserProfile) => {
    setCurrentUser(user);
    recordStudentLogin(user);
    if (user.role === 'student') {
      setActiveSection('module1');
    } else if (user.role === 'faculty') {
      setActiveSection('scores');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    try {
      localStorage.setItem('vtu_user_profile', JSON.stringify(user));
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleQbAnswers = (allowed: boolean) => {
    setQbAnswersAllowed(allowed);
    try {
      localStorage.setItem('vtu_qb_answers_allowed', JSON.stringify(allowed));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const handleSwitchModule = (e: Event) => {
      const customEvent = e as CustomEvent;
      const m = customEvent.detail;
      setActiveSection(`module${m}` as SectionId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSwitchSection = (e: Event) => {
      const customEvent = e as CustomEvent;
      const sec = customEvent.detail as SectionId;
      if (sec) {
        setActiveSection(sec);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    window.addEventListener('switch-module', handleSwitchModule);
    window.addEventListener('switch-section', handleSwitchSection);
    return () => {
      window.removeEventListener('switch-module', handleSwitchModule);
      window.removeEventListener('switch-section', handleSwitchSection);
    };
  }, []);

  const handleSelectSection = (id: SectionId) => {
    setActiveSection(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#1A1A1A] flex flex-col font-sans antialiased selection:bg-[#991b1b] selection:text-white">
      <Navbar
        activeSection={activeSection}
        onSelectSection={handleSelectSection}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onQuickSwitchUser={handleSelectUser}
        onGoToLoginPage={() => setIsLoggedIn(false)}
        qbAnswersAllowed={qbAnswersAllowed}
        onToggleQbAnswers={handleToggleQbAnswers}
      />

      <main className="flex-1 pb-16">
        {activeSection === 'module1' && (
          <ModuleView
            moduleNumber={1}
            currentUser={currentUser}
            qbAnswersAllowed={qbAnswersAllowed}
            onToggleQbAnswers={handleToggleQbAnswers}
          />
        )}
        {activeSection === 'module2' && (
          <ModuleView
            moduleNumber={2}
            currentUser={currentUser}
            qbAnswersAllowed={qbAnswersAllowed}
            onToggleQbAnswers={handleToggleQbAnswers}
          />
        )}
        {activeSection === 'module3' && (
          <ModuleView
            moduleNumber={3}
            currentUser={currentUser}
            qbAnswersAllowed={qbAnswersAllowed}
            onToggleQbAnswers={handleToggleQbAnswers}
          />
        )}
        {activeSection === 'module4' && (
          <ModuleView
            moduleNumber={4}
            currentUser={currentUser}
            qbAnswersAllowed={qbAnswersAllowed}
            onToggleQbAnswers={handleToggleQbAnswers}
          />
        )}
        {activeSection === 'module5' && (
          <ModuleView
            moduleNumber={5}
            currentUser={currentUser}
            qbAnswersAllowed={qbAnswersAllowed}
            onToggleQbAnswers={handleToggleQbAnswers}
          />
        )}
        {activeSection === 'scores' && <ScoresView currentUser={currentUser} />}
        {activeSection === '3.2' && <AnimRegExToNFADFASimulator />}
        {activeSection === '4.1' && <PumpingLemmaVisualizer />}
        {activeSection === '4.2' && <ClosurePropertiesExplorer />}
        {activeSection === '4.4' && <MinimizationVisualizer />}
        {activeSection === 'ppt' && <PresentationSlidesView />}
        {activeSection === 'hot' && <HotQuestionsView />}
        {activeSection === 'pbl' && <PblChallengesView />}
        {activeSection === 'collab' && <CollaborativeHub />}
        {activeSection === 'tutor' && <AiTutorChat />}
      </main>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onSelectUser={handleSelectUser}
      />

      <footer className="bg-[#F8F6F2] border-t border-[#1A1A1A]/10 py-8 px-6 text-center text-xs text-[#1A1A1A]/70 space-y-1">
        <p className="font-serif italic text-sm text-[#1A1A1A]">Automata Theory & Computation Learning Suite</p>
        <p>Based on Hopcroft, Motwani & Ullman (Padma Reddy Syllabus Edition)</p>
        <p className="text-[11px] text-[#1A1A1A]/50">
          Student & Faculty Authentication • 1-Attempt Quiz Evaluation • CSV Score Log Database • Permission Control for Question Bank Answers
        </p>
      </footer>
    </div>
  );
}
