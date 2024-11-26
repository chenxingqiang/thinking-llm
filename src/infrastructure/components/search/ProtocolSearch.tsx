import React from 'react';
import { Box, TextField, Autocomplete, Chip, IconButton } from '@mui/material';
import { Search as SearchIcon, FilterList as FilterIcon } from '@mui/icons-material';
import { useProtocolSearch } from '../../hooks/useProtocolSearch';

export const ProtocolSearch: React.FC = () => {
  const { tags, search, setSearch, selectedTags, setSelectedTags } = useProtocolSearch();

  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 4 }}>
      <Box sx={{ flex: 1, display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          placeholder="Search protocols..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
          }}
        />
        <IconButton>
          <FilterIcon />
        </IconButton>
      </Box>
      <Autocomplete
        multiple
        options={tags}
        value={selectedTags}
        onChange={(_, newValue) => setSelectedTags(newValue)}
        renderInput={(params) => (
          <TextField {...params} placeholder="Filter by tags" sx={{ minWidth: 200 }} />
        )}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip label={option} {...getTagProps({ index })} />
          ))
        }
      />
    </Box>
  );
}; 