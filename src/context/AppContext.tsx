import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useEffect } from 'react';
import { Resume, JobDescription, MatchResult, TabType } from '../types';
import { extractKeywords, calculateMatch, parseResume } from '../utils/matchingFunctions';
import { supabase } from '../lib/supabase';
import { 
  saveResume, 
  getResumes, 
  deleteResume, 
  saveJobDescription, 
  getJobDescriptions, 
  deleteJobDescription,
  saveMatchResult,
  getMatchResults
} from '../services/database';
import type { User } from '@supabase/supabase-js';

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
  user: User | null;
  loading: boolean;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  signOut: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<TabType>('upload');
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [jobDescriptions, setJobDescriptions] = useState<JobDescription[]>([]);
  const [matchResults, setMatchResults] = useState<MatchResult[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Initialize auth state and load data
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadUserData();
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await loadUserData();
        } else {
          // Clear data when user signs out
          setResumes([]);
          setJobDescriptions([]);
          setMatchResults([]);
          setSelectedResumeId(null);
          setSelectedJobId(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const loadUserData = async () => {
    try {
      const [resumesResult, jobsResult, matchesResult] = await Promise.all([
        getResumes(),
        getJobDescriptions(),
        getMatchResults()
      ]);

      if (resumesResult.data) {
        setResumes(resumesResult.data);
        if (resumesResult.data.length > 0 && !selectedResumeId) {
          setSelectedResumeId(resumesResult.data[0].id);
        }
      }

      if (jobsResult.data) {
        setJobDescriptions(jobsResult.data);
        if (jobsResult.data.length > 0 && !selectedJobId) {
          setSelectedJobId(jobsResult.data[0].id);
        }
      }

      if (matchesResult.data) {
        setMatchResults(matchesResult.data);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const addResume = async (resume: Resume) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    const parsedContent = parseResume(resume.content);
    const newResume = { ...resume, parsedContent };
    
    const { error } = await saveResume(newResume);
    if (error) {
      console.error('Error saving resume:', error);
      return;
    }

    setResumes(prev => [newResume, ...prev]);
    
    // Auto-select if it's the first resume
    if (resumes.length === 0) {
      setSelectedResumeId(resume.id);
    }
  };

  const removeResume = async (id: string) => {
    if (!user) return;

    const { error } = await deleteResume(id);
    if (error) {
      console.error('Error deleting resume:', error);
      return;
    }

    setResumes(prev => prev.filter(resume => resume.id !== id));
    if (selectedResumeId === id) {
      const remainingResumes = resumes.filter(r => r.id !== id);
      setSelectedResumeId(remainingResumes.length > 0 ? remainingResumes[0].id : null);
    }
  };

  const addJobDescription = async (job: JobDescription) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    const keywords = extractKeywords(job.description);
    const newJob = { ...job, keywords };
    
    const { error } = await saveJobDescription(newJob);
    if (error) {
      console.error('Error saving job description:', error);
      return;
    }

    setJobDescriptions(prev => [newJob, ...prev]);
    
    // Auto-select if it's the first job
    if (jobDescriptions.length === 0) {
      setSelectedJobId(job.id);
    }
  };

  const removeJobDescription = async (id: string) => {
    if (!user) return;

    const { error } = await deleteJobDescription(id);
    if (error) {
      console.error('Error deleting job description:', error);
      return;
    }

    setJobDescriptions(prev => prev.filter(job => job.id !== id));
    if (selectedJobId === id) {
      const remainingJobs = jobDescriptions.filter(j => j.id !== id);
      setSelectedJobId(remainingJobs.length > 0 ? remainingJobs[0].id : null);
    }
  };

  const addMatchResult = async (result: MatchResult) => {
    if (!user) return;

    const { error } = await saveMatchResult(result);
    if (error) {
      console.error('Error saving match result:', error);
      return;
    }

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
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    const resume = resumes.find(r => r.id === resumeId);
    const job = jobDescriptions.find(j => j.id === jobId);
    
    if (!resume || !job) return;
    
    const result = calculateMatch(resume, job);
    addMatchResult(result);
    setActiveTab('results');
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
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
    user,
    loading,
    showAuthModal,
    setShowAuthModal,
    signOut: handleSignOut,
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