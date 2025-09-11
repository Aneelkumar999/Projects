import React from 'react';
import { FileText, Briefcase, BarChart2, History, Menu, X, User, LogOut, Database } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { TabType } from '../types';
import AuthModal from './AuthModal';

const Header: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    user, 
    showAuthModal, 
    setShowAuthModal, 
    signOut 
  } = useAppContext();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  const tabs = [
    { id: 'upload', label: 'Resumes', icon: <FileText className="w-5 h-5" /> },
    { id: 'match', label: 'Job Descriptions', icon: <Briefcase className="w-5 h-5" /> },
    { id: 'results', label: 'Analysis', icon: <BarChart2 className="w-5 h-5" /> },
    { id: 'history', label: 'History', icon: <History className="w-5 h-5" /> },
  ] as const;

  return (
    <>
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 text-white font-bold text-xl flex items-center">
              <FileText className="w-6 h-6 mr-2" />
              <span>ResumeMatch</span>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <nav className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'text-white bg-blue-700 shadow-lg transform scale-105'
                      : 'text-blue-100 hover:text-white hover:bg-blue-500'
                  }`}
                >
                  {tab.icon}
                  <span className="ml-2">{tab.label}</span>
                </button>
              ))}
            </nav>
            
            {/* Auth Section */}
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="text-blue-100 text-sm">
                  {user.email}
                </div>
                <button
                  onClick={signOut}
                  className="flex items-center px-3 py-2 text-blue-100 hover:text-white hover:bg-blue-500 rounded-md transition-colors duration-200"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="flex items-center px-4 py-2 bg-white text-blue-600 rounded-md hover:bg-blue-50 transition-colors duration-200"
              >
                <User className="w-4 h-4 mr-2" />
                Sign In
              </button>
            )}
          </div>
          
          {/* Mobile Navigation Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-white hover:text-blue-200 focus:outline-none"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-blue-800 shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`w-full flex items-center px-3 py-2 rounded-md text-base font-medium ${
                  activeTab === tab.id
                    ? 'text-white bg-blue-700'
                    : 'text-blue-100 hover:text-white hover:bg-blue-500'
                }`}
              >
                {tab.icon}
                <span className="ml-2">{tab.label}</span>
              </button>
            ))}
            
            {/* Mobile Auth Section */}
            <div className="border-t border-blue-700 pt-3 mt-3">
              {user ? (
                <div className="space-y-2">
                  <div className="px-3 py-2 text-blue-100 text-sm">
                    {user.email}
                  </div>
                  <button
                    onClick={signOut}
                    className="w-full flex items-center px-3 py-2 text-blue-100 hover:text-white hover:bg-blue-500 rounded-md"
                  >
                    <LogOut className="w-5 h-5 mr-2" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setShowAuthModal(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center px-3 py-2 bg-white text-blue-600 rounded-md hover:bg-blue-50"
                >
                  <User className="w-5 h-5 mr-2" />
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
    
    <AuthModal
      isOpen={showAuthModal}
      onClose={() => setShowAuthModal(false)}
      onAuthSuccess={() => {
        setShowAuthModal(false);
      }}
    />
    </>
  );
};

export default Header;