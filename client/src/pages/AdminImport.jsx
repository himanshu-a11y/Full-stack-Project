import React, { useState } from 'react';
import axios from '../api/axios';
import Sidebar from '../components/ui/Sidebar';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';

const AdminImport = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

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

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type !== 'text/csv') {
      setMessage('Please select a valid CSV file.');
      setMessageType('error');
      setFile(null);
      return;
    }
    setFile(selectedFile);
    setMessage('');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type !== 'text/csv') {
      setMessage('Please select a valid CSV file.');
      setMessageType('error');
      setFile(null);
      return;
    }
    setFile(droppedFile);
    setMessage('');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Please select a file first.');
      setMessageType('error');
      return;
    }

    setUploading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/api/admin/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage(`Successfully imported ${response.data.inserted + response.data.updated} students (${response.data.inserted} new, ${response.data.updated} updated).`);
      setMessageType('success');
      setFile(null);
    } catch (error) {
      console.error('Upload error:', error);
      setMessage(error.response?.data?.message || 'Failed to import data. Please try again.');
      setMessageType('error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex bg-[#F8FAFC] h-screen overflow-hidden font-sans">
      <Sidebar 
        links={sidebarLinks} 
        title="ADMIN NAVIGATION" 
        roleBadge={{ type: 'admin', label: 'Admin Panel' }}
        user={{ name: 'SkillBridge Admin' }}
      />

      <div className="flex-1 overflow-y-auto h-screen p-6 pt-24 lg:p-12 max-w-5xl mx-auto w-full scrollbar-hide">
        <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Bulk Student <span className="text-brand-blue">Import</span></h1>
            <p className="text-slate-500 mt-2 font-medium">Upload institutional CSV records to verify and match students.</p>
          </div>
        </div>

        <Card className="p-10 border-none bg-white shadow-2xl shadow-slate-200/50 rounded-[3rem]">
          <div className="mb-10 text-center">
            <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">Institutional Data Sync</h2>
            <p className="text-slate-500 font-medium">Select your prepared CSV file to begin the synchronization process.</p>
          </div>

          <div
            className="border-4 border-dashed border-slate-100 rounded-[2.5rem] p-16 text-center bg-slate-50/50 hover:bg-slate-50 hover:border-brand-blue/30 transition-all cursor-pointer mb-10 group"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => document.getElementById('file-input').click()}
          >
            <input
              id="file-input"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-slate-200 group-hover:scale-110 transition-transform">
              <svg className="w-10 h-10 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <p className="text-lg font-black text-slate-900 mb-1">
              {file ? file.name : 'Click to select CSV'}
            </p>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
              {file ? 'File ready for sync' : 'Institutional format required (Max 5MB)'}
            </p>
          </div>

          {message && (
            <Alert variant={messageType === 'success' ? 'success' : 'error'} className="mb-10 rounded-[2rem] p-6 font-bold">
              {message}
            </Alert>
          )}

          <div className="flex justify-center">
            <Button 
              onClick={handleUpload} 
              disabled={!file || uploading}
              className="bg-slate-900 text-white rounded-2xl h-14 px-12 font-black uppercase tracking-[0.2em] shadow-xl shadow-slate-900/20 hover:bg-black transition-all disabled:opacity-50"
            >
              {uploading ? 'Syncing...' : 'Start Institutional Sync'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminImport;
