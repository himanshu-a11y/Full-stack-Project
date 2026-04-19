import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../api/axios';
import { TRADES, DISTRICTS, CERTIFICATIONS } from '../../../shared/constants';
import Sidebar from '../components/ui/Sidebar';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';

const PostJob = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    trade: '',
    district: '',
    certRequired: [],
    description: '',
  });

  const [myJobs, setMyJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchMyJobs = async () => {
      try {
        const res = await axios.get('/api/jobs?page=1&limit=50');
        setMyJobs(res.data.jobs || []);
      } catch (err) {
        console.error('Could not load jobs:', err);
      } finally {
        setJobsLoading(false);
      }
    };
    fetchMyJobs();
  }, [success]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCertChange = (cert) => {
    const current = formData.certRequired;
    if (current.includes(cert)) {
      setFormData({ ...formData, certRequired: current.filter((c) => c !== cert) });
    } else {
      setFormData({ ...formData, certRequired: [...current, cert] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await axios.post('/api/jobs', formData);
      setSuccess('Job posted successfully! Job ID: ' + res.data.job._id);
      setFormData({ title: '', trade: '', district: '', certRequired: [], description: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const sidebarLinks = [
    {
      label: 'Post New Job',
      to: '/employer/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex bg-slate-50 min-h-[calc(100vh-64px)]">
      <div className="hidden md:block">
        <Sidebar links={sidebarLinks} title="Employer Panel" />
      </div>

      <div className="flex-1 p-6 md:p-10 max-w-5xl mx-auto overflow-y-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Employer Dashboard</h1>
          <p className="text-gray-600">Manage your job listings and find the best candidates.</p>
        </div>

        {/* Post Job Form */}
        <Card className="p-6 md:p-8 mb-10">
          <div className="border-b border-gray-100 pb-4 mb-6">
            <h2 className="text-xl font-semibold text-brand-navy">Post a New Job</h2>
            <p className="text-sm text-gray-500 mt-1">Fill out the requirements to find the right ITI candidate.</p>
          </div>

          {error && <Alert variant="error" className="mb-6">{error}</Alert>}
          {success && <Alert variant="success" className="mb-6">{success}</Alert>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Job Title"
              type="text"
              name="title"
              placeholder="e.g. Electrician Trainee"
              value={formData.title}
              onChange={handleChange}
              required
            />

            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Trade Required</label>
                <select
                  name="trade"
                  value={formData.trade}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-navy focus:border-transparent"
                >
                  <option value="">Select trade...</option>
                  {TRADES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">District</label>
                <select
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-navy focus:border-transparent"
                >
                  <option value="">Select district...</option>
                  {DISTRICTS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Certifications Required</label>
              <div className="flex flex-wrap gap-3 p-4 border border-gray-200 rounded-lg bg-gray-50">
                {CERTIFICATIONS.map((cert) => (
                  <label key={cert} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 hover:text-gray-900 bg-white px-3 py-1.5 rounded border border-gray-200 shadow-sm transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.certRequired.includes(cert)}
                      onChange={() => handleCertChange(cert)}
                      className="w-4 h-4 text-brand-navy rounded border-gray-300 focus:ring-brand-navy"
                    />
                    {cert}
                  </label>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Job Description</label>
              <textarea
                name="description"
                placeholder="Describe the role, responsibilities, and requirements..."
                value={formData.description}
                onChange={handleChange}
                rows={4}
                required
                className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-navy focus:border-transparent resize-y"
              />
            </div>

            <div className="pt-2">
              <Button type="submit" loading={loading}>
                {loading ? 'Posting...' : 'Post Job'}
              </Button>
            </div>
          </form>
        </Card>

        {/* My Posted Jobs Table */}
        <Card className="p-6 md:p-8">
          <div className="border-b border-gray-100 pb-4 mb-6">
            <h3 className="text-xl font-semibold text-brand-navy">My Posted Jobs</h3>
          </div>

          {jobsLoading ? (
            <div className="py-8 text-center text-gray-500">Loading jobs...</div>
          ) : myJobs.length === 0 ? (
            <div className="py-12 text-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <p className="text-gray-500">No jobs posted yet. Post your first job above.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 text-sm">
                    <th className="px-4 py-3 font-medium border-b border-gray-200 rounded-tl-lg">Title</th>
                    <th className="px-4 py-3 font-medium border-b border-gray-200">Trade</th>
                    <th className="px-4 py-3 font-medium border-b border-gray-200">District</th>
                    <th className="px-4 py-3 font-medium border-b border-gray-200 rounded-tr-lg">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-gray-700">
                  {myJobs.map((job) => (
                    <tr key={job._id} className="border-b border-gray-100 hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-4 font-medium text-gray-900">{job.title}</td>
                      <td className="px-4 py-4">{job.trade}</td>
                      <td className="px-4 py-4">{job.district}</td>
                      <td className="px-4 py-4">
                        <Link
                          to={`/employer/jobs/${job._id}/candidates`}
                          className="text-brand-blue font-medium hover:underline inline-flex items-center gap-1"
                        >
                          View Candidates
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default PostJob;