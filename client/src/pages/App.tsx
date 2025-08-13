import React, { useMemo, useState } from 'react';
import { Alert, AppBar, Box, Toolbar, Typography } from '@mui/material';
import Sidebar from '../components/Sidebar';
import ResultsGrid from '../components/ResultsGrid';
import SearchForms from '../components/SearchForms';
import { Mode, Truck } from '../types/models';

// types moved to ../types/models

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export default function App() {
  const [applicant, setApplicant] = useState('');
  const [status, setStatus] = useState<'APPROVED' | 'REQUESTED' | 'EXPIRED' | 'SUSPEND' | 'ALL' | ''>('');
  const [street, setStreet] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [nearestStatus, setNearestStatus] = useState<'APPROVED' | 'REQUESTED' | 'EXPIRED' | 'SUSPEND' | 'ALL'>('APPROVED');
  const [nearestLimit, setNearestLimit] = useState('5');
  const [results, setResults] = useState<Truck[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>('applicant');

  const statuses = useMemo(() => [ '', 'APPROVED', 'REQUESTED', 'EXPIRED', 'SUSPEND', 'ALL' ] as const, []);

  async function runApplicantSearch(e: React.FormEvent) {
    e.preventDefault();
    setError(null); setLoading(true);
    try {
      const url = new URL('/api/v1/applicants', window.location.origin);
      url.searchParams.set('name', applicant);
      if (status) url.searchParams.set('status', status);
      const data = await getJson<Truck[]>(url.toString());
      setResults(data);
    } catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  }

  async function runStreetSearch(e: React.FormEvent) {
    e.preventDefault();
    setError(null); setLoading(true);
    try {
      const url = new URL('/api/v1/streets', window.location.origin);
      url.searchParams.set('query', street);
      const data = await getJson<Truck[]>(url.toString());
      setResults(data);
    } catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  }

  async function runNearestSearch(e: React.FormEvent) {
    e.preventDefault();
    setError(null); setLoading(true);
    try {
      const url = new URL('/api/v1/nearest', window.location.origin);
      url.searchParams.set('lat', lat);
      url.searchParams.set('lng', lng);
      url.searchParams.set('limit', nearestLimit);
      if (nearestStatus) url.searchParams.set('status', nearestStatus);
      const data = await getJson<Truck[]>(url.toString());
      setResults(data);
    } catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" color="primary" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap>SF Food Mapper</Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <Sidebar mode={mode} onChange={(m) => {
          // Clear inputs on mode switch without firing any API requests
          setMode(m);
          setApplicant('');
          setStatus('');
          setStreet('');
          setLat('');
          setLng('');
          setNearestLimit('5');
          setNearestStatus('APPROVED');
          setResults([]);
          setError(null);
        }} />
      </Box>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <div>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Search San Francisco mobile food facilities using the city open data API.
          </Typography>

          <SearchForms
            mode={mode}
            applicant={applicant}
            status={status}
            onApplicantChange={setApplicant}
            onStatusChange={setStatus}
            street={street}
            onStreetChange={setStreet}
            lat={lat}
            lng={lng}
            onLatChange={setLat}
            onLngChange={setLng}
            nearestLimit={nearestLimit}
            onNearestLimitChange={setNearestLimit}
            nearestStatus={nearestStatus}
            onNearestStatusChange={setNearestStatus}
            onApplicantSubmit={runApplicantSearch}
            onStreetSubmit={runStreetSearch}
            onNearestSubmit={runNearestSearch}
          />

          <ResultsGrid results={results} loading={loading} error={error} />
        </div>
      </Box>
    </Box>
  );
}

