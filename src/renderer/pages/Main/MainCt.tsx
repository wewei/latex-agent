import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainRp from './MainRp';

export const MainCt: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigateToEdit = (documentId: string) => {
    navigate(`/edit/${documentId}`);
  };

  return (
    <MainRp onNavigateToEdit={handleNavigateToEdit} />
  );
};
