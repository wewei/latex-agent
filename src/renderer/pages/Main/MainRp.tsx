import React from 'react';
import { Container, Paper, Typography, Button, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

type MainRpProps = {
  onNavigateToEdit: (documentId: string) => void;
};

const MainRp: React.FC<MainRpProps> = ({ onNavigateToEdit }) => {
  const { t } = useTranslation();

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          {t('main.title')}
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          {t('main.description')}
        </Typography>
        <Box mt={2}>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => onNavigateToEdit('test-document-1')}
          >
            Open Test Document
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default MainRp; 