import React, { useState, useEffect } from 'react';
import { supabase } from './sign-up';
import { 
  ChevronRight, 
  FileText, 
  Loader, 
  Building2, 
  Shield, 
  Users, 
  Briefcase 
} from 'lucide-react';

function Guildplan1() {
  const [currentStep, setCurrentStep] = useState(1);
  const [documents, setDocuments] = useState([]);
  const [documentIndex, setDocumentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [uid, setUid] = useState(null); // State to store the UID
  const [steps, setSteps] = useState([]); // State to store the steps dynamically

  useEffect(() => {
    const fetchUID = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (user) {
        setUid(user.id); // Set the UID in state

        // Dynamically update the steps array once UID is available
        setSteps([
          `http://127.0.0.1:8000/businessstructure/${user.id}/1`,
          `http://127.0.0.1:8000/legalcompliance&licensingdocuments/${user.id}/1`,
          `http://127.0.0.1:8000/tax&financedocuments/${user.id}/1`,
          `http://127.0.0.1:8000/employeerelateddocuments/${user.id}/1`,
          `http://127.0.0.1:8000/optionalbrandingipdocuments/${user.id}/1`,
        ]);
      } else {
        console.error("Error fetching UID:", error);
      }
    };

    fetchUID();
  }, []);

  useEffect(() => {
    const fetchDocuments = async () => {
      if (!uid || currentStep > steps.length || currentStep < 1) {
        return; // Ensure UID is available and currentStep is valid
      }

      setLoading(true);
      try {
        const response = await fetch(steps[currentStep - 1]);
        const data = await response.json();
        setDocuments(data.documents);
        setDocumentIndex(0);
      } catch (error) {
        console.error("Error fetching documents:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [uid, currentStep, steps]); // Add uid and steps as dependencies

  const handleNext = () => {
    if (documentIndex < documents.length - 1) {
      setDocumentIndex(documentIndex + 1);
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleStepClick = (step) => {
    setCurrentStep(step);
  };

  const stepIcons = [
    <Building2 className="w-6 h-6" />,
    <Shield className="w-6 h-6" />,
    <FileText className="w-6 h-6" />,
    <Users className="w-6 h-6" />,
    <Briefcase className="w-6 h-6" />
  ];

  if (!uid || steps.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Loader className="w-8 h-8 text-purple-400 animate-spin" />
            <span className="text-white text-lg">Loading your business plan...</span>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep > steps.length) {
    window.location.href = '/dashboard';
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4 mt-10">
            Business Setup <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Guide</span>
          </h1>
          <p className="text-gray-300 text-lg">Follow these steps to establish your business</p>
        </header>

        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-4">
            {steps.map((_, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  index + 1 <= currentStep
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600'
                    : 'bg-slate-700'
                } transition-all duration-300`}>
                  {stepIcons[index]}
                </div>
                <div className={`h-1 w-full ${
                  index + 1 < steps.length ? 'block' : 'hidden'
                } ${
                  index + 1 < currentStep
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600'
                    : 'bg-slate-700'
                }`} />
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800/50 rounded-2xl border border-purple-500/20 p-6">
              <ul className="space-y-3">
                {[
                  "Business Structure Document",
                  "Legal Compliance & Licensing",
                  "Tax & Finance Documents",
                  "Employee Related Documents",
                  "Optional Branding/IP Documents",
                ].map((item, index) => (
                  <li
                    key={item}
                    onClick={() => handleStepClick(index + 1)}
                    className={`px-4 py-3 rounded-lg cursor-pointer transition-all duration-300 ${
                      index + 1 === currentStep
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                        : 'text-gray-300 hover:bg-slate-700/50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {stepIcons[index]}
                      <span>{item}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-slate-800/50 rounded-2xl border border-purple-500/20 p-8">
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <Loader className="w-8 h-8 text-purple-400 animate-spin" />
                </div>
              ) : documents.length > 0 ? (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-4">
                    {documents[documentIndex].documenttitle}
                  </h2>
                  <p className="text-gray-300 leading-relaxed">
                    {documents[documentIndex].process}
                  </p>
                  {documents[documentIndex].URL ? (
                    <div className="mt-4">
                      <div className="bg-slate-700/50 rounded-lg p-4 border border-purple-500/20">
                        <p className="text-sm text-gray-400 mb-2">Reference Link:</p>
                        <p className="text-purple-400 break-all mb-3 text-sm">
                          {documents[documentIndex].URL}
                        </p>
                        {!documents[documentIndex].URL.includes("N/A") && !documents[documentIndex].URL.includes("NA") ? (
                          <a
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              window.open(`https://www.google.com/search?q=${encodeURIComponent(documents[documentIndex].URL)}`, '_blank');
                            }}
                            className="inline-flex items-center px-4 py-2 bg-purple-500/20 rounded-full text-purple-300 text-sm font-medium hover:bg-purple-500/30 transition-all duration-300"
                          >
                            Search <ChevronRight className="w-4 h-4 ml-1" />
                          </a>
                        ) : (
                          <span className="inline-flex items-center px-4 py-2 bg-slate-700/50 text-gray-400 text-sm font-medium rounded-full cursor-not-allowed">
                            No Search Available
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4">
                      <p className="text-gray-400 text-sm italic">No reference link available</p>
                    </div>
                  )}
                  <div className="pt-6">
                    <button
                      onClick={handleNext}
                      disabled={loading}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-full font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {documentIndex < documents.length - 1 ? 'Next Document' : 'Next Step'}
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-300">No documents found for this step.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Guildplan1;