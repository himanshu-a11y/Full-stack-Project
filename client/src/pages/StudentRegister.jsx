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
      setError(err.response?.data?.message || 'Registration failed. Note: Backend auth routes might be disabled.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-[calc(100vh-64px)] bg-slate-50 flex items-center justify-center p-4 py-12">
        <Card className="w-full max-w-2xl p-8 md:p-10 shadow-card-hover border-t-4 border-t-brand-blue">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-brand-navy tracking-tight mb-2">Student Registration</h2>
            <p className="text-gray-600 text-sm">Create your profile to get discovered by employers</p>
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
              />
              <Input
                label="Phone Number"
                type="tel"
                name="phone"
                placeholder="9876543210"
                value={formData.phone}
                onChange={handleChange}
                required
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
              />
              <Input
                label="Password"
                type="password"
                name="password"
                placeholder="Min 6 characters"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">ITI Trade</label>
                <select
                  name="trade"
                  value={formData.trade}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-brand-navy focus:border-transparent outline-none"
                >
                  <option value="">Select your trade...</option>
                  {TRADES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">District</label>
                <select
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-brand-navy focus:border-transparent outline-none"
                >
                  <option value="">Select your district...</option>
                  {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Certifications (Optional)</label>
              <div className="flex flex-wrap gap-3 p-4 border border-gray-200 rounded-lg bg-gray-50">
                {CERTIFICATIONS.map((cert) => (
                  <label key={cert} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 bg-white px-3 py-1.5 rounded border border-gray-200 shadow-sm">
                    <input
                      type="checkbox"
                      checked={formData.certifications.includes(cert)}
                      onChange={() => handleCertChange(cert)}
                      className="w-4 h-4 text-brand-navy rounded border-gray-300"
                    />
                    {cert}
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <Button type="submit" loading={loading} fullWidth className="!py-3">
                {loading ? 'Creating Profile...' : 'Complete Registration'}
              </Button>
            </div>
          </form>

          <div className="mt-8 text-center text-sm text-gray-600">
            Already registered?{' '}
            <Link to="/student/login" className="text-brand-blue font-medium hover:underline">Log in here</Link>
          </div>
        </Card>
      </div>
      <Footer />
    </>
  );
};

export default StudentRegister;
