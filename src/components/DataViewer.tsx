import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Database, Eye, EyeOff, Calendar, FileText, Briefcase } from 'lucide-react';

const DataViewer: React.FC = () => {
  const { resumes, jobDescriptions, matchResults } = useAppContext();
  const [activeDataTab, setActiveDataTab] = useState<'resumes' | 'jobs' | 'matches'>('resumes');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleString();
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
          <Database className="w-6 h-6 mr-2 text-blue-600" />
          Data Viewer
        </h2>
        <p className="text-gray-600">
          View all your stored data (stored locally in browser).
        </p>
      </div>

      {/* Data Type Tabs */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveDataTab('resumes')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeDataTab === 'resumes'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FileText className="w-4 h-4 inline mr-2" />
              Resumes ({resumes.length})
            </button>
            <button
              onClick={() => setActiveDataTab('jobs')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeDataTab === 'jobs'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Briefcase className="w-4 h-4 inline mr-2" />
              Job Descriptions ({jobDescriptions.length})
            </button>
            <button
              onClick={() => setActiveDataTab('matches')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeDataTab === 'matches'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Database className="w-4 h-4 inline mr-2" />
              Match Results ({matchResults.length})
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Resumes Data */}
          {activeDataTab === 'resumes' && (
            <div className="space-y-4">
              {resumes.length === 0 ? (
                <p className="text-gray-500 italic text-center py-8">No resumes found</p>
              ) : (
                resumes.map((resume) => (
                  <div key={resume.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-800">{resume.name}</h3>
                        <p className="text-sm text-gray-500">ID: {resume.id}</p>
                        <p className="text-sm text-gray-500">
                          <Calendar className="w-4 h-4 inline mr-1" />
                          {formatDate(resume.dateAdded)}
                        </p>
                      </div>
                      <button
                        onClick={() => toggleExpanded(resume.id)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {expandedItems.has(resume.id) ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    
                    {expandedItems.has(resume.id) && (
                      <div className="mt-4 space-y-3">
                        <div>
                          <h4 className="font-medium text-gray-700 mb-1">Content:</h4>
                          <div className="bg-gray-50 p-3 rounded text-sm max-h-40 overflow-y-auto">
                            {resume.content}
                          </div>
                        </div>
                        
                        {resume.parsedContent && (
                          <>
                            <div>
                              <h4 className="font-medium text-gray-700 mb-1">Parsed Skills:</h4>
                              <div className="flex flex-wrap gap-2">
                                {resume.parsedContent.skills.map((skill, index) => (
                                  <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-medium text-gray-700 mb-1">Experience Entries:</h4>
                              <div className="text-sm text-gray-600">
                                {resume.parsedContent.experience.length} entries found
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-medium text-gray-700 mb-1">Education Entries:</h4>
                              <div className="text-sm text-gray-600">
                                {resume.parsedContent.education.length} entries found
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* Job Descriptions Data */}
          {activeDataTab === 'jobs' && (
            <div className="space-y-4">
              {jobDescriptions.length === 0 ? (
                <p className="text-gray-500 italic text-center py-8">No job descriptions found</p>
              ) : (
                jobDescriptions.map((job) => (
                  <div key={job.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-800">{job.title}</h3>
                        <p className="text-gray-600">{job.company}</p>
                        <p className="text-sm text-gray-500">ID: {job.id}</p>
                        <p className="text-sm text-gray-500">
                          <Calendar className="w-4 h-4 inline mr-1" />
                          {formatDate(job.dateAdded)}
                        </p>
                      </div>
                      <button
                        onClick={() => toggleExpanded(job.id)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {expandedItems.has(job.id) ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    
                    {expandedItems.has(job.id) && (
                      <div className="mt-4 space-y-3">
                        <div>
                          <h4 className="font-medium text-gray-700 mb-1">Description:</h4>
                          <div className="bg-gray-50 p-3 rounded text-sm max-h-40 overflow-y-auto">
                            {job.description}
                          </div>
                        </div>
                        
                        {job.keywords && job.keywords.length > 0 && (
                          <div>
                            <h4 className="font-medium text-gray-700 mb-1">Extracted Keywords:</h4>
                            <div className="flex flex-wrap gap-2">
                              {job.keywords.map((keyword, index) => (
                                <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                  {keyword}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* Match Results Data */}
          {activeDataTab === 'matches' && (
            <div className="space-y-4">
              {matchResults.length === 0 ? (
                <p className="text-gray-500 italic text-center py-8">No match results found</p>
              ) : (
                matchResults.map((match, index) => {
                  const resume = resumes.find(r => r.id === match.resumeId);
                  const job = jobDescriptions.find(j => j.id === match.jobId);
                  const matchId = `${match.resumeId}-${match.jobId}-${index}`;
                  
                  return (
                    <div key={matchId} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            {resume?.name || 'Unknown Resume'} → {job?.title || 'Unknown Job'}
                          </h3>
                          <p className="text-gray-600">{job?.company || 'Unknown Company'}</p>
                          <p className="text-sm text-gray-500">
                            Resume ID: {match.resumeId}
                          </p>
                          <p className="text-sm text-gray-500">
                            Job ID: {match.jobId}
                          </p>
                          <p className="text-sm text-gray-500">
                            <Calendar className="w-4 h-4 inline mr-1" />
                            {formatDate(match.dateCreated)}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600">
                            {Math.round(match.overallScore)}%
                          </div>
                          <button
                            onClick={() => toggleExpanded(matchId)}
                            className="text-blue-600 hover:text-blue-800 mt-2"
                          >
                            {expandedItems.has(matchId) ? (
                              <EyeOff className="w-5 h-5" />
                            ) : (
                              <Eye className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </div>
                      
                      {expandedItems.has(matchId) && (
                        <div className="mt-4 space-y-3">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-blue-50 p-3 rounded">
                              <h4 className="font-medium text-gray-700 mb-1">Keyword Match</h4>
                              <div className="text-lg font-semibold text-blue-600">
                                {Math.round(match.keywordMatch.score)}%
                              </div>
                              <div className="text-sm text-gray-600">
                                {match.keywordMatch.matched.length} matched, {match.keywordMatch.missing.length} missing
                              </div>
                            </div>
                            
                            <div className="bg-green-50 p-3 rounded">
                              <h4 className="font-medium text-gray-700 mb-1">Skills Match</h4>
                              <div className="text-lg font-semibold text-green-600">
                                {Math.round(match.skillsMatch.score)}%
                              </div>
                              <div className="text-sm text-gray-600">
                                {match.skillsMatch.matched.length} matched, {match.skillsMatch.missing.length} missing
                              </div>
                            </div>
                            
                            <div className="bg-purple-50 p-3 rounded">
                              <h4 className="font-medium text-gray-700 mb-1">Experience Match</h4>
                              <div className="text-lg font-semibold text-purple-600">
                                {Math.round(match.experienceMatch.score)}%
                              </div>
                              <div className="text-sm text-gray-600">
                                Relevance: {match.experienceMatch.relevance}%
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-gray-700 mb-2">Suggestions:</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                              {match.suggestions.map((suggestion, idx) => (
                                <li key={idx}>{suggestion}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>

      {/* Database Info */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Database className="w-5 h-5 mr-2" />
          Local Storage Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">Total Resumes:</span>
            <div className="text-gray-600">{resumes.length}</div>
          </div>
          <div>
            <span className="font-medium text-gray-700">Total Jobs:</span>
            <div className="text-gray-600">{jobDescriptions.length}</div>
          </div>
          <div>
            <span className="font-medium text-gray-700">Total Matches:</span>
            <div className="text-gray-600">{matchResults.length}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataViewer;