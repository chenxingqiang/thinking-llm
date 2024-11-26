import React from 'react';
import { Box, Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Upload as UploadIcon, Download as DownloadIcon } from '@mui/icons-material';
import { useProtocolStore } from '../../stores/protocolStore';

export const ProtocolExportImport: React.FC = () => {
  const { protocol, updateProtocol } = useProtocolStore();
  const [importDialogOpen, setImportDialogOpen] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const blob = new Blob([protocol], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'protocol.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        updateProtocol(content);
        setImportDialogOpen(false);
      };
      reader.readAsText(file);
    }
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<UploadIcon />}
          onClick={() => setImportDialogOpen(true)}
        >
          Import
        </Button>
        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={handleExport}
        >
          Export
        </Button>
      </Box>

      <Dialog open={importDialogOpen} onClose={() => setImportDialogOpen(false)}>
        <DialogTitle>Import Protocol</DialogTitle>
        <DialogContent>
          <Typography>
            Select a markdown file to import your protocol.
          </Typography>
          <input
            type="file"
            accept=".md"
            ref={fileInputRef}
            onChange={handleImport}
            style={{ display: 'none' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImportDialogOpen(false)}>Cancel</Button>
          <Button onClick={() => fileInputRef.current?.click()}>
            Choose File
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}; 