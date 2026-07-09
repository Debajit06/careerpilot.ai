

import React, { useState, useRef } from "react";
import { useInterview } from '../hooks/useInterview.js';
import { useAuth } from '../../auth/hooks/useAuth.js';
import { useNavigate, Navigate } from 'react-router-dom';

function Home() {
  const { user, loading: authLoading } = useAuth();
  const { loading, generateReport, reports } = useInterview();
  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const resumeInputRef = useRef();

  const navigate = useNavigate();

  const handleGenerateReport = async () => {
    setErrorMsg("");
    const resumeFile = resumeInputRef.current?.files[0];
    
    if (!resumeFile && !selfDescription) {
      setErrorMsg("Either a Resume or a Self Description is required.");
      return;
    }

    const data = await generateReport({ jobDescription, selfDescription, resumeFile });
    if (data && data._id) {
      navigate(`/interview/${data._id}`);
    } else {
      setErrorMsg("Failed to generate report. Please ensure you are logged in and try again.");
    }
  };

  if (!authLoading && !user) {
    return <Navigate to="/login" replace />;
  }

  // Styled Loading Screen
  if (loading || authLoading) {
    return (
      <main className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center font-sans">
        <h1 className="text-2xl md:text-4xl font-bold animate-pulse text-transparent bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text">
          Loading your interview plan...
        </h1>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col justify-between p-4 md:p-8 font-sans">
      
      {/* Page Header */}
      <header className="max-w-4xl mx-auto text-center my-8 md:my-12">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
          Create Your Custom{" "}
          <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
            Interview Plan
          </span>
        </h1>
        <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto">
          Let our AI analyze the job requirements and your unique profile to
          build a winning strategy.
        </p>
      </header>

      {/* Main Card */}
      <div className="max-w-5xl mx-auto w-full bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden my-auto flex flex-col">
        
        <div className="flex flex-col lg:flex-row p-6 md:p-8 gap-8">
          
          {/* Left Panel - White Theme */}
          <div className="flex-1 flex flex-col bg-white text-gray-900 p-6 rounded-2xl shadow-inner">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <span className="p-2 bg-gray-100 text-green-700 rounded-lg flex items-center justify-center border border-gray-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  </svg>
                </span>
                <h2 className="text-lg font-bold text-gray-900">Target Job Description</h2>
              </div>
              <span className="px-2.5 py-1 text-xs font-semibold bg-red-100 text-red-600 border border-red-200 rounded-full">
                Required
              </span>
            </div>

            <textarea
              onChange={(e) => setJobDescription(e.target.value)}
              value={jobDescription}
              maxLength={5000}
              className="w-full flex-1 min-h-[250px] lg:min-h-[380px] bg-gray-50 border border-gray-300 rounded-xl p-4 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 focus:bg-white resize-y transition-all shadow-sm"
              placeholder={`Paste the full job description here...\ne.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...'`}
            />

            <div className="text-right text-xs font-medium text-gray-500 mt-2">
              {jobDescription.length} / 5000 chars
            </div>
          </div>

          {/* Panel Divider */}
          <div className="hidden lg:block w-px bg-gray-800 my-2"></div>
          <div className="block lg:hidden h-px w-full bg-gray-800 my-2"></div>

          {/* Right Panel - Green 700 Theme */}
          <div className="flex-1 flex flex-col justify-between gap-5 bg-green-700 text-white p-6 rounded-2xl shadow-lg border border-green-600">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <span className="p-2 bg-green-800/80 text-white rounded-lg flex items-center justify-center border border-green-600/50 shadow-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
                <h2 className="text-lg font-bold text-white tracking-wide">Your Profile</h2>
              </div>

              {/* Upload Section */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-white-100">
                    Upload Resume
                  </label>
                  <span className="px-2 py-0.5 text-[11px] font-bold bg-white text-green-500 border border-white backdrop-blur-md rounded-full shadow-sm">
                    Best Results
                  </span>
                </div>

                <label className="border-2 border-dashed border-green-500 hover:border-green-300 bg-green-800/40 hover:bg-green-800/70 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all group">
                  <span className="p-3 bg-green-800 group-hover:bg-green-600 text-green-200 group-hover:text-white rounded-full mb-3 transition-colors shadow-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="16 16 12 12 8 16" />
                      <line x1="12" y1="12" x2="12" y2="21" />
                      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                    </svg>
                  </span>
                  <p className="text-sm font-semibold text-white">
                    Click to upload or drag &amp; drop
                  </p>
                  <p className="text-xs text-green-200/80 mt-1">
                    PDF or DOCX (Max 5MB)
                  </p>
                  <input 
                    ref={resumeInputRef} 
                    hidden 
                    type="file" 
                    id="resume" 
                    name="resume" 
                    accept=".pdf,.docx" 
                  />
                </label>
              </div>

              {/* OR Divider */}
              <div className="flex items-center my-4">
                <div className="flex-grow h-px bg-green-600"></div>
                <span className="flex-shrink text-xs text-green-200 px-3 font-bold tracking-wider">
                  OR
                </span>
                <div className="flex-grow h-px bg-green-600"></div>
              </div>

              {/* Self Description */}
              <div className="flex flex-col gap-2">
                <label
                  className="text-sm font-semibold text-green-100"
                  htmlFor="selfDescription"
                >
                  Quick Self-Description
                </label>
                <textarea
                  onChange={(e) => setSelfDescription(e.target.value)}
                  value={selfDescription}
                  id="selfDescription"
                  name="selfDescription"
                  className="w-full h-28 bg-green-800/60 border border-green-500/80 rounded-xl p-3.5 text-sm text-white placeholder-green-300/60 focus:outline-none focus:border-white focus:ring-1 focus:ring-white resize-none transition-all shadow-inner"
                  placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
                />
              </div>
            </div>

            {/* Info Box */}
            <div className="flex items-start gap-3 p-3.5 bg-green-800/80 border border-green-600 rounded-xl text-xs text-green-100 leading-relaxed shadow-sm">
              <span className="text-white mt-0.5 flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" stroke="#15803d" strokeWidth="2" />
                  <line x1="12" y1="16" x2="12.01" y2="16" stroke="#15803d" strokeWidth="2" />
                </svg>
              </span>
              <p>
                Either a <strong className="text-white underline decoration-green-400">Resume</strong> or a{" "}
                <strong className="text-white underline decoration-green-400">Self Description</strong> is required to generate a
                personalized plan.
              </p>
            </div>

          </div>
        </div>

        {/* Card Footer */}
        <div className="bg-gray-950/80 border-t border-gray-800 px-6 py-4 md:px-8 flex flex-col items-center gap-4">
          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-gray-400 font-medium">
              AI-Powered Strategy Generation • Approx 30s
            </span>

            <button 
              onClick={handleGenerateReport}
              className="w-full sm:w-auto px-6 py-3 bg-green-600 hover:bg-green-500 active:bg-green-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-green-600/20 hover:shadow-green-600/30 flex items-center justify-center gap-2 transition-all"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
              </svg>
              Generate My Interview Strategy
            </button>
          </div>
          {errorMsg && (
            <div className="w-full text-center text-sm font-semibold text-red-500 bg-red-950/40 border border-red-800/50 p-2 rounded-lg mt-2">
              {errorMsg}
            </div>
          )}
        </div>

      </div>

      {/* Recent Reports List */}
      {reports && reports.length > 0 && (
        <section className="max-w-5xl mx-auto w-full mt-12 mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-gray-100 mb-6">My Recent Interview Plans</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {reports.map(report => (
              <li 
                key={report._id} 
                onClick={() => navigate(`/interview/${report._id}`)}
                className="bg-gray-900 border border-gray-800 hover:border-green-500 rounded-xl p-5 cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 group"
              >
                <h3 className="text-lg font-bold text-gray-100 group-hover:text-green-400 transition-colors mb-2 truncate">
                  {report.title || 'Untitled Position'}
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Generated on {new Date(report.createdAt).toLocaleDateString()}
                </p>
                <span 
                  className={`inline-block px-3 py-1 text-xs font-bold rounded-md ${
                    report.matchScore >= 80 ? 'bg-green-900/40 text-green-400 border border-green-800' : 
                    report.matchScore >= 60 ? 'bg-yellow-900/40 text-yellow-400 border border-yellow-800' : 
                    'bg-red-900/40 text-red-400 border border-red-800'
                  }`}
                >
                  Match Score: {report.matchScore}%
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Page Footer */}
      <footer className="max-w-5xl mx-auto w-full flex justify-center gap-6 text-xs text-gray-500 my-8">
        <a href="#" className="hover:text-gray-400 transition-colors">Privacy Policy</a>
        <a href="#" className="hover:text-gray-400 transition-colors">Terms of Service</a>
        <a href="#" className="hover:text-gray-400 transition-colors">Help Center</a>
      </footer>

    </div>
  );
}

export default Home;