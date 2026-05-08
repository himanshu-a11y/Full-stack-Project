import React from 'react';
import Sidebar from '../components/ui/Sidebar';
import Card from '../components/ui/Card';

const AdminLogs = () => {
  const sidebarLinks = [
    {
      label: 'Admin Home',
      to: '/admin/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      label: 'Bulk Import',
      to: '/admin/import',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      ),
    },
    {
      label: 'User Audit',
      to: '/admin/users',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
    {
      label: 'System Logs',
      to: '/admin/logs',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
  ];

  const logs = [
    { id: 1, event: 'Bulk Import Started', user: 'Admin', time: '2024-05-04 10:30', status: 'Success' },
    { id: 2, event: 'Student Verification', user: 'Admin', target: 'student1@skillbridge.gov', time: '2024-05-04 11:15', status: 'Success' },
    { id: 3, event: 'New Job Posted', user: 'Employer1', time: '2024-05-04 12:00', status: 'Info' },
  ];

  return (
    <div className="flex bg-[#F8FAFC] h-screen overflow-hidden font-sans">
      <Sidebar 
        links={sidebarLinks} 
        title="ADMIN NAVIGATION" 
        roleBadge={{ type: 'admin', label: 'Admin Panel' }}
        user={{ name: 'SkillBridge Admin' }}
      />

      <div className="flex-1 overflow-y-auto h-screen p-6 pt-24 lg:p-12 max-w-5xl mx-auto w-full scrollbar-hide">
        <div className="mb-12">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">System <span className="text-brand-blue">Audit Logs</span></h1>
          <p className="text-slate-500 mt-2 font-medium">Tracking all critical administrative actions and system events.</p>
        </div>

        <Card className="p-0 border-none bg-white shadow-2xl shadow-slate-200/50 rounded-[3rem] overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Event</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">User</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Time</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <p className="text-sm font-black text-slate-900">{log.event}</p>
                    {log.target && <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{log.target}</p>}
                  </td>
                  <td className="px-8 py-6 text-sm font-bold text-slate-500">{log.user}</td>
                  <td className="px-8 py-6 text-sm font-bold text-slate-500">{log.time}</td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      log.status === 'Success' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-brand-blue'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogs;
