import { supabase } from '../lib/supabase';
import { Resume, JobDescription, MatchResult, ParsedResume } from '../types';

// Resume operations
export const saveResume = async (resume: Resume): Promise<{ data: any; error: any }> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { data: null, error: { message: 'User not authenticated' } };
  }

  const { data, error } = await supabase
    .from('resumes')
    .insert({
      id: resume.id,
      user_id: user.id,
      name: resume.name,
      content: resume.content,
      parsed_skills: resume.parsedContent?.skills || [],
      parsed_experience: resume.parsedContent?.experience || [],
      parsed_education: resume.parsedContent?.education || [],
    })
    .select()
    .single();

  return { data, error };
};

export const getResumes = async (): Promise<{ data: Resume[] | null; error: any }> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { data: null, error: { message: 'User not authenticated' } };
  }

  const { data, error } = await supabase
    .from('resumes')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return { data: null, error };
  }

  const resumes: Resume[] = data.map(row => ({
    id: row.id,
    name: row.name,
    content: row.content,
    parsedContent: {
      skills: row.parsed_skills || [],
      experience: row.parsed_experience || [],
      education: row.parsed_education || [],
      fullText: row.content,
    } as ParsedResume,
    dateAdded: new Date(row.created_at || ''),
  }));

  return { data: resumes, error: null };
};

export const deleteResume = async (id: string): Promise<{ error: any }> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { error: { message: 'User not authenticated' } };
  }

  const { error } = await supabase
    .from('resumes')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  return { error };
};

// Job description operations
export const saveJobDescription = async (job: JobDescription): Promise<{ data: any; error: any }> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { data: null, error: { message: 'User not authenticated' } };
  }

  const { data, error } = await supabase
    .from('job_descriptions')
    .insert({
      id: job.id,
      user_id: user.id,
      title: job.title,
      company: job.company,
      description: job.description,
      keywords: job.keywords || [],
    })
    .select()
    .single();

  return { data, error };
};

export const getJobDescriptions = async (): Promise<{ data: JobDescription[] | null; error: any }> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { data: null, error: { message: 'User not authenticated' } };
  }

  const { data, error } = await supabase
    .from('job_descriptions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return { data: null, error };
  }

  const jobs: JobDescription[] = data.map(row => ({
    id: row.id,
    title: row.title,
    company: row.company,
    description: row.description,
    keywords: row.keywords || [],
    dateAdded: new Date(row.created_at || ''),
  }));

  return { data: jobs, error: null };
};

export const deleteJobDescription = async (id: string): Promise<{ error: any }> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { error: { message: 'User not authenticated' } };
  }

  const { error } = await supabase
    .from('job_descriptions')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  return { error };
};

// Match result operations
export const saveMatchResult = async (result: MatchResult): Promise<{ data: any; error: any }> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { data: null, error: { message: 'User not authenticated' } };
  }

  const { data, error } = await supabase
    .from('match_results')
    .upsert({
      user_id: user.id,
      resume_id: result.resumeId,
      job_id: result.jobId,
      overall_score: result.overallScore,
      keyword_match_score: result.keywordMatch.score,
      keyword_matched: result.keywordMatch.matched,
      keyword_missing: result.keywordMatch.missing,
      skills_match_score: result.skillsMatch.score,
      skills_matched: result.skillsMatch.matched,
      skills_missing: result.skillsMatch.missing,
      experience_match_score: result.experienceMatch.score,
      experience_relevance: result.experienceMatch.relevance,
      suggestions: result.suggestions,
    })
    .select()
    .single();

  return { data, error };
};

export const getMatchResults = async (): Promise<{ data: MatchResult[] | null; error: any }> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { data: null, error: { message: 'User not authenticated' } };
  }

  const { data, error } = await supabase
    .from('match_results')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return { data: null, error };
  }

  const results: MatchResult[] = data.map(row => ({
    resumeId: row.resume_id || '',
    jobId: row.job_id || '',
    overallScore: row.overall_score,
    keywordMatch: {
      score: row.keyword_match_score,
      matched: row.keyword_matched || [],
      missing: row.keyword_missing || [],
    },
    skillsMatch: {
      score: row.skills_match_score,
      matched: row.skills_matched || [],
      missing: row.skills_missing || [],
    },
    experienceMatch: {
      score: row.experience_match_score,
      relevance: row.experience_relevance,
    },
    suggestions: row.suggestions || [],
    dateCreated: new Date(row.created_at || ''),
  }));

  return { data: results, error: null };
};

export const deleteMatchResult = async (resumeId: string, jobId: string): Promise<{ error: any }> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { error: { message: 'User not authenticated' } };
  }

  const { error } = await supabase
    .from('match_results')
    .delete()
    .eq('resume_id', resumeId)
    .eq('job_id', jobId)
    .eq('user_id', user.id);

  return { error };
};