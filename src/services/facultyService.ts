export interface FacultyRecord {
  id: string; // Faculty ID (e.g. FAC_CSE_101)
  name: string;
  department: string;
  designation?: string;
  addedAt?: string;
}

export const INITIAL_FACULTY_ROSTER: FacultyRecord[] = [
  {
    id: 'FAC_CSE_101',
    name: 'Prof. Dr. Pushpa Mohan',
    department: 'Computer Science & Engineering',
    designation: 'Professor & HOD'
  },
  {
    id: 'FAC_CSE_102',
    name: 'Dr. Rajesh Kumar',
    department: 'Computer Science & Engineering',
    designation: 'Associate Professor'
  },
  {
    id: 'FAC_ISE_103',
    name: 'Prof. Anitha Rao',
    department: 'Information Science & Engineering',
    designation: 'Assistant Professor'
  },
  {
    id: 'FAC_CSE_104',
    name: 'Dr. Suresh Babu',
    department: 'Computer Science & Engineering',
    designation: 'Professor'
  },
  {
    id: 'FAC_ISE_105',
    name: 'Prof. Priya Sharma',
    department: 'Information Science & Engineering',
    designation: 'Associate Professor'
  },
  {
    id: 'FAC_AI_106',
    name: 'Dr. Ramesh V.',
    department: 'Artificial Intelligence & Data Science',
    designation: 'Professor & Chair'
  }
];

const LOCAL_STORAGE_KEY = 'vtu_registered_faculty';

export const getStoredFaculty = (): FacultyRecord[] => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Error reading stored faculty:", e);
  }
  return INITIAL_FACULTY_ROSTER;
};

export const saveStoredFacultyLocally = (facultyList: FacultyRecord[]) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(facultyList));
  } catch (e) {
    console.error("Error saving faculty to localStorage:", e);
  }
};

export const fetchFaculty = async (): Promise<FacultyRecord[]> => {
  try {
    const res = await fetch(`/api/faculty?t=${Date.now()}`);
    if (res.ok) {
      const data = await res.json();
      let serverFaculty: FacultyRecord[] = [];
      if (Array.isArray(data)) {
        serverFaculty = data;
      } else if (data && Array.isArray(data.faculty)) {
        serverFaculty = data.faculty;
      }

      if (serverFaculty.length > 0) {
        const local = getStoredFaculty();
        const mergedMap = new Map<string, FacultyRecord>();

        local.forEach(f => mergedMap.set(f.id.toUpperCase(), f));
        serverFaculty.forEach(f => mergedMap.set(f.id.toUpperCase(), f));

        const mergedList = Array.from(mergedMap.values());
        saveStoredFacultyLocally(mergedList);
        return mergedList;
      }
    }
  } catch (e) {
    console.warn("API /api/faculty fetch failed, using local storage faculty roster:", e);
  }
  return getStoredFaculty();
};

export const addFacultyToRoster = async (
  newFaculty: FacultyRecord
): Promise<{ success: boolean; facultyMember?: FacultyRecord; facultyList: FacultyRecord[]; error?: string }> => {
  const normalizedId = (newFaculty.id || '').trim().toUpperCase();
  const normalizedName = (newFaculty.name || '').trim();

  if (!normalizedId || !normalizedName) {
    return {
      success: false,
      facultyList: getStoredFaculty(),
      error: 'Please provide both a valid Faculty Employee ID and Full Name.'
    };
  }

  const formatted: FacultyRecord = {
    id: normalizedId,
    name: normalizedName,
    department: (newFaculty.department || 'Computer Science & Engineering').trim(),
    designation: (newFaculty.designation || 'Professor / Faculty Member').trim(),
    addedAt: new Date().toISOString().slice(0, 10)
  };

  // 1. Update local state immediately
  const currentList = getStoredFaculty();
  const existingIdx = currentList.findIndex(f => f.id.toUpperCase() === normalizedId);
  let updatedList: FacultyRecord[] = [];

  if (existingIdx >= 0) {
    updatedList = [...currentList];
    updatedList[existingIdx] = formatted;
  } else {
    updatedList = [formatted, ...currentList];
  }

  saveStoredFacultyLocally(updatedList);

  // Notify UI subscribers
  window.dispatchEvent(new CustomEvent('vtu-faculty-updated', { detail: updatedList }));

  // 2. Persist to Backend API
  try {
    const res = await fetch('/api/faculty', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formatted)
    });

    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.faculty)) {
        saveStoredFacultyLocally(data.faculty);
        window.dispatchEvent(new CustomEvent('vtu-faculty-updated', { detail: data.faculty }));
        return { success: true, facultyMember: formatted, facultyList: data.faculty };
      }
    }
  } catch (e) {
    console.warn("POST /api/faculty background save notice:", e);
  }

  return { success: true, facultyMember: formatted, facultyList: updatedList };
};

export const validateFaculty = (
  id: string,
  facultyList: FacultyRecord[]
): FacultyRecord | null => {
  if (!id) return null;
  const clean = id.trim().toUpperCase();
  if (!clean) return null;
  const match = facultyList.find(f => f.id.toUpperCase() === clean);
  return match || null;
};
