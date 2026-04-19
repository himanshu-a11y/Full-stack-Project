import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';

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

  return (
    <div style={styles.container}>

      {/* Header */}
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Matched Candidates</h2>
          <p style={styles.subtitle}>Job ID: {id}</p>
        </div>
        <button style={styles.backBtn} onClick={() => navigate('/employer/dashboard')}>
          Back to Dashboard
        </button>
      </div>

      {/* Cache indicator */}
      <div style={styles.cacheRow}>
        {cached ? (
          <span style={styles.cachedChip}>Served from cache</span>
        ) : (
          <span style={styles.freshChip}>Fresh from database</span>
        )}
        <span style={styles.countText}>
          {candidates.length} candidate{candidates.length !== 1 ? 's' : ''} found
        </span>
      </div>

      {/* Weight tuning controls */}
      <div style={styles.weightCard}>
        <h3 style={styles.weightTitle}>Tune Matching Weights</h3>
        <p style={styles.weightSubtitle}>
          Adjust how much each factor matters. Total must equal 100.
        </p>

        {weightError && <div style={styles.weightError}>{weightError}</div>}

        <div style={styles.sliderRow}>
          <div style={styles.sliderGroup}>
            <label style={styles.sliderLabel}>
              Trade match
              <span style={styles.sliderValue}>{weights.tradeW} pts</span>
            </label>
            <input
              type="range"
              name="tradeW"
              min="0"
              max="100"
              step="5"
              value={weights.tradeW}
              onChange={handleWeightChange}
              style={styles.slider}
            />
          </div>

          <div style={styles.sliderGroup}>
            <label style={styles.sliderLabel}>
              District match
              <span style={styles.sliderValue}>{weights.districtW} pts</span>
            </label>
            <input
              type="range"
              name="districtW"
              min="0"
              max="100"
              step="5"
              value={weights.districtW}
              onChange={handleWeightChange}
              style={styles.slider}
            />
          </div>

          <div style={styles.sliderGroup}>
            <label style={styles.sliderLabel}>
              Certification match
              <span style={styles.sliderValue}>{weights.certW} pts</span>
            </label>
            <input
              type="range"
              name="certW"
              min="0"
              max="100"
              step="5"
              value={weights.certW}
              onChange={handleWeightChange}
              style={styles.slider}
            />
          </div>
        </div>

        <div style={styles.totalRow}>
          <span style={totalWeight === 100 ? styles.totalGood : styles.totalBad}>
            Total: {totalWeight} / 100
          </span>
          <button
            style={totalWeight === 100 ? styles.rematchBtn : styles.rematchBtnDisabled}
            onClick={handleRematch}
            disabled={totalWeight !== 100}
          >
            Re-match Candidates
          </button>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div style={styles.errorBox}>
          {error}
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div style={styles.loadingBox}>
          Finding best candidates...
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && candidates.length === 0 && (
        <div style={styles.emptyBox}>
          No matching candidates found for this job.
          Try adjusting the weights or check that students are registered.
        </div>
      )}

      {/* Candidate cards */}
      {!loading && candidates.map((candidate, index) => (
        <div key={candidate._id} style={styles.candidateCard}>

          {/* Rank + Name row */}
          <div style={styles.cardHeader}>
            <div style={styles.rankCircle}>#{index + 1}</div>
            <div>
              <div style={styles.candidateName}>{candidate.name}</div>
              <div style={styles.candidatePhone}>{candidate.phone}</div>
            </div>
            <div style={styles.totalScore}>{candidate.score} pts</div>
          </div>

          {/* Score breakdown badges */}
          <div style={styles.badgeRow}>
            <div style={styles.badgeGroup}>
              <span style={styles.badgeLabel}>Trade</span>
              <span style={candidate.score >= weights.tradeW
                ? styles.badgeBlue
                : styles.badgeGray}>
                {candidate.trade}
              </span>
            </div>

            <div style={styles.badgeGroup}>
              <span style={styles.badgeLabel}>District</span>
              <span style={candidate.score >= weights.districtW
                ? styles.badgeGreen
                : styles.badgeGray}>
                {candidate.district}
              </span>
            </div>

            <div style={styles.badgeGroup}>
              <span style={styles.badgeLabel}>Certifications</span>
              {candidate.certifications && candidate.certifications.length > 0
                ? candidate.certifications.map((cert) => (
                    <span key={cert} style={styles.badgeOrange}>{cert}</span>
                  ))
                : <span style={styles.badgeGray}>None</span>
              }
            </div>
          </div>

        </div>
      ))}

    </div>
  );
};

