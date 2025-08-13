import React, { useMemo, useRef, useState } from 'react';
import { Truck } from '../types/models';
import { Alert, Box, CircularProgress, Paper, Typography } from '@mui/material';

type ResultsGridProps = {
  results: Truck[];
  loading: boolean;
  error: string | null;
};

// Displays results in a responsive, resizable grid with sticky header, empty/loading/error states
export default function ResultsGrid({ results, loading, error }: ResultsGridProps) {
  // Column widths in pixels for desktop grid: [#, Applicant, Status, Address, Lat, Lng, Distance]
  const [colWidths, setColWidths] = useState<number[]>([56, 240, 140, 320, 120, 120, 140]);
  const minWidths = useMemo(() => [48, 160, 100, 220, 100, 100, 120], []);
  const resizingRef = useRef<{ index: number; startX: number; startWidth: number } | null>(null);

  const gridStyle = useMemo(() => ({ gridTemplateColumns: colWidths.map((w) => `${w}px`).join(' ') }), [colWidths]);

  // Begin column resize; track starting mouse X and width
  function onResizeStart(e: React.MouseEvent, index: number) {
    e.preventDefault();
    e.stopPropagation();
    resizingRef.current = { index, startX: e.clientX, startWidth: colWidths[index] };
    document.addEventListener('mousemove', onResizing);
    document.addEventListener('mouseup', onResizeEnd);
    document.body.style.cursor = 'col-resize';
  }

  // Resize handler updating the active column width, respecting a minimum per column
  function onResizing(e: MouseEvent) {
    if (!resizingRef.current) return;
    const { index, startX, startWidth } = resizingRef.current;
    const delta = e.clientX - startX;
    const next = Math.max(minWidths[index], startWidth + delta);
    setColWidths((prev) => prev.map((w, i) => (i === index ? next : w)));
  }

  // Cleanup after resize and restore cursor
  function onResizeEnd() {
    resizingRef.current = null;
    document.removeEventListener('mousemove', onResizing);
    document.removeEventListener('mouseup', onResizeEnd);
    document.body.style.cursor = '';
  }
  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" data-testid="results-header" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography component="span" variant="h6" fontWeight={600} data-testid="results-count">{results.length}</Typography>
        <Typography component="span" variant="h6">Results</Typography>
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <Paper elevation={1} sx={{ position: 'relative', mt: 1 }}>
        <Box sx={{ width: '100%', maxHeight: '70vh', overflowY: 'auto', overflowX: 'auto' }}>
          <Box
            role="row"
            sx={{
              display: { xs: 'none', md: 'grid' },
              columnGap: 3,
              px: 3,
              py: 1.5,
              fontWeight: 700,
              textTransform: 'uppercase',
              color: 'text.secondary',
              borderBottom: 1,
              borderColor: 'divider',
              position: 'sticky',
              top: 0,
              bgcolor: 'background.paper',
            }}
            style={gridStyle}
          >
            {['#','Applicant','Status','Address','Lat','Lng','Distance (m)'].map((label, i) => (
              <Box key={label} role="columnheader" sx={{ position: 'relative', pr: 1 }}>
                {label}
                {i < colWidths.length - 1 && (
                  <Box
                    onMouseDown={(e: any) => onResizeStart(e, i)}
                    sx={{ position: 'absolute', top: 0, right: 0, height: '100%', width: 8, cursor: 'col-resize' }}
                    role="separator"
                    aria-orientation="vertical"
                  >
                    <Box sx={{ position: 'absolute', right: 0, top: 8, bottom: 8, width: 1, bgcolor: 'divider' }} />
                  </Box>
                )}
              </Box>
            ))}
          </Box>
          {results.length === 0 ? (
            <Box sx={{ px: 3, py: 4, color: 'text.secondary' }} data-testid="results-empty">No results found.</Box>
          ) : (
            <div role="rowgroup">
              {results.map((t, i) => (
                <div key={`${t.objectid || i}`}>
                  {/* Mobile: stacked card */}
                  <Box sx={{ display: { xs: 'block', md: 'none' }, px: 2, py: 2, borderBottom: '1px solid', borderColor: 'divider' }} data-testid="results-row">
                    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                      <Typography variant="body2" color="text.secondary">{i + 1}</Typography>
                      <Typography variant="subtitle2" noWrap title={t.applicant || ''}>{t.applicant || '-'}</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>Status: {t.status || '-'}</Typography>
                    <Typography variant="body2" color="text.secondary" noWrap title={t.address || ''}>Address: {t.address || '-'}</Typography>
                    <Typography variant="body2" color="text.secondary">Coords: {t.latitude || '-'}, {t.longitude || '-'}</Typography>
                    <Typography variant="body2" color="text.secondary">Distance: {t.distance_in_meters ? Math.round(Number(t.distance_in_meters)) : '-'} m</Typography>
                  </Box>

                  {/* Desktop: grid row */}
                  <Box
                    role="row"
                    sx={{ display: { xs: 'none', md: 'grid' }, columnGap: 3, px: 3, py: 1.5, borderBottom: 1, borderColor: 'divider', textAlign: 'left' }}
                    style={gridStyle}
                    data-testid="results-row"
                  >
                    <Box role="cell" sx={{ color: 'text.secondary' }}>{i + 1}</Box>
                    <Box role="cell" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={t.applicant || ''}>{t.applicant || '-'}</Box>
                    <Box role="cell" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.status || '-'}</Box>
                    <Box role="cell" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={t.address || ''}>{t.address || '-'}</Box>
                    <Box role="cell" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.latitude || '-'}</Box>
                    <Box role="cell" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.longitude || '-'}</Box>
                    <Box role="cell" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.distance_in_meters ? Math.round(Number(t.distance_in_meters)) : '-'}</Box>
                  </Box>
                </div>
              ))}
            </div>
          )}
        </Box>
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60 dark:bg-slate-900/60" role="status" aria-live="polite">
            <div className="h-10 w-10 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
            <span className="sr-only">Loading</span>
          </div>
        )}
      </Paper>
    </Box>
  );
}

