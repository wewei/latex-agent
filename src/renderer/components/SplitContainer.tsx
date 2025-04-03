import React from 'react';
import { Box, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

const Container = styled(Box)({
  display: 'flex',
  height: 'calc(100vh - 64px)', // Adjust based on your header height
  gap: '16px',
  padding: '16px',
});

const LeftPanel = styled(Paper)({
  flex: 1,
  overflow: 'hidden',
});

const RightPanel = styled(Paper)({
  flex: 1,
  overflow: 'auto',
  padding: '16px',
});

type SplitContainerProps = {
  leftContent: React.ReactNode;
  rightContent: React.ReactNode;
};

export const SplitContainer = ({ leftContent, rightContent }: SplitContainerProps) => {
  return (
    <Container>
      <LeftPanel elevation={2}>
        {leftContent}
      </LeftPanel>
      <RightPanel elevation={2}>
        {rightContent}
      </RightPanel>
    </Container>
  );
}; 