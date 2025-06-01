import React, { useState, useEffect } from 'react';
import './Guildplan1.css';
import { supabase } from './sign-up';

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

  if (!uid || steps.length === 0) {
    return (<div className="loader-wrapper">
      <div className="loader">
        <div className="roller"></div>
        <div className="roller"></div>
      </div>

      <div id="loader2" className="loader">
        <div className="roller"></div>
        <div className="roller"></div>
      </div>

      <div id="loader3" className="loader">
        <div className="roller"></div>
        <div className="roller"></div>
      </div>
    </div>)
  }

  if (currentStep > steps.length) {
    window.location.href = '/summary';
    return null;
  }

  return (
    <div className="business-guild-container">
      <header className="business-guild-header">
        <h1>Business Guild</h1>
      </header>

      {/* Horizontal Progress Bar */}
      <div className="horizontal-progress-bar">
        {steps.map((_, index) => (
          <div
            key={index}
            className={`progress-step ${index + 1 <= currentStep ? 'completed' : ''}`}
          >
            <span className="step-number">{index + 1}</span>
          </div>
        ))}
      </div>

      <main className="business-guild-content">
        <aside className="process-container">
          <ul>
            {[
              "Business Structure Document",
              "Legal Compliance & Licensing Documents",
              "Tax & Finance Documents",
              "Employee Related Documents",
              "Optional Branding/IP Documents",
            ].map((item, index) => (
              <li
                key={item}
                className={index + 1 === currentStep ? 'active-step' : ''}
                onClick={() => handleStepClick(index + 1)}
              >
                {item}
              </li>
            ))}
          </ul>
        </aside>

        <section className="document-details">
          {loading ? (
                    <div className="loading"><div className="loader-wrapper">
            <div className="loader">
                <div className="roller"></div>
                <div className="roller"></div>
            </div>

            <div id="loader2" className="loader">
                <div className="roller"></div>
                <div className="roller"></div>
            </div>

            <div id="loader3" className="loader">
                <div className="roller"></div>
                <div className="roller"></div>
            </div>
            </div></div>
          ) : documents.length > 0 ? (
            <div>
              <h3>{documents[documentIndex].documenttitle}</h3>
              <p>{documents[documentIndex].process}</p>
              {documents[documentIndex].URL && (
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    e.preventDefault(); // Prevent default link behavior
                    const searchEngine = 'https://www.google.com/search?q='; // Change this to your preferred search engine
                    window.open(`${searchEngine}${encodeURIComponent(documents[documentIndex].URL)}`, '_blank');
                  }}
                >
                  {documents[documentIndex].URL}
                </a>
              )}
            </div>
          ) : (
            <p>No documents found for this step.</p>
          )}
          <div className="button-container">
            <button onClick={handleNext} disabled={loading}>
              {documentIndex < documents.length - 1 ? 'Next Document' : 'Next Step'}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Guildplan1;