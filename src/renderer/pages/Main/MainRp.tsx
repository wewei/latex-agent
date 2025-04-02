import React from 'react';
import { Container, Paper, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const MainRp: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          {t('main.title')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t('main.description')}
        </Typography>
      </Paper>
    </Container>
  );
};

export default MainRp; 