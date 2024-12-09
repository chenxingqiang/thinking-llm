import React from 'react'
import { TextField, Box, InputAdornment } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'

interface ProtocolSearchProps {
  searchQuery: string
  onSearchChange: (query: string) => void
}

export const ProtocolSearch: React.FC<ProtocolSearchProps> = ({
  searchQuery,
  onSearchChange,
}) => {
  return (
    <Box sx={{ width: '100%', maxWidth: 600, mb: 4 }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search protocols..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
    </Box>
  )
}
