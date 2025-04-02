import React, { useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import WelcomeRp from './WelcomeRp';

type WelcomeState = {
  currentStep: number;
  totalSteps: number;
};

type WelcomeAction = 
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'COMPLETE' };

const initialState: WelcomeState = {
  currentStep: 0,
  totalSteps: 3,
};

const reducer = (state: WelcomeState, action: WelcomeAction): WelcomeState => {
  switch (action.type) {
    case 'NEXT_STEP':
      return {
        ...state,
        currentStep: Math.min(state.currentStep + 1, state.totalSteps - 1),
      };
    case 'PREV_STEP':
      return {
        ...state,
        currentStep: Math.max(state.currentStep - 1, 0),
      };
    case 'COMPLETE':
      return {
        ...state,
        currentStep: state.totalSteps,
      };
    default:
      return state;
  }
};

export const WelcomeCt: React.FC = () => {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleNext = () => {
    if (state.currentStep === state.totalSteps - 1) {
      dispatch({ type: 'COMPLETE' });
      navigate('/main');
    } else {
      dispatch({ type: 'NEXT_STEP' });
    }
  };

  const handlePrev = () => {
    dispatch({ type: 'PREV_STEP' });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container maxWidth="md">
        <WelcomeRp
          currentStep={state.currentStep}
          totalSteps={state.totalSteps}
          onNext={handleNext}
          onPrev={handlePrev}
          onComplete={() => {
            dispatch({ type: 'COMPLETE' });
            navigate('/main');
          }}
        />
      </Container>
    </Box>
  );
};
