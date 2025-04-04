import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

interface DetailPanelRpProps {
  detail: {
    title: string;
    content: string;
    lastModified: string;
  };
}

export const DetailPanelRp: React.FC<DetailPanelRpProps> = ({ detail }) => {
  return (
    <Paper sx={{ height: '100%', p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          {detail.title}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          最后修改时间: {new Date(detail.lastModified).toLocaleString()}
        </Typography>
      </Box>
      <Typography variant="body1">
        {detail.content}
      </Typography>
    </Paper>
  );
}; 