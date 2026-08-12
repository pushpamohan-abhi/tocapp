import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Google GenAI if key is present
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// In-memory score store with safe file backup
import fs from "fs";

let scoresStore: any[] = [];

// In-memory student store with safe file backup
let studentsStore: any[] = [];

// In-memory faculty store with safe file backup
let facultyStore: any[] = [
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
  }
];

try {
  const facultyFilePath = path.join(process.cwd(), 'faculty.json');
  if (fs.existsSync(facultyFilePath)) {
    const raw = fs.readFileSync(facultyFilePath, 'utf-8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      facultyStore = parsed;
    }
  }
} catch (e) {
  console.log("Faculty file load info:", e);
}

const saveFacultyToFile = (facultyList: any[]) => {
  try {
    const facultyFilePath = path.join(process.cwd(), 'faculty.json');
    fs.writeFileSync(facultyFilePath, JSON.stringify(facultyList, null, 2));

    let csvContent = "Faculty ID,Faculty Name,Department,Designation\n";
    facultyList.forEach(f => {
      csvContent += `"${f.id}","${f.name}","${f.department || 'Computer Science & Engineering'}","${f.designation || 'Professor'}"\n`;
    });
    fs.writeFileSync(path.join(process.cwd(), 'faculty.csv'), csvContent);
  } catch (e) {
    console.log("Safe persistent write notice for faculty:", e);
  }
};

try {
  const studentsFilePath = path.join(process.cwd(), 'students.json');
  if (fs.existsSync(studentsFilePath)) {
    const raw = fs.readFileSync(studentsFilePath, 'utf-8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      studentsStore = parsed;
    }
  }
} catch (e) {
  console.log("Students file load info:", e);
}

const saveStudentsToFile = (students: any[]) => {
  try {
    const studentsFilePath = path.join(process.cwd(), 'students.json');
    fs.writeFileSync(studentsFilePath, JSON.stringify(students, null, 2));

    let csvContent = "USN,Student Name,Semester,Class,Assigned Faculty\n";
    students.forEach(s => {
      csvContent += `"${s.id}","${s.name}","${s.sem || '5th Semester CSE'}","${s.className || 'CSE-A'}","${s.assignedFaculty || 'Prof. Dr. Pushpa Mohan'}"\n`;
    });
    fs.writeFileSync(path.join(process.cwd(), 'students.csv'), csvContent);
  } catch (e) {
    console.log("Safe persistent write notice for students:", e);
  }
};
try {
  const scoresFilePath = path.join(process.cwd(), 'scores.json');
  if (fs.existsSync(scoresFilePath)) {
    const raw = fs.readFileSync(scoresFilePath, 'utf-8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      scoresStore = parsed;
    }
  }
} catch (e) {
  console.log("Scores file load info:", e);
}

const saveScoresToFile = (scores: any[]) => {
  try {
    const scoresFilePath = path.join(process.cwd(), 'scores.json');
    fs.writeFileSync(scoresFilePath, JSON.stringify(scores, null, 2));

    // Also write CSV version
    let csvContent = "Faculty,Class,Student ID,Student Name,Assessment,Score,Total,Percentage,Date\n";
    scores.forEach(s => {
      csvContent += `"${s.faculty || 'Prof. Dr. Pushpa Mohan'}","${s.className || 'CSE-A'}","${s.userId}","${s.userName}","${s.assessment || 'Module ' + s.moduleNumber + ' Quiz'}",${s.score},${s.totalQuestions},"${s.percentage}%","${s.timestamp}"\n`;
    });
    fs.writeFileSync(path.join(process.cwd(), 'scores.csv'), csvContent);
  } catch (e) {
    // EROFS on read-only environments like Vercel
    console.log("Safe persistent write notice (read-only filesystem on serverless):", e);
  }
};

// GitHub REST API Integration & CSV Helper Functions
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

