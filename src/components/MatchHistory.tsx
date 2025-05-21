import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Clock, ArrowRight, BarChart2 } from 'lucide-react';

const MatchHistory: React.FC = () => {
  const { 
    matchResults, 
    resumes, 
    jobDescriptions, 
    setSelectedResumeId, 
    setSelectedJobId, 
    setActiveTab 
  } = useAppContext();
  
  // Sort match results by date (newest first)
  const sortedResults = [...matchResults].sort((a, b) => 
    b.dateCreated.getTime() - a.dateCreated.getTime()
  );
  
  // Function to get resume name by ID
  const getResumeName = (id: string) => {
    const resume = resumes.find(r => r.id === id);
    return resume ? resume.name : 'Unknown Resume';
  };
  
  // Function to get job title and company by ID
  const getJobInfo = (id: string) => {
    const job = jobDescriptions.find(j => j.id === id);
    return job ? { title: job.title, company: job.company } : { title: 'Unknown Job', company: 'Unknown Company' };
  };
  
  // Function to view detailed results
  const viewResults = (resumeId: string, jobId: string) => {
    setSelectedResumeId(resumeId);
    setSelectedJobId(jobId);
    setActiveTab('results');
  };
  
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

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Match History</h2>
        <p className="text-gray-600">
          View all previous resume and job description matches.
        </p>
      </div>
      
      {sortedResults.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Match History</h3>
          <p className="text-gray-600 mb-6">
            You haven't performed any resume-job matches yet. 
            Go to the Resumes and Job Descriptions tabs to get started.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Resume
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Job
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Match Score
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedResults.map((result) => {
                  const jobInfo = getJobInfo(result.jobId);
                  return (
                    <tr key={`${result.resumeId}-${result.jobId}-${result.dateCreated.getTime()}`} 
                        className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {result.dateCreated.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {getResumeName(result.resumeId)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {jobInfo.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {jobInfo.company}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getScoreBgColor(result.overallScore)} ${getScoreColor(result.overallScore)}`}>
                          {Math.round(result.overallScore)}%
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => viewResults(result.resumeId, result.jobId)}
                          className="text-blue-600 hover:text-blue-900 flex items-center justify-end space-x-1"
                        >
                          <span>View Details</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Statistics Section */}
      {sortedResults.length > 0 && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Total Matches</h3>
              <BarChart2 className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-blue-700">
              {matchResults.length}
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Average Score</h3>
              <BarChart2 className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-green-700">
              {matchResults.length > 0 
                ? Math.round(matchResults.reduce((sum, result) => sum + result.overallScore, 0) / matchResults.length)
                : 0}%
            </div>
          </div>
          
          <div className="bg-purple-50 rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Highest Score</h3>
              <BarChart2 className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-purple-700">
              {matchResults.length > 0 
                ? Math.round(Math.max(...matchResults.map(result => result.overallScore)))
                : 0}%
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchHistory;