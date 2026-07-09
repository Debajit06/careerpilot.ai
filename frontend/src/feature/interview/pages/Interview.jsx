import React, { useState, useEffect } from 'react'
import { useInterview } from '../hooks/useInterview.js'
import { useAuth } from '../../auth/hooks/useAuth.js'
import { useNavigate, useParams, Navigate } from 'react-router-dom'

const NAV_ITEMS = [
    { id: 'technical', label: 'Technical Questions', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>) },
    { id: 'behavioral', label: 'Behavioral Questions', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>) },
    { id: 'roadmap', label: 'Road Map', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11" /></svg>) },
]

// ── Sub-components ────────────────────────────────────────────────────────────
const QuestionCard = ({ item, index }) => {
    const [open, setOpen] = useState(false)

    return (
        <div className='border border-zinc-800 bg-zinc-900/50 rounded-xl overflow-hidden mb-4 transition-all duration-300 hover:border-zinc-700'>
            <div
                className='p-5 flex items-start gap-4 cursor-pointer hover:bg-zinc-800/50 transition-colors' 
                onClick={() => setOpen(o => !o)}
            >
                <span className='flex-shrink-0 w-8 h-8 flex items-center justify-center bg-green-500/10 text-green-500 font-bold rounded-lg text-sm border border-green-500/20'>
                    Q{index + 1}
                </span>
                <p className='flex-1 font-medium text-zinc-200 mt-1 leading-relaxed'>
                    {item.question}
                </p>
                <span className={`text-zinc-500 mt-1 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                </span>
            </div>
            
            {open && (
                <div className='p-5 border-t border-zinc-800 bg-zinc-900/30 flex flex-col gap-6 animate-in slide-in-from-top-2 duration-200'>
                    <div className='flex flex-col gap-2'>
                        <span className='text-xs font-bold uppercase tracking-widest text-green-500/80'>Intention</span>
                        <p className='text-zinc-400 text-sm leading-relaxed'>{item.intention}</p>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <span className='text-xs font-bold uppercase tracking-widest text-green-500/80'>Model Answer</span>
                        <p className='text-zinc-300 text-sm leading-relaxed'>{item.answer}</p>
                    </div>
                </div>
            )}
        </div>
    )
}

const RoadMapDay = ({ day }) => (
    <div className='border-l-2 border-green-500/30 pl-8 pb-10 relative last:border-transparent last:pb-0'>
        {/* Timeline Dot */}
        <div className='absolute -left-[9px] top-1 w-4 h-4 bg-black border-2 border-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.4)]'></div>
        
        <div className='mb-5'>
            <span className='inline-block px-3 py-1 bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold uppercase tracking-wider rounded-md mb-3'>
                Day {day.day}
            </span>
            <h3 className='text-xl font-semibold text-white'>{day.focus}</h3>
        </div>
        <ul className='flex flex-col gap-3 text-zinc-400 text-sm'>
            {day.tasks.map((task, i) => (
                <li key={i} className='flex items-start gap-3'>
                    <span className='mt-1.5 w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0' />
                    <span className='leading-relaxed'>{task}</span>
                </li>
            ))}
        </ul>
    </div>
)

// ── Main Component ────────────────────────────────────────────────────────────
const Interview = () => {
    const { user, loading: authLoading, handleLogout } = useAuth()
    const [activeNav, setActiveNav] = useState('technical')
    const { report, getReportById, loading, getResumePdf, loadingText } = useInterview()
    const { interviewId } = useParams()
    const navigate = useNavigate()

    if (!authLoading && !user) {
        return <Navigate to="/login" replace />
    }

    if (loading || authLoading) {
        return (
            <main className='min-h-screen bg-black flex items-center justify-center text-green-500'>
                <div className='flex flex-col items-center gap-4'>
                    <div className='w-8 h-8 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin'></div>
                    <h1 className='text-lg font-medium tracking-wide'>{authLoading ? 'Loading your account...' : loadingText}</h1>
                </div>
            </main>
        )
    }

    if (!report) {
        return (
            <main className='min-h-screen bg-black flex items-center justify-center text-red-500 font-sans p-4'>
                <div className='flex flex-col items-center text-center max-w-md gap-6 bg-zinc-900/50 border border-zinc-800 p-8 rounded-2xl'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                    <div className='flex flex-col gap-2'>
                        <h1 className='text-xl font-bold text-white'>Report Not Found</h1>
                        <p className='text-zinc-400 text-sm leading-relaxed'>
                            This interview strategy plan could not be found, or you do not have permission to view it.
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/')}
                        className='w-full px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-semibold transition-colors border border-zinc-700'
                    >
                        Back to Home
                    </button>
                </div>
            </main>
        )
    }

    const scoreRingColor =
        report.matchScore >= 80 ? 'border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.2)]' :
        report.matchScore >= 60 ? 'border-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.2)]' : 
        'border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)]'

    return (
        <div className='min-h-screen bg-black text-zinc-200 p-4 md:p-8 font-sans selection:bg-green-500/30 flex flex-col gap-8'>
            {/* Top Navbar */}
            <nav className="w-full max-w-7xl mx-auto flex items-center justify-between py-4 border-b border-zinc-800">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
                    <img src="/logo.png" alt="CareerPilot Logo" className="w-8 h-8 object-contain rounded-lg" />
                    <span className="font-bold text-lg text-white tracking-wide">CareerPilot.ai</span>
                </div>
                <div className="flex items-center gap-4">
                    {user && (
                        <div className="hidden sm:flex flex-col items-end text-right">
                            <span className="text-sm font-semibold text-zinc-200">{user.username}</span>
                            <span className="text-xs text-zinc-500">{user.email}</span>
                        </div>
                    )}
                    <button 
                        onClick={handleLogout}
                        className="px-4 py-2 text-xs font-semibold text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-xl transition-all flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        Logout
                    </button>
                </div>
            </nav>

            <div className='max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 lg:gap-12 w-full'>

                {/* ── Left Nav ── */}
                <nav className='w-full lg:w-64 flex-shrink-0 flex flex-col gap-8'>
                    <div className="flex flex-col gap-2 sticky top-8">
                        <p className='text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3 pl-2'>Sections</p>
                        {NAV_ITEMS.map(item => {
                            const isActive = activeNav === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveNav(item.id)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
                                        isActive 
                                        ? 'bg-green-500/10 text-green-400 border border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.05)]' 
                                        : 'text-zinc-400 hover:bg-zinc-900 hover:text-white border border-transparent'
                                    }`}
                                >
                                    <span className={`${isActive ? 'text-green-400' : 'text-zinc-500'}`}>
                                        {item.icon}
                                    </span>
                                    {item.label}
                                </button>
                            )
                        })}

                        <button
                            onClick={() => { getResumePdf(interviewId) }}
                            className='mt-8 flex items-center justify-center gap-2 w-full px-4 py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-medium transition-colors shadow-[0_4px_14px_0_rgba(22,163,74,0.39)] hover:shadow-[0_6px_20px_rgba(22,163,74,0.23)]'
                        >
                            <svg className='w-4 h-4' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M10.6144 17.7956 11.492 15.7854C12.2731 13.9966 13.6789 12.5726 15.4325 11.7942L17.8482 10.7219C18.6162 10.381 18.6162 9.26368 17.8482 8.92277L15.5079 7.88394C13.7092 7.08552 12.2782 5.60881 11.5105 3.75894L10.6215 1.61673C10.2916.821765 9.19319.821767 8.8633 1.61673L7.97427 3.75892C7.20657 5.60881 5.77553 7.08552 3.97685 7.88394L1.63658 8.92277C.868537 9.26368.868536 10.381 1.63658 10.7219L4.0523 11.7942C5.80589 12.5726 7.21171 13.9966 7.99275 15.7854L8.8704 17.7956C9.20776 18.5682 10.277 18.5682 10.6144 17.7956ZM19.4014 22.6899 19.6482 22.1242C20.0882 21.1156 20.8807 20.3125 21.8695 19.8732L22.6299 19.5353C23.0412 19.3526 23.0412 18.7549 22.6299 18.5722L21.9121 18.2532C20.8978 17.8026 20.0911 16.9698 19.6586 15.9269L19.4052 15.3156C19.2285 14.8896 18.6395 14.8896 18.4628 15.3156L18.2094 15.9269C17.777 16.9698 16.9703 17.8026 15.956 18.2532L15.2381 18.5722C14.8269 18.7549 14.8269 19.3526 15.2381 19.5353L15.9985 19.8732C16.9874 20.3125 17.7798 21.1156 18.2198 22.1242L18.4667 22.6899C18.6473 23.104 19.2207 23.104 19.4014 22.6899Z"></path>
                            </svg>
                            Download Resume
                        </button>
                    </div>
                </nav>

                {/* Divider (Desktop only) */}
                <div className='hidden lg:block w-px bg-zinc-800' />

                {/* ── Center Content ── */}
                <main className='flex-1 min-w-0'>
                    {activeNav === 'technical' && (
                        <section className='animate-in fade-in duration-500'>
                            <div className='flex justify-between items-end border-b border-zinc-800 pb-5 mb-8'>
                                <div>
                                    <h2 className='text-3xl font-bold text-white mb-1'>Technical Questions</h2>
                                    <p className='text-zinc-400 text-sm'>Core competency and system design</p>
                                </div>
                                <span className='text-green-400 font-medium text-xs bg-green-500/10 px-3 py-1.5 rounded-full border border-green-500/20'>
                                    {report.technicalQuestions.length} questions
                                </span>
                            </div>
                            <div className='flex flex-col'>
                                {report.technicalQuestions.map((q, i) => (
                                    <QuestionCard key={i} item={q} index={i} />
                                ))}
                            </div>
                        </section>
                    )}

                    {activeNav === 'behavioral' && (
                        <section className='animate-in fade-in duration-500'>
                            <div className='flex justify-between items-end border-b border-zinc-800 pb-5 mb-8'>
                                <div>
                                    <h2 className='text-3xl font-bold text-white mb-1'>Behavioral Questions</h2>
                                    <p className='text-zinc-400 text-sm'>Culture fit and past experiences</p>
                                </div>
                                <span className='text-green-400 font-medium text-xs bg-green-500/10 px-3 py-1.5 rounded-full border border-green-500/20'>
                                    {report.behavioralQuestions.length} questions
                                </span>
                            </div>
                            <div className='flex flex-col'>
                                {report.behavioralQuestions.map((q, i) => (
                                    <QuestionCard key={i} item={q} index={i} />
                                ))}
                            </div>
                        </section>
                    )}

                    {activeNav === 'roadmap' && (
                        <section className='animate-in fade-in duration-500'>
                            <div className='flex justify-between items-end border-b border-zinc-800 pb-5 mb-8'>
                                <div>
                                    <h2 className='text-3xl font-bold text-white mb-1'>Preparation Road Map</h2>
                                    <p className='text-zinc-400 text-sm'>Day-by-day learning schedule</p>
                                </div>
                                <span className='text-green-400 font-medium text-xs bg-green-500/10 px-3 py-1.5 rounded-full border border-green-500/20'>
                                    {report.preparationPlan.length}-day plan
                                </span>
                            </div>
                            <div className='pt-4 pl-2'>
                                {report.preparationPlan.map((day) => (
                                    <RoadMapDay key={day.day} day={day} />
                                ))}
                            </div>
                        </section>
                    )}
                </main>

                {/* Divider (Desktop only) */}
                <div className='hidden lg:block w-px bg-zinc-800' />

                {/* ── Right Sidebar ── */}
                <aside className='w-full lg:w-72 flex-shrink-0 flex flex-col gap-6'>
                    
                    {/* Match Score */}
                    <div className='bg-zinc-900/40 border border-zinc-800 p-8 rounded-2xl flex flex-col items-center text-center'>
                        <p className='text-zinc-400 font-semibold text-sm uppercase tracking-widest mb-6'>Match Score</p>
                        <div className={`w-36 h-36 rounded-full flex flex-col items-center justify-center border-4 ${scoreRingColor} bg-black/50 mb-6`}>
                            <div className='flex items-baseline'>
                                <span className='text-5xl font-bold text-white'>{report.matchScore}</span>
                                <span className='text-2xl text-zinc-400 font-light ml-1'>%</span>
                            </div>
                        </div>
                        <p className='text-green-400 text-sm font-medium bg-green-500/10 px-4 py-1.5 rounded-full border border-green-500/20'>
                            Strong match for this role
                        </p>
                    </div>

                    {/* Skill Gaps */}
                    <div className='bg-zinc-900/40 border border-zinc-800 p-6 rounded-2xl'>
                        <div className='flex items-center gap-2 mb-5'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                            <p className='text-zinc-400 font-semibold text-sm uppercase tracking-widest'>Skill Gaps</p>
                        </div>
                        <div className='flex flex-wrap gap-2'>
                            {report.skillGaps.map((gap, i) => (
                                <span 
                                    key={i} 
                                    className={`px-3 py-1.5 text-xs font-medium rounded-md border 
                                        ${gap.severity === 'high' 
                                            ? 'bg-red-500/10 text-red-400 border-red-500/20' 
                                            : gap.severity === 'medium'
                                                ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                                : 'bg-zinc-800 text-zinc-300 border-zinc-700'
                                        }`}
                                >
                                    {gap.skill}
                                </span>
                            ))}
                        </div>
                    </div>

                </aside>
            </div>
        </div>
    )
}

export default Interview