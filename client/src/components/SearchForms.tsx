import React from 'react';
import { Mode } from '../types/models';
import { Box, Button, FormControl, InputLabel, MenuItem, Paper, Select, Stack, TextField } from '@mui/material';

type Props = {
  mode: Mode;
  applicant: string;
  status: 'APPROVED' | 'REQUESTED' | 'EXPIRED' | 'SUSPEND' | 'ALL' | '';
  onApplicantChange: (v: string) => void;
  onStatusChange: (v: Props['status']) => void;
  street: string;
  onStreetChange: (v: string) => void;
  lat: string;
  lng: string;
  onLatChange: (v: string) => void;
  onLngChange: (v: string) => void;
  nearestLimit: string;
  onNearestLimitChange: (v: string) => void;
  nearestStatus: 'APPROVED' | 'REQUESTED' | 'EXPIRED' | 'SUSPEND' | 'ALL';
  onNearestStatusChange: (v: Props['nearestStatus']) => void;
  onApplicantSubmit: (e: React.FormEvent) => void;
  onStreetSubmit: (e: React.FormEvent) => void;
  onNearestSubmit: (e: React.FormEvent) => void;
};

// Renders one of three search forms based on the active mode; delegates state via props and emits submit events
export default function SearchForms(props: Props) {
  const statuses = ['', 'APPROVED', 'REQUESTED', 'EXPIRED', 'SUSPEND', 'ALL'] as const;
  return (
    <Stack spacing={2}>
      {props.mode === 'applicant' && (
        <Paper component="form" onSubmit={props.onApplicantSubmit} sx={{ p: 2 }} data-testid="form-applicant">
          <Box component="h2" sx={{ m: 0, mb: 1.5, fontSize: 20, fontWeight: 600 }}>Search by Applicant</Box>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
            <TextField
              label="Applicant name"
              placeholder="Applicant name"
              value={props.applicant}
              onChange={e => props.onApplicantChange(e.target.value)}
              required
              inputProps={{ 'data-testid': 'input-applicant' }}
              size="small"
              sx={{ minWidth: 220 }}
            />
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                label="Status"
                value={props.status}
                onChange={e => props.onStatusChange(e.target.value as Props['status'])}
              >
                {statuses.map(s => (
                  <MenuItem key={s} value={s}>{s || 'Any status'}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button type="submit" variant="contained" size="small" sx={{ height: 40 }}>Search</Button>
          </Stack>
        </Paper>
      )}

      {props.mode === 'street' && (
        <Paper component="form" onSubmit={props.onStreetSubmit} sx={{ p: 2 }} data-testid="form-street">
          <Box component="h2" sx={{ m: 0, mb: 1.5, fontSize: 20, fontWeight: 600 }}>Search by Street</Box>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
            <TextField
              label="Street contains"
              placeholder="Street contains... (e.g., SAN)"
              value={props.street}
              onChange={e => props.onStreetChange(e.target.value)}
              required
              inputProps={{ 'data-testid': 'input-street' }}
              size="small"
              sx={{ minWidth: 280 }}
            />
            <Button type="submit" variant="contained" size="small" sx={{ height: 40 }}>Search</Button>
          </Stack>
        </Paper>
      )}

      {props.mode === 'nearest' && (
        <Paper component="form" onSubmit={props.onNearestSubmit} sx={{ p: 2 }} data-testid="form-nearest">
          <Box component="h2" sx={{ m: 0, mb: 1.5, fontSize: 20, fontWeight: 600 }}>Find Nearest</Box>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
            <TextField
              label="Latitude"
              placeholder="Latitude"
              value={props.lat}
              onChange={e => props.onLatChange(e.target.value)}
              required
              inputProps={{ 'data-testid': 'input-lat' }}
              size="small"
              sx={{ minWidth: 180 }}
            />
            <TextField
              label="Longitude"
              placeholder="Longitude"
              value={props.lng}
              onChange={e => props.onLngChange(e.target.value)}
              required
              inputProps={{ 'data-testid': 'input-lng' }}
              size="small"
              sx={{ minWidth: 180 }}
            />
            <TextField
              label="Limit"
              placeholder="Limit"
              value={props.nearestLimit}
              onChange={e => props.onNearestLimitChange(e.target.value)}
              inputProps={{ 'data-testid': 'input-limit' }}
              size="small"
              sx={{ minWidth: 120 }}
            />
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel id="nearest-status-label">Status</InputLabel>
              <Select
                labelId="nearest-status-label"
                label="Status"
                value={props.nearestStatus}
                onChange={e => props.onNearestStatusChange(e.target.value as Props['nearestStatus'])}
              >
                {(['APPROVED','REQUESTED','EXPIRED','SUSPEND','ALL'] as const).map(s => (
                  <MenuItem key={s} value={s}>{s}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button type="submit" variant="contained" size="small" sx={{ height: 40 }}>Search</Button>
          </Stack>
        </Paper>
      )}
    </Stack>
  );
}

