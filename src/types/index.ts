export interface Resume {
  id: string;
  name: string;
  content: string;
  parsedContent?: ParsedResume;
  file?: File;
  dateAdded: Date;
}

export interface ParsedResume {
  skills: string[];
  experience: string[];
  education: string[];
  fullText: string;
}

export interface JobDescription {
  id: string;
  title: string;
  company: string;
  description: string;
  keywords?: string[];
  keyTerms?: string[];
  dateAdded: Date;
}

export interface MatchResult {
  resumeId: string;
  jobId: string;
  overallScore: number;
  keywordMatch: {
    score: number;
    matched: string[];
    missing: string[];
  };
  skillsMatch: {
    score: number;
    matched: string[];
    missing: string[];
  };
  experienceMatch: {
    score: number;
    relevance: number;
  };
  suggestions: string[];
  dateCreated: Date;
}

export type TabType = 'upload' | 'match' | 'results' | 'history' | 'data';