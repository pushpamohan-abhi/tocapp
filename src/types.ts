export type UserRole = 'student' | 'faculty';

export interface UserProfile {
  id: string; // USN for student, ID for faculty
  name: string;
  role: UserRole;
  department?: string;
  sem?: string; // e.g., 'CSE-A' or '5th Semester CSE'
  assignedFaculty?: string; // e.g., 'Prof. Dr. Pushpa Mohan'
}

export interface QuizScoreRecord {
  id: string;
  faculty: string;         // e.g., 'Prof. Dr. Pushpa Mohan'
  className: string;       // e.g., 'CSE-A' or '5th Semester CSE'
  userId: string;          // USN / Student ID
  userName: string;        // Student Name
  userRole: UserRole;
  assessment: string;      // e.g., 'Module 1 Quiz'
  moduleNumber: number;
  score: number;           // Marks obtained
  totalQuestions: number;  // Total marks
  percentage: number;      // e.g., 80
  timestamp: string;       // Submission date/time (e.g., '2026-08-12')
  userAnswers?: Record<string, number>;
}

export type SectionId = 'module1' | 'module2' | 'module3' | 'module4' | 'module5' | '3.2' | '4.1' | '4.2' | '4.4' | 'hot' | 'pbl' | 'collab' | 'tutor' | 'ppt' | 'scores';

export interface AutomataState {
  id: string;
  name: string;
  isInitial: boolean;
  isAccept: boolean;
  x: number;
  y: number;
}

export interface AutomataTransition {
  from: string;
  to: string;
  symbol: string; // e.g. 'a', 'b', 'ε'
}

export interface DFA {
  states: AutomataState[];
  transitions: AutomataTransition[];
  alphabet: string[];
  initialState: string;
  acceptStates: string[];
}

export interface HotQuestion {
  id: string;
  section: string;
  title: string;
  prompt: string;
  difficulty: 'Advanced' | 'Expert' | 'Master';
  hints: string[];
  sampleSolution: string;
}

export interface PblChallenge {
  id: string;
  title: string;
  domain: string; // e.g., 'Compiler Lexical Analyzer', 'Network Firewall Protocol', 'Text Editor Search Engine'
  scenario: string;
  task: string;
  evaluationCriteria: string[];
  initialRegexOrDfa?: string;
}

export interface CollaborativeDiscussion {
  id: string;
  author: string;
  topicId: string;
  content: string;
  timestamp: string;
  upvotes: number;
  commentsCount: number;
}
