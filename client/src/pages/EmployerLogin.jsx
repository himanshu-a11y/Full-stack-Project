import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../api/axios';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import Footer from '../components/Footer';

const EmployerLogin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
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
      const res = await axios.post('/api/auth/login', {
        ...formData,
        role: 'employer',
      });
      localStorage.setItem('skillbridge_token', res.data.token);
      localStorage.setItem('skillbridge_role', 'employer');
      window.dispatchEvent(new Event('auth-change'));
      navigate('/employer/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-[calc(100vh-64px)] bg-slate-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 shadow-card-hover md:my-10 border-t-4 border-t-brand-blue">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-brand-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-brand-navy tracking-tight mb-2">Employer Login</h2>
            <p className="text-gray-600 text-sm">Post jobs and find top ITI talent for your organization.</p>
          </div>

          {error && <Alert variant="error" className="mb-6">{error}</Alert>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Work Email"
              type="email"
              name="email"
              placeholder="hr@company.com"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <div className="pt-2">
              <Button type="submit" loading={loading} fullWidth className="py-3">
                {loading ? 'Logging in...' : 'Login as Employer'}
              </Button>
            </div>
          </form>

          <div className="mt-8 text-center space-y-3">
            <p className="text-sm text-gray-600">
              Don't have an employer account?{' '}
              <Link to="/employer/register" className="text-brand-blue font-medium hover:underline">Register here</Link>
            </p>
          </div>
        </Card>
      </div>
      <Footer />
    </>
  );
};

export default EmployerLogin;