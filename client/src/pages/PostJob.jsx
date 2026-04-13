import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../api/axios';
import { TRADES, DISTRICTS, CERTIFICATIONS } from '../../../shared/constants';

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

  // Fetch existing jobs on page load
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

  return (
    <div style={styles.container}>

      {/* Post Job Form */}
      <div style={styles.card}>
        <h2 style={styles.title}>Post a New Job</h2>
        <p style={styles.subtitle}>Find the right ITI candidate for your requirement</p>

        {error && <div style={styles.errorBox}>{error}</div>}
        {success && (
          <div style={styles.successBox}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Job Title</label>
            <input
              style={styles.input}
              type="text"
              name="title"
              placeholder="e.g. Electrician Trainee"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div style={styles.row}>
            <div style={{ ...styles.field, flex: 1 }}>
              <label style={styles.label}>Trade Required</label>
              <select
                style={styles.input}
                name="trade"
                value={formData.trade}
                onChange={handleChange}
                required
              >
                <option value="">Select trade</option>
                {TRADES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div style={{ ...styles.field, flex: 1, marginLeft: '16px' }}>
              <label style={styles.label}>District</label>
              <select
                style={styles.input}
                name="district"
                value={formData.district}
                onChange={handleChange}
                required
              >
                <option value="">Select district</option>
                {DISTRICTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Certifications Required</label>
            <div style={styles.checkboxGroup}>
              {CERTIFICATIONS.map((cert) => (
                <label key={cert} style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={formData.certRequired.includes(cert)}
                    onChange={() => handleCertChange(cert)}
                    style={{ marginRight: '6px' }}
                  />
                  {cert}
                </label>
              ))}
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Job Description</label>
            <textarea
              style={styles.textarea}
              name="description"
              placeholder="Describe the role, responsibilities, and requirements..."
              value={formData.description}
              onChange={handleChange}
              rows={4}
              required
            />
          </div>

          <button
            style={loading ? styles.btnDisabled : styles.btn}
            type="submit"
            disabled={loading}
          >
            {loading ? 'Posting...' : 'Post Job'}
          </button>
        </form>
      </div>

      {/* My Posted Jobs Table */}
      <div style={styles.card}>
        <h3 style={styles.title}>My Posted Jobs</h3>

        {jobsLoading ? (
          <p style={{ color: '#718096', fontSize: '14px' }}>Loading jobs...</p>
        ) : myJobs.length === 0 ? (
          <p style={{ color: '#718096', fontSize: '14px' }}>
            No jobs posted yet. Post your first job above.
          </p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Title</th>
                <th style={styles.th}>Trade</th>
                <th style={styles.th}>District</th>
                <th style={styles.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {myJobs.map((job) => (
                <tr key={job._id}>
                  <td style={styles.td}>{job.title}</td>
                  <td style={styles.td}>{job.trade}</td>
                  <td style={styles.td}>{job.district}</td>
                  <td style={styles.td}>
                    <Link
                      to={`/employer/jobs/${job._id}/candidates`}
                      style={styles.viewLink}
                    >
                      View Candidates
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '40px 16px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '0.5px solid #E2E8F0',
    padding: '40px',
    marginBottom: '32px',
  },
  title: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1F3864',
    margin: '0 0 6px 0',
  },
  subtitle: {
    fontSize: '14px',
    color: '#718096',
    margin: '0 0 28px 0',
  },
  errorBox: {
    backgroundColor: '#FFF5F5',
    border: '1px solid #FEB2B2',
    color: '#C53030',
    padding: '10px 14px',
    borderRadius: '8px',
    fontSize: '14px',
    marginBottom: '16px',
  },
  successBox: {
    backgroundColor: '#F0FFF4',
    border: '1px solid #9AE6B4',
    color: '#276749',
    padding: '10px 14px',
    borderRadius: '8px',
    fontSize: '14px',
    marginBottom: '16px',
  },
  field: {
    marginBottom: '18px',
  },
  row: {
    display: 'flex',
    marginBottom: '18px',
  },
  label: {
    display: 'block',
    fontSize: '13px',
    fontWeight: '500',
    color: '#4A5568',
    marginBottom: '6px',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    fontSize: '14px',
    border: '1px solid #CBD5E0',
    borderRadius: '8px',
    outline: 'none',
    boxSizing: 'border-box',
    color: '#2D3748',
    backgroundColor: '#ffffff',
  },
  textarea: {
    width: '100%',
    padding: '10px 12px',
    fontSize: '14px',
    border: '1px solid #CBD5E0',
    borderRadius: '8px',
    outline: 'none',
    boxSizing: 'border-box',
    color: '#2D3748',
    resize: 'vertical',
  },
  checkboxGroup: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    padding: '10px',
    border: '1px solid #CBD5E0',
    borderRadius: '8px',
  },
  checkboxLabel: {
    fontSize: '13px',
    color: '#4A5568',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
  btn: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#1F3864',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '500',
    cursor: 'pointer',
    marginTop: '8px',
  },
  btnDisabled: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#A0AEC0',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    cursor: 'not-allowed',
    marginTop: '8px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px',
  },
  th: {
    textAlign: 'left',
    padding: '10px 12px',
    backgroundColor: '#EDF2F7',
    color: '#4A5568',
    fontWeight: '500',
    borderBottom: '1px solid #E2E8F0',
  },
  td: {
    padding: '10px 12px',
    borderBottom: '1px solid #E2E8F0',
    color: '#2D3748',
  },
  viewLink: {
    color: '#1F3864',
    fontWeight: '500',
    textDecoration: 'none',
    fontSize: '13px',
  },
};

export default PostJob;