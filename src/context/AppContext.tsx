import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Resume, JobDescription, MatchResult, TabType } from '../types';
import { extractKeywords, calculateMatch, parseResume } from '../utils/matchingFunctions';

interface AppContextType {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  resumes: Resume[];
  addResume: (resume: Resume) => void;
  removeResume: (id: string) => void;
  jobDescriptions: JobDescription[];
  addJobDescription: (job: JobDescription) => void;
  removeJobDescription: (id: string) => void;
  matchResults: MatchResult[];
  addMatchResult: (result: MatchResult) => void;
  getMatchById: (resumeId: string, jobId: string) => MatchResult | undefined;
  selectedResumeId: string | null;
  setSelectedResumeId: (id: string | null) => void;
  selectedJobId: string | null;
  setSelectedJobId: (id: string | null) => void;
  matchResumeWithJob: (resumeId: string, jobId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<TabType>('upload');
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [jobDescriptions, setJobDescriptions] = useState<JobDescription[]>([]);
  const [matchResults, setMatchResults] = useState<MatchResult[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  const addResume = (resume: Resume) => {
    const parsedContent = parseResume(resume.content);
    const newResume = { ...resume, parsedContent };
    setResumes([...resumes, newResume]);
    
    // Auto-select if it's the first resume
    if (resumes.length === 0) {
      setSelectedResumeId(resume.id);
    }
  };

  const removeResume = (id: string) => {
    setResumes(resumes.filter(resume => resume.id !== id));
    if (selectedResumeId === id) {
      setSelectedResumeId(resumes.length > 1 ? resumes[0].id : null);
    }
  };

  const addJobDescription = (job: JobDescription) => {
    const keywords = extractKeywords(job.description);
    const newJob = { ...job, keywords };
    setJobDescriptions([...jobDescriptions, newJob]);
    
    // Auto-select if it's the first job
    if (jobDescriptions.length === 0) {
      setSelectedJobId(job.id);
    }
  };

  const removeJobDescription = (id: string) => {
    setJobDescriptions(jobDescriptions.filter(job => job.id !== id));
    if (selectedJobId === id) {
      setSelectedJobId(jobDescriptions.length > 1 ? jobDescriptions[0].id : null);
    }
  };

  const addMatchResult = (result: MatchResult) => {
    setMatchResults(prev => {
      // Replace if exists, otherwise add
      const exists = prev.some(
        r => r.resumeId === result.resumeId && r.jobId === result.jobId
      );
      
      if (exists) {
        return prev.map(r => 
          r.resumeId === result.resumeId && r.jobId === result.jobId
            ? result
            : r
        );
      } else {
        return [...prev, result];
      }
    });
  };

  const getMatchById = (resumeId: string, jobId: string) => {
    return matchResults.find(
      r => r.resumeId === resumeId && r.jobId === jobId
    );
  };

  const matchResumeWithJob = (resumeId: string, jobId: string) => {
    const resume = resumes.find(r => r.id === resumeId);
    const job = jobDescriptions.find(j => j.id === jobId);
    
    if (!resume || !job) return;
    
    const result = calculateMatch(resume, job);
    addMatchResult(result);
    setActiveTab('results');
  };

  const value = {
    activeTab,
    setActiveTab,
    resumes,
    addResume,
    removeResume,
    jobDescriptions,
    addJobDescription,
    removeJobDescription,
    matchResults,
    addMatchResult,
    getMatchById,
    selectedResumeId,
    setSelectedResumeId,
    selectedJobId,
    setSelectedJobId,
    matchResumeWithJob,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};