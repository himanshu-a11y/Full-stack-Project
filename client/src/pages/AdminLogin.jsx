import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../api/axios';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import Footer from '../components/Footer';

const AdminLogin = () => {
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
        role: 'admin',
      });
      localStorage.setItem('skillbridge_token', res.data.token);
      localStorage.setItem('skillbridge_role', 'admin');
      window.dispatchEvent(new Event('auth-change'));
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Admin login failed. Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen relative overflow-hidden bg-[#F8FAFC] flex items-center justify-center p-4 py-20">
        {/* Dynamic Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-slate-900/[0.03] blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-blue/[0.03] blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="w-full max-w-[440px] relative z-10">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-slate-900 text-white mb-6 shadow-2xl shadow-slate-900/20 transition-transform duration-700 hover:rotate-[360deg]">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3">Admin Access</h1>
            <p className="text-slate-500 font-medium tracking-wide">Enter secure credentials to manage the portal</p>
            <div className="mt-4 inline-block px-4 py-2 bg-slate-100 rounded-xl text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Hint: admin@skillbridge.gov / admin123
            </div>
          </div>

          <Card className="p-10 shadow-2xl shadow-slate-200/60 rounded-[3rem] border-none bg-white/80 backdrop-blur-xl">
            {error && <Alert variant="error" className="mb-8 rounded-2xl font-bold">{error}</Alert>}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-6">
                <Input
                  label="ADMIN EMAIL"
                  type="email"
                  name="email"
                  placeholder="admin@skillbridge.gov"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="bg-slate-50/50 border-slate-100 focus:bg-white transition-all h-14 font-bold"
                />
                <Input
                  label="PASSWORD"
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="bg-slate-50/50 border-slate-100 focus:bg-white transition-all h-14 font-bold"
                />
              </div>

              <Button 
                type="submit" 
                loading={loading} 
                fullWidth 
                className="h-14 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-slate-900/20 hover:bg-black hover:-translate-y-1 active:translate-y-0 transition-all"
              >
                Initialize Session
              </Button>
            </form>

            <div className="mt-10 pt-8 border-t border-slate-50 text-center">
              <Link to="/" className="text-xs font-black text-slate-400 hover:text-slate-900 uppercase tracking-widest transition-colors flex items-center justify-center gap-2 font-bold">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Return to Public Portal
              </Link>
            </div>
          </Card>
          
          <p className="mt-8 text-center text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
            Secure Infrastructure &copy; 2026 SkillBridge
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AdminLogin;
