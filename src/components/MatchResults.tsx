import React from 'react';
import { useAppContext } from '../context/AppContext';
import { CheckCircle, XCircle, AlertTriangle, ArrowRight, Info } from 'lucide-react';

const MatchResults: React.FC = () => {
  const { 
    matchResults, 
    selectedResumeId, 
    selectedJobId, 
    resumes, 
    jobDescriptions 
  } = useAppContext();
  
  // Get the current match result
  const currentMatch = matchResults.find(
    result => result.resumeId === selectedResumeId && result.jobId === selectedJobId
  );
  
  const resume = resumes.find(r => r.id === selectedResumeId);
  const jobDescription = jobDescriptions.find(j => j.id === selectedJobId);
  
  if (!currentMatch || !resume || !jobDescription) {
    return (
      <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 text-center">
        <div className="bg-blue-50 rounded-lg p-8 inline-block">
          <Info className="w-16 h-16 text-blue-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No Match Results</h2>
          <p className="text-gray-600 mb-6">
            Please select both a resume and a job description, then perform a match analysis.
          </p>
          <button
            onClick={() => {
              if (selectedResumeId && selectedJobId) {
                // This should navigate to the match tab
              }
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
            disabled={!selectedResumeId || !selectedJobId}
          >
            Go to Matching
          </button>
        </div>
      </div>
    );
  }

  // Calculate color based on score
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  // Calculate background color based on score
  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };
  
  // Calculate icon based on score
  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="w-6 h-6 text-green-600" />;
    if (score >= 60) return <AlertTriangle className="w-6 h-6 text-yellow-600" />;
    return <XCircle className="w-6 h-6 text-red-600" />;
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Match Results</h2>
        <p className="text-gray-600">
          Analysis of how well your resume matches the selected job description.
        </p>
      </div>
      
      {/* Match Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">
              {resume.name} <ArrowRight className="inline w-4 h-4 mx-2" /> {jobDescription.title}
            </h3>
            <p className="text-gray-600">{jobDescription.company}</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center">
            <div className={`text-3xl font-bold ${getScoreColor(currentMatch.overallScore)}`}>
              {Math.round(currentMatch.overallScore)}%
            </div>
            <div className="ml-2">
              {getScoreIcon(currentMatch.overallScore)}
            </div>
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
          <div 
            className={`h-2.5 rounded-full transition-all duration-1000 ease-out`}
            style={{ 
              width: `${currentMatch.overallScore}%`,
              backgroundColor: currentMatch.overallScore >= 80 ? '#22c55e' : 
                               currentMatch.overallScore >= 60 ? '#eab308' : '#ef4444'
            }}
          ></div>
        </div>
        
        <div className="text-sm text-gray-500">
          Analyzed on {currentMatch.dateCreated.toLocaleString()}
        </div>
      </div>
      
      {/* Score Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Keyword Match */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold text-gray-800">Keyword Match</h4>
            <div className={`text-xl font-bold ${getScoreColor(currentMatch.keywordMatch.score)}`}>
              {Math.round(currentMatch.keywordMatch.score)}%
            </div>
          </div>
          
          <div className={`w-full ${getScoreBgColor(currentMatch.keywordMatch.score)} rounded-lg p-4 mb-4`}>
            <div className="flex justify-between items-center mb-2">
              <div className="text-gray-700 font-medium">Matched Keywords</div>
              <div className="text-gray-700 font-medium">{currentMatch.keywordMatch.matched.length}</div>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {currentMatch.keywordMatch.matched.length > 0 ? (
                currentMatch.keywordMatch.matched.map((keyword, index) => (
                  <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    {keyword}
                  </span>
                ))
              ) : (
                <span className="text-gray-500 text-sm italic">No matched keywords</span>
              )}
            </div>
            
            <div className="flex justify-between items-center mb-2">
              <div className="text-gray-700 font-medium">Missing Keywords</div>
              <div className="text-gray-700 font-medium">{currentMatch.keywordMatch.missing.length}</div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {currentMatch.keywordMatch.missing.length > 0 ? (
                currentMatch.keywordMatch.missing.map((keyword, index) => (
                  <span key={index} className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                    {keyword}
                  </span>
                ))
              ) : (
                <span className="text-gray-500 text-sm italic">No missing keywords</span>
              )}
            </div>
          </div>
        </div>
        
        {/* Skills Match */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold text-gray-800">Skills Match</h4>
            <div className={`text-xl font-bold ${getScoreColor(currentMatch.skillsMatch.score)}`}>
              {Math.round(currentMatch.skillsMatch.score)}%
            </div>
          </div>
          
          <div className={`w-full ${getScoreBgColor(currentMatch.skillsMatch.score)} rounded-lg p-4 mb-4`}>
            <div className="flex justify-between items-center mb-2">
              <div className="text-gray-700 font-medium">Matched Skills</div>
              <div className="text-gray-700 font-medium">{currentMatch.skillsMatch.matched.length}</div>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {currentMatch.skillsMatch.matched.length > 0 ? (
                currentMatch.skillsMatch.matched.map((skill, index) => (
                  <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-gray-500 text-sm italic">No matched skills</span>
              )}
            </div>
            
            <div className="flex justify-between items-center mb-2">
              <div className="text-gray-700 font-medium">Missing Skills</div>
              <div className="text-gray-700 font-medium">{currentMatch.skillsMatch.missing.length}</div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {currentMatch.skillsMatch.missing.length > 0 ? (
                currentMatch.skillsMatch.missing.map((skill, index) => (
                  <span key={index} className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-gray-500 text-sm italic">No missing skills</span>
              )}
            </div>
          </div>
        </div>
        
        {/* Experience Match */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold text-gray-800">Experience Match</h4>
            <div className={`text-xl font-bold ${getScoreColor(currentMatch.experienceMatch.score)}`}>
              {Math.round(currentMatch.experienceMatch.score)}%
            </div>
          </div>
          
          <div className={`w-full ${getScoreBgColor(currentMatch.experienceMatch.score)} rounded-lg p-4 mb-4`}>
            <div className="flex justify-between items-center mb-2">
              <div className="text-gray-700 font-medium">Relevance Score</div>
              <div className="text-gray-700 font-medium">{currentMatch.experienceMatch.relevance}%</div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
              <div 
                className="h-2.5 rounded-full bg-blue-600 transition-all duration-1000 ease-out"
                style={{ width: `${currentMatch.experienceMatch.relevance}%` }}
              ></div>
            </div>
            
            <p className="text-sm text-gray-600">
              This score indicates how relevant your experience is to the job requirements based on
              content analysis.
            </p>
          </div>
        </div>
      </div>
      
      {/* Suggestions */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h4 className="font-semibold text-gray-800 mb-4">Improvement Suggestions</h4>
        
        <ul className="space-y-3">
          {currentMatch.suggestions.map((suggestion, index) => (
            <li key={index} className="flex items-start">
              <ArrowRight className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">{suggestion}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MatchResults;