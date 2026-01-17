
export enum CEFRLevel {
  A1 = 'A1',
  A2 = 'A2',
  B1 = 'B1',
  B2 = 'B2',
  C1 = 'C1',
  C2 = 'C2',
  UNSET = 'UNSET'
}

export type Industry = 'Design' | 'Film' | 'Audio' | 'Marketing' | 'General';

export interface UserProfile {
  level: CEFRLevel;
  xp: number;
  streak: number;
  industry: Industry;
  name: string;
  masteryScores: Record<string, number>; // Level -> Score
  moduleProgress: Record<string, Record<string, number>>; // Level -> Module Name -> Score
}

export interface GroundingSource {
  uri: string;
  title?: string;
}

export interface Message {
  role: 'user' | 'model';
  content: string;
  isAudio?: boolean;
  transcription?: string;
  groundingUrls?: GroundingSource[];
  options?: string[];
  isAssessment?: boolean;
}

export interface AssessmentResult {
  level: string;
  score: string;
  skill_breakdown: {
    vocabulary: string;
    grammar: string;
    listening: string;
    reading: string;
  };
  mastery_status: string;
  next_action: string;
}
