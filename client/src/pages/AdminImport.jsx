import { useState, useRef } from 'react';
import axios from '../api/axios';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import Sidebar from '../components/ui/Sidebar';

const AdminImport = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

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
  ];

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      setError('');
    } else {
      setError('Please select a valid CSV file.');
      setFile(null);
    }
  };

  const downloadSampleCSV = () => {
    const headers = 'name,email,phone,trade,district,certifications,status\n';
    const row1 = 'John Doe,john@example.com,9876543210,Electrician,Ahmedabad,"NTC, NAC",Active\n';
    const row2 = 'Jane Smith,jane@example.com,9876543211,Fitter,Surat,NTC,Active\n';
    const csvContent = headers + row1 + row2;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_students.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const handleImport = async () => {
    if (!file) return;

    setLoading(true);
    setError('');
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('/api/admin/import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(res.data);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      setError(err.response?.data?.message || 'Import failed. Ensure your CSV format is correct.');
      if (err.response?.data?.errors) {
        setResult({ errors: err.response.data.errors, inserted: 0, updated: 0 });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-[#F8FAFC] h-screen overflow-hidden font-sans">
      <div className="hidden lg:block h-full shrink-0">
        <Sidebar 
          links={sidebarLinks} 
          title="ADMIN PORTAL" 
          roleBadge={{ type: 'admin', label: 'Admin Panel' }}
        />
      </div>

      <div className="flex-1 overflow-y-auto h-screen p-6 lg:p-12 max-w-5xl mx-auto w-full scrollbar-hide">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Bulk <span className="text-brand-blue">Data Import</span></h1>
            <p className="text-slate-500 mt-2 font-medium">Populate student records using standardized CSV batches.</p>
          </div>
          <Button 
            variant="outline" 
            onClick={downloadSampleCSV}
            className="rounded-2xl border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
          >
            Download Sample CSV
          </Button>
        </header>

        <Card className="p-10 border-none bg-white shadow-xl shadow-slate-200/50 rounded-[3rem] mb-10">
          <div className="mb-10">
            <h2 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight">Upload Manifest</h2>
            <p className="text-slate-500 text-sm font-medium">Select a correctly formatted .csv file to begin processing.</p>
          </div>

          {error && <Alert variant="error" className="mb-8 rounded-[2rem] font-bold">{error}</Alert>}

          <div 
            onClick={() => fileInputRef.current?.click()}
            className="group border-2 border-dashed border-slate-200 rounded-[2.5rem] p-16 text-center bg-slate-50/50 hover:bg-white hover:border-brand-blue transition-all cursor-pointer mb-10 relative overflow-hidden"
          >
            <input 
              type="file" 
              accept=".csv" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <div className="relative z-10">
              <div className="w-20 h-20 bg-white rounded-3xl shadow-lg flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                <svg className="h-10 w-10 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <p className="text-lg font-black text-slate-900 mb-2">
                {file ? file.name : 'Drop your CSV here'}
              </p>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.2em]">Limit: 5MB • Standardized Schema Only</p>
            </div>
          </div>

          <div className="flex justify-end">
            <Button 
              onClick={handleImport} 
              disabled={!file || loading}
              loading={loading}
              className="h-14 px-10 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-slate-900/20 hover:bg-black transition-all"
            >
              Initialize Import Pipeline
            </Button>
          </div>
        </Card>

        {result && (
          <Card className="p-10 border-none bg-slate-900 text-white shadow-2xl shadow-slate-900/30 rounded-[3rem] animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-2xl font-black tracking-tight">Process Report</h3>
              <div className="flex gap-2">
                <div className="px-4 py-2 bg-emerald-500/20 rounded-xl border border-emerald-500/30">
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Success</p>
                  <p className="text-lg font-black">{result.inserted + result.updated}</p>
                </div>
                <div className="px-4 py-2 bg-rose-500/20 rounded-xl border border-rose-500/30">
                  <p className="text-[10px] font-black uppercase tracking-widest text-rose-400">Failures</p>
                  <p className="text-lg font-black">{result.errors?.length || 0}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-10">
              <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">New Students</p>
                <p className="text-3xl font-black text-emerald-400">+{result.inserted || 0}</p>
              </div>
              <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Records Updated</p>
                <p className="text-3xl font-black text-brand-blue">{result.updated || 0}</p>
              </div>
            </div>

            {result.errors && result.errors.length > 0 && (
              <div className="pt-8 border-t border-white/10">
                <h4 className="text-sm font-black text-rose-400 uppercase tracking-widest mb-4">Error Log</h4>
                <div className="space-y-3 max-h-60 overflow-y-auto pr-4 scrollbar-hide">
                  {result.errors.map((err, idx) => (
                    <div key={idx} className="p-4 bg-rose-500/10 rounded-2xl border border-rose-500/20 flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-rose-500/20 flex-shrink-0 flex items-center justify-center text-[10px] font-black text-rose-400">!</div>
                      <p className="text-xs font-medium text-rose-200">
                        <span className="font-black text-rose-400 uppercase mr-2 tracking-widest">Row {err.row || idx + 1}:</span> {err.message}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminImport;
