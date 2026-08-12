export type UserRole = 'student' | 'faculty';

export interface UserProfile {
  id: string; // USN for student, ID for faculty
  name: string;
  role: UserRole;
  department?: string;
  sem?: string;
}

export interface QuizScoreRecord {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  moduleNumber: number;
  score: number;
  totalQuestions: number;
  percentage: number;
  timestamp: string;
  userAnswers: Record<string, number>;
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