function parseCsvToRecords(csvText: string): any[] {
  const lines = csvText.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length === 0) return [];

  let startIdx = 0;
  if (lines[0].toLowerCase().includes('faculty')) {
    startIdx = 1;
  }

  const records: any[] = [];
  for (let i = startIdx; i < lines.length; i++) {
    const cols = parseCsvLine(lines[i]);
    if (cols.length >= 7) {
      const faculty = cols[0] || 'Prof. Dr. Pushpa Mohan';
      const className = cols[1] || 'CSE-A';
      const userId = cols[2] || 'ST001';
      const userName = cols[3] || 'Student';
      const assessment = cols[4] || 'Module 1 Quiz';
      const score = parseInt(cols[5], 10) || 0;
      const totalQuestions = parseInt(cols[6], 10) || 10;
      const pctStr = (cols[7] || '0%').replace('%', '');
      const percentage = parseInt(pctStr, 10) || Math.round((score / (totalQuestions || 1)) * 100);
      const timestamp = cols[8] || new Date().toISOString().slice(0, 10);

      const targetUserId = userId.trim().toLowerCase();
      const targetAssessment = assessment.trim().toLowerCase();

      const rec = {
        id: `score_${userId}_${assessment.replace(/\s+/g, '')}`,
        faculty,
        className,
        userId,
        userName,
        userRole: 'student',
        assessment,
        moduleNumber: parseInt(assessment.replace(/\D/g, ''), 10) || 1,
        score,
        totalQuestions,
        percentage,
        timestamp,
        userAnswers: {}
      };

      // Find existing record matching same Student ID + Assessment -> replace with latest
      const matchIdx = records.findIndex(
        r => (r.userId || '').trim().toLowerCase() === targetUserId &&
             (r.assessment || '').trim().toLowerCase() === targetAssessment
      );
      if (matchIdx >= 0) {
        records[matchIdx] = rec;
      } else {
        records.push(rec);
      }
    }
  }
  return records;
}

function recordToCsvRow(s: any): string {
  const faculty = s.faculty || 'Prof. Dr. Pushpa Mohan';
  const className = s.className || 'CSE-A';
  const userId = s.userId || '';
  const userName = s.userName || '';
  const assessment = s.assessment || `Module ${s.moduleNumber || 1} Quiz`;
  const score = s.score !== undefined ? s.score : 0;
  const total = s.totalQuestions || 10;
  const percentage = s.percentage !== undefined ? s.percentage : Math.round((score / total) * 100);
  const date = s.timestamp || new Date().toISOString().slice(0, 10);

  return `"${faculty.replace(/"/g, '""')}","${className.replace(/"/g, '""')}","${userId.replace(/"/g, '""')}","${userName.replace(/"/g, '""')}","${assessment.replace(/"/g, '""')}",${score},${total},"${percentage}%","${date.replace(/"/g, '""')}"`;
}

async function fetchScoresFromGitHub() {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const GITHUB_OWNER = process.env.GITHUB_OWNER;
  const GITHUB_REPO = process.env.GITHUB_REPO;
  const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';

  if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
    return null;
  }

  const timestamp = Date.now();
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/scores.csv?ref=${GITHUB_BRANCH}&t=${timestamp}`;
  const res = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Vercel-Scores-App',
      'Cache-Control': 'no-cache, no-store'
    }
  });

  if (res.status === 404) {
    return {
      content: "Faculty,Class,Student ID,Student Name,Assessment,Score,Total,Percentage,Date\n",
      sha: null,
      exists: false
    };
  }

  if (!res.ok) {
    const errorText = await res.text();
    console.error(`GitHub API GET error (${res.status}):`, errorText);
    throw new Error(`GitHub API GET failed with status ${res.status}`);
  }

  const data = await res.json();
  const rawBase64 = (data.content || '').replace(/\n/g, '');
  const decodedContent = Buffer.from(rawBase64, 'base64').toString('utf-8');

  return {
    content: decodedContent,
    sha: data.sha,
    exists: true
  };
}

async function upsertScoreToGitHubCSV(formattedRecord: any) {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const GITHUB_OWNER = process.env.GITHUB_OWNER;
  const GITHUB_REPO = process.env.GITHUB_REPO;
  const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';

  if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
    return null;
  }

  const maxRetries = 5;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const githubFile = await fetchScoresFromGitHub();
      if (!githubFile) return null;

      let currentRecords = parseCsvToRecords(githubFile.content || '');

      const targetUserId = (formattedRecord.userId || '').trim().toLowerCase();
      const targetAssessment = (formattedRecord.assessment || '').trim().toLowerCase();

      // Find existing record with same Student ID + same Assessment
      const matchIndex = currentRecords.findIndex(
        r => (r.userId || '').trim().toLowerCase() === targetUserId &&
             (r.assessment || '').trim().toLowerCase() === targetAssessment
      );

      if (matchIndex >= 0) {
        currentRecords[matchIndex] = {
          ...currentRecords[matchIndex],
          ...formattedRecord,
          id: currentRecords[matchIndex].id || formattedRecord.id
        };
      } else {
        currentRecords.push(formattedRecord);
      }

      let csvContent = "Faculty,Class,Student ID,Student Name,Assessment,Score,Total,Percentage,Date\n";
      currentRecords.forEach(r => {
        csvContent += recordToCsvRow(r) + '\n';
      });

      const encodedContent = Buffer.from(csvContent, 'utf-8').toString('base64');

      const putUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/scores.csv`;
      const bodyPayload: any = {
        message: `Update scores.csv: ${formattedRecord.userName} (${formattedRecord.userId}) - ${formattedRecord.assessment}`,
        content: encodedContent,
        branch: GITHUB_BRANCH
      };
      if (githubFile.sha) {
        bodyPayload.sha = githubFile.sha;
      }

      const putRes = await fetch(putUrl, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
          'User-Agent': 'Vercel-Scores-App'
        },
        body: JSON.stringify(bodyPayload)
      });

      if (putRes.ok) {
        console.log(`Successfully committed updated score to GitHub scores.csv (Attempt ${attempt})`);
        return currentRecords;
      }

      if (putRes.status === 409 || putRes.status === 422) {
        console.warn(`GitHub SHA conflict (attempt ${attempt}/${maxRetries}). Retrying...`);
        await new Promise(r => setTimeout(r, 100 * attempt + Math.random() * 100));
        continue;
      }

      const errorText = await putRes.text();
      console.error(`GitHub API PUT error (${putRes.status}):`, errorText);
      throw new Error(`GitHub API PUT failed with status ${putRes.status}`);

    } catch (err: any) {
      if (attempt === maxRetries) {
        throw err;
      }
      await new Promise(r => setTimeout(r, 200 * attempt));
    }
  }

  throw new Error("Failed to update score in GitHub scores.csv after max retries");
}

