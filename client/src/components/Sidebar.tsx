import React from 'react';
import { Drawer, List, ListItemButton, ListItemText, Toolbar, Box } from '@mui/material';
import { Mode } from '../types/models';

type SidebarProps = {
  mode: Mode;
  onChange: (mode: Mode) => void;
  width?: number;
};

// Permanent MUI drawer for switching search modes; highlights active and exposes API docs link
export default function Sidebar({ mode, onChange, width = 260 }: SidebarProps) {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width,
          boxSizing: 'border-box',
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          boxShadow: 3,
        },
      }}
    >
      <Toolbar />
      <List sx={{ flexGrow: 1 }}>
        <ListItemButton
          data-testid="nav-applicant"
          selected={mode === 'applicant'}
          onClick={() => onChange('applicant')}
          sx={{
            color: 'primary.contrastText',
            '&:hover': { bgcolor: 'primary.dark' },
            '&.Mui-selected': { bgcolor: 'primary.dark', color: 'primary.contrastText' },
            '&.Mui-selected:hover': { bgcolor: 'primary.dark' },
            borderRadius: 2,
            mx: 1,
          }}
        >
          <ListItemText primary="Search by Applicant" />
        </ListItemButton>
        <ListItemButton
          data-testid="nav-street"
          selected={mode === 'street'}
          onClick={() => onChange('street')}
          sx={{
            color: 'primary.contrastText',
            '&:hover': { bgcolor: 'primary.dark' },
            '&.Mui-selected': { bgcolor: 'primary.dark', color: 'primary.contrastText' },
            '&.Mui-selected:hover': { bgcolor: 'primary.dark' },
            borderRadius: 2,
            mx: 1,
          }}
        >
          <ListItemText primary="Search by Street" />
        </ListItemButton>
        <ListItemButton
          data-testid="nav-nearest"
          selected={mode === 'nearest'}
          onClick={() => onChange('nearest')}
          sx={{
            color: 'primary.contrastText',
            '&:hover': { bgcolor: 'primary.dark' },
            '&.Mui-selected': { bgcolor: 'primary.dark', color: 'primary.contrastText' },
            '&.Mui-selected:hover': { bgcolor: 'primary.dark' },
            borderRadius: 2,
            mx: 1,
          }}
        >
          <ListItemText primary="Find Nearest" />
        </ListItemButton>
      </List>
      <Box sx={{ p: 2 }}>
        <a href="/docs" target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>API Docs</a>
      </Box>
    </Drawer>
  );
}

