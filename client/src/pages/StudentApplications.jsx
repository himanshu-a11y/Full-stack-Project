import { useState, useEffect } from 'react';
import axios from '../api/axios';
import Sidebar from '../components/ui/Sidebar';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { useNavigate } from 'react-router-dom';

const StudentApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get('/api/applications/student');
        setApplications(res.data.applications || []);
      } catch (err) {
        console.error("Failed to fetch applications", err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const sidebarLinks = [
    {
      label: 'Dashboard',
      to: '/student/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      label: 'My Profile',
      to: '/student/profile',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      label: 'Browse Jobs',
      to: '/jobs',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      label: 'Applications',
      to: '/student/applications',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
    },
    {
      label: 'Messages',
      to: '/messages',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
    },
  ];

  if (loading) return <div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue"></div></div>;

  return (
    <div className="flex bg-[#F0FDF4] h-screen overflow-hidden font-sans">
      <Sidebar links={sidebarLinks} title="STUDENT NAVIGATION" roleBadge={{ type: 'student', label: 'Student Portal' }} />

      <div className="flex-1 overflow-y-auto h-full p-6 pt-24 lg:p-12 w-full scrollbar-hide">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-black text-slate-900 mb-8 tracking-tight">My Applications</h1>
          
          <div className="grid gap-6">
            {applications.length === 0 ? (
              <Card className="p-12 text-center border-dashed">
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-4">You haven't applied for any jobs yet.</p>
                <Button onClick={() => navigate('/jobs')} variant="outline">Browse Jobs Now</Button>
              </Card>
            ) : (
              applications.map(app => (
                <Card key={app._id} className="p-8 border-0 shadow-soft bg-white hover:shadow-card transition-all">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                         <h3 className="text-xl font-black text-slate-900">{app.jobId?.title}</h3>
                         <Badge variant={app.status === 'pending' ? 'orange' : app.status === 'accepted' ? 'green' : 'red'} className="text-[9px] uppercase font-black tracking-widest">
                           {app.status}
                         </Badge>
                      </div>
                       <div className="flex items-center gap-2 mb-4">
                        <p className="text-slate-500 font-medium text-sm">Employer: <span className="text-brand-blue font-bold">{app.employerId?.companyName || 'Private Employer'}</span></p>
                        {app.employerId?.isVerified ? (
                          <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                            <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                            Verified
                          </span>
                        ) : (
                          <span className="text-[9px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
                            Pending Approval
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Applied on {new Date(app.appliedAt).toLocaleDateString()}</p>
                    </div>

                    <div className="flex gap-3">
                      {app.status === 'accepted' ? (
                        <Button onClick={() => navigate('/messages')} className="bg-slate-900 text-white shadow-xl shadow-slate-200 flex items-center gap-2">
                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                           Chat with Employer
                        </Button>
                      ) : (
                        <Button variant="outline" className="opacity-50 cursor-not-allowed">Application {app.status}</Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentApplications;
