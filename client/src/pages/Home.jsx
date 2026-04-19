import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Hero Section */}
      <section className="bg-white border-b border-gray-100 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-brand-navy tracking-tight mb-6 mt-10">
            Connecting Skilled Students with <span className="text-brand-blue">Opportunities</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            SkillBridge intelligently matches ITI graduates with employers based on trade, location, and certifications.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/student/register" className="w-full sm:w-auto">
              <Button fullWidth className="text-base !py-3 !px-8">I am a Student</Button>
            </Link>
            <Link to="/employer/register" className="w-full sm:w-auto">
              <Button variant="outline" fullWidth className="text-base !py-3 !px-8 bg-white">I am an Employer</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-brand-navy mb-4">Why use SkillBridge?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">We streamline the hiring process by bringing the talent and the opportunities into one smart platform.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-8 text-center hover:shadow-card-hover transition-shadow">
            <div className="bg-brand-light w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-blue">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            </div>
            <h3 className="text-xl font-bold text-brand-navy mb-3">Rich Profiles</h3>
            <p className="text-gray-600 leading-relaxed">Students can build detailed profiles highlighting their trades, district, and specific NCVT/SCVT certifications.</p>
          </Card>

          <Card className="p-8 text-center hover:shadow-card-hover transition-shadow">
            <div className="bg-brand-light w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-blue">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-brand-navy mb-3">Smart Matching</h3>
            <p className="text-gray-600 leading-relaxed">Our proprietary algorithm scores students based on precise job requirements, saving hours of manual resume screening.</p>
          </Card>

          <Card className="p-8 text-center hover:shadow-card-hover transition-shadow">
            <div className="bg-brand-light w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-blue">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-brand-navy mb-3">Easy Hiring</h3>
            <p className="text-gray-600 leading-relaxed">Employers can easily filter, rank, and contact the best fit candidates per open position directly.</p>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-navy text-white mt-auto py-12 px-4 sm:px-6 lg:px-8 border-t border-brand-navy">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
             <div className="bg-white/10 text-white p-1.5 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight">SkillBridge</span>
          </div>
          <div className="text-sm text-gray-300">
            &copy; {new Date().getFullYear()} SkillBridge Platform. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
