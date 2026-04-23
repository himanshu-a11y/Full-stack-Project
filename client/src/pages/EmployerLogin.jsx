import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../api/axios';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
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
      navigate('/employer/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-[calc(100vh-64px)] bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-card-hover md:my-10">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-brand-navy tracking-tight mb-2">Employer Login</h2>
          <p className="text-gray-600 text-sm">Access your dashboard and manage job postings</p>
        </div>

        {error && <Alert variant="error" className="mb-6">{error}</Alert>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Email"
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
            <Button type="submit" loading={loading} fullWidth>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </div>
        </form>

        <div className="mt-8 text-center space-y-3">
          <p className="text-sm text-gray-600">
            New employer?{' '}
            <Link to="/employer/register" className="text-brand-blue font-medium hover:underline">Register here</Link>
          </p>
          <div className="h-px bg-gray-200 w-full my-4"></div>
          <p className="text-sm text-gray-600">
            Are you a student?{' '}
            <Link to="/student/login" className="text-brand-blue font-medium hover:underline">Student login</Link>
          </p>
        </div>
      </Card>
    </div>
    <Footer />
  </>
  );
};

export default EmployerLogin;