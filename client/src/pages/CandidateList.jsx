import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import Sidebar from '../components/ui/Sidebar';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';

const CandidateList = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cached, setCached] = useState(false);

  const [weights, setWeights] = useState({
    tradeW: 40,
    districtW: 30,
    certW: 30,
  });

  const [weightError, setWeightError] = useState('');

  const totalWeight = weights.tradeW + weights.districtW + weights.certW;

  const fetchCandidates = async (w) => {
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
  };

  useEffect(() => {
    fetchCandidates(weights);
  }, []);

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
      label: 'Post New Job',
      to: '/employer/post-job',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
        </svg>
      ),
    },
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
      label: 'Browse Jobs',
      to: '/jobs',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex bg-slate-50 min-h-[calc(100vh-64px)]">
      <div className="hidden md:block">
        <Sidebar links={sidebarLinks} title="NAVIGATION" />
      </div>

      <div className="flex-1 p-6 md:p-10 max-w-5xl mx-auto overflow-y-auto w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Matched Candidates</h1>
            <p className="text-sm text-gray-600">Job ID: <span className="font-mono bg-gray-100 px-1 py-0.5 rounded">{id}</span></p>
          </div>
          <Button variant="outline" onClick={() => navigate('/employer/dashboard')} className="md:hidden">
            Back to Dashboard
          </Button>
        </div>

        {/* Cache indicator */}
        <div className="flex items-center gap-3 mb-8">
          {cached ? (
            <Badge variant="green" className="!px-3 !py-1">Served from cache</Badge>
          ) : (
            <Badge variant="blue" className="!px-3 !py-1">Fresh from database</Badge>
          )}
          <span className="text-sm text-gray-600 font-medium">
            {candidates.length} candidate{candidates.length !== 1 ? 's' : ''} found
          </span>
        </div>

        {/* Error state */}
        {error && <Alert variant="error" className="mb-6">{error}</Alert>}

        {/* Weight tuning controls */}
        <Card className="p-6 md:p-8 mb-8">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-brand-navy">Tune Matching Weights</h3>
            <p className="text-sm text-gray-500 mt-1">
              Adjust how much each factor matters. Total score weight must exactly equal 100.
            </p>
          </div>

          {weightError && <Alert variant="error" className="mb-4">{weightError}</Alert>}

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="space-y-3 mt-2">
              <label className="flex justify-between text-sm font-medium text-gray-700">
                <span>Trade match</span>
                <span className="text-brand-navy font-bold">{weights.tradeW} pts</span>
              </label>
              <input
                type="range"
                name="tradeW"
                min="0"
                max="100"
                step="5"
                value={weights.tradeW}
                onChange={handleWeightChange}
                className="w-full"
              />
            </div>

            <div className="space-y-3 mt-2">
              <label className="flex justify-between text-sm font-medium text-gray-700">
                <span>District match</span>
                <span className="text-brand-navy font-bold">{weights.districtW} pts</span>
              </label>
              <input
                type="range"
                name="districtW"
                min="0"
                max="100"
                step="5"
                value={weights.districtW}
                onChange={handleWeightChange}
                className="w-full"
              />
            </div>

            <div className="space-y-3 mt-2">
              <label className="flex justify-between text-sm font-medium text-gray-700">
                <span>Certification match</span>
                <span className="text-brand-navy font-bold">{weights.certW} pts</span>
              </label>
              <input
                type="range"
                name="certW"
                min="0"
                max="100"
                step="5"
                value={weights.certW}
                onChange={handleWeightChange}
                className="w-full"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-gray-100 gap-4">
            <span className={`text-sm font-semibold ${totalWeight === 100 ? 'text-emerald-700' : 'text-red-600'}`}>
              Total Weight: {totalWeight} / 100
            </span>
            <Button
              onClick={handleRematch}
              disabled={totalWeight !== 100}
              className="w-full sm:w-auto"
            >
              Re-match Candidates
            </Button>
          </div>
        </Card>

        {/* Loading state */}
        {loading && (
          <div className="py-16 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-navy mb-4"></div>
            <p className="text-gray-500 font-medium">Finding best candidates...</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && candidates.length === 0 && (
          <div className="py-16 text-center bg-white rounded-xl border border-dashed border-gray-300">
            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
            </div>
            <p className="text-gray-900 font-medium mb-1">No matching candidates found.</p>
            <p className="text-gray-500 text-sm">Try adjusting the weights or check that students are registered.</p>
          </div>
        )}

        {/* Candidate cards */}
        <div className="space-y-4">
          {!loading && candidates.map((candidate, index) => (
            <Card key={candidate._id} className="p-5 md:p-6 hover:shadow-md transition-shadow">

              {/* Rank + Name row */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-brand-light text-brand-blue flex items-center justify-center font-bold flex-shrink-0">
                  #{index + 1}
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">{candidate.name}</h3>
                  <p className="text-sm text-gray-500">{candidate.phone}</p>
                </div>
                <div className="ml-auto text-right">
                  <div className="text-2xl tracking-tight font-extrabold text-brand-navy">{candidate.score}</div>
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Points</div>
                </div>
              </div>

              {/* Score breakdown badges */}
              <div className="flex flex-wrap gap-x-6 gap-y-3 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Trade</span>
                  <Badge variant={candidate.score >= weights.tradeW ? 'blue' : 'gray'}>
                    {candidate.trade}
                  </Badge>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">District</span>
                  <Badge variant={candidate.score >= (weights.districtW) ? 'green' : 'gray'}>
                    {candidate.district}
                  </Badge>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Certifications</span>
                  <div className="flex gap-1.5 flex-wrap">
                    {candidate.certifications && candidate.certifications.length > 0
                      ? candidate.certifications.map((cert) => (
                        <Badge key={cert} variant="orange">{cert}</Badge>
                      ))
                      : <Badge variant="gray">None</Badge>
                    }
                  </div>
                </div>
              </div>

            </Card>
          ))}
        </div>

      </div>
    </div>
  );
};

export default CandidateList;