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
      localStorage.setItem('skillbridge_user_id', res.data.profile._id);
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
      <div className="min-h-[calc(100vh-64px)] relative overflow-hidden bg-[#F0FDF4] flex items-center justify-center p-4">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-brand-blue/5 blur-[100px] animate-pulse" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-navy/5 blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="w-full max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Card className="p-8 md:p-10 shadow-[0_20px_50px_rgba(31,56,100,0.1)] border-t-4 border-t-brand-blue backdrop-blur-sm bg-white/90 transition-all duration-300 hover:shadow-[0_25px_60px_rgba(31,56,100,0.15)]">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-blue/10 text-brand-blue mb-4 transition-transform duration-500 hover:scale-110">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h2 className="text-3xl font-extrabold text-brand-navy tracking-tight mb-2">Employer Login</h2>
              <p className="text-gray-500 text-sm">Post jobs and find top ITI talent for your organization.</p>
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
                className="transition-all duration-200 focus:ring-4 focus:ring-brand-blue/10"
              />

              <Input
                label="Password"
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                className="transition-all duration-200 focus:ring-4 focus:ring-brand-blue/10"
              />

              <div className="pt-2">
                <Button 
                  type="submit" 
                  loading={loading} 
                  fullWidth 
                  className="py-3.5 shadow-lg shadow-brand-navy/20 active:scale-[0.98] transition-all"
                >
                  {loading ? 'Logging in...' : 'Login as Employer'}
                </Button>
              </div>
            </form>

            <div className="mt-10 pt-6 border-t border-gray-100 text-center space-y-3">
              <p className="text-sm text-gray-500">
                Don't have an employer account?{' '}
                <Link 
                  to="/employer/register" 
                  className="text-brand-blue font-bold hover:text-brand-navy transition-colors underline-offset-4 hover:underline"
                >
                  Register here
                </Link>
              </p>
            </div>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default EmployerLogin;