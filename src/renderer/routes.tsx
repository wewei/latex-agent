import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';

const WelcomeCt = lazy(() => import('./pages/Welcome'));
const MainCt = lazy(() => import('./pages/Main'));
const EditCt = lazy(() => import('./pages/Edit/EditCt'));

const LoadingFallback = () => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    minHeight="100vh"
  >
    <CircularProgress />
  </Box>
);

export const AppRoutes = () => {
  return (
    <HashRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Navigate to="/welcome" replace />} />
          <Route path="/welcome" element={<WelcomeCt />} />
          <Route path="/main" element={<MainCt />} />
          <Route path="/edit/:documentId" element={<EditCt />} />
        </Routes>
      </Suspense>
    </HashRouter>
  );
}; 