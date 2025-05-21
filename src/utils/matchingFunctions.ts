import { Resume, JobDescription, MatchResult, ParsedResume } from '../types';

// Simulates parsing a resume into structured data
export const parseResume = (content: string): ParsedResume => {
  // This is a simplified mock function
  // In a real app, this would be a complex backend operation
  
  const skills = extractSkills(content);
  const experience = extractExperience(content);
  const education = extractEducation(content);
  
  return {
    skills,
    experience,
    education,
    fullText: content,
  };
};

// Extract skills from text
const extractSkills = (text: string): string[] => {
  // Common skills to look for
  const commonSkills = [
    'JavaScript', 'Python', 'Java', 'C++', 'SQL', 'React', 'Angular', 'Vue',
    'Node.js', 'Express', 'Django', 'Flask', 'Spring', 'Docker', 'Kubernetes',
    'AWS', 'Azure', 'Google Cloud', 'Git', 'Jenkins', 'CI/CD', 'Agile', 'Scrum',
    'Project Management', 'Leadership', 'Communication', 'Problem Solving',
    'Data Analysis', 'Machine Learning', 'AI', 'Data Science', 'UI/UX Design',
    'Figma', 'Sketch', 'Adobe XD', 'Photoshop', 'Illustrator',
  ];
  
  return commonSkills.filter(skill => 
    text.toLowerCase().includes(skill.toLowerCase())
  );
};

// Extract experience sections
const extractExperience = (text: string): string[] => {
  // Simple regex to find potential experience sections
  // A real implementation would be much more sophisticated
  const experienceMatches = text.match(/(?:Experience|Work|Employment)(?:[\s\S]*?)(?:Education|Skills|Projects|About|$)/i);
  
  if (experienceMatches && experienceMatches[0]) {
    // Split by potential job entries (looking for dates)
    return experienceMatches[0]
      .split(/\d{4}\s*[-–—to]+\s*(?:\d{4}|present|current)/i)
      .filter(Boolean)
      .map(entry => entry.trim());
  }
  
  return [];
};

// Extract education sections
const extractEducation = (text: string): string[] => {
  // Simple regex to find potential education sections
  const educationMatches = text.match(/(?:Education|Degree|University|College)(?:[\s\S]*?)(?:Experience|Skills|Projects|About|$)/i);
  
  if (educationMatches && educationMatches[0]) {
    // Split by potential education entries
    return educationMatches[0]
      .split(/(?:University|College|Institute|School)(?:\s+of\s+)?/i)
      .filter(Boolean)
      .map(entry => entry.trim());
  }
  
  return [];
};

// Extract keywords from job description
export const extractKeywords = (description: string): string[] => {
  // In a real implementation, this would use NLP techniques
  // For this demo, we'll use a simple approach with common keywords
  const words = description.toLowerCase().split(/\s+/);
  const uniqueWords = [...new Set(words)];
  
  // Filter for words that seem like skills or qualifications
  // (simulating what an NLP system might determine as relevant)
  const potentialKeywords = [
    'experience', 'skill', 'proficient', 'knowledge', 'ability', 'familiar',
    'develop', 'design', 'implement', 'create', 'manage', 'lead', 'communicate',
    'analyze', 'solve', 'organize', 'coordinate', 'plan', 'build', 'test',
    'debug', 'deploy', 'maintain', 'optimize', 'improve', 'degree', 'bachelor',
    'master', 'phd', 'certification', 'qualified', 'expert', 'specialist',
  ];
  
  // Find words near potential keywords
  let keywords: string[] = [];
  
  for (let i = 0; i < uniqueWords.length; i++) {
    if (potentialKeywords.includes(uniqueWords[i])) {
      // Add surrounding words as potential skills/requirements
      let start = Math.max(0, i - 2);
      let end = Math.min(uniqueWords.length - 1, i + 3);
      
      for (let j = start; j <= end; j++) {
        if (uniqueWords[j].length > 3 && !potentialKeywords.includes(uniqueWords[j])) {
          keywords.push(uniqueWords[j]);
        }
      }
    }
  }
  
  // Add common technical skills if they appear in the description
  const commonSkills = [
    'javascript', 'python', 'java', 'c++', 'sql', 'react', 'angular', 'vue',
    'node.js', 'express', 'django', 'flask', 'spring', 'docker', 'kubernetes',
    'aws', 'azure', 'google cloud', 'git', 'jenkins', 'ci/cd', 'agile', 'scrum',
  ];
  
  commonSkills.forEach(skill => {
    if (description.toLowerCase().includes(skill)) {
      keywords.push(skill);
    }
  });
  
  // Remove duplicates and return
  return [...new Set(keywords)];
};

