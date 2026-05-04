import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import Sidebar from '../components/ui/Sidebar';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import Modal from '../components/ui/Modal';

const CandidateList = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cached, setCached] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [weights, setWeights] = useState({
    tradeW: 40,
    districtW: 30,
    certW: 30,
  });

  const [weightError, setWeightError] = useState('');

  const totalWeight = weights.tradeW + weights.districtW + weights.certW;

  const fetchCandidates = useCallback(async (w) => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(
        `/api/jobs/${id}/candidates?tradeW=${w.tradeW}&districtW=${w.districtW}&certW=${w.certW}`
      );
      setCandidates(res.data.candidates || []);
      setCached(res.data.cached || false);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Could not load candidates. Make sure the backend is running.'
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCandidates({ tradeW: 40, districtW: 30, certW: 30 });
  }, [fetchCandidates]);

  const handleWeightChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...weights, [name]: parseInt(value) };
    setWeights(updated);
    const total = updated.tradeW + updated.districtW + updated.certW;
    if (total !== 100) {
      setWeightError(`Weights must add up to 100. Current total: ${total}`);
    } else {
      setWeightError('');
    }
  };

  const handleRematch = () => {
    if (totalWeight !== 100) {
      setWeightError(`Weights must add up to 100. Current total: ${totalWeight}`);
      return;
    }
    fetchCandidates(weights);
  };

  const sidebarLinks = [
    {
      label: 'Dashboard',
      to: '/employer/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      label: 'Manage Applications',
      to: '/employer/applications',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: 'Messages',
      to: '/messages',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
    },
    {
      label: 'Post New Job',
      to: '/employer/post-job',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
        </svg>
      ),
    },
    {
      label: 'Company Profile',
      to: '/employer/profile',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex bg-[#F0FDF4] h-screen overflow-hidden font-sans">
      <Sidebar
        links={sidebarLinks}
        title="EMPLOYER PORTAL"
        roleBadge={{ type: 'employer', label: 'Employer Hub' }}
      />

      <div className="flex-1 overflow-y-auto h-screen p-6 pt-24 lg:p-12 max-w-7xl mx-auto w-full scrollbar-hide">
        {/* Main Content Area */}
        <div className="max-w-6xl mx-auto p-6 md:p-8 space-y-8">

          {/* Header Section */}
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Active Matching</span>
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Matched Candidates</h1>
              <p className="text-slate-500 font-medium">Discovering the best talent for Job #{id}</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end mr-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Source</span>
                {cached ? (
                  <span className="text-sm font-semibold text-emerald-600">Optimizer Cache</span>
                ) : (
                  <span className="text-sm font-semibold text-blue-600">Live Database</span>
                )}
              </div>
              <Button variant="outline" onClick={() => navigate('/employer/dashboard')} className="border-slate-200 hover:bg-white hover:shadow-sm">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Dashboard
              </Button>
            </div>
          </header>

          {error && <Alert variant="error" className="shadow-sm border-red-100">{error}</Alert>}

          {/* Engine Configuration Card */}
          <section>
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
              <div className="p-1 bg-gradient-to-r from-brand-navy via-brand-blue to-emerald-400"></div>
              <div className="p-6 md:p-10">
                <div className="flex items-start justify-between mb-8">
                  <div className="space-y-1">
                    <h2 className="text-xl font-bold text-slate-900">Matching Engine Tuning</h2>
                    <p className="text-sm text-slate-500">Adjust parameters to refine candidate ranking accuracy.</p>
                  </div>
                  <div className={`px-4 py-2 rounded-2xl text-sm font-bold border-2 transition-all ${totalWeight === 100 ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-rose-50 border-rose-200 text-rose-700 animate-pulse'}`}>
                    Total: {totalWeight}%
                  </div>
                </div>

                {weightError && <div className="mb-6 px-4 py-2 bg-rose-50 border-l-4 border-rose-500 text-rose-700 text-xs font-bold rounded-r-lg">{weightError}</div>}

                <div className="grid md:grid-cols-3 gap-8 mb-10">
                  {/* Trade Weight */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        </div>
                        <span className="text-sm font-bold text-slate-700">Trade Match</span>
                      </div>
                      <span className="text-lg font-black text-brand-navy">{weights.tradeW}%</span>
                    </div>
                    <input
                      type="range"
                      name="tradeW"
                      min="0"
                      max="100"
                      step="5"
                      value={weights.tradeW}
                      onChange={handleWeightChange}
                      className="w-full accent-brand-navy"
                    />
                  </div>

                  {/* District Weight */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        </div>
                        <span className="text-sm font-bold text-slate-700">District Match</span>
                      </div>
                      <span className="text-lg font-black text-brand-navy">{weights.districtW}%</span>
                    </div>
                    <input
                      type="range"
                      name="districtW"
                      min="0"
                      max="100"
                      step="5"
                      value={weights.districtW}
                      onChange={handleWeightChange}
                      className="w-full accent-brand-navy"
                    />
                  </div>

                  {/* Cert Weight */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
                        </div>
                        <span className="text-sm font-bold text-slate-700">Certifications</span>
                      </div>
                      <span className="text-lg font-black text-brand-navy">{weights.certW}%</span>
                    </div>
                    <input
                      type="range"
                      name="certW"
                      min="0"
                      max="100"
                      step="5"
                      value={weights.certW}
                      onChange={handleWeightChange}
                      className="w-full accent-brand-navy"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={handleRematch}
                    disabled={totalWeight !== 100 || loading}
                    className={`h-12 px-8 rounded-2xl font-bold transition-all ${totalWeight === 100 ? 'bg-brand-navy hover:bg-slate-800 text-white shadow-lg shadow-brand-navy/20' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Optimizing...
                      </span>
                    ) : 'Apply & Re-match Candidates'}
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Results Summary */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              Results Found
              <span className="inline-flex items-center justify-center bg-slate-200 text-slate-700 text-xs font-black px-2 py-0.5 rounded-full min-w-[24px]">
                {candidates.length}
              </span>
            </h2>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Ranked by score</div>
          </div>

          {/* Candidates Grid */}
          <div className="grid gap-6">
            {!loading && candidates.map((candidate, index) => (
              <div
                key={candidate._id}
                className="group relative bg-white rounded-[2rem] border border-slate-100 p-6 md:p-8 hover:border-brand-blue/30 hover:shadow-2xl hover:shadow-brand-blue/5 transition-all duration-500 overflow-hidden"
              >
                {/* Background Accent */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full -mr-32 -mt-32 opacity-50 group-hover:bg-brand-blue/5 transition-colors duration-500"></div>

                <div className="relative flex flex-col md:flex-row md:items-center gap-8">
                  {/* Rank Indicator */}
                  <div className="flex-shrink-0 flex flex-col items-center justify-center">
                    <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-2xl font-black shadow-lg transform group-hover:scale-110 transition-transform duration-500 ${index === 0 ? 'bg-amber-400 text-white' : index === 1 ? 'bg-slate-300 text-white' : index === 2 ? 'bg-orange-300 text-white' : 'bg-slate-100 text-slate-400'}`}>
                      {index + 1}
                    </div>
                  </div>

                  {/* Candidate Info */}
                  <div className="flex-grow space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-2xl font-black text-slate-900 group-hover:text-brand-blue transition-colors">{candidate.name}</h3>
                      {candidate.isVerified ? (
                        <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 shadow-sm" title="Institutional Verified">
                          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                          <span className="text-[10px] font-black uppercase tracking-widest">Verified</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100" title="Manual Registration - Not yet vetted">
                          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                          <span className="text-[10px] font-black uppercase tracking-widest">Unverified</span>
                        </div>
                      )}
                      {index === 0 && <span className="bg-brand-blue/10 text-brand-blue text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border border-brand-blue/20">Top Match</span>}
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                        {candidate.phone}
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400">•</div>
                      <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        {candidate.district}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4">
                      <div className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200">
                        {candidate.trade}
                      </div>
                      {candidate.certifications && candidate.certifications.map(cert => (
                        <div key={cert} className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-xl border border-amber-100">
                          {cert}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Score Visualization */}
                  <div className="flex-shrink-0 flex flex-col items-center md:items-end justify-center min-w-[120px]">
                    <div className="relative w-20 h-20 flex items-center justify-center">
                      <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="16" fill="none" stroke="#F1F5F9" strokeWidth="3" />
                        <circle
                          cx="18"
                          cy="18"
                          r="16"
                          fill="none"
                          stroke={candidate.score > 80 ? '#10B981' : candidate.score > 50 ? '#3B82F6' : '#94A3B8'}
                          strokeWidth="3"
                          strokeDasharray="100"
                          strokeDashoffset={100 - candidate.score}
                          strokeLinecap="round"
                          className="transition-all duration-1000 ease-out"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-xl font-black text-slate-900 leading-none">{candidate.score}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">pts</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* View Profile Action (SaaS style) */}
                <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="text-xs font-bold text-slate-400 italic">Candidate profile ready for review</div>
                  <Button 
                    variant="outline" 
                    className="text-xs font-bold rounded-xl h-9 hover:bg-slate-900 hover:text-white transition-all"
                    onClick={() => {
                      setSelectedCandidate(candidate);
                      setIsModalOpen(true);
                      // Increment view count when details are opened
                      axios.patch(`/api/student/${candidate._id}/view`).catch(err => console.error(err));
                    }}
                  >
                    Detailed Analytics
                    <svg className="w-3 h-3 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {!loading && !error && candidates.length === 0 && (
            <div className="py-24 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-200 shadow-inner">
              <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">No Talent Found</h3>
              <p className="text-slate-500 max-w-sm mx-auto font-medium">Try lowering some weights or expanding your search criteria to find potential matches.</p>
              <Button
                onClick={() => setWeights({ tradeW: 33, districtW: 33, certW: 34 })}
                className="mt-8 bg-slate-900 text-white rounded-2xl h-12 px-8 font-bold"
              >
                Reset to Balanced
              </Button>
            </div>
          )}

          {/* Loading Indicator */}
          {loading && (
            <div className="py-24 flex flex-col items-center justify-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-slate-100 border-t-brand-blue animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 bg-brand-blue/10 rounded-full animate-pulse"></div>
                </div>
              </div>
              <p className="text-slate-500 font-bold animate-pulse">Running talent matching algorithms...</p>
            </div>
          )}
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Candidate Detailed Analysis"
      >
        {selectedCandidate && (
          <div className="space-y-10">
            <div className="flex items-center gap-8">
              <div className="w-24 h-24 bg-brand-blue text-white rounded-[1.5rem] flex items-center justify-center text-4xl font-black shadow-xl shadow-brand-blue/20">
                {selectedCandidate.name.charAt(0)}
              </div>
              <div>
                <h4 className="text-3xl font-black text-slate-900 mb-2">{selectedCandidate.name}</h4>
                <div className="flex items-center gap-3">
                  {selectedCandidate.isVerified ? (
                    <Badge variant="green" className="px-4 py-1.5 text-[9px] uppercase font-black tracking-[0.2em] shadow-lg shadow-emerald-100">Verified Alumni</Badge>
                  ) : (
                    <Badge variant="orange" className="px-4 py-1.5 text-[9px] uppercase font-black tracking-[0.2em] shadow-lg shadow-orange-50 border border-orange-100">Unverified Account</Badge>
                  )}
                  <Badge variant="blue" className="px-4 py-1.5 text-[9px] uppercase font-black tracking-[0.2em] shadow-lg shadow-blue-50">{selectedCandidate.trade}</Badge>
                  <span className="text-slate-400 font-bold text-sm">•</span>
                  <span className="text-slate-500 font-bold text-sm">{selectedCandidate.district}, {selectedCandidate.state}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Overall Match Score</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black text-slate-900">{selectedCandidate.score}</span>
                  <span className="text-xl font-bold text-slate-400">/ 100</span>
                </div>
              </div>
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Contact Information</p>
                <p className="text-xl font-bold text-slate-900">{selectedCandidate.phone}</p>
                <p className="text-xs text-slate-500 mt-1 font-medium">Verified Phone Line</p>
              </div>
            </div>

            <div className="space-y-4">
              <h5 className="text-sm font-black text-slate-900 uppercase tracking-widest">Verified Certifications</h5>
              <div className="flex flex-wrap gap-3">
                {selectedCandidate.certifications?.length > 0 ? (
                  selectedCandidate.certifications.map(cert => (
                    <div key={cert} className="px-5 py-3 bg-white border-2 border-slate-100 rounded-2xl flex items-center gap-3 hover:border-brand-blue/30 transition-all">
                      <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                      </div>
                      <span className="text-sm font-bold text-slate-700">{cert}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-400 italic">No certifications listed</p>
                )}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex gap-4">
              <Button fullWidth className="bg-slate-900 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-slate-200">Download Resume</Button>
              <Button 
                fullWidth 
                variant="outline" 
                className="py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest"
                onClick={() => navigate('/messages')}
              >
                Initiate Chat
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CandidateList;
