import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/ui/Sidebar';
import { useState, useEffect } from 'react';
import axios from '../api/axios';

const ApplicationSuccess = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const role = localStorage.getItem('skillbridge_role');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(role === 'employer' ? '/api/employer/profile' : '/api/student/profile');
        setUser(role === 'employer' ? res.data.employer : res.data.student);
      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    };
    fetchUser();
  }, [role]);

  const sidebarLinks = [
    { label: 'Dashboard', to: '/student/dashboard', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg> },
    { label: 'My Profile', to: '/student/profile', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> },
    { label: 'Browse Jobs', to: '/jobs', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> }
  ];

  return (
    <div className="flex bg-[#F0FDF4] h-screen items-center justify-center font-sans relative overflow-hidden">
      <div className="max-w-2xl w-full px-6 text-center z-10 animate-in zoom-in fade-in duration-1000">
        <div className="w-32 h-32 bg-emerald-500 rounded-[3.5rem] flex items-center justify-center mx-auto mb-12 shadow-3xl shadow-emerald-500/30 rotate-[12deg] hover:rotate-0 transition-transform duration-700">
          <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.5" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h1 className="text-6xl font-black text-slate-900 tracking-tighter mb-6 leading-none">Application <span className="text-emerald-500 italic">Sent!</span></h1>
        <p className="text-slate-500 text-xl font-medium mb-16 leading-relaxed max-w-lg mx-auto">Your verified profile has been shared with the employer. They will review your credentials and reach out directly for next steps.</p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <button onClick={() => navigate('/student/dashboard')} className="w-full sm:w-auto px-12 py-5 bg-slate-900 text-white font-black uppercase tracking-[0.25em] text-[11px] rounded-[2rem] hover:bg-black hover:-translate-y-1 transition-all shadow-2xl shadow-slate-900/10">Return to Dashboard</button>
          <button onClick={() => navigate('/jobs')} className="w-full sm:w-auto px-12 py-5 bg-white border-2 border-slate-100 text-slate-900 font-black uppercase tracking-[0.25em] text-[11px] rounded-[2rem] hover:bg-slate-50 hover:border-slate-200 hover:-translate-y-1 transition-all">Keep Browsing Jobs</button>
        </div>
      </div>

      {/* Decorative Background Accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-100/50 rounded-full blur-[120px] -mr-48 -mt-48 opacity-70"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100/50 rounded-full blur-[120px] -ml-48 -mb-48 opacity-70"></div>
    </div>
  );
};

export default ApplicationSuccess;
