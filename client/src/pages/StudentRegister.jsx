import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../api/axios';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import Footer from '../components/Footer';

const TRADES = ['Electrician', 'Fitter', 'Welder', 'Turner', 'Mechanic', 'Plumber', 'Carpenter', 'Painter', 'Draughtsman', 'COPA'];
const DISTRICTS = ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar', 'Mehsana', 'Anand', 'Bhavnagar', 'Jamnagar', 'Junagadh'];
const CERTIFICATIONS = ['NCVT', 'SCVT', 'NAC', 'CTI', 'CITS', 'NIMI'];

const StudentRegister = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    trade: '',
    district: '',
    certifications: []
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCertChange = (cert) => {
    const current = formData.certifications;
    if (current.includes(cert)) {
      setFormData({ ...formData, certifications: current.filter((c) => c !== cert) });
    } else {
      setFormData({ ...formData, certifications: [...current, cert] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post('/api/student/register', formData);
      localStorage.setItem('skillbridge_token', res.data.token);
      localStorage.setItem('skillbridge_role', 'student');
      window.dispatchEvent(new Event('auth-change'));
      navigate('/student/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-[calc(100vh-64px)] relative overflow-hidden bg-[#f8fafc] flex items-center justify-center p-4 py-12">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-5%] right-[-5%] w-[40%] h-[40%] rounded-full bg-brand-blue/5 blur-[100px] animate-pulse" />
          <div className="absolute bottom-[-5%] left-[-5%] w-[40%] h-[40%] rounded-full bg-brand-navy/5 blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="w-full max-w-2xl relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Card className="p-8 md:p-10 shadow-[0_20px_50px_rgba(31,56,100,0.1)] border-t-4 border-t-brand-blue backdrop-blur-sm bg-white/90 transition-all duration-300 hover:shadow-[0_25px_60px_rgba(31,56,100,0.15)]">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-blue/10 text-brand-blue mb-4 transition-transform duration-500 hover:scale-110">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
              </div>
              <h2 className="text-3xl font-extrabold text-brand-navy tracking-tight mb-2">Student Registration</h2>
              <p className="text-gray-500 text-sm">Create your profile to get discovered by employers</p>
            </div>

            {error && <Alert variant="error" className="mb-6">{error}</Alert>}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  label="Full Name"
                  type="text"
                  name="name"
                  placeholder="Raju Patel"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="transition-all duration-200 focus:ring-4 focus:ring-brand-blue/10"
                />
                <Input
                  label="Phone Number"
                  type="tel"
                  name="phone"
                  placeholder="9876543210"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="transition-all duration-200 focus:ring-4 focus:ring-brand-blue/10"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  label="Email Address"
                  type="email"
                  name="email"
                  placeholder="raju@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="transition-all duration-200 focus:ring-4 focus:ring-brand-blue/10"
                />
                <Input
                  label="Password"
                  type="password"
                  name="password"
                  placeholder="Min 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="transition-all duration-200 focus:ring-4 focus:ring-brand-blue/10"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-brand-navy">ITI Trade</label>
                  <select
                    name="trade"
                    value={formData.trade}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 text-sm rounded-lg border border-gray-200 bg-white focus:ring-4 focus:ring-brand-blue/10 focus:border-brand-blue outline-none transition-all"
                  >
                    <option value="">Select your trade...</option>
                    {TRADES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-brand-navy">District</label>
                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 text-sm rounded-lg border border-gray-200 bg-white focus:ring-4 focus:ring-brand-blue/10 focus:border-brand-blue outline-none transition-all"
                  >
                    <option value="">Select your district...</option>
                    {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-sm font-semibold text-brand-navy">Certifications (Optional)</label>
                <div className="flex flex-wrap gap-3 p-5 border border-gray-100 rounded-xl bg-slate-50/50">
                  {CERTIFICATIONS.map((cert) => (
                    <label key={cert} className={`flex items-center gap-2 cursor-pointer text-xs font-medium px-4 py-2 rounded-full border transition-all ${formData.certifications.includes(cert) ? 'bg-brand-blue text-white border-brand-blue shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-brand-blue'}`}>
                      <input
                        type="checkbox"
                        checked={formData.certifications.includes(cert)}
                        onChange={() => handleCertChange(cert)}
                        className="hidden"
                      />
                      {cert}
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <Button 
                  type="submit" 
                  loading={loading} 
                  fullWidth 
                  className="py-4 shadow-lg shadow-brand-navy/20 active:scale-[0.98] transition-all"
                >
                  {loading ? 'Creating Profile...' : 'Complete Registration'}
                </Button>
              </div>
            </form>

            <div className="mt-10 pt-6 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-500">
                Already registered?{' '}
                <Link 
                  to="/student/login" 
                  className="text-brand-blue font-bold hover:text-brand-navy transition-colors underline-offset-4 hover:underline"
                >
                  Log in here
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

export default StudentRegister;
