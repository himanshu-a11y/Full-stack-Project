// CommonJS wrapper for server-side imports.
// Client should import from `shared/constants.js` (ESM).

const TRADES = [
  'Electrician', 'Fitter', 'Welder', 'Turner', 'Mechanic',
  'Plumber', 'Carpenter', 'Painter', 'Draughtsman', 'COPA'
];

const DISTRICTS = [
  'Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar',
  'Mehsana', 'Anand', 'Bhavnagar', 'Jamnagar', 'Junagadh'
];

const CERTIFICATIONS = ['NCVT', 'SCVT', 'NAC', 'CTI', 'CITS', 'NIMI'];

module.exports = { TRADES, DISTRICTS, CERTIFICATIONS };