// Calculate match score between resume and job description
export const calculateMatch = (resume: Resume, job: JobDescription): MatchResult => {
  if (!resume.parsedContent) {
    throw new Error('Resume has not been parsed');
  }
  
  const { parsedContent } = resume;
  
  // Keyword matching
  const jobKeywords = job.keywords || extractKeywords(job.description);
  const resumeText = parsedContent.fullText.toLowerCase();
  
  const matchedKeywords = jobKeywords.filter(keyword => 
    resumeText.includes(keyword.toLowerCase())
  );
  
  const missingKeywords = jobKeywords.filter(keyword => 
    !resumeText.includes(keyword.toLowerCase())
  );
  
  const keywordMatchScore = jobKeywords.length > 0 
    ? (matchedKeywords.length / jobKeywords.length) * 100 
    : 0;
  
  // Skills matching
  const jobSkills = extractSkills(job.description);
  const resumeSkills = parsedContent.skills;
  
  const matchedSkills = resumeSkills.filter(skill => 
    jobSkills.some(jobSkill => 
      jobSkill.toLowerCase() === skill.toLowerCase()
    )
  );
  
  const missingSkills = jobSkills.filter(skill => 
    !resumeSkills.some(resumeSkill => 
      resumeSkill.toLowerCase() === skill.toLowerCase()
    )
  );
  
  const skillsMatchScore = jobSkills.length > 0 
    ? (matchedSkills.length / jobSkills.length) * 100 
    : 0;
  
  // Experience relevance (simplified)
  // In a real system, this would use semantic analysis
  const experienceRelevance = Math.min(
    100,
    parsedContent.experience.length * 20
  );
  
  const experienceMatchScore = experienceRelevance * 0.8;
  
  // Overall score (weighted average)
  const overallScore = (
    keywordMatchScore * 0.4 +
    skillsMatchScore * 0.4 +
    experienceMatchScore * 0.2
  );
  
  // Generate suggestions
  const suggestions = generateSuggestions(
    missingKeywords,
    missingSkills,
    jobKeywords
  );
  
  return {
    resumeId: resume.id,
    jobId: job.id,
    overallScore,
    keywordMatch: {
      score: keywordMatchScore,
      matched: matchedKeywords,
      missing: missingKeywords,
    },
    skillsMatch: {
      score: skillsMatchScore,
      matched: matchedSkills,
      missing: missingSkills,
    },
    experienceMatch: {
      score: experienceMatchScore,
      relevance: experienceRelevance,
    },
    suggestions,
    dateCreated: new Date(),
  };
};

// Generate improvement suggestions based on match results
const generateSuggestions = (
  missingKeywords: string[],
  missingSkills: string[],
  jobKeywords: string[]
): string[] => {
  const suggestions: string[] = [];
  
  // Suggest adding missing keywords
  if (missingKeywords.length > 0) {
    suggestions.push(
      `Consider adding these keywords to your resume: ${missingKeywords.slice(0, 5).join(', ')}${missingKeywords.length > 5 ? '...' : ''}`
    );
  }
  
  // Suggest highlighting specific skills
  if (missingSkills.length > 0) {
    suggestions.push(
      `Highlight these skills if you have them: ${missingSkills.slice(0, 5).join(', ')}${missingSkills.length > 5 ? '...' : ''}`
    );
  }
  
  // Suggest using more specific language
  suggestions.push(
    'Use specific, measurable achievements rather than generic descriptions'
  );
  
  // Suggest quantifying achievements
  suggestions.push(
    'Quantify your achievements with numbers, percentages, or other metrics'
  );
  
  // Suggest tailoring to the job
  suggestions.push(
    'Tailor your resume to match this specific job description more closely'
  );
  
  return suggestions;
};