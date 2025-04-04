import React from 'react';
import { Box } from '@mui/material';
import { NavigationPanelCt } from '../../components/NavigationPanel/NavigationPanelCt';
import { DetailPanelCt } from '../../components/DetailPanel/DetailPanelCt';

const MainCt: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Box sx={{ width: 300, borderRight: 1, borderColor: 'divider' }}>
        <NavigationPanelCt />
      </Box>
      <Box sx={{ flex: 1 }}>
        <DetailPanelCt />
      </Box>
    </Box>
  );
};

export default MainCt;
