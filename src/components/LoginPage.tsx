import React, { useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { ShieldCheck, GraduationCap, User, Check, ArrowRight, AlertTriangle, UserPlus, RefreshCw, Trash2 } from 'lucide-react';
import { fetchStudents, validateStudent, addStudentToRoster, deleteStudentFromRoster, StudentRecord } from '../services/studentService';
import { fetchFaculty, validateFaculty, addFacultyToRoster, FacultyRecord } from '../services/facultyService';

interface LoginPageProps {
  onLogin: (user: UserProfile) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [activeTab, setActiveTab] = useState<UserRole>('student');

  // Student Roster state
  const [studentsList, setStudentsList] = useState<StudentRecord[]>([]);
  const [selectedStudentUsn, setSelectedStudentUsn] = useState<string>('');

  // Faculty Roster state
  const [facultyList, setFacultyList] = useState<FacultyRecord[]>([]);
  const [selectedFacultyId, setSelectedFacultyId] = useState<string>('FAC_CSE_101');

  // Custom Student input state
  const [studentId, setStudentId] = useState('');
  const [studentName, setStudentName] = useState('');
  const [studentSem, setStudentSem] = useState('5th Semester CSE');

  // Custom Faculty input state
  const [facultyId, setFacultyId] = useState('FAC_CSE_101');
  const [facultyName, setFacultyName] = useState('Prof. Dr. Pushpa Mohan');
  const [facultyDept, setFacultyDept] = useState('Computer Science & Engineering');

  // Registration modal / toggle state
  const [isRegistering, setIsRegistering] = useState(false);
  const [regType, setRegType] = useState<'student' | 'faculty'>('student');
  const [regUsn, setRegUsn] = useState('');
  const [regName, setRegName] = useState('');
  const [regSem, setRegSem] = useState('5th Semester CSE');
  const [regClass, setRegClass] = useState('CSE-A');
  const [regFacultyDept, setRegFacultyDept] = useState('Computer Science & Engineering');
  const [regFacultyDesig, setRegFacultyDesig] = useState('Professor');
  const [regSuccessMsg, setRegSuccessMsg] = useState<string | null>(null);

  // Validation & error states
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoadingRoster, setIsLoadingRoster] = useState(false);

  const loadRoster = async () => {
    setIsLoadingRoster(true);
    try {
      const [sList, fList] = await Promise.all([fetchStudents(), fetchFaculty()]);
      setStudentsList(sList);
      setFacultyList(fList);

      if (sList.length > 0) {
        const currentMatch = sList.find(s => s.id.toUpperCase() === studentId.trim().toUpperCase());
        if (currentMatch) {
          setStudentName(currentMatch.name);
          setStudentSem(currentMatch.sem || '5th Semester CSE');
        } else {
          setSelectedStudentUsn(sList[0].id);
          setStudentId(sList[0].id);
          setStudentName(sList[0].name);
          setStudentSem(sList[0].sem || '5th Semester CSE');
        }
      }

      if (fList.length > 0) {
        const currentFacultyMatch = fList.find(f => f.id.toUpperCase() === facultyId.trim().toUpperCase());
        if (currentFacultyMatch) {
          setFacultyName(currentFacultyMatch.name);
          setFacultyDept(currentFacultyMatch.department);
        } else {
          setSelectedFacultyId(fList[0].id);
          setFacultyId(fList[0].id);
          setFacultyName(fList[0].name);
          setFacultyDept(fList[0].department);
        }
      }
    } catch (e) {
      console.error("Error loading roster data:", e);
    } finally {
      setIsLoadingRoster(false);
    }
  };

  useEffect(() => {
    loadRoster();

    const handleStudentUpdate = (e: Event) => {
      const custom = e as CustomEvent;
      if (custom.detail && Array.isArray(custom.detail)) {
        setStudentsList(custom.detail);
      } else {
        loadRoster();
      }
    };

    const handleFacultyUpdate = (e: Event) => {
      const custom = e as CustomEvent;
      if (custom.detail && Array.isArray(custom.detail)) {
        setFacultyList(custom.detail);
      } else {
        loadRoster();
      }
    };

    window.addEventListener('vtu-students-updated', handleStudentUpdate);
    window.addEventListener('vtu-faculty-updated', handleFacultyUpdate);
    return () => {
      window.removeEventListener('vtu-students-updated', handleStudentUpdate);
      window.removeEventListener('vtu-faculty-updated', handleFacultyUpdate);
    };
  }, []);

  const handleSelectStudentFromRoster = (usn: string) => {
    setSelectedStudentUsn(usn);
    setErrorMessage(null);
  };

  const handleDeleteSelectedStudent = async (usn: string) => {
    if (!usn) return;
    if (window.confirm(`Are you sure you want to remove student record (${usn}) from the roster?`)) {
      const updated = await deleteStudentFromRoster(usn);
      setStudentsList(updated);
      if (updated.length > 0) {
        setSelectedStudentUsn(updated[0].id);
        setStudentId(updated[0].id);
        setStudentName(updated[0].name);
        if (updated[0].sem) setStudentSem(updated[0].sem);
      } else {
        setSelectedStudentUsn('');
        setStudentId('');
        setStudentName('');
      }
      setRegSuccessMsg(`Student record '${usn}' removed successfully.`);
    }
  };

  const handleSelectFacultyFromRoster = (fid: string) => {
    setSelectedFacultyId(fid);
    setErrorMessage(null);
  };

  const handleRosterStudentLogin = () => {
    setErrorMessage(null);
    const matched = studentsList.find(s => s.id.toUpperCase() === selectedStudentUsn.toUpperCase()) || studentsList[0];
    if (matched) {
      onLogin({
        id: matched.id,
        name: matched.name,
        role: 'student',
        sem: matched.sem || '5th Semester CSE',
        assignedFaculty: matched.assignedFaculty || 'Prof. Dr. Pushpa Mohan',
      });
    } else {
      setErrorMessage("Student not found in active roster.");
    }
  };

  const handleRosterFacultyLogin = () => {
    setErrorMessage(null);
    const matched = facultyList.find(f => f.id.toUpperCase() === selectedFacultyId.toUpperCase()) || facultyList[0];
    if (matched) {
      onLogin({
        id: matched.id,
        name: matched.name,
        role: 'faculty',
        department: matched.department || 'Computer Science & Engineering',
        sem: matched.designation || 'Professor'
      });
    } else {
      setErrorMessage("Faculty not found in active roster.");
    }
  };

  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setRegSuccessMsg(null);

    const cleanUsn = studentId.trim().toUpperCase();
    const cleanName = studentName.trim();

    if (!cleanUsn) {
      setErrorMessage("Please enter a valid Student USN.");
      return;
    }

    const existingStudent = validateStudent(cleanUsn, studentsList);

    if (existingStudent) {
      onLogin({
        id: existingStudent.id,
        name: existingStudent.name,
        role: 'student',
        sem: existingStudent.sem || studentSem || '5th Semester CSE',
        assignedFaculty: existingStudent.assignedFaculty || 'Prof. Dr. Pushpa Mohan',
      });
      return;
    }

    if (!cleanName) {
      setErrorMessage(`USN '${cleanUsn}' is not registered yet. Please enter your Full Name below to register and log in.`);
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
      setStudentsList(res.students);
      setSelectedStudentUsn(cleanUsn);
      setRegSuccessMsg(`New student ${cleanUsn} (${cleanName}) registered successfully! Opening portal...`);

      onLogin({
        id: cleanUsn,
        name: cleanName,
        role: 'student',
        sem: studentSem.trim() || '5th Semester CSE',
        assignedFaculty: 'Prof. Dr. Pushpa Mohan'
      });
    } else {
      setErrorMessage(res.error || "Failed to register student.");
    }
  };

  const handleFacultySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setRegSuccessMsg(null);

    const cleanId = facultyId.trim().toUpperCase();
    const cleanName = facultyName.trim();

    if (!cleanId) {
      setErrorMessage("Please enter a valid Faculty Employee ID.");
      return;
    }

    const existingFaculty = validateFaculty(cleanId, facultyList);

    if (existingFaculty) {
      onLogin({
        id: existingFaculty.id,
        name: existingFaculty.name,
        role: 'faculty',
        department: existingFaculty.department || facultyDept || 'Computer Science & Engineering',
        sem: existingFaculty.designation || 'Professor'
      });
      return;
    }

    if (!cleanName) {
      setErrorMessage(`Faculty ID '${cleanId}' is not registered yet. Please enter your Full Name below to register and log in.`);
      return;
    }

    const res = await addFacultyToRoster({
      id: cleanId,
      name: cleanName,
      department: facultyDept.trim() || 'Computer Science & Engineering',
      designation: 'Professor / Faculty Member'
    });

    if (res.success) {
      setFacultyList(res.facultyList);
      setSelectedFacultyId(cleanId);
      setRegSuccessMsg(`New faculty member ${cleanId} (${cleanName}) registered successfully! Opening faculty portal...`);

      onLogin({
        id: cleanId,
        name: cleanName,
        role: 'faculty',
        department: facultyDept.trim() || 'Computer Science & Engineering',
        sem: 'Professor'
      });
    } else {
      setErrorMessage(res.error || "Failed to register new faculty.");
    }
  };

  const handleStudentIdInputChange = (val: string) => {
    setStudentId(val);
    setErrorMessage(null);
    const clean = val.trim().toUpperCase();
    const match = studentsList.find(s => s.id.toUpperCase() === clean);
    if (match) {
      setStudentName(match.name);
      if (match.sem) setStudentSem(match.sem);
    } else {
      const isExistingRosterName = studentsList.some(s => s.name === studentName);
      if (isExistingRosterName) {
        setStudentName('');
      }
    }
  };

  const handleFacultyIdInputChange = (val: string) => {
    setFacultyId(val);
    setErrorMessage(null);
    const clean = val.trim().toUpperCase();
    const match = facultyList.find(f => f.id.toUpperCase() === clean);
    if (match) {
      setFacultyName(match.name);
      if (match.department) setFacultyDept(match.department);
    } else {
      const isExistingRosterName = facultyList.some(f => f.name === facultyName);
      if (isExistingRosterName) {
        setFacultyName('');
      }
    }
  };

  const handleRegisterNewMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setRegSuccessMsg(null);

    const cleanId = regUsn.trim().toUpperCase();
    const cleanName = regName.trim();

    if (!cleanId || !cleanName) {
      setErrorMessage("ID/USN and Full Name are required to complete registration.");
      return;
    }

    if (regType === 'student') {
      const res = await addStudentToRoster({
        id: cleanId,
        name: cleanName,
        sem: regSem,
        className: regClass,
        assignedFaculty: 'Prof. Dr. Pushpa Mohan'
      });

      if (res.success) {
        setStudentsList(res.students);
        setSelectedStudentUsn(cleanId);
        setStudentId(cleanId);
        setStudentName(cleanName);
        setStudentSem(regSem);
        setRegSuccessMsg(`Student ${cleanId} (${cleanName}) registered successfully! Opening portal...`);
        setIsRegistering(false);
        setRegUsn('');
        setRegName('');

        // AUTOMATICALLY LOG IN THE STUDENT IMMEDIATELY
        onLogin({
          id: cleanId,
          name: cleanName,
          role: 'student',
          sem: regSem || '5th Semester CSE',
          assignedFaculty: 'Prof. Dr. Pushpa Mohan'
        });
      } else {
        setErrorMessage(res.error || "Failed to register student.");
      }
    } else {
      const res = await addFacultyToRoster({
        id: cleanId,
        name: cleanName,
        department: regFacultyDept,
        designation: regFacultyDesig
      });

      if (res.success) {
        setFacultyList(res.facultyList);
        setSelectedFacultyId(cleanId);
        setFacultyId(cleanId);
        setFacultyName(cleanName);
        setFacultyDept(regFacultyDept);
        setRegSuccessMsg(`New Faculty ${cleanId} (${cleanName}) registered successfully! Opening faculty portal...`);
        setIsRegistering(false);
        setRegUsn('');
        setRegName('');

        // AUTOMATICALLY LOG IN THE FACULTY IMMEDIATELY
        onLogin({
          id: cleanId,
          name: cleanName,
          role: 'faculty',
          department: regFacultyDept || 'Computer Science & Engineering',
          sem: regFacultyDesig || 'Professor'
        });
      } else {
        setErrorMessage(res.error || "Failed to register new faculty.");
      }
    }
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
            <span>Institutional Dual Portal • Verified Roster Access</span>
          </div>
        </div>
      </header>

      {/* Main Login Workspace */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-12 flex flex-col justify-center gap-8">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-xs md:text-sm font-mono font-extrabold uppercase tracking-widest text-[#991b1b] bg-red-100/90 px-4 py-1.5 rounded-full border-2 border-[#991b1b]/30">
            VTU Examination & Learning Suite Login
          </span>
          <h2 className="font-serif italic text-3xl md:text-5xl text-[#0F172A] font-extrabold leading-tight">
            Select Your Academic Role & Portal
          </h2>
          <p className="text-base md:text-lg text-[#0F172A] font-medium leading-relaxed">
            Log in as a <strong className="text-[#991b1b] font-bold">Student</strong> using your registered USN to access course manifolds, interactive visual simulators, and single-attempt quizzes, or log in as <strong className="text-[#991b1b] font-bold">Faculty</strong> to manage permission keys and student rosters.
          </p>
        </div>

        {/* ERROR / SUCCESS NOTIFICATION BANNERS */}
        {errorMessage && (
          <div className="max-w-4xl mx-auto w-full bg-rose-50 border-2 border-rose-500 text-rose-900 p-4 rounded-xl shadow-md flex flex-wrap items-center justify-between gap-4 animate-shake">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0" />
              <div>
                <strong className="block font-mono text-xs uppercase tracking-wider text-rose-800 font-bold">Validation Error:</strong>
                <span className="text-sm md:text-base font-bold">{errorMessage}</span>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => { setRegType('student'); setIsRegistering(true); }}
                className="bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-md text-xs font-mono font-bold uppercase tracking-wider shrink-0 transition-colors"
              >
                + Register New Student
              </button>
              <button
                onClick={() => { setRegType('faculty'); setIsRegistering(true); }}
                className="bg-amber-700 hover:bg-amber-800 text-white px-3 py-1.5 rounded-md text-xs font-mono font-bold uppercase tracking-wider shrink-0 transition-colors"
              >
                + Register New Faculty
              </button>
            </div>
          </div>
        )}

        {regSuccessMsg && (
          <div className="max-w-4xl mx-auto w-full bg-emerald-50 border-2 border-emerald-500 text-emerald-900 p-4 rounded-xl shadow-md flex items-center space-x-3">
            <Check className="w-6 h-6 text-emerald-600 shrink-0 font-extrabold" />
            <span className="text-sm md:text-base font-bold">{regSuccessMsg}</span>
          </div>
        )}

        {/* STUDENT & FACULTY REGISTRATION FORM MODAL / COLLAPSIBLE */}
        {isRegistering && (
          <div className="max-w-3xl mx-auto w-full bg-amber-50/95 border-2 border-amber-400 p-6 rounded-xl shadow-lg space-y-4">
            <div className="flex justify-between items-center border-b border-amber-300 pb-3">
              <div className="flex items-center space-x-2 text-amber-900">
                <UserPlus className="w-5 h-5 text-amber-700" />
                <h3 className="font-serif italic text-xl font-bold">
                  {regType === 'student' ? 'Register New Student' : 'Register New Faculty Member'}
                </h3>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex bg-amber-200/80 p-1 rounded border border-amber-400">
                  <button
                    type="button"
                    onClick={() => setRegType('student')}
                    className={`px-3 py-1 rounded text-xs font-mono font-bold uppercase ${regType === 'student' ? 'bg-amber-900 text-white' : 'text-amber-900 hover:text-black'}`}
                  >
                    Student
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegType('faculty')}
                    className={`px-3 py-1 rounded text-xs font-mono font-bold uppercase ${regType === 'faculty' ? 'bg-[#991b1b] text-white' : 'text-amber-900 hover:text-black'}`}
                  >
                    Faculty
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setIsRegistering(false)}
                  className="text-xs font-mono font-bold uppercase text-amber-800 hover:text-black underline"
                >
                  Cancel / Close
                </button>
              </div>
            </div>

            <form onSubmit={handleRegisterNewMember} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono font-bold text-amber-900 uppercase">
                    {regType === 'student' ? 'Student USN *' : 'Faculty Employee ID *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={regUsn}
                    onChange={e => setRegUsn(e.target.value)}
                    placeholder={regType === 'student' ? "e.g. 1VT22CS004" : "e.g. FAC_CSE_104"}
                    className="w-full bg-white border border-amber-300 px-3 py-2 rounded text-sm font-mono font-bold focus:border-amber-800 outline-none text-[#0F172A]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono font-bold text-amber-900 uppercase">
                    {regType === 'student' ? 'Student Full Name *' : 'Faculty Full Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={e => setRegName(e.target.value)}
                    placeholder={regType === 'student' ? "e.g. Siddharth Rao" : "e.g. Dr. Sunitha M"}
                    className="w-full bg-white border border-amber-300 px-3 py-2 rounded text-sm font-bold focus:border-amber-800 outline-none text-[#0F172A]"
                  />
                </div>
              </div>

              {regType === 'student' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-mono font-bold text-amber-900 uppercase">Semester & Branch</label>
                    <input
                      type="text"
                      value={regSem}
                      onChange={e => setRegSem(e.target.value)}
                      placeholder="e.g. 5th Semester CSE"
                      className="w-full bg-white border border-amber-300 px-3 py-2 rounded text-sm focus:border-amber-800 outline-none text-[#0F172A]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-mono font-bold text-amber-900 uppercase">Class / Section</label>
                    <input
                      type="text"
                      value={regClass}
                      onChange={e => setRegClass(e.target.value)}
                      placeholder="e.g. CSE-A"
                      className="w-full bg-white border border-amber-300 px-3 py-2 rounded text-sm focus:border-amber-800 outline-none text-[#0F172A]"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-mono font-bold text-amber-900 uppercase">Department</label>
                    <input
                      type="text"
                      value={regFacultyDept}
                      onChange={e => setRegFacultyDept(e.target.value)}
                      placeholder="e.g. Computer Science & Engineering"
                      className="w-full bg-white border border-amber-300 px-3 py-2 rounded text-sm focus:border-amber-800 outline-none text-[#0F172A]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-mono font-bold text-amber-900 uppercase">Designation / Role</label>
                    <input
                      type="text"
                      value={regFacultyDesig}
                      onChange={e => setRegFacultyDesig(e.target.value)}
                      placeholder="e.g. Associate Professor"
                      className="w-full bg-white border border-amber-300 px-3 py-2 rounded text-sm focus:border-amber-800 outline-none text-[#0F172A]"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className={`w-full text-white font-mono text-sm font-bold uppercase tracking-wider py-3 rounded-lg shadow-md flex items-center justify-center space-x-2 ${
                  regType === 'student' ? 'bg-amber-800 hover:bg-amber-900' : 'bg-[#991b1b] hover:bg-[#7f1d1d]'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                <span>Save & Activate {regType === 'student' ? 'Student' : 'Faculty'} Immediately</span>
              </button>
            </form>
          </div>
        )}

        {/* 1-Click Demo Login Quick Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto w-full">
          {/* Quick Student Login Card */}
          <div className="bg-white border-2 border-slate-300 hover:border-[#0F172A] p-7 rounded-xl shadow-md hover:shadow-xl transition-all flex flex-col justify-between space-y-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 bg-[#0F172A] text-white text-xs font-mono font-extrabold uppercase px-4 py-1.5 rounded-bl-lg flex items-center space-x-2">
              <span>Student Portal</span>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 text-[#0F172A]">
                  <div className="p-3 bg-emerald-100 rounded-lg">
                    <GraduationCap className="w-8 h-8 text-emerald-700" />
                  </div>
                  <div>
                    <h3 className="font-serif italic text-2xl font-extrabold text-[#0F172A]">Student Roster Login</h3>
                    <p className="text-sm font-mono font-bold text-slate-700">Select or Enter Registered USN</p>
                  </div>
                </div>
              </div>

              {/* Registered Student Roster Dropdown Selector */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-mono font-extrabold text-slate-700 uppercase tracking-wider">
                    Select Active Roster Student ({studentsList.length} Registered)
                  </label>
                  <button
                    type="button"
                    onClick={loadRoster}
                    title="Refresh student roster"
                    className="text-[11px] text-slate-500 hover:text-black flex items-center space-x-1"
                  >
                    <RefreshCw className={`w-3 h-3 ${isLoadingRoster ? 'animate-spin' : ''}`} />
                    <span>Sync</span>
                  </button>
                </div>
                <select
                  value={selectedStudentUsn}
                  onChange={e => handleSelectStudentFromRoster(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-300 px-3 py-2.5 rounded-lg text-sm font-mono font-bold text-[#0F172A] focus:border-[#0F172A] outline-none"
                >
                  {studentsList.map(st => (
                    <option key={st.id} value={st.id}>
                      {st.name} ({st.id}) — {st.sem || 'CSE-A'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-slate-100 p-4 rounded-lg text-sm space-y-2 font-mono text-[#0F172A] border-2 border-slate-200">
                {(() => {
                  const activeRosterItem = studentsList.find(s => s.id.toUpperCase() === selectedStudentUsn.toUpperCase()) || studentsList[0];
                  return (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600 font-bold">Selected Student:</span>
                        <span className="font-extrabold text-[#0F172A] text-sm">{activeRosterItem ? activeRosterItem.name : '—'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600 font-bold">Verified USN:</span>
                        <span className="font-extrabold text-[#0F172A] text-base">{activeRosterItem ? activeRosterItem.id : '—'}</span>
                      </div>
                      {activeRosterItem && (
                        <div className="pt-1 flex justify-end">
                          <button
                            type="button"
                            onClick={() => handleDeleteSelectedStudent(activeRosterItem.id)}
                            className="text-xs text-rose-700 hover:text-rose-900 font-bold flex items-center space-x-1 hover:underline"
                            title="Remove student record from database"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                            <span>Remove Record</span>
                          </button>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            </div>

            <button
              onClick={handleRosterStudentLogin}
              className="w-full bg-[#0F172A] hover:bg-black text-white font-mono text-sm md:text-base font-extrabold uppercase tracking-wider py-4 rounded-lg flex items-center justify-center space-x-3 transition-colors shadow-md"
            >
              <span>
                Login as Roster Student ({
                  (studentsList.find(s => s.id.toUpperCase() === selectedStudentUsn.toUpperCase()) || studentsList[0])?.name || 'Student'
                })
              </span>
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
                  <p className="text-sm font-mono font-bold text-red-900">Select or Register Faculty Member</p>
                </div>
              </div>

              {/* Registered Faculty Dropdown Selector */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-mono font-extrabold text-red-900 uppercase tracking-wider">
                    Select Active Faculty ({facultyList.length} Available)
                  </label>
                  <button
                    type="button"
                    onClick={loadRoster}
                    title="Refresh faculty roster"
                    className="text-[11px] text-red-700 hover:text-black flex items-center space-x-1"
                  >
                    <RefreshCw className={`w-3 h-3 ${isLoadingRoster ? 'animate-spin' : ''}`} />
                    <span>Sync</span>
                  </button>
                </div>
                <select
                  value={selectedFacultyId}
                  onChange={e => handleSelectFacultyFromRoster(e.target.value)}
                  className="w-full bg-red-50 border-2 border-red-300 px-3 py-2.5 rounded-lg text-sm font-mono font-bold text-[#991b1b] focus:border-[#991b1b] outline-none"
                >
                  {facultyList.map(f => (
                    <option key={f.id} value={f.id}>
                      {f.name} ({f.id}) — {f.department}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-red-50 p-4 rounded-lg text-sm space-y-2 font-mono text-[#991b1b] border-2 border-red-200">
                {(() => {
                  const activeFacultyItem = facultyList.find(f => f.id.toUpperCase() === selectedFacultyId.toUpperCase()) || facultyList[0];
                  return (
                    <>
                      <div className="flex justify-between">
                        <span className="text-red-700 font-bold">Selected Faculty:</span>
                        <span className="font-extrabold text-[#991b1b] text-sm">{activeFacultyItem ? activeFacultyItem.name : 'Prof. Dr. Pushpa Mohan'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-red-700 font-bold">Faculty ID:</span>
                        <span className="font-extrabold text-[#991b1b] text-base">{activeFacultyItem ? activeFacultyItem.id : 'FAC_CSE_101'}</span>
                      </div>
                    </>
                  );
                })()}
              </div>

              <ul className="text-sm text-[#0F172A] font-semibold space-y-2 pt-1">
                <li className="flex items-center space-x-2.5">
                  <Check className="w-5 h-5 text-[#991b1b] shrink-0 font-bold" />
                  <span>Add & Register New Students to Roster</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <Check className="w-5 h-5 text-[#991b1b] shrink-0 font-bold" />
                  <span>Toggle Permission for Student Q-Bank Answer Keys</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <Check className="w-5 h-5 text-[#991b1b] shrink-0 font-bold" />
                  <span>View Master Student Quiz Scores & Export CSV Logs</span>
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <button
                onClick={handleRosterFacultyLogin}
                className="w-full bg-[#991b1b] hover:bg-[#7f1d1d] text-white font-mono text-sm md:text-base font-extrabold uppercase tracking-wider py-4 rounded-lg flex items-center justify-center space-x-3 transition-colors shadow-md"
              >
                <span>
                  Login as Faculty ({
                    (facultyList.find(f => f.id.toUpperCase() === selectedFacultyId.toUpperCase()) || facultyList[0])?.name || 'Faculty'
                  })
                </span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={() => { setRegType('faculty'); setIsRegistering(true); }}
                className="w-full bg-red-100 hover:bg-red-200 text-[#991b1b] border border-red-300 py-2 rounded-lg font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-colors"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>+ Register New Faculty Member</span>
              </button>
            </div>
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
                onClick={() => { setActiveTab('student'); setErrorMessage(null); }}
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
                onClick={() => { setActiveTab('faculty'); setErrorMessage(null); }}
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

          {/* Explanation Banner: Purpose of Custom Institutional Credentials */}
          <div className="bg-sky-50 border-2 border-sky-300 p-4 rounded-xl text-xs md:text-sm text-sky-950 space-y-1">
            <div className="font-mono font-extrabold uppercase tracking-wider text-sky-900 flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-sky-700 shrink-0" />
              <span>What is Custom Institutional Credentials?</span>
            </div>
            <p className="font-medium leading-relaxed">
              This form allows any student or faculty member to sign in directly using their custom USN or Employee ID.
              If your ID is already registered, you will be logged in immediately.
              If you are a <strong>new student or faculty member</strong>, entering your ID and Full Name will <strong>automatically register you to the roster</strong> and sign you in in one click!
            </p>
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
                    onChange={e => handleStudentIdInputChange(e.target.value)}
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

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#0F172A] hover:bg-black text-white font-mono text-sm md:text-base font-extrabold uppercase tracking-wider py-3.5 rounded-lg shadow-md flex items-center justify-center space-x-2"
                >
                  <Check className="w-5 h-5 text-emerald-400" />
                  <span>Enter Portal as Student ({studentId || 'USN'})</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setRegType('student'); setIsRegistering(true); }}
                  className="bg-slate-100 hover:bg-slate-200 text-[#0F172A] border-2 border-slate-300 px-4 py-3 rounded-lg font-mono text-xs font-extrabold uppercase tracking-wider flex items-center justify-center space-x-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>+ Register New Student</span>
                </button>
              </div>
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
                    onChange={e => handleFacultyIdInputChange(e.target.value)}
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

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#991b1b] hover:bg-[#7f1d1d] text-white font-mono text-sm md:text-base font-extrabold uppercase tracking-wider py-3.5 rounded-lg shadow-md flex items-center justify-center space-x-2"
                >
                  <Check className="w-5 h-5 text-amber-300" />
                  <span>Enter Portal as Faculty ({facultyId || 'ID'})</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setRegType('faculty'); setIsRegistering(true); }}
                  className="bg-red-50 hover:bg-red-100 text-[#991b1b] border-2 border-red-300 px-4 py-3 rounded-lg font-mono text-xs font-extrabold uppercase tracking-wider flex items-center justify-center space-x-2"
                >
                  <UserPlus className="w-4 h-4 text-[#991b1b]" />
                  <span>+ Register New Faculty</span>
                </button>
              </div>
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

