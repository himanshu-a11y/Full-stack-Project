import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans overflow-x-hidden">
      {/* Hero Section - Refined Light Version */}
      <section className="relative pt-32 pb-24 px-6 lg:px-12 overflow-hidden bg-white">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-40">
           <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand-blue/10 rounded-full blur-[100px] animate-pulse"></div>
           <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-brand-accent/5 rounded-full blur-[100px] animate-pulse delay-700"></div>
        </div>
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-blue/5 border border-brand-blue/10 mb-8">
             <span className="w-2 h-2 rounded-full bg-brand-blue animate-pulse"></span>
             <span className="text-[10px] font-bold text-brand-blue uppercase tracking-[0.2em]">Bridge the gap between skills and jobs</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-8 leading-tight">
            The Smartest Way to <span className="text-brand-blue">Empower</span> <br/>
            Your Skilled <span className="text-brand-blue italic">Career</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
            SkillBridge is a professional platform dedicated to connecting ITI students with quality employers across Gujarat through verified data and intelligent matching.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link to="/student/register" className="w-full sm:w-auto">
              <Button fullWidth className="text-sm font-bold uppercase tracking-widest bg-brand-blue py-4 px-10 rounded-xl shadow-lg shadow-brand-blue/20 hover:shadow-xl hover:-translate-y-0.5 transition-all">I am a Student</Button>
            </Link>
            <Link to="/employer/register" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-10 py-4 rounded-xl bg-white border border-slate-200 text-slate-700 text-sm font-bold uppercase tracking-widest hover:bg-slate-50 hover:border-slate-300 shadow-sm transition-all">I am an Employer</button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 lg:px-12 bg-brand-mint border-t border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-xs font-black text-brand-blue uppercase tracking-[0.3em] mb-4">How it works</h2>
            <h3 className="text-3xl font-bold text-slate-900">Built for Professional <span className="text-brand-blue italic">Efficiency</span></h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-10 border-0 shadow-soft hover:shadow-card transition-all duration-300 rounded-2xl bg-white group">
              <div className="bg-brand-blue/10 w-14 h-14 rounded-xl flex items-center justify-center mb-8 text-brand-blue group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4 tracking-tight">Verified Profiles</h3>
              <p className="text-slate-500 leading-relaxed font-medium text-sm">Students create detailed digital resumes verified by trade, district, and certification standards.</p>
            </Card>

            <Card className="p-10 border-0 shadow-soft hover:shadow-card transition-all duration-300 rounded-2xl bg-white group">
              <div className="bg-emerald-50 w-14 h-14 rounded-xl flex items-center justify-center mb-8 text-emerald-600 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4 tracking-tight">Precision Matching</h3>
              <p className="text-slate-500 leading-relaxed font-medium text-sm">Our algorithm ranks candidates based on exactly what employers need, ensuring the perfect fit every time.</p>
            </Card>

            <Card className="p-10 border-0 shadow-soft hover:shadow-card transition-all duration-300 rounded-2xl bg-white group">
              <div className="bg-blue-50 w-14 h-14 rounded-xl flex items-center justify-center mb-8 text-brand-blue group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4 tracking-tight">Seamless Hiring</h3>
              <p className="text-slate-500 leading-relaxed font-medium text-sm">Employers manage recruitment through a centralized dashboard, making the process faster and more reliable.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
