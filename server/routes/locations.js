const express = require('express');
const { COUNTRIES, STATES_BY_COUNTRY } = require('../../shared/constants.cjs');

const router = express.Router();

async function fetchCountriesFromApi() {
  const res = await fetch('https://restcountries.com/v3.1/all?fields=name');
  if (!res.ok) throw new Error(`countries api failed: ${res.status}`);
  const data = await res.json();
  return data
    .map((c) => c?.name?.common)
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));
}

async function fetchStatesFromApi(country) {
  const res = await fetch('https://countriesnow.space/api/v0.1/countries/states', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ country }),
  });
  if (!res.ok) throw new Error(`states api failed: ${res.status}`);
  const data = await res.json();
  const states = data?.data?.states || [];
  return states.map((s) => s?.name).filter(Boolean);
}

async function fetchCitiesFromApi(country, state) {
  const res = await fetch('https://countriesnow.space/api/v0.1/countries/state/cities', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ country, state }),
  });
  if (!res.ok) throw new Error(`cities api failed: ${res.status}`);
  const data = await res.json();
  return data?.data || [];
}

router.get('/countries', async (req, res) => {
  try {
    const countries = await fetchCountriesFromApi();
    return res.json({ countries });
  } catch (_) {
    return res.json({ countries: COUNTRIES });
  }
});

router.get('/states', async (req, res) => {
  const country = (req.query.country || '').trim();
  if (!country) return res.status(400).json({ message: 'country query param is required' });

  try {
    const states = await fetchStatesFromApi(country);
    return res.json({ states });
  } catch (_) {
    return res.json({ states: STATES_BY_COUNTRY[country] || [] });
  }
});

router.get('/districts', async (req, res) => {
  const country = (req.query.country || '').trim();
  const state = (req.query.state || '').trim();
  if (!country || !state) return res.status(400).json({ message: 'country and state query params are required' });

  try {
    const districts = await fetchCitiesFromApi(country, state);
    return res.json({ districts });
  } catch (_) {
    // If we have a hardcoded list for India, and it's india, return it, else empty
    if (country.toLowerCase() === 'india') {
      return res.json({ districts: STATES_BY_COUNTRY['India'] || [] });
    }
    return res.json({ districts: [] });
  }
});

module.exports = router;

