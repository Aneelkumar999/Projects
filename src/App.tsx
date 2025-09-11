import React from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import Header from './components/Header';
import ResumeUpload from './components/ResumeUpload';
import JobDescriptions from './components/JobDescriptions';
import MatchResults from './components/MatchResults';
import MatchHistory from './components/MatchHistory';
import { FileText, Loader2 } from 'lucide-react';

// Main content wrapper that uses the context
const MainContent: React.FC = () => {
  const { activeTab, loading, user } = useAppContext();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Render the appropriate component based on the active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'upload':
        return <ResumeUpload />;
      case 'match':
        return <JobDescriptions />;
      case 'results':
        return <MatchResults />;
      case 'history':
        return <MatchHistory />;
      default:
        return <ResumeUpload />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {!user && (
        <div className="bg-blue-50 border-b border-blue-200 py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-blue-800 text-sm text-center">
              Sign in to save your resumes, job descriptions, and match history to the cloud.
            </p>
          </div>
        </div>
      )}
      
      <main className="py-6">
        {renderContent()}
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <FileText className="w-5 h-5 text-blue-600 mr-2" />
              <span className="text-gray-600 font-medium">ResumeMatch</span>
            </div>
            <div className="text-gray-500 text-sm">
              © {new Date().getFullYear()} ResumeMatch. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// App component that wraps everything with the provider
function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

export default App;