const styles = {
  container: {
    maxWidth: '860px',
    margin: '0 auto',
    padding: '40px 16px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px',
  },
  title: {
    fontSize: '22px',
    fontWeight: '600',
    color: '#1F3864',
    margin: '0 0 4px 0',
  },
  subtitle: {
    fontSize: '13px',
    color: '#718096',
    margin: 0,
  },
  backBtn: {
    padding: '8px 16px',
    backgroundColor: 'transparent',
    border: '1px solid #CBD5E0',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    color: '#4A5568',
  },
  cacheRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '20px',
  },
  cachedChip: {
    backgroundColor: '#F0FFF4',
    color: '#276749',
    border: '1px solid #9AE6B4',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '500',
  },
  freshChip: {
    backgroundColor: '#EBF8FF',
    color: '#2B6CB0',
    border: '1px solid #90CDF4',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '500',
  },
  countText: {
    fontSize: '13px',
    color: '#718096',
  },
  weightCard: {
    backgroundColor: '#ffffff',
    border: '0.5px solid #E2E8F0',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '24px',
  },
  weightTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1F3864',
    margin: '0 0 4px 0',
  },
  weightSubtitle: {
    fontSize: '13px',
    color: '#718096',
    margin: '0 0 16px 0',
  },
  weightError: {
    backgroundColor: '#FFF5F5',
    border: '1px solid #FEB2B2',
    color: '#C53030',
    padding: '8px 12px',
    borderRadius: '8px',
    fontSize: '13px',
    marginBottom: '12px',
  },
  sliderRow: {
    display: 'flex',
    gap: '24px',
    flexWrap: 'wrap',
  },
  sliderGroup: {
    flex: 1,
    minWidth: '180px',
  },
  sliderLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '13px',
    color: '#4A5568',
    marginBottom: '6px',
    fontWeight: '500',
  },
  sliderValue: {
    color: '#1F3864',
    fontWeight: '600',
  },
  slider: {
    width: '100%',
    cursor: 'pointer',
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '16px',
    paddingTop: '16px',
    borderTop: '1px solid #E2E8F0',
  },
  totalGood: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#276749',
  },
  totalBad: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#C53030',
  },
  rematchBtn: {
    padding: '8px 20px',
    backgroundColor: '#1F3864',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
  rematchBtnDisabled: {
    padding: '8px 20px',
    backgroundColor: '#A0AEC0',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'not-allowed',
    fontSize: '14px',
  },
  errorBox: {
    backgroundColor: '#FFF5F5',
    border: '1px solid #FEB2B2',
    color: '#C53030',
    padding: '16px',
    borderRadius: '8px',
    fontSize: '14px',
    marginBottom: '16px',
    textAlign: 'center',
  },
  loadingBox: {
    textAlign: 'center',
    padding: '40px',
    color: '#718096',
    fontSize: '14px',
  },
  emptyBox: {
    textAlign: 'center',
    padding: '40px',
    backgroundColor: '#F7F8FA',
    borderRadius: '12px',
    color: '#718096',
    fontSize: '14px',
    lineHeight: '1.6',
  },
  candidateCard: {
    backgroundColor: '#ffffff',
    border: '0.5px solid #E2E8F0',
    borderRadius: '12px',
    padding: '20px 24px',
    marginBottom: '16px',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '14px',
  },
  rankCircle: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: '#1F3864',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '13px',
    fontWeight: '600',
    flexShrink: 0,
  },
  candidateName: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#2D3748',
  },
  candidatePhone: {
    fontSize: '12px',
    color: '#718096',
    marginTop: '2px',
  },
  totalScore: {
    marginLeft: 'auto',
    fontSize: '22px',
    fontWeight: '700',
    color: '#1F3864',
  },
  badgeRow: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
    paddingTop: '12px',
    borderTop: '1px solid #F0F0F0',
  },
  badgeGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    flexWrap: 'wrap',
  },
  badgeLabel: {
    fontSize: '11px',
    color: '#A0AEC0',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  badgeBlue: {
    backgroundColor: '#EBF8FF',
    color: '#2B6CB0',
    padding: '3px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '500',
  },
  badgeGreen: {
    backgroundColor: '#F0FFF4',
    color: '#276749',
    padding: '3px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '500',
  },
  badgeOrange: {
    backgroundColor: '#FFFAF0',
    color: '#C05621',
    padding: '3px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '500',
  },
  badgeGray: {
    backgroundColor: '#F7F8FA',
    color: '#718096',
    padding: '3px 10px',
    borderRadius: '20px',
    fontSize: '12px',
  },
};

export default CandidateList;