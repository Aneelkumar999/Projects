import React, { useState, useRef } from 'react';
import { Upload, Plus, Trash2, FileText, AlertCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Resume } from '../types';

const ResumeUpload: React.FC = () => {
  const { addResume, resumes, removeResume, selectedResumeId, setSelectedResumeId } = useAppContext();
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    // Check file type - only allow text files, PDFs would need a parser library
    if (file.type !== 'text/plain') {
      setError('Only text files are supported at this time');
      return;
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    // Reset error state
    setError(null);

    // Read the file content
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        const content = e.target.result as string;
        
        const newResume: Resume = {
          id: crypto.randomUUID(),
          name: file.name,
          content,
          file,
          dateAdded: new Date(),
        };
        
        addResume(newResume);
      }
    };
    
    reader.onerror = () => {
      setError('Error reading file');
    };
    
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
      // Reset the input value so the same file can be uploaded again if needed
      e.target.value = '';
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handlePasteResume = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        const newResume: Resume = {
          id: crypto.randomUUID(),
          name: `Pasted Resume ${new Date().toLocaleString()}`,
          content: text,
          dateAdded: new Date(),
        };
        
        addResume(newResume);
      }
    } catch (err) {
      setError('Unable to paste content. Browser may not support clipboard access.');
    }
  };

  const handleSelectResume = (id: string) => {
    setSelectedResumeId(id);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Upload Resumes</h2>
        <p className="text-gray-600">
          Upload your resume as a text file to analyze it against job descriptions.
        </p>
      </div>
      
      {/* Upload Area */}
      <div 
        className={`border-2 border-dashed rounded-lg p-8 mb-8 text-center transition-colors duration-200 ${
          dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
        }`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt"
          className="hidden"
          onChange={handleFileChange}
        />
        
        <Upload className="w-12 h-12 text-blue-500 mx-auto mb-4" />
        
        <h3 className="text-lg font-medium text-gray-700 mb-2">
          Drag & Drop your resume file here
        </h3>
        
        <p className="text-gray-500 mb-4">
          or click to browse your files (TXT format only)
        </p>
        
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={handleUploadClick}
            className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            Browse Files
          </button>
          
          <button
            onClick={handlePasteResume}
            className="flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors duration-200"
          >
            <FileText className="w-4 h-4 mr-2" />
            Paste Resume Text
          </button>
        </div>
        
        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md flex items-start">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
      </div>
      
      {/* Resume List */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Your Resumes ({resumes.length})
        </h3>
        
        {resumes.length === 0 ? (
          <p className="text-gray-500 italic text-center py-8">
            No resumes uploaded yet. Upload a resume to get started.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resumes.map((resume) => (
              <div 
                key={resume.id}
                onClick={() => handleSelectResume(resume.id)}
                className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedResumeId === resume.id
                    ? 'border-blue-500 bg-blue-50 shadow-md ring-2 ring-blue-200'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-blue-600 mr-2" />
                    <h4 className="font-medium text-gray-800 truncate max-w-[180px]">
                      {resume.name}
                    </h4>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeResume(resume.id);
                    }}
                    className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                    aria-label="Delete resume"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="text-sm text-gray-500 mb-2">
                  Added: {resume.dateAdded.toLocaleDateString()}
                </div>
                
                <div className="text-sm text-gray-700 line-clamp-3 h-16 overflow-hidden">
                  {resume.content.substring(0, 150)}...
                </div>
                
                {selectedResumeId === resume.id && (
                  <div className="mt-3 text-blue-600 text-sm font-medium">
                    Selected
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeUpload;