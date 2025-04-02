import React from 'react';
import { Box, Button, Container, Paper, Typography, Stepper, Step, StepLabel } from '@mui/material';
import { useTranslation } from 'react-i18next';

type WelcomeRpProps = {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  onComplete: () => void;
};

const WelcomeRp: React.FC<WelcomeRpProps> = ({
  currentStep,
  totalSteps,
  onNext,
  onPrev,
  onComplete,
}) => {
  const { t } = useTranslation();

  const steps = [
    {
      title: t('welcome.step1.title'),
      description: t('welcome.step1.description'),
    },
    {
      title: t('welcome.step2.title'),
      description: t('welcome.step2.description'),
    },
    {
      title: t('welcome.step3.title'),
      description: t('welcome.step3.description'),
    },
  ];

  return (
    <Container maxWidth="md">
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4,
          height: '500px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
      >
        <Box>
          <Stepper activeStep={currentStep} alternativeLabel>
            {steps.map((step, index) => (
              <Step key={index}>
                <StepLabel>{step.title}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box sx={{ mt: 4, mb: 4, minHeight: '200px' }}>
            <Typography variant="h4" gutterBottom>
              {steps[currentStep].title}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {steps[currentStep].description}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            disabled={currentStep === 0}
            onClick={onPrev}
          >
            {t('common.previous')}
          </Button>
          <Button
            variant="contained"
            onClick={currentStep === totalSteps - 1 ? onComplete : onNext}
          >
            {currentStep === totalSteps - 1 ? t('common.finish') : t('common.next')}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default WelcomeRp; 