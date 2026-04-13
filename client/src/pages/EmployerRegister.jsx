import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../api/axios';

const EmployerRegister = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    password: '',
    city: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post('/api/employer/register', formData);
      localStorage.setItem('skillbridge_token', res.data.token);
      localStorage.setItem('skillbridge_role', 'employer');
      navigate('/employer/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Employer Registration</h2>
        <p style={styles.subtitle}>Post jobs and find skilled ITI candidates</p>

        {error && <div style={styles.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Company Name</label>
            <input
              style={styles.input}
              type="text"
              name="companyName"
              placeholder="e.g. Tata Motors Ltd"
              value={formData.companyName}
              onChange={handleChange}
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              style={styles.input}
              type="email"
              name="email"
              placeholder="hr@company.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              name="password"
              placeholder="Minimum 6 characters"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>City</label>
            <input
              style={styles.input}
              type="text"
              name="city"
              placeholder="e.g. Ahmedabad"
              value={formData.city}
              onChange={handleChange}
              required
            />
          </div>

          <button style={loading ? styles.btnDisabled : styles.btn} type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'Register as Employer'}
          </button>
        </form>

        <p style={styles.bottomText}>
          Already have an account?{' '}
          <Link to="/employer/login" style={styles.link}>Login here</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#F7F8FA',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 16px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '0.5px solid #E2E8F0',
    padding: '40px',
    width: '100%',
    maxWidth: '460px',
  },
  title: {
    fontSize: '22px',
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
  field: {
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
  bottomText: {
    textAlign: 'center',
    fontSize: '13px',
    color: '#718096',
    marginTop: '20px',
  },
  link: {
    color: '#1F3864',
    fontWeight: '500',
    textDecoration: 'none',
  },
};

export default EmployerRegister;