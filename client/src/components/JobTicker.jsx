import React from 'react';

const JobTicker = ({ jobs }) => {
  if (!jobs || jobs.length === 0) return null;

  return (
    <div className="w-full bg-white/80 backdrop-blur-md border-b border-slate-100 py-3 ticker-container shadow-sm mb-8 rounded-2xl overflow-hidden">
      <div className="ticker-content flex items-center">
        {[...Array(5)].map((_, i) => (
          <React.Fragment key={i}>
            {jobs.map((job, index) => (
              <div 
                key={`${job._id}-${i}-${index}`} 
                className={`ticker-item text-[11px] ${
                  index % 2 === 0 ? 'text-brand-blue' : 'text-emerald-600'
                }`}
              >
                <span className="mr-2 opacity-50">🔥</span>
                {job.title}
                <span className="mx-4 text-slate-300">•</span>
                <span className="text-slate-400 font-bold">{job.trade}</span>
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default JobTicker;
