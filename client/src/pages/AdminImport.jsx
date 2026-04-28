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
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-brand-navy">Admin Dashboard</h1>
          <Button variant="outline" onClick={downloadSampleCSV}>
            Download Sample CSV
          </Button>
        </div>

        <Card className="p-8 border-t-4 border-t-brand-blue mb-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Bulk Import Students</h2>
            <p className="text-gray-600 text-sm">Upload a CSV file containing student records to populate the database.</p>
            <p className="text-xs text-brand-blue mt-2 font-medium">
              Note: CSV must include headers: name, email, phone, trade, district, certifications, status
            </p>
          </div>

          {error && <Alert variant="error" className="mb-6">{error}</Alert>}

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
              Upload & Import
            </Button>
          </div>
        </Card>

        {result && (
          <Card className="p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Import Results</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-3 px-4 font-semibold text-sm text-gray-600">Inserted</th>
                    <th className="py-3 px-4 font-semibold text-sm text-gray-600">Updated</th>
                    <th className="py-3 px-4 font-semibold text-sm text-gray-600">Errors</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-4 text-green-600 font-bold">{result.inserted || 0}</td>
                    <td className="py-4 px-4 text-blue-600 font-bold">{result.updated || 0}</td>
                    <td className="py-4 px-4 text-red-600 font-bold">{result.errors?.length || 0}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {result.errors && result.errors.length > 0 && (
              <div className="mt-8">
                <h4 className="text-sm font-bold text-red-600 mb-2">Error Details:</h4>
                <div className="bg-red-50 rounded-lg p-4 max-h-60 overflow-y-auto">
                  <ul className="space-y-2">
                    {result.errors.map((err, idx) => (
                      <li key={idx} className="text-xs text-red-800">
                        <span className="font-bold">Row {err.row || idx + 1}:</span> {err.message}
                      </li>
                    ))}
                  </ul>
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
