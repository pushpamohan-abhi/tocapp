import React, { useState } from 'react';
import { UserProfile, UserRole } from '../types';
import { User, ShieldCheck, GraduationCap, X, Check, BookOpen, UserCheck, Key, Lock } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onSelectUser: (user: UserProfile) => void;
  initialRole?: UserRole;
}

export const DEFAULT_STUDENT: UserProfile = {
  id: '1VT22CS001',
  name: 'Rahul Sharma',
  role: 'student',
  sem: 'CSE-A',
  department: 'Computer Science & Engineering',
  assignedFaculty: 'Prof. Dr. Pushpa Mohan'
};

export const DEFAULT_FACULTY: UserProfile = {
  id: 'FAC_CSE_101',
  name: 'Prof. Dr. Pushpa Mohan',
  role: 'faculty',
  department: 'Computer Science & Engineering',
  sem: 'Professor & HOD'
};

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, currentUser, onSelectUser, initialRole }) => {
  const [roleTab, setRoleTab] = useState<UserRole>(initialRole || currentUser.role);
  const [studentId, setStudentId] = useState(currentUser.role === 'student' ? currentUser.id : '1VT22CS001');
  const [studentName, setStudentName] = useState(currentUser.role === 'student' ? currentUser.name : 'Rahul Sharma');
  const [studentSem, setStudentSem] = useState('5th Semester CSE');

  const [facultyId, setFacultyId] = useState(currentUser.role === 'faculty' ? currentUser.id : 'FAC_CSE_101');
  const [facultyName, setFacultyName] = useState(currentUser.role === 'faculty' ? currentUser.name : 'Prof. Dr. A.M. Padma Reddy');
  const [facultyDept, setFacultyDept] = useState('Computer Science & Engineering');

  if (!isOpen) return null;

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId.trim() || !studentName.trim()) return;
    onSelectUser({
      id: studentId.trim().toUpperCase(),
      name: studentName.trim(),
      role: 'student',
      sem: studentSem,
      department: 'CSE',
      assignedFaculty: currentUser.assignedFaculty || 'Prof. Dr. Pushpa Mohan'
    });
    onClose();
  };

  const handleSaveFaculty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!facultyId.trim() || !facultyName.trim()) return;
    onSelectUser({
      id: facultyId.trim().toUpperCase(),
      name: facultyName.trim(),
      role: 'faculty',
      department: facultyDept,
      sem: 'Faculty'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FDFCFB] border border-[#1A1A1A]/20 rounded-sm w-full max-w-xl p-6 shadow-2xl relative space-y-6 overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#1A1A1A]/50 hover:text-[#1A1A1A] p-1 rounded transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 bg-[#991b1b] text-white px-2.5 py-0.5 rounded-sm text-[10px] font-mono font-bold uppercase tracking-widest">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>VTU Academic Portal • Dual User Authentication</span>
          </div>
          <h3 className="font-serif italic text-2xl text-[#1A1A1A]">Login for Student & Faculty</h3>
          <p className="text-xs text-[#1A1A1A]/70">
            Select your role below or sign in using your institutional USN or Faculty ID credentials.
          </p>
        </div>

        {/* 1-Click Dual Login Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            onClick={() => {
              onSelectUser(DEFAULT_STUDENT);
              onClose();
            }}
            className={`p-4 rounded border-2 cursor-pointer transition-all space-y-2 hover:shadow-md ${
              currentUser.role === 'student'
                ? 'bg-slate-50 border-[#1A1A1A]'
                : 'bg-white border-[#1A1A1A]/15 hover:border-[#1A1A1A]'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-[#1A1A1A] font-bold text-xs uppercase font-mono">
                <GraduationCap className="w-4 h-4 text-[#1A1A1A]" />
                <span>Student Login</span>
              </div>
              <span className="text-[10px] bg-[#1A1A1A] text-white px-2 py-0.5 rounded font-mono font-bold">
                1-Click Quick Login
              </span>
            </div>
            <div className="text-xs font-serif font-bold text-[#1A1A1A]">{DEFAULT_STUDENT.name}</div>
            <div className="text-[11px] text-[#1A1A1A]/60 font-mono">USN: {DEFAULT_STUDENT.id}</div>
            <p className="text-[10px] text-[#1A1A1A]/70 italic pt-1 border-t border-[#1A1A1A]/10">
              Access Lectures, Manifolds, Study Notes, Single-Attempt Quiz, and Question Bank.
            </p>
          </div>

          <div
            onClick={() => {
              onSelectUser(DEFAULT_FACULTY);
              onClose();
            }}
            className={`p-4 rounded border-2 cursor-pointer transition-all space-y-2 hover:shadow-md ${
              currentUser.role === 'faculty'
                ? 'bg-red-50/50 border-[#991b1b]'
                : 'bg-white border-[#991b1b]/20 hover:border-[#991b1b]'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-[#991b1b] font-bold text-xs uppercase font-mono">
                <User className="w-4 h-4 text-[#991b1b]" />
                <span>Faculty Login</span>
              </div>
              <span className="text-[10px] bg-[#991b1b] text-white px-2 py-0.5 rounded font-mono font-bold">
                Faculty Admin
              </span>
            </div>
            <div className="text-xs font-serif font-bold text-[#991b1b]">{DEFAULT_FACULTY.name}</div>
            <div className="text-[11px] text-[#1A1A1A]/60 font-mono">ID: {DEFAULT_FACULTY.id}</div>
            <p className="text-[10px] text-[#1A1A1A]/70 italic pt-1 border-t border-[#1A1A1A]/10">
              Unlock Q-Bank answers for students, view master CSV score logs, & manage attempts.
            </p>
          </div>
        </div>

        {/* Custom Credential Input Tab Section */}
        <div className="space-y-3 pt-2 border-t border-[#1A1A1A]/10">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]/50 block font-mono">
            Or Login with Custom Institutional Credentials:
          </span>

          <div className="grid grid-cols-2 gap-2 bg-[#F8F6F2] p-1 rounded border border-[#1A1A1A]/10">
            <button
              type="button"
              onClick={() => setRoleTab('student')}
              className={`py-2 px-3 rounded text-xs font-bold font-mono transition-all flex items-center justify-center space-x-2 ${
                roleTab === 'student'
                  ? 'bg-[#1A1A1A] text-white shadow-sm'
                  : 'text-[#1A1A1A]/60 hover:text-[#1A1A1A]'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Student Custom Form</span>
            </button>
            <button
              type="button"
              onClick={() => setRoleTab('faculty')}
              className={`py-2 px-3 rounded text-xs font-bold font-mono transition-all flex items-center justify-center space-x-2 ${
                roleTab === 'faculty'
                  ? 'bg-[#991b1b] text-white shadow-sm'
                  : 'text-[#1A1A1A]/60 hover:text-[#1A1A1A]'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Faculty Custom Form</span>
            </button>
          </div>

          {roleTab === 'student' ? (
            <form onSubmit={handleSaveStudent} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-mono font-bold text-[#1A1A1A]">USN (University Seat No.)</label>
                  <input
                    type="text"
                    required
                    value={studentId}
                    onChange={e => setStudentId(e.target.value)}
                    placeholder="e.g. 1VT22CS001"
                    className="w-full bg-white border border-[#1A1A1A]/20 px-3 py-2 rounded text-xs font-mono focus:border-[#1A1A1A] outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono font-bold text-[#1A1A1A]">Student Name</label>
                  <input
                    type="text"
                    required
                    value={studentName}
                    onChange={e => setStudentName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full bg-white border border-[#1A1A1A]/20 px-3 py-2 rounded text-xs focus:border-[#1A1A1A] outline-none"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-mono font-bold text-[#1A1A1A]">Semester & Branch</label>
                <input
                  type="text"
                  value={studentSem}
                  onChange={e => setStudentSem(e.target.value)}
                  placeholder="5th Semester CSE"
                  className="w-full bg-white border border-[#1A1A1A]/20 px-3 py-2 rounded text-xs focus:border-[#1A1A1A] outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#1A1A1A] hover:bg-black text-white font-mono text-xs font-bold uppercase tracking-wider py-2.5 rounded shadow-sm flex items-center justify-center space-x-2 mt-2"
              >
                <Check className="w-4 h-4" />
                <span>Login as Student</span>
              </button>
            </form>
          ) : (
            <form onSubmit={handleSaveFaculty} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-mono font-bold text-[#991b1b]">Faculty ID</label>
                  <input
                    type="text"
                    required
                    value={facultyId}
                    onChange={e => setFacultyId(e.target.value)}
                    placeholder="e.g. FAC_CSE_101"
                    className="w-full bg-white border border-[#991b1b]/30 px-3 py-2 rounded text-xs font-mono focus:border-[#991b1b] outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono font-bold text-[#991b1b]">Faculty Name</label>
                  <input
                    type="text"
                    required
                    value={facultyName}
                    onChange={e => setFacultyName(e.target.value)}
                    placeholder="e.g. Prof. Dr. Pushpa Mohan"
                    className="w-full bg-white border border-[#991b1b]/30 px-3 py-2 rounded text-xs focus:border-[#991b1b] outline-none"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-mono font-bold text-[#991b1b]">Department</label>
                <input
                  type="text"
                  value={facultyDept}
                  onChange={e => setFacultyDept(e.target.value)}
                  placeholder="Computer Science & Engineering"
                  className="w-full bg-white border border-[#991b1b]/30 px-3 py-2 rounded text-xs focus:border-[#991b1b] outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#991b1b] hover:bg-[#7f1d1d] text-white font-mono text-xs font-bold uppercase tracking-wider py-2.5 rounded shadow-sm flex items-center justify-center space-x-2 mt-2"
              >
                <Check className="w-4 h-4" />
                <span>Login as Faculty</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

