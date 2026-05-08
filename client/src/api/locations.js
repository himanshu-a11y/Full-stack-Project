import axios from './axios';
import { COUNTRIES, STATES_BY_COUNTRY } from '../../../shared/constants.js';

export async function getCountries() {
  try {
    const res = await axios.get('/api/locations/countries');
    const countries = res.data?.countries || [];
    return countries.length ? countries : COUNTRIES;
  } catch {
    return COUNTRIES;
  }
}

export async function getStates(country) {
  if (!country) return [];
  try {
    const res = await axios.get(`/api/locations/states?country=${encodeURIComponent(country)}`);
    const states = res.data?.states || [];
    return states.length ? states : (STATES_BY_COUNTRY[country] || []);
  } catch {
    return STATES_BY_COUNTRY[country] || [];
  }
}

export async function getDistricts(country, state) {
  if (!country || !state) return [];
  try {
    const res = await axios.get(`/api/locations/districts?country=${encodeURIComponent(country)}&state=${encodeURIComponent(state)}`);
    return res.data?.districts || [];
  } catch {
    return [];
  }
}

