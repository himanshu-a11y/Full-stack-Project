import { useState, useRef } from 'react';
import axios from '../api/axios';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';

const AdminImport = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-extrabold text-brand-navy mb-8">Admin Dashboard</h1>

        <Card className="p-8 border-t-4 border-t-brand-blue">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Bulk Import Students</h2>
            <p className="text-gray-600 text-sm">Upload a CSV file containing student records to populate the database.</p>
          </div>

          {error && <Alert variant="error" className="mb-6">{error}</Alert>}
          {result && (
            <Alert variant="success" className="mb-6">
              Import Successful! Inserted: {result.inserted}, Updated: {result.updated}
              {result.errors.length > 0 && (
                <div className="mt-2 text-xs">
                  Errors: {result.errors.length} (Check console for details)
                </div>
              )}
            </Alert>
          )}

          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer mb-6"
          >
            <input 
              type="file" 
              accept=".csv" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-sm text-gray-600 font-medium mb-1">
              {file ? file.name : 'Click to upload or drag and drop'}
            </p>
            <p className="text-xs text-gray-500">CSV files only (Max 5MB)</p>
          </div>

          <div className="flex justify-end">
            <Button 
              onClick={handleImport} 
              disabled={!file || loading}
              loading={loading}
            >
              Import Data
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminImport;
