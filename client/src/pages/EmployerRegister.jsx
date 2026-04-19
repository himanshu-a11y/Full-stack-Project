import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../api/axios';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import Alert from '../components/ui/Alert';

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
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-card-hover md:my-10">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-brand-navy tracking-tight mb-2">Employer Registration</h2>
          <p className="text-gray-600 text-sm">Post jobs and find skilled ITI candidates</p>
        </div>

        {error && <Alert variant="error" className="mb-6">{error}</Alert>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Company Name"
            type="text"
            name="companyName"
            placeholder="e.g. Tata Motors Ltd"
            value={formData.companyName}
            onChange={handleChange}
            required
          />

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
            placeholder="Minimum 6 characters"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <Input
            label="City"
            type="text"
            name="city"
            placeholder="e.g. Ahmedabad"
            value={formData.city}
            onChange={handleChange}
            required
          />

          <div className="pt-3">
            <Button type="submit" loading={loading} fullWidth>
              {loading ? 'Registering...' : 'Register as Employer'}
            </Button>
          </div>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/employer/login" className="text-brand-blue font-medium hover:underline">Login here</Link>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default EmployerRegister;