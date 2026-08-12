import type { Request, Response } from 'express';

export interface StudentRecord {
  id: string; // USN (uppercase)
  name: string;
  sem?: string;
  className?: string;
  assignedFaculty?: string;
  addedAt?: string;
}

let serverlessStudentsCache: StudentRecord[] = [
  {
    id: '1VT22CS001',
    name: 'Rahul Sharma',
    sem: '5th Semester CSE',
    className: 'CSE-A',
    assignedFaculty: 'Prof. Dr. Pushpa Mohan'
  },
  {
    id: '1VT22CS002',
    name: 'Priya Ananth',
    sem: '5th Semester CSE',
    className: 'CSE-A',
    assignedFaculty: 'Prof. Dr. Pushpa Mohan'
  },
  {
    id: '1VT22CS003',
    name: 'Karthik V',
    sem: '5th Semester CSE',
    className: 'CSE-B',
    assignedFaculty: 'Prof. Dr. Pushpa Mohan'
  }
];

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function parseCsvToStudents(csvText: string): StudentRecord[] {
  const lines = csvText.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length === 0) return [];

  let startIdx = 0;
  if (lines[0].toLowerCase().includes('usn') || lines[0].toLowerCase().includes('student')) {
    startIdx = 1;
  }

  const studentsMap = new Map<string, StudentRecord>();
  for (let i = startIdx; i < lines.length; i++) {
    const cols = parseCsvLine(lines[i]);
    if (cols.length >= 2) {
      const id = (cols[0] || '').trim().toUpperCase();
      const name = (cols[1] || '').trim();
      const sem = (cols[2] || '5th Semester CSE').trim();
      const className = (cols[3] || 'CSE-A').trim();
      const assignedFaculty = (cols[4] || 'Prof. Dr. Pushpa Mohan').trim();

      if (id && name) {
        studentsMap.set(id, {
          id,
          name,
          sem,
          className,
          assignedFaculty
        });
      }
    }
  }
  return Array.from(studentsMap.values());
}

async function fetchStudentsFromGitHub(): Promise<{ content: string; sha?: string } | null> {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const GITHUB_OWNER = process.env.GITHUB_OWNER;
  const GITHUB_REPO = process.env.GITHUB_REPO;
  const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';

  if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
    return null;
  }

  const timestamp = Date.now();
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/students.csv?ref=${GITHUB_BRANCH}&t=${timestamp}`;
  try {
    const res = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Vercel-Students-App',
        'Cache-Control': 'no-cache, no-store'
      }
    });

    if (res.status === 404) {
      return {
        content: "USN,Student Name,Semester,Class,Assigned Faculty\n"
      };
    }

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    if (data && data.content) {
      const decoded = Buffer.from(data.content, 'base64').toString('utf-8');
      return { content: decoded, sha: data.sha };
    }
  } catch (e) {
    console.error("fetchStudentsFromGitHub error:", e);
  }
  return null;
}

async function upsertStudentToGitHubCSV(student: StudentRecord): Promise<StudentRecord[] | null> {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const GITHUB_OWNER = process.env.GITHUB_OWNER;
  const GITHUB_REPO = process.env.GITHUB_REPO;
  const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';

  if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
    return null;
  }

  const maxRetries = 3;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const githubFile = await fetchStudentsFromGitHub();
      let currentStudents = githubFile ? parseCsvToStudents(githubFile.content) : [];

      // Merge defaults if empty
      if (currentStudents.length === 0) {
        currentStudents = [...serverlessStudentsCache];
      }

      const targetId = student.id.toUpperCase();
      const matchIndex = currentStudents.findIndex(s => s.id.toUpperCase() === targetId);

      if (matchIndex >= 0) {
        currentStudents[matchIndex] = { ...currentStudents[matchIndex], ...student };
      } else {
        currentStudents.unshift(student);
      }

      let csvContent = "USN,Student Name,Semester,Class,Assigned Faculty\n";
      currentStudents.forEach(s => {
        csvContent += `"${s.id.replace(/"/g, '""')}","${s.name.replace(/"/g, '""')}","${(s.sem || '5th Semester CSE').replace(/"/g, '""')}","${(s.className || 'CSE-A').replace(/"/g, '""')}","${(s.assignedFaculty || 'Prof. Dr. Pushpa Mohan').replace(/"/g, '""')}"\n`;
      });

      const encodedContent = Buffer.from(csvContent, 'utf-8').toString('base64');
      const putUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/students.csv`;

      const bodyPayload: any = {
        message: `Register student: ${student.name} (${student.id})`,
        content: encodedContent,
        branch: GITHUB_BRANCH
      };
      if (githubFile && githubFile.sha) {
        bodyPayload.sha = githubFile.sha;
      }

      const putRes = await fetch(putUrl, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
          'User-Agent': 'Vercel-Students-App'
        },
        body: JSON.stringify(bodyPayload)
      });

      if (putRes.ok) {
        return currentStudents;
      }
    } catch (err) {
      console.error("upsertStudentToGitHubCSV error:", err);
    }
  }
  return null;
}

export default async function handler(req: Request, res: Response) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    try {
      const githubFile = await fetchStudentsFromGitHub();
      if (githubFile) {
        const ghStudents = parseCsvToStudents(githubFile.content);
        if (ghStudents.length > 0) {
          // Merge cache
          const mergedMap = new Map<string, StudentRecord>();
          serverlessStudentsCache.forEach(s => mergedMap.set(s.id.toUpperCase(), s));
          ghStudents.forEach(s => mergedMap.set(s.id.toUpperCase(), s));
          serverlessStudentsCache = Array.from(mergedMap.values());
        }
      }
      return res.status(200).json({ students: serverlessStudentsCache });
    } catch (e: any) {
      return res.status(200).json({ students: serverlessStudentsCache });
    }
  }

  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { id, name, sem, className, assignedFaculty } = body || {};

      if (!id || !name) {
        return res.status(400).json({ error: "Missing required Student USN (id) or Full Name (name)" });
      }

      const newStudent: StudentRecord = {
        id: id.trim().toUpperCase(),
        name: name.trim(),
        sem: sem ? sem.trim() : '5th Semester CSE',
        className: className ? className.trim() : 'CSE-A',
        assignedFaculty: assignedFaculty ? assignedFaculty.trim() : 'Prof. Dr. Pushpa Mohan',
        addedAt: new Date().toISOString().slice(0, 10)
      };

      const ghList = await upsertStudentToGitHubCSV(newStudent);
      if (ghList) {
        serverlessStudentsCache = ghList;
        return res.status(200).json({ success: true, student: newStudent, students: ghList });
      }

      const matchIdx = serverlessStudentsCache.findIndex(s => s.id.toUpperCase() === newStudent.id);
      if (matchIdx >= 0) {
        serverlessStudentsCache[matchIdx] = newStudent;
      } else {
        serverlessStudentsCache.unshift(newStudent);
      }

      return res.status(200).json({ success: true, student: newStudent, students: serverlessStudentsCache });
    } catch (e: any) {
      return res.status(500).json({ error: e.message || "Failed to save student" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
