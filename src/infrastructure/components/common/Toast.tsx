import React from 'react';
import { Snackbar, Alert, AlertColor } from '@mui/material';
import { create } from 'zustand';

interface ToastState {
  open: boolean;
  message: string;
  severity: AlertColor;
  autoHideDuration?: number;
  showToast: (message: string, options?: { severity?: AlertColor; duration?: number }) => void;
  hideToast: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  open: false,
  message: '',
  severity: 'info',
  autoHideDuration: 6000,
  showToast: (message, options = {}) =>
    set({
      open: true,
      message,
      severity: options.severity || 'info',
      autoHideDuration: options.duration || 6000,
    }),
  hideToast: () => set({ open: false }),
}));

export const Toast: React.FC = () => {
  const { open, message, severity, autoHideDuration, hideToast } = useToastStore();

  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={() => hideToast()}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert
        onClose={() => hideToast()}
        severity={severity}
        variant="filled"
        sx={{ width: '100%' }}
        elevation={6}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}; 