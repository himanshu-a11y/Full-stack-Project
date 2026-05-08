import { useState, useEffect } from 'react';
import axios from '../api/axios';
import Sidebar from '../components/ui/Sidebar';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const Chat = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const role = localStorage.getItem('skillbridge_role');

  const getUserId = () => {
    const token = localStorage.getItem('skillbridge_token');
    if (!token) return null;
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
      return JSON.parse(jsonPayload).id;
    } catch (e) {
      return null;
    }
  };

  const userId = getUserId();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const endpoint = role === 'student' ? '/api/applications/student' : '/api/applications/employer';
        const res = await axios.get(endpoint);
        const accepted = res.data.applications?.filter(app => app.status === 'accepted') || [];
        setConversations(accepted);
        if (accepted.length > 0) setSelectedConv(accepted[0]);
      } catch (err) {
        console.error("Failed to fetch conversations", err);
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, [role]);

  useEffect(() => {
    if (!selectedConv) return;
    const otherId = role === 'student' ? selectedConv.employerId?._id : selectedConv.studentId?._id;
    if (!otherId) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get(`/api/messages/${otherId}`);
        setMessages(res.data.messages || []);
        // Mark as read
        if (res.data.messages?.some(m => m.receiverId === userId && !m.isRead)) {
           await axios.patch(`/api/messages/read/${otherId}`);
        }
      } catch (err) {
        console.error("Failed to fetch messages", err);
      }
    };
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000); // Simple polling for "real-time"
    return () => clearInterval(interval);
  }, [selectedConv, role, userId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConv) return;

    const otherId = role === 'student' ? selectedConv.employerId?._id : selectedConv.studentId?._id;
    
    try {
      await axios.post('/api/messages', {
        receiverId: otherId,
        senderModel: role === 'student' ? 'Student' : 'Employer',
        receiverModel: role === 'student' ? 'Employer' : 'Student',
        content: newMessage
      });
      setNewMessage('');
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  const sidebarLinks = role === 'student' ? [
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
  ] : [
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

  return (
    <div className="flex bg-[#F0FDF4] h-screen overflow-hidden font-sans">
      <div className="hidden md:block h-full shrink-0">
        <Sidebar links={sidebarLinks} title="MESSAGES" roleBadge={{ type: role, label: 'Chat Center' }} />
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Contacts Sidebar */}
        <div className="w-full md:w-80 border-r border-slate-100 bg-white flex flex-col">
          <div className="p-6 border-b border-slate-100">
             <h2 className="text-xl font-black text-slate-900 tracking-tight">Chats</h2>
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            {conversations.length === 0 ? (
              <div className="p-8 text-center"><p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No active chats.</p></div>
            ) : (
              conversations.map(conv => (
                <div 
                  key={conv._id} 
                  onClick={() => setSelectedConv(conv)}
                  className={`p-6 cursor-pointer border-b border-slate-50 transition-all ${selectedConv?._id === conv._id ? 'bg-brand-blue/5 border-l-4 border-l-brand-blue' : 'hover:bg-slate-50'}`}
                >
                  <h4 className="font-black text-slate-900 truncate">
                    {role === 'student' ? conv.employerId?.name : conv.studentId?.name}
                  </h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                    Job: {conv.jobId?.title}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-slate-50/50">
          {selectedConv ? (
            <>
              <div className="p-6 bg-white border-b border-slate-100 flex items-center justify-between">
                <div>
                   <h3 className="font-black text-slate-900">{role === 'student' ? selectedConv.employerId?.name : selectedConv.studentId?.name}</h3>
                   <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Active Connection</span>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.senderId === userId ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] p-4 rounded-2xl shadow-sm font-medium text-sm ${msg.senderId === userId ? 'bg-brand-blue text-white rounded-tr-none' : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'}`}>
                      {msg.content}
                      <p className={`text-[9px] mt-2 opacity-60 ${msg.senderId === userId ? 'text-white' : 'text-slate-400'}`}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} className="p-6 bg-white border-t border-slate-100 flex gap-4">
                <input 
                  type="text" 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-6 py-4 rounded-2xl bg-slate-50 border-0 outline-none focus:ring-2 focus:ring-brand-blue text-sm font-medium"
                />
                <Button type="submit" className="bg-brand-blue px-8">Send</Button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
               <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                 <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
               </div>
               <h3 className="text-xl font-black text-slate-900 mb-2">Your Conversations</h3>
               <p className="text-slate-500 text-sm max-w-xs">Select a contact from the left to start discussing job opportunities.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
