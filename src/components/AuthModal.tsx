import React, { useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { User, ShieldCheck, GraduationCap, X, Check, AlertTriangle, UserPlus } from 'lucide-react';
import { fetchStudents, validateStudent, addStudentToRoster, StudentRecord } from '../services/studentService';
import { fetchFaculty, validateFaculty, addFacultyToRoster, FacultyRecord } from '../services/facultyService';

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
  const [studentsList, setStudentsList] = useState<StudentRecord[]>([]);
  const [facultyList, setFacultyList] = useState<FacultyRecord[]>([]);

  const [studentId, setStudentId] = useState(currentUser.role === 'student' ? currentUser.id : '');
  const [studentName, setStudentName] = useState(currentUser.role === 'student' ? currentUser.name : '');
  const [studentSem, setStudentSem] = useState('5th Semester CSE');

  const [facultyId, setFacultyId] = useState(currentUser.role === 'faculty' ? currentUser.id : 'FAC_CSE_101');
  const [facultyName, setFacultyName] = useState(currentUser.role === 'faculty' ? currentUser.name : 'Prof. Dr. Pushpa Mohan');
  const [facultyDept, setFacultyDept] = useState('Computer Science & Engineering');

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Quick Registration inside Modal
  const [isRegistering, setIsRegistering] = useState(false);
  const [regType, setRegType] = useState<'student' | 'faculty'>('student');
  const [regUsn, setRegUsn] = useState('');
  const [regName, setRegName] = useState('');

  const loadRoster = async () => {
    try {
      const [sList, fList] = await Promise.all([fetchStudents(), fetchFaculty()]);
      setStudentsList(sList);
      setFacultyList(fList);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadRoster();
      setErrorMessage(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const cleanUsn = studentId.trim().toUpperCase();
    const cleanName = studentName.trim();

    if (!cleanUsn) {
      setErrorMessage("Please enter a valid Student USN.");
      return;
    }

    // 1. Single source of truth validation
    const match = validateStudent(cleanUsn, studentsList);

    if (match) {
      onSelectUser({
        id: match.id,
        name: match.name,
        role: 'student',
        sem: match.sem || studentSem || 'CSE-A',
        department: 'CSE',
        assignedFaculty: match.assignedFaculty || 'Prof. Dr. Pushpa Mohan'
      });
      onClose();
      return;
    }

    // 2. If USN is not in roster yet -> Auto-register & log in!
    if (!cleanName) {
      setErrorMessage(`USN '${cleanUsn}' is not registered yet. Please enter Student Name to register and log in.`);
      return;
    }

    const res = await addStudentToRoster({
      id: cleanUsn,
      name: cleanName,
      sem: studentSem.trim() || '5th Semester CSE',
      className: 'CSE-A',
      assignedFaculty: 'Prof. Dr. Pushpa Mohan'
    });

    if (res.success) {
      onSelectUser({
        id: cleanUsn,
        name: cleanName,
        role: 'student',
        sem: studentSem.trim() || '5th Semester CSE',
        department: 'CSE',
        assignedFaculty: 'Prof. Dr. Pushpa Mohan'
      });
      onClose();
    } else {
      setErrorMessage(res.error || "Failed to register student.");
    }
  };

  const handleQuickRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const cleanId = regUsn.trim().toUpperCase();
    const cleanName = regName.trim();

    if (!cleanId || !cleanName) {
      setErrorMessage("ID/USN and Full Name are required.");
      return;
    }

    if (regType === 'student') {
      const res = await addStudentToRoster({
        id: cleanId,
        name: cleanName,
        sem: '5th Semester CSE',
        className: 'CSE-A',
        assignedFaculty: 'Prof. Dr. Pushpa Mohan'
      });

      if (res.success) {
        setStudentsList(res.students);
        setStudentId(cleanId);
        setStudentName(cleanName);
        setIsRegistering(false);
        setRegUsn('');
        setRegName('');

        // Automatically select user and close modal
        onSelectUser({
          id: cleanId,
          name: cleanName,
          role: 'student',
          sem: '5th Semester CSE',
          department: 'CSE',
          assignedFaculty: 'Prof. Dr. Pushpa Mohan'
        });
        onClose();
      } else {
        setErrorMessage(res.error || "Failed to register student.");
      }
    } else {
      const res = await addFacultyToRoster({
        id: cleanId,
        name: cleanName,
        department: 'Computer Science & Engineering',
        designation: 'Professor'
      });

      if (res.success) {
        setFacultyList(res.facultyList);
        setFacultyId(cleanId);
        setFacultyName(cleanName);
        setIsRegistering(false);
        setRegUsn('');
        setRegName('');

        // Automatically select faculty and close modal
        onSelectUser({
          id: cleanId,
          name: cleanName,
          role: 'faculty',
          department: 'Computer Science & Engineering',
          sem: 'Professor'
        });
        onClose();
      } else {
        setErrorMessage(res.error || "Failed to register faculty.");
      }
    }
  };

  const handleSaveFaculty = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const cleanId = facultyId.trim().toUpperCase();
    const cleanName = facultyName.trim();

    if (!cleanId) {
      setErrorMessage("Please enter a valid Faculty ID.");
      return;
    }

    const match = validateFaculty(cleanId, facultyList);

    if (match) {
      onSelectUser({
        id: match.id,
        name: match.name,
        role: 'faculty',
        department: match.department || facultyDept,
        sem: match.designation || 'Faculty'
      });
      onClose();
      return;
    }

    if (!cleanName) {
      setErrorMessage(`Faculty ID '${cleanId}' is not registered yet. Please enter Full Name to register and log in.`);
      return;
    }

    const res = await addFacultyToRoster({
      id: cleanId,
      name: cleanName,
      department: facultyDept.trim() || 'Computer Science & Engineering',
      designation: 'Professor'
    });

    if (res.success) {
      onSelectUser({
        id: cleanId,
        name: cleanName,
        role: 'faculty',
        department: facultyDept.trim() || 'Computer Science & Engineering',
        sem: 'Faculty'
      });
      onClose();
    } else {
      setErrorMessage(res.error || "Failed to register faculty.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FDFCFB] border border-[#1A1A1A]/20 rounded-sm w-full max-w-xl p-6 shadow-2xl relative space-y-5 overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#1A1A1A]/50 hover:text-[#1A1A1A] p-1 rounded transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 bg-[#991b1b] text-white px-2.5 py-0.5 rounded-sm text-[10px] font-mono font-bold uppercase tracking-widest">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>VTU Academic Portal • Verified Roster Login</span>
          </div>
          <h3 className="font-serif italic text-2xl text-[#1A1A1A]">Login for Student & Faculty</h3>
          <p className="text-xs text-[#1A1A1A]/70">
            Sign in using your registered USN or Faculty ID. Newly added students and faculty members are validated instantly.
          </p>
        </div>

        {errorMessage && (
          <div className="bg-rose-50 border-2 border-rose-500 text-rose-900 p-3 rounded text-xs font-mono font-bold flex items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <div className="flex space-x-1 shrink-0">
              <button
                type="button"
                onClick={() => { setRegType('student'); setIsRegistering(true); }}
                className="bg-rose-600 text-white px-2 py-1 rounded text-[10px] hover:bg-rose-700 transition-colors"
              >
                + Student
              </button>
              <button
                type="button"
                onClick={() => { setRegType('faculty'); setIsRegistering(true); }}
                className="bg-amber-800 text-white px-2 py-1 rounded text-[10px] hover:bg-amber-900 transition-colors"
              >
                + Faculty
              </button>
            </div>
          </div>
        )}

        {isRegistering && (
          <form onSubmit={handleQuickRegister} className="bg-amber-50 p-3 rounded border border-amber-300 space-y-2">
            <div className="flex justify-between items-center text-xs font-mono font-bold text-amber-900">
              <span>Register New {regType === 'student' ? 'Student' : 'Faculty Member'}:</span>
              <div className="flex items-center space-x-2">
                <button type="button" onClick={() => setRegType(regType === 'student' ? 'faculty' : 'student')} className="underline text-[10px]">
                  Switch to {regType === 'student' ? 'Faculty' : 'Student'}
                </button>
                <button type="button" onClick={() => setIsRegistering(false)} className="underline text-[10px]">Close</button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                required
                placeholder={regType === 'student' ? "USN (e.g. 1VT22CS004)" : "ID (e.g. FAC_CSE_104)"}
                value={regUsn}
                onChange={e => setRegUsn(e.target.value)}
                className="bg-white border p-1.5 rounded text-xs font-mono font-bold"
              />
              <input
                type="text"
                required
                placeholder="Full Name"
                value={regName}
                onChange={e => setRegName(e.target.value)}
                className="bg-white border p-1.5 rounded text-xs font-bold"
              />
            </div>
            <button type="submit" className="w-full bg-amber-800 text-white text-xs font-mono py-1.5 rounded font-bold">
              Save {regType === 'student' ? 'Student' : 'Faculty'} & Validate
            </button>
          </form>
        )}

        {/* 1-Click Dual Login Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            onClick={() => {
              const defaultMatch = validateStudent(DEFAULT_STUDENT.id, studentsList);
              if (defaultMatch) {
                onSelectUser({ ...DEFAULT_STUDENT, name: defaultMatch.name });
                onClose();
              } else {
                setErrorMessage("Student not found. Please check the USN or contact faculty.");
              }
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
                1-Click Quick
              </span>
            </div>
            <div className="text-xs font-serif font-bold text-[#1A1A1A]">{DEFAULT_STUDENT.name}</div>
            <div className="text-[11px] text-[#1A1A1A]/60 font-mono">USN: {DEFAULT_STUDENT.id}</div>
          </div>

          <div
            onClick={() => {
              const facultyMatch = validateFaculty(DEFAULT_FACULTY.id, facultyList);
              onSelectUser(facultyMatch ? {
                id: facultyMatch.id,
                name: facultyMatch.name,
                role: 'faculty',
                department: facultyMatch.department,
                sem: facultyMatch.designation || 'Professor'
              } : DEFAULT_FACULTY);
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
            <div className="text-xs font-serif font-bold text-[#991b1b]">
              {(facultyList.find(f => f.id === DEFAULT_FACULTY.id) || DEFAULT_FACULTY).name}
            </div>
            <div className="text-[11px] text-[#1A1A1A]/60 font-mono">ID: {DEFAULT_FACULTY.id}</div>
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
              onClick={() => { setRoleTab('student'); setErrorMessage(null); }}
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
              onClick={() => { setRoleTab('faculty'); setErrorMessage(null); }}
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
              {studentsList.length > 0 && (
                <div className="space-y-1">
                  <label className="text-[11px] font-mono font-bold text-[#1A1A1A]">Registered Student Roster ({studentsList.length}):</label>
                  <select
                    value={studentId}
                    onChange={e => {
                      const usn = e.target.value;
                      setStudentId(usn);
                      const match = studentsList.find(s => s.id.toUpperCase() === usn.toUpperCase());
                      if (match) {
                        setStudentName(match.name);
                        setStudentSem(match.sem || '5th Semester CSE');
                      }
                      setErrorMessage(null);
                    }}
                    className="w-full bg-white border border-[#1A1A1A]/20 px-2.5 py-1.5 rounded text-xs font-mono font-bold"
                  >
                    {studentsList.map(st => (
                      <option key={st.id} value={st.id}>
                        {st.name} ({st.id})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-mono font-bold text-[#1A1A1A]">USN (University Seat No.)</label>
                  <input
                    type="text"
                    required
                    value={studentId}
                    onChange={e => { setStudentId(e.target.value); setErrorMessage(null); }}
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

              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  className="flex-1 bg-[#1A1A1A] hover:bg-black text-white font-mono text-xs font-bold uppercase tracking-wider py-2.5 rounded shadow-sm flex items-center justify-center space-x-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Login as Student</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setRegType('student'); setIsRegistering(true); }}
                  className="bg-slate-100 hover:bg-slate-200 text-[#1A1A1A] px-3 py-2.5 rounded border border-slate-300 text-xs font-mono font-bold flex items-center space-x-1"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>+ Register</span>
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSaveFaculty} className="space-y-3">
              {facultyList.length > 0 && (
                <div className="space-y-1">
                  <label className="text-[11px] font-mono font-bold text-[#991b1b]">Registered Faculty Roster ({facultyList.length}):</label>
                  <select
                    value={facultyId}
                    onChange={e => {
                      const fid = e.target.value;
                      setFacultyId(fid);
                      const match = facultyList.find(f => f.id.toUpperCase() === fid.toUpperCase());
                      if (match) {
                        setFacultyName(match.name);
                        setFacultyDept(match.department);
                      }
                      setErrorMessage(null);
                    }}
                    className="w-full bg-white border border-[#991b1b]/30 px-2.5 py-1.5 rounded text-xs font-mono font-bold text-[#991b1b]"
                  >
                    {facultyList.map(f => (
                      <option key={f.id} value={f.id}>
                        {f.name} ({f.id}) — {f.department}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-mono font-bold text-[#991b1b]">Faculty ID</label>
                  <input
                    type="text"
                    required
                    value={facultyId}
                    onChange={e => { setFacultyId(e.target.value); setErrorMessage(null); }}
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

              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  className="flex-1 bg-[#991b1b] hover:bg-[#7f1d1d] text-white font-mono text-xs font-bold uppercase tracking-wider py-2.5 rounded shadow-sm flex items-center justify-center space-x-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Login as Faculty</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setRegType('faculty'); setIsRegistering(true); }}
                  className="bg-red-50 hover:bg-red-100 text-[#991b1b] border border-red-300 px-3 py-2.5 rounded text-xs font-mono font-bold flex items-center space-x-1"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>+ Register</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

