import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../api/axios';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import Footer from '../components/Footer';

const StudentLogin = () => {
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
        role: 'student',
      });
      localStorage.setItem('skillbridge_token', res.data.token);
      localStorage.setItem('skillbridge_role', 'student');
      window.dispatchEvent(new Event('auth-change'));
      navigate('/student/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-[calc(100vh-64px)] relative overflow-hidden bg-[#f8fafc] flex items-center justify-center p-4">
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
                  <path d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
              </div>
              <h2 className="text-3xl font-extrabold text-brand-navy tracking-tight mb-2">Student Login</h2>
              <p className="text-gray-500 text-sm">Welcome back! Access your career opportunities.</p>
            </div>

            {error && <Alert variant="error" className="mb-6">{error}</Alert>}

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Email Address"
                type="email"
                name="email"
                placeholder="student@example.com"
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
                  {loading ? 'Authenticating...' : 'Sign In'}
                </Button>
              </div>
            </form>

            <div className="mt-10 pt-6 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-500">
                Don't have an account?{' '}
                <Link 
                  to="/student/register" 
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

export default StudentLogin;
