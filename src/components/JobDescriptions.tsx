import React, { useState } from 'react';
import { Briefcase, Plus, Trash2, Edit2, Save, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { JobDescription } from '../types';

const JobDescriptions: React.FC = () => {
  const { 
    jobDescriptions, 
    addJobDescription, 
    removeJobDescription, 
    selectedJobId, 
    setSelectedJobId,
    selectedResumeId,
    matchResumeWithJob
  } = useAppContext();
  
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
  });
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.title.trim() || !formData.company.trim() || !formData.description.trim()) {
      setValidationError('All fields are required');
      return;
    }
    
    if (formData.description.length < 50) {
      setValidationError('Job description should be at least 50 characters');
      return;
    }
    
    setValidationError(null);
    
    // If editing existing job
    if (editingId) {
      const updatedJob: JobDescription = {
        id: editingId,
        title: formData.title,
        company: formData.company,
        description: formData.description,
        dateAdded: new Date(),
      };
      
      removeJobDescription(editingId);
      addJobDescription(updatedJob);
      setEditingId(null);
    } else {
      // Creating new job
      const newJob: JobDescription = {
        id: crypto.randomUUID(),
        title: formData.title,
        company: formData.company,
        description: formData.description,
        dateAdded: new Date(),
      };
      
      addJobDescription(newJob);
    }
    
    // Reset form
    setFormData({
      title: '',
      company: '',
      description: '',
    });
  };

  const handleEdit = (job: JobDescription) => {
    setEditingId(job.id);
    setFormData({
      title: job.title,
      company: job.company,
      description: job.description,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      title: '',
      company: '',
      description: '',
    });
    setValidationError(null);
  };

  const handleSelectJob = (id: string) => {
    setSelectedJobId(id);
  };

  const handleMatchResume = (jobId: string) => {
    if (selectedResumeId) {
      matchResumeWithJob(selectedResumeId, jobId);
    } else {
      alert("Please select a resume first");
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Job Descriptions</h2>
        <p className="text-gray-600">
          Add job descriptions to match against your resumes.
        </p>
      </div>
      
      {/* Job Description Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          {editingId ? (
            <>
              <Edit2 className="w-5 h-5 mr-2 text-blue-600" />
              Edit Job Description
            </>
          ) : (
            <>
              <Plus className="w-5 h-5 mr-2 text-blue-600" />
              Add New Job Description
            </>
          )}
        </h3>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Job Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Frontend Developer"
              />
            </div>
            
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                Company
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Tech Solutions Inc."
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Job Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleFormChange}
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Paste the full job description here..."
            />
          </div>
          
          {validationError && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {validationError}
            </div>
          )}
          
          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center"
            >
              <Save className="w-4 h-4 mr-2" />
              {editingId ? 'Update Job' : 'Save Job'}
            </button>
            
            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-200 flex items-center"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
      
      {/* Job Descriptions List */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Your Job Descriptions ({jobDescriptions.length})
        </h3>
        
        {jobDescriptions.length === 0 ? (
          <p className="text-gray-500 italic text-center py-8">
            No job descriptions added yet. Add a job description to get started.
          </p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {jobDescriptions.map((job) => (
              <div 
                key={job.id}
                onClick={() => handleSelectJob(job.id)}
                className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedJobId === job.id
                    ? 'border-blue-500 bg-blue-50 shadow-md ring-2 ring-blue-200'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium text-gray-800 flex items-center">
                      <Briefcase className="w-4 h-4 text-blue-600 mr-2 flex-shrink-0" />
                      {job.title}
                    </h4>
                    <p className="text-gray-600 text-sm">{job.company}</p>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(job);
                      }}
                      className="text-gray-400 hover:text-blue-500 transition-colors duration-200"
                      aria-label="Edit job"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeJobDescription(job.id);
                      }}
                      className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                      aria-label="Delete job"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                <div className="text-sm text-gray-500 mb-2">
                  Added: {job.dateAdded.toLocaleDateString()}
                </div>
                
                <div className="text-sm text-gray-700 line-clamp-3 mb-4 h-16 overflow-hidden">
                  {job.description.substring(0, 150)}...
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {job.keywords && job.keywords.slice(0, 5).map((keyword, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {keyword}
                    </span>
                  ))}
                  {job.keywords && job.keywords.length > 5 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                      +{job.keywords.length - 5} more
                    </span>
                  )}
                </div>
                
                <div className="flex justify-between items-center">
                  {selectedJobId === job.id && (
                    <div className="text-blue-600 text-sm font-medium">
                      Selected
                    </div>
                  )}
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMatchResume(job.id);
                    }}
                    disabled={!selectedResumeId}
                    className={`ml-auto px-3 py-1.5 rounded text-sm font-medium flex items-center ${
                      selectedResumeId
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Match with Resume
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDescriptions;