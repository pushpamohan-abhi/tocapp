import type { Request, Response } from 'express';

// Global memory cache as fallback when GitHub environment variables are not set
let serverlessScoresCache: any[] = [
  {
    id: 'score_1',
    faculty: 'Prof. Dr. Pushpa Mohan',
    className: 'CSE-A',
    userId: '1VT22CS001',
    userName: 'Rahul Sharma',
    userRole: 'student',
    assessment: 'Module 1 Quiz',
    moduleNumber: 1,
    score: 5,
    totalQuestions: 6,
    percentage: 83,
    timestamp: '2026-08-11',
    userAnswers: {}
  },
  {
    id: 'score_2',
    faculty: 'Prof. Dr. Pushpa Mohan',
    className: 'CSE-A',
    userId: '1VT22CS002',
    userName: 'Priya Ananth',
    userRole: 'student',
    assessment: 'Module 1 Quiz',
    moduleNumber: 1,
    score: 6,
    totalQuestions: 6,
    percentage: 100,
    timestamp: '2026-08-11',
    userAnswers: {}
  },
  {
    id: 'score_3',
    faculty: 'Prof. Dr. Pushpa Mohan',
    className: 'CSE-B',
    userId: '1VT22CS003',
    userName: 'Karthik V',
    userRole: 'student',
    assessment: 'Module 2 Quiz',
    moduleNumber: 2,
    score: 4,
    totalQuestions: 5,
    percentage: 80,
    timestamp: '2026-08-12',
    userAnswers: {}
  }
];

// Helper to parse CSV string line into array of column values
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

      records.push({
        id: `score_${userId}_${assessment.replace(/\s+/g, '')}_${i}`,
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
      });
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

// GitHub REST API Helper Functions
async function fetchScoresFromGitHub() {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const GITHUB_OWNER = process.env.GITHUB_OWNER;
  const GITHUB_REPO = process.env.GITHUB_REPO;
  const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';

  if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
    return null;
  }

  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/scores.csv?ref=${GITHUB_BRANCH}`;
  const res = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Vercel-Scores-App'
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

async function appendScoreToGitHubCSV(formattedRecord: any) {
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

      let currentContent = githubFile.content;
      if (!currentContent.endsWith('\n') && currentContent.length > 0) {
        currentContent += '\n';
      }

      if (!currentContent.toLowerCase().includes('faculty')) {
        currentContent = "Faculty,Class,Student ID,Student Name,Assessment,Score,Total,Percentage,Date\n" + currentContent;
      }

      const newRow = recordToCsvRow(formattedRecord);
      const updatedContent = currentContent + newRow + '\n';
      const encodedContent = Buffer.from(updatedContent, 'utf-8').toString('base64');

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
        console.log(`Successfully committed score to GitHub scores.csv (Attempt ${attempt})`);
        return parseCsvToRecords(updatedContent);
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

  throw new Error("Failed to append score to GitHub scores.csv after max retries");
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

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    try {
      const githubData = await fetchScoresFromGitHub();
      let records = serverlessScoresCache;

      if (githubData && githubData.content) {
        records = parseCsvToRecords(githubData.content);
        serverlessScoresCache = records;
      }

      const { faculty, className, assessment } = req.query || {};
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

      return res.status(200).json(result);
    } catch (e: any) {
      console.error("GET /api/scores error:", e);
      return res.status(200).json(serverlessScoresCache);
    }
  }

  if (req.method === 'POST') {
    try {
      const record = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      if (!record || !record.userId) {
        return res.status(400).json({ error: "Missing required student USN/ID" });
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

      const githubRecords = await appendScoreToGitHubCSV(formattedRecord);
      if (githubRecords) {
        serverlessScoresCache = githubRecords;
        return res.status(200).json({
          success: true,
          score: formattedRecord,
          allScores: githubRecords,
          storage: 'github'
        });
      }

      // Fallback if GitHub credentials not provided
      serverlessScoresCache = serverlessScoresCache.filter(
        s => !(s.userId === formattedRecord.userId && s.assessment === formattedRecord.assessment)
      );
      serverlessScoresCache.push(formattedRecord);

      return res.status(200).json({
        success: true,
        score: formattedRecord,
        allScores: serverlessScoresCache,
        storage: 'local-fallback'
      });
    } catch (e: any) {
      console.error("POST /api/scores error:", e);
      return res.status(500).json({ error: e.message || "Failed to save score to GitHub" });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { id } = req.query || {};
      if (id) {
        serverlessScoresCache = serverlessScoresCache.filter(s => s.id !== id);
      } else {
        serverlessScoresCache = [];
      }

      await saveAllRecordsToGitHubCSV(serverlessScoresCache);

      return res.status(200).json({ success: true, scores: serverlessScoresCache });
    } catch (e: any) {
      return res.status(500).json({ error: e.message || "Failed to delete score" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
