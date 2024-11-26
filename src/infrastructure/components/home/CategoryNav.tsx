import React from 'react';
import { Tabs, Tab, Box } from '@mui/material';

const categories = [
  'All',
  'Academic Writing',
  'Programming',
  'Testing',
  'Product Design',
  'Research',
];

export const CategoryNav: React.FC = () => {
  const [value, setValue] = React.useState(0);

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
      <Tabs
        value={value}
        onChange={(_, newValue) => setValue(newValue)}
        variant="scrollable"
        scrollButtons="auto"
      >
        {categories.map(category => (
          <Tab key={category} label={category} />
        ))}
      </Tabs>
    </Box>
  );
}; 