import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import axios from '../api/axios';

const AdminImport = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

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
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-extrabold text-brand-navy mb-8">Admin Dashboard</h1>

        <Card className="p-8 border-t-4 border-t-brand-blue">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Bulk Import Students</h2>
            <p className="text-gray-600 text-sm">Upload a CSV file containing student records to populate the database.</p>
          </div>

          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer mb-6"
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
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-sm text-gray-600 font-medium mb-1">
              {file ? `Selected: ${file.name}` : 'Click to upload or drag and drop'}
            </p>
            <p className="text-xs text-gray-500">CSV files only (Max 5MB)</p>
          </div>

          {message && (
            <Alert type={messageType} className="mb-6">
              {message}
            </Alert>
          )}

          <div className="flex justify-end">
            <Button onClick={handleUpload} disabled={!file || uploading}>
              {uploading ? 'Importing...' : 'Import Data'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminImport;
