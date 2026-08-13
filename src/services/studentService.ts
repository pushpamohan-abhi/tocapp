import { UserProfile } from '../types';

export interface StudentRecord {
  id: string; // USN (uppercase)
  name: string;
  sem?: string;
  className?: string;
  assignedFaculty?: string;
  addedAt?: string;
}

export const INITIAL_STUDENT_ROSTER: StudentRecord[] = [];

const LOCAL_STORAGE_KEY = 'vtu_registered_students';

export const getStoredStudents = (): StudentRecord[] => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.filter(s =>
          s && s.id &&
          !['1VT22CS001', '1VT22CS002', '1VT22CS003'].includes(s.id.toUpperCase()) &&
          !['RAHUL SHARMA', 'PRIYA ANANTH', 'KARTHIK V'].includes((s.name || '').toUpperCase())
        );
      }
    }
  } catch (e) {
    console.error("Error reading stored students:", e);
  }
  return INITIAL_STUDENT_ROSTER;
};

export const saveStoredStudentsLocally = (students: StudentRecord[]) => {
  try {
    const cleanList = students.filter(s =>
      s && s.id &&
      !['1VT22CS001', '1VT22CS002', '1VT22CS003'].includes(s.id.toUpperCase()) &&
      !['RAHUL SHARMA', 'PRIYA ANANTH', 'KARTHIK V'].includes((s.name || '').toUpperCase())
    );
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cleanList));
  } catch (e) {
    console.error("Error saving students to localStorage:", e);
  }
};

export const fetchStudents = async (): Promise<StudentRecord[]> => {
  try {
    const res = await fetch(`/api/students?t=${Date.now()}`);
    if (res.ok) {
      const data = await res.json();
      let serverStudents: StudentRecord[] = [];
      if (Array.isArray(data)) {
        serverStudents = data;
      } else if (data && Array.isArray(data.students)) {
        serverStudents = data.students;
      }

      // Filter out any old test student records
      const cleanStudents = serverStudents.filter(s =>
        s && s.id &&
        !['1VT22CS001', '1VT22CS002', '1VT22CS003'].includes(s.id.toUpperCase()) &&
        !['RAHUL SHARMA', 'PRIYA ANANTH', 'KARTHIK V'].includes((s.name || '').toUpperCase())
      );

      // Overwrite local storage directly with clean server roster
      saveStoredStudentsLocally(cleanStudents);
      return cleanStudents;
    }
  } catch (e) {
    console.warn("API /api/students fetch failed, using local storage roster:", e);
  }
  return getStoredStudents();
};

export const addStudentToRoster = async (
  newStudent: StudentRecord
): Promise<{ success: boolean; student?: StudentRecord; students: StudentRecord[]; error?: string }> => {
  const normalizedUsn = (newStudent.id || '').trim().toUpperCase();
  const normalizedName = (newStudent.name || '').trim();

  if (!normalizedUsn || !normalizedName) {
    return {
      success: false,
      students: getStoredStudents(),
      error: 'Please provide both a valid Student USN and Student Full Name.'
    };
  }

  const formatted: StudentRecord = {
    id: normalizedUsn,
    name: normalizedName,
    sem: (newStudent.sem || '5th Semester CSE').trim(),
    className: (newStudent.className || 'CSE-A').trim(),
    assignedFaculty: (newStudent.assignedFaculty || 'Prof. Dr. Pushpa Mohan').trim(),
    addedAt: new Date().toISOString().slice(0, 10)
  };

  // 1. Update local state immediately
  const currentList = getStoredStudents();
  const existingIdx = currentList.findIndex(s => s.id.toUpperCase() === normalizedUsn);
  let updatedList: StudentRecord[] = [];

  if (existingIdx >= 0) {
    updatedList = [...currentList];
    updatedList[existingIdx] = formatted;
  } else {
    updatedList = [formatted, ...currentList];
  }

  saveStoredStudentsLocally(updatedList);

  // Notify UI subscribers
  window.dispatchEvent(new CustomEvent('vtu-students-updated', { detail: updatedList }));

  // 2. Persist to Backend API
  try {
    const res = await fetch('/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formatted)
    });

    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.students)) {
        saveStoredStudentsLocally(data.students);
        window.dispatchEvent(new CustomEvent('vtu-students-updated', { detail: data.students }));
        return { success: true, student: formatted, students: data.students };
      }
    }
  } catch (e) {
    console.warn("POST /api/students background save notice:", e);
  }

  return { success: true, student: formatted, students: updatedList };
};

export const validateStudent = (
  usn: string,
  studentList: StudentRecord[]
): StudentRecord | null => {
  if (!usn) return null;
  const clean = usn.trim().toUpperCase();
  if (!clean) return null;
  const match = studentList.find(s => s.id.toUpperCase() === clean);
  return match || null;
};

export const deleteStudentFromRoster = async (usn: string): Promise<StudentRecord[]> => {
  const cleanUsn = usn.trim().toUpperCase();
  const currentList = getStoredStudents();
  const updatedList = currentList.filter(s => s.id.toUpperCase() !== cleanUsn);

  saveStoredStudentsLocally(updatedList);
  window.dispatchEvent(new CustomEvent('vtu-students-updated', { detail: updatedList }));

  try {
    const res = await fetch(`/api/students?id=${encodeURIComponent(cleanUsn)}`, {
      method: 'DELETE'
    });
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.students)) {
        const cleanServer = data.students.filter((s: StudentRecord) =>
          s && s.id &&
          !['1VT22CS001', '1VT22CS002', '1VT22CS003'].includes(s.id.toUpperCase()) &&
          !['RAHUL SHARMA', 'PRIYA ANANTH', 'KARTHIK V'].includes((s.name || '').toUpperCase())
        );
        saveStoredStudentsLocally(cleanServer);
        window.dispatchEvent(new CustomEvent('vtu-students-updated', { detail: cleanServer }));
        return cleanServer;
      }
    }
  } catch (e) {
    console.warn("DELETE /api/students background call notice:", e);
  }

  return updatedList;
};
