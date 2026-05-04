import { useState, useEffect } from 'react';
import axios from '../api/axios';
import Sidebar from '../components/ui/Sidebar';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { useNavigate } from 'react-router-dom';

const EmployerApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get('/api/applications/employer');
        setApplications(res.data.applications || []);
      } catch (err) {
        console.error("Failed to fetch applications", err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      await axios.patch(`/api/applications/${id}/status`, { status });
      setApplications(prev => prev.map(app => 
        app._id === id ? { ...app, status } : app
      ));
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const sidebarLinks = [
    {
      label: 'Dashboard',
      to: '/employer/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      label: 'Manage Applications',
      to: '/employer/applications',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
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
    {
      label: 'Post New Job',
      to: '/employer/post-job',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
        </svg>
      ),
    },
    {
      label: 'Company Profile',
      to: '/employer/profile',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
  ];

  if (loading) return <div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue"></div></div>;

  return (
    <div className="flex bg-[#F0FDF4] h-screen overflow-hidden font-sans">
      <div className="hidden md:block h-full shrink-0">
        <Sidebar links={sidebarLinks} title="EMPLOYER NAVIGATION" roleBadge={{ type: 'employer', label: 'Employer Hub' }} />
      </div>

      <div className="flex-1 overflow-y-auto h-full p-6 lg:p-12 w-full scrollbar-hide">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-black text-slate-900 mb-8 tracking-tight">Manage Applications</h1>
          
          <div className="grid gap-6">
            {applications.length === 0 ? (
              <Card className="p-12 text-center border-dashed"><p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No applications received yet.</p></Card>
            ) : (
              applications.map(app => (
                <Card key={app._id} className="p-8 border-0 shadow-soft bg-white hover:shadow-card transition-all">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                         <h3 className="text-xl font-black text-slate-900">{app.studentId?.name}</h3>
                         <Badge variant={app.status === 'pending' ? 'orange' : app.status === 'accepted' ? 'green' : 'red'} className="text-[9px] uppercase font-black tracking-widest">
                           {app.status}
                         </Badge>
                      </div>
                      <p className="text-slate-500 font-medium text-sm mb-4">Applied for: <span className="text-brand-blue font-bold">{app.jobId?.title}</span></p>
                      
                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                          {app.studentId?.trade}
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                          {app.studentId?.phone}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      {app.status === 'pending' ? (
                        <>
                          <Button onClick={() => handleStatusUpdate(app._id, 'accepted')} className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20">Accept Request</Button>
                          <Button onClick={() => handleStatusUpdate(app._id, 'rejected')} variant="outline" className="border-rose-100 text-rose-500 hover:bg-rose-50">Decline</Button>
                        </>
                      ) : app.status === 'accepted' ? (
                        <Button onClick={() => navigate('/messages')} className="bg-slate-900 text-white shadow-xl shadow-slate-200 flex items-center gap-2">
                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                           Chat Now
                        </Button>
                      ) : (
                        <span className="text-xs font-black text-rose-500 uppercase tracking-widest bg-rose-50 px-4 py-2 rounded-full">Rejected</span>
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

export default EmployerApplications;
