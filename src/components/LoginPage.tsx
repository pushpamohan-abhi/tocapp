import React, { useState } from 'react';
import { UserProfile, UserRole } from '../types';
import { ShieldCheck, GraduationCap, User, Check, ArrowRight, BookOpen, FileSpreadsheet, Lock, Sparkles, Award } from 'lucide-react';
import { DEFAULT_STUDENT, DEFAULT_FACULTY } from './AuthModal';

interface LoginPageProps {
  onLogin: (user: UserProfile) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [activeTab, setActiveTab] = useState<UserRole>('student');

  // Custom Student state
  const [studentId, setStudentId] = useState('1VT22CS001');
  const [studentName, setStudentName] = useState('Rahul Sharma');
  const [studentSem, setStudentSem] = useState('5th Semester CSE');

  // Custom Faculty state
  const [facultyId, setFacultyId] = useState('FAC_CSE_101');
  const [facultyName, setFacultyName] = useState('Prof. Dr. Pushpa Mohan');
  const [facultyDept, setFacultyDept] = useState('Computer Science & Engineering');

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId.trim() || !studentName.trim()) return;
    onLogin({
      id: studentId.trim().toUpperCase(),
      name: studentName.trim(),
      role: 'student',
      sem: studentSem.trim() || '5th Semester CSE',
    });
  };

  const handleFacultySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!facultyId.trim() || !facultyName.trim()) return;
    onLogin({
      id: facultyId.trim().toUpperCase(),
      name: facultyName.trim(),
      role: 'faculty',
      department: facultyDept.trim() || 'Computer Science & Engineering',
    });
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#0F172A] flex flex-col justify-between font-sans antialiased selection:bg-[#991b1b] selection:text-white">
      {/* Top Portal Banner */}
      <header className="bg-[#0F172A] text-white py-6 px-6 border-b-4 border-[#991b1b] shadow-md">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-md bg-[#991b1b] text-white font-serif italic text-3xl flex items-center justify-center font-extrabold shadow-md">
              U
            </div>
            <div>
              <h1 className="font-serif italic text-2xl md:text-3xl tracking-tight text-white font-extrabold">
                Automata Theory & Computation (BCS503 / 10CS56)
              </h1>
              <p className="text-xs md:text-sm uppercase tracking-widest text-red-300 font-mono font-extrabold">
                VTU Curriculum • Hopcroft, Motwani & Ullman (Padma Reddy Syllabus Edition)
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-white/15 px-4 py-2 rounded-md text-sm font-mono font-bold text-white shadow-xs border border-white/20">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>Institutional Dual Portal • Secure Access</span>
          </div>
        </div>
      </header>

      {/* Main Login Workspace */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-12 flex flex-col justify-center gap-10">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-xs md:text-sm font-mono font-extrabold uppercase tracking-widest text-[#991b1b] bg-red-100/90 px-4 py-1.5 rounded-full border-2 border-[#991b1b]/30">
            VTU Examination & Learning Suite Login
          </span>
          <h2 className="font-serif italic text-3xl md:text-5xl text-[#0F172A] font-extrabold leading-tight">
            Select Your Academic Role & Portal
          </h2>
          <p className="text-base md:text-lg text-[#0F172A] font-medium leading-relaxed">
            Log in as a <strong className="text-[#991b1b] font-bold">Student</strong> using your USN to access course manifolds, interactive visual simulators, and single-attempt quizzes, or log in as <strong className="text-[#991b1b] font-bold">Faculty</strong> to manage permission keys and master score databases.
          </p>
        </div>

        {/* 1-Click Demo Login Quick Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto w-full">
          {/* Quick Student Login Card */}
          <div className="bg-white border-2 border-slate-300 hover:border-[#0F172A] p-7 rounded-xl shadow-md hover:shadow-xl transition-all flex flex-col justify-between space-y-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 bg-[#0F172A] text-white text-xs font-mono font-extrabold uppercase px-4 py-1.5 rounded-bl-lg">
              Student Portal
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-center space-x-3 text-[#0F172A]">
                <div className="p-3 bg-emerald-100 rounded-lg">
                  <GraduationCap className="w-8 h-8 text-emerald-700" />
                </div>
                <div>
                  <h3 className="font-serif italic text-2xl font-extrabold text-[#0F172A]">Student Quick Login</h3>
                  <p className="text-sm font-mono font-bold text-slate-700">Preset Profile: {DEFAULT_STUDENT.name}</p>
                </div>
              </div>

              <div className="bg-slate-100 p-4 rounded-lg text-sm space-y-2 font-mono text-[#0F172A] border-2 border-slate-200">
                <div className="flex justify-between">
                  <span className="text-slate-600 font-bold">USN:</span>
                  <span className="font-extrabold text-[#0F172A] text-base">{DEFAULT_STUDENT.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 font-bold">Semester:</span>
                  <span className="font-extrabold text-[#0F172A] text-base">{DEFAULT_STUDENT.sem}</span>
                </div>
              </div>

              <ul className="text-sm text-[#0F172A] font-semibold space-y-2 pt-1">
                <li className="flex items-center space-x-2.5">
                  <Check className="w-5 h-5 text-emerald-600 shrink-0 font-bold" />
                  <span>View Module 1-5 Lectures, Notes & Visual Simulators</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <Check className="w-5 h-5 text-emerald-600 shrink-0 font-bold" />
                  <span>Attempt Module Quizzes (1-Attempt Enforced, CSV Download)</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <Check className="w-5 h-5 text-emerald-600 shrink-0 font-bold" />
                  <span>Access VTU Question Bank (Questions Only - No Ans)</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => onLogin(DEFAULT_STUDENT)}
              className="w-full bg-[#0F172A] hover:bg-black text-white font-mono text-sm md:text-base font-extrabold uppercase tracking-wider py-4 rounded-lg flex items-center justify-center space-x-3 transition-colors shadow-md"
            >
              <span>Login as Student (Rahul Sharma)</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Faculty Login Card */}
          <div className="bg-white border-2 border-red-300 hover:border-[#991b1b] p-7 rounded-xl shadow-md hover:shadow-xl transition-all flex flex-col justify-between space-y-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 bg-[#991b1b] text-white text-xs font-mono font-extrabold uppercase px-4 py-1.5 rounded-bl-lg">
              Faculty Admin
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-center space-x-3 text-[#991b1b]">
                <div className="p-3 bg-red-100 rounded-lg">
                  <User className="w-8 h-8 text-[#991b1b]" />
                </div>
                <div>
                  <h3 className="font-serif italic text-2xl font-extrabold text-[#991b1b]">Faculty Quick Login</h3>
                  <p className="text-sm font-mono font-bold text-red-900">Preset Profile: {DEFAULT_FACULTY.name}</p>
                </div>
              </div>

              <div className="bg-red-50 p-4 rounded-lg text-sm space-y-2 font-mono text-[#991b1b] border-2 border-red-200">
                <div className="flex justify-between">
                  <span className="text-red-700 font-bold">Faculty ID:</span>
                  <span className="font-extrabold text-[#991b1b] text-base">{DEFAULT_FACULTY.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-700 font-bold">Designation:</span>
                  <span className="font-extrabold text-[#991b1b] text-base">{DEFAULT_FACULTY.department}</span>
                </div>
              </div>

              <ul className="text-sm text-[#0F172A] font-semibold space-y-2 pt-1">
                <li className="flex items-center space-x-2.5">
                  <Check className="w-5 h-5 text-[#991b1b] shrink-0 font-bold" />
                  <span>Toggle Permission for Student Q-Bank Answer Keys</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <Check className="w-5 h-5 text-[#991b1b] shrink-0 font-bold" />
                  <span>View Master Student Quiz Scores & Export CSV Logs</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <Check className="w-5 h-5 text-[#991b1b] shrink-0 font-bold" />
                  <span>Full Q-Bank with Detailed Answer Keys (Both Options)</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => onLogin(DEFAULT_FACULTY)}
              className="w-full bg-[#991b1b] hover:bg-[#7f1d1d] text-white font-mono text-sm md:text-base font-extrabold uppercase tracking-wider py-4 rounded-lg flex items-center justify-center space-x-3 transition-colors shadow-md"
            >
              <span>Login as Faculty (Prof. Dr. Pushpa Mohan)</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Custom Institutional ID Login Section */}
        <div className="max-w-3xl mx-auto w-full bg-white border-2 border-slate-300 rounded-xl p-8 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-slate-200 pb-4 gap-4">
            <div>
              <h3 className="font-serif italic text-2xl text-[#0F172A] font-extrabold">Custom Institutional Credentials</h3>
              <p className="text-sm font-semibold text-slate-600">Sign in using your official VTU USN or Faculty ID number</p>
            </div>

            <div className="flex bg-slate-100 p-1.5 rounded-lg border-2 border-slate-200">
              <button
                type="button"
                onClick={() => setActiveTab('student')}
                className={`px-4 py-2 rounded-md text-xs md:text-sm font-mono font-extrabold transition-all ${
                  activeTab === 'student'
                    ? 'bg-[#0F172A] text-white shadow-xs'
                    : 'text-slate-700 hover:text-black'
                }`}
              >
                Student Form
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('faculty')}
                className={`px-4 py-2 rounded-md text-xs md:text-sm font-mono font-extrabold transition-all ${
                  activeTab === 'faculty'
                    ? 'bg-[#991b1b] text-white shadow-xs'
                    : 'text-slate-700 hover:text-black'
                }`}
              >
                Faculty Form
              </button>
            </div>
          </div>

          {activeTab === 'student' ? (
            <form onSubmit={handleStudentSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs md:text-sm font-mono font-extrabold text-[#0F172A] uppercase tracking-wider">Student USN (University Seat No.) *</label>
                  <input
                    type="text"
                    required
                    value={studentId}
                    onChange={e => setStudentId(e.target.value)}
                    placeholder="e.g. 1VT22CS001"
                    className="w-full bg-white border-2 border-slate-300 px-4 py-3 rounded-lg text-sm md:text-base font-mono font-bold focus:border-[#0F172A] outline-none text-[#0F172A]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs md:text-sm font-mono font-extrabold text-[#0F172A] uppercase tracking-wider">Student Full Name *</label>
                  <input
                    type="text"
                    required
                    value={studentName}
                    onChange={e => setStudentName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full bg-white border-2 border-slate-300 px-4 py-3 rounded-lg text-sm md:text-base font-bold focus:border-[#0F172A] outline-none text-[#0F172A]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs md:text-sm font-mono font-extrabold text-[#0F172A] uppercase tracking-wider">Semester & Branch</label>
                <input
                  type="text"
                  value={studentSem}
                  onChange={e => setStudentSem(e.target.value)}
                  placeholder="e.g. 5th Semester CSE"
                  className="w-full bg-white border-2 border-slate-300 px-4 py-3 rounded-lg text-sm md:text-base font-bold focus:border-[#0F172A] outline-none text-[#0F172A]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#0F172A] hover:bg-black text-white font-mono text-sm md:text-base font-extrabold uppercase tracking-wider py-3.5 rounded-lg shadow-md flex items-center justify-center space-x-2"
              >
                <Check className="w-5 h-5 text-emerald-400" />
                <span>Enter Portal as Custom Student ({studentId || 'USN'})</span>
              </button>
            </form>
          ) : (
            <form onSubmit={handleFacultySubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs md:text-sm font-mono font-extrabold text-[#991b1b] uppercase tracking-wider">Faculty Employee ID *</label>
                  <input
                    type="text"
                    required
                    value={facultyId}
                    onChange={e => setFacultyId(e.target.value)}
                    placeholder="e.g. FAC_CSE_101"
                    className="w-full bg-white border-2 border-red-300 px-4 py-3 rounded-lg text-sm md:text-base font-mono font-bold focus:border-[#991b1b] outline-none text-[#0F172A]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs md:text-sm font-mono font-extrabold text-[#991b1b] uppercase tracking-wider">Faculty Full Name *</label>
                  <input
                    type="text"
                    required
                    value={facultyName}
                    onChange={e => setFacultyName(e.target.value)}
                    placeholder="e.g. Prof. Dr. Pushpa Mohan"
                    className="w-full bg-white border-2 border-red-300 px-4 py-3 rounded-lg text-sm md:text-base font-bold focus:border-[#991b1b] outline-none text-[#0F172A]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs md:text-sm font-mono font-extrabold text-[#991b1b] uppercase tracking-wider">Department / Position</label>
                <input
                  type="text"
                  value={facultyDept}
                  onChange={e => setFacultyDept(e.target.value)}
                  placeholder="e.g. Computer Science & Engineering"
                  className="w-full bg-white border-2 border-red-300 px-4 py-3 rounded-lg text-sm md:text-base font-bold focus:border-[#991b1b] outline-none text-[#0F172A]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#991b1b] hover:bg-[#7f1d1d] text-white font-mono text-sm md:text-base font-extrabold uppercase tracking-wider py-3.5 rounded-lg shadow-md flex items-center justify-center space-x-2"
              >
                <Check className="w-5 h-5 text-amber-300" />
                <span>Enter Portal as Custom Faculty ({facultyId || 'ID'})</span>
              </button>
            </form>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#0F172A] text-slate-300 py-6 px-6 text-center text-sm space-y-1 border-t-4 border-[#991b1b]">
        <p className="font-serif italic text-base text-white font-extrabold">Automata Theory & Computation Learning Suite</p>
        <p className="font-semibold text-slate-200">VTU Syllabus BCS503 / 10CS56 • Hopcroft, Motwani & Ullman (Padma Reddy Edition)</p>
      </footer>
    </div>
  );
};