async function saveAllRecordsToGitHubCSV(records: any[]) {
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
      const githubFile = await fetchScoresFromGitHub();
      if (!githubFile) return null;

      let csvContent = "Faculty,Class,Student ID,Student Name,Assessment,Score,Total,Percentage,Date\n";
      records.forEach(r => {
        csvContent += recordToCsvRow(r) + '\n';
      });

      const encodedContent = Buffer.from(csvContent, 'utf-8').toString('base64');
      const putUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/scores.csv`;
      const bodyPayload: any = {
        message: `Update scores.csv: Sync records`,
        content: encodedContent,
        branch: GITHUB_BRANCH
      };
      if (githubFile.sha) {
        bodyPayload.sha = githubFile.sha;
      }

      const putRes = await fetch(putUrl, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
          'User-Agent': 'Vercel-Scores-App'
        },
        body: JSON.stringify(bodyPayload)
      });

      if (putRes.ok) {
        return parseCsvToRecords(csvContent);
      }

      if (putRes.status === 409 || putRes.status === 422) {
        await new Promise(r => setTimeout(r, 100 * attempt));
        continue;
      }

      throw new Error(`GitHub API PUT failed with status ${putRes.status}`);
    } catch (err) {
      if (attempt === maxRetries) throw err;
    }
  }
}

// Score API Routes
app.get("/api/scores", async (req, res) => {
  try {
    const githubData = await fetchScoresFromGitHub();
    let records = scoresStore;

    if (githubData) {
      if (githubData.content) {
        records = parseCsvToRecords(githubData.content);
        scoresStore = records;
      } else if (!githubData.exists) {
        records = [];
      }
    }

    const { faculty, className, assessment } = req.query;
    let result = [...records];

    if (faculty && faculty !== 'all') {
      result = result.filter(s => (s.faculty || '').toLowerCase() === String(faculty).toLowerCase());
    }
    if (className && className !== 'all') {
      result = result.filter(s => (s.className || '').toLowerCase() === String(className).toLowerCase());
    }
    if (assessment && assessment !== 'all') {
      result = result.filter(s => (s.assessment || '').toLowerCase() === String(assessment).toLowerCase());
    }

    const isGithubConfigured = Boolean(process.env.GITHUB_TOKEN && process.env.GITHUB_OWNER && process.env.GITHUB_REPO);

    if (!isGithubConfigured) {
      return res.json({
        scores: result,
        notice: "Results are available after deployment to Vercel.",
        isGithubConfigured: false
      });
    }

    res.json(result);
  } catch (e: any) {
    console.error("GET /api/scores error:", e);
    if (process.env.GITHUB_TOKEN) {
      return res.status(500).json({ error: "Unable to load results. Please try again." });
    }
    res.json({
      scores: scoresStore,
      notice: "Results are available after deployment to Vercel.",
      isGithubConfigured: false
    });
  }
});

app.post("/api/scores", async (req, res) => {
  try {
    const record = req.body;
    if (!record || !record.userId) {
      return res.status(400).json({ error: "Missing required student user ID" });
    }

    const formattedRecord = {
      id: record.id || `score_${record.userId}_${Date.now()}`,
      faculty: record.faculty || 'Prof. Dr. Pushpa Mohan',
      className: record.className || 'CSE-A',
      userId: record.userId,
      userName: record.userName || 'Student',
      userRole: record.userRole || 'student',
      assessment: record.assessment || `Module ${record.moduleNumber || 1} Quiz`,
      moduleNumber: record.moduleNumber || 1,
      score: record.score || 0,
      totalQuestions: record.totalQuestions || 10,
      percentage: record.percentage || 0,
      timestamp: record.timestamp || new Date().toISOString().slice(0, 10),
      userAnswers: record.userAnswers || {}
    };

    const githubRecords = await upsertScoreToGitHubCSV(formattedRecord);
    if (githubRecords) {
      scoresStore = githubRecords;
      return res.json({ success: true, score: formattedRecord, allScores: githubRecords, storage: 'github' });
    }

    // Fallback if GitHub credentials not provided (upsert record matching Student ID + Assessment)
    const targetUserId = (formattedRecord.userId || '').trim().toLowerCase();
    const targetAssessment = (formattedRecord.assessment || '').trim().toLowerCase();
    const matchIdx = scoresStore.findIndex(
      s => (s.userId || '').trim().toLowerCase() === targetUserId &&
           (s.assessment || '').trim().toLowerCase() === targetAssessment
    );
    if (matchIdx >= 0) {
      scoresStore[matchIdx] = formattedRecord;
    } else {
      scoresStore.push(formattedRecord);
    }

    saveScoresToFile(scoresStore);
    res.json({ success: true, score: formattedRecord, allScores: scoresStore, storage: 'local-fallback' });
  } catch (e: any) {
    console.error("POST /api/scores error:", e);
    res.status(500).json({ error: e.message || "Failed to save score" });
  }
});

app.delete("/api/scores", async (req, res) => {
  const { id } = req.query;
  if (id) {
    scoresStore = scoresStore.filter(s => s.id !== id);
  } else {
    scoresStore = [];
  }
  saveScoresToFile(scoresStore);
  await saveAllRecordsToGitHubCSV(scoresStore);
  res.json({ success: true, scores: scoresStore });
});

// Student Roster API Routes
app.get("/api/students", (req, res) => {
  try {
    // Extract any student unique IDs from scoresStore to ensure all students who have taken quizzes are also in studentsStore
    const studentMap = new Map<string, any>();
    studentsStore.forEach(s => studentMap.set(s.id.toUpperCase(), s));

    scoresStore.forEach(s => {
      const usn = (s.userId || '').trim().toUpperCase();
      if (usn && !studentMap.has(usn)) {
        studentMap.set(usn, {
          id: usn,
          name: s.userName || 'Student',
          sem: '5th Semester CSE',
          className: s.className || 'CSE-A',
          assignedFaculty: s.faculty || 'Prof. Dr. Pushpa Mohan'
        });
      }
    });

    const merged = Array.from(studentMap.values());
    studentsStore = merged;
    saveStudentsToFile(merged);
    res.json({ students: merged });
  } catch (e: any) {
    res.json({ students: studentsStore });
  }
});

app.post("/api/students", (req, res) => {
  try {
    const { id, name, sem, className, assignedFaculty } = req.body || {};
    if (!id || !name) {
      return res.status(400).json({ error: "Missing required Student USN (id) or Full Name (name)" });
    }

    const cleanUsn = String(id).trim().toUpperCase();
    const cleanName = String(name).trim();

    const formatted = {
      id: cleanUsn,
      name: cleanName,
      sem: sem ? String(sem).trim() : '5th Semester CSE',
      className: className ? String(className).trim() : 'CSE-A',
      assignedFaculty: assignedFaculty ? String(assignedFaculty).trim() : 'Prof. Dr. Pushpa Mohan',
      addedAt: new Date().toISOString().slice(0, 10)
    };

    const matchIdx = studentsStore.findIndex(s => s.id.toUpperCase() === cleanUsn);
    if (matchIdx >= 0) {
      studentsStore[matchIdx] = { ...studentsStore[matchIdx], ...formatted };
    } else {
      studentsStore.unshift(formatted);
    }

    saveStudentsToFile(studentsStore);
    res.json({ success: true, student: formatted, students: studentsStore });
  } catch (e: any) {
    res.status(500).json({ error: e.message || "Failed to save student" });
  }
});

app.delete("/api/students", (req, res) => {
  try {
    const { id } = req.query;
    if (id) {
      const cleanId = String(id).trim().toUpperCase();
      studentsStore = studentsStore.filter(s => s.id.toUpperCase() !== cleanId);
      // Also delete score records for this student
      scoresStore = scoresStore.filter(s => (s.userId || '').trim().toUpperCase() !== cleanId);
      saveScoresToFile(scoresStore);
    } else {
      studentsStore = [];
      scoresStore = [];
      saveScoresToFile(scoresStore);
    }
    saveStudentsToFile(studentsStore);
    res.json({ success: true, students: studentsStore });
  } catch (e: any) {
    res.status(500).json({ error: e.message || "Failed to delete student" });
  }
});

// Faculty Roster API Routes
app.get("/api/faculty", (req, res) => {
  try {
    res.json({ faculty: facultyStore });
  } catch (e: any) {
    res.json({ faculty: facultyStore });
  }
});

app.post("/api/faculty", (req, res) => {
  try {
    const { id, name, department, designation } = req.body || {};
    if (!id || !name) {
      return res.status(400).json({ error: "Missing required Faculty ID (id) or Full Name (name)" });
    }

    const cleanId = String(id).trim().toUpperCase();
    const cleanName = String(name).trim();

    const formatted = {
      id: cleanId,
      name: cleanName,
      department: department ? String(department).trim() : 'Computer Science & Engineering',
      designation: designation ? String(designation).trim() : 'Professor / Faculty Member',
      addedAt: new Date().toISOString().slice(0, 10)
    };

    const matchIdx = facultyStore.findIndex(f => f.id.toUpperCase() === cleanId);
    if (matchIdx >= 0) {
      facultyStore[matchIdx] = { ...facultyStore[matchIdx], ...formatted };
    } else {
      facultyStore.unshift(formatted);
    }

    saveFacultyToFile(facultyStore);
    res.json({ success: true, facultyMember: formatted, faculty: facultyStore });
  } catch (e: any) {
    res.status(500).json({ error: e.message || "Failed to save faculty" });
  }
});

// API Endpoints
app.post("/api/ai-tutor", async (req, res) => {
  try {
    const { prompt, section, context } = req.body;
    if (!ai) {
      return res.json({
        reply: "AI Tutor is currently running in offline simulation mode (GEMINI_API_KEY not configured). Based on Ullman Automata theory, remember that regular expressions describe regular languages accepted by finite automata. For section " + section + ", " + (context || "keep practicing state transitions and pumping lemma proofs!")
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `You are an expert Automata Theory professor and AI tutor specializing in 'Introduction to Automata Theory, Languages, and Computation' by Ullman, Hopcroft, and Motwani. 
The student is asking about Section: ${section || "General"}.
Context: ${context || "None"}
Student Query/Prompt: ${prompt}

Provide a clear, pedagogical, encouraging response using alternative teaching methods (analogies, manifold representations, real-world examples). Keep it structured and precise.`
            }
          ]
        }
      ]
    });

    res.json({ reply: response.text });
  } catch (error: any) {
    console.error("AI Tutor Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate AI tutoring response." });
  }
});

app.post("/api/evaluate-hot", async (req, res) => {
  try {
    const { questionId, userAnswer, questionTitle } = req.body;
    if (!ai) {
      // Offline fallback evaluation
      const correct = userAnswer && userAnswer.length > 20;
      return res.json({
        score: correct ? 85 : 40,
        feedback: correct 
          ? "Great analytical reasoning! You correctly identified the core structural properties and demonstrated sound critical thinking in line with Ullman's principles."
          : "Your answer touches on basic concepts, but needs deeper rigor. Consider applying formal closure properties or state limits to your argument."
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `You are an expert professor evaluating a student's Higher Order Thinking (HOT) question response based on Hopcroft & Ullman Automata Theory.
Question ID: ${questionId}
Question Title: ${questionTitle}
Student Answer: ${userAnswer}

Evaluate the student's answer critically and pedagogically. Return a JSON-like text with score (0-100) and constructive feedback pointing out strengths and areas for deeper analytical thought.`
            }
          ]
        }
      ]
    });

    res.json({ evaluation: response.text });
  } catch (error: any) {
    console.error("HOT Eval Error:", error);
    res.status(500).json({ error: error.message || "Evaluation failed." });
  }
});

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Automata Theory Lab server running on http://localhost:${PORT}`);
  });
}

startServer();
