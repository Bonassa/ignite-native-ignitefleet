import React from 'react';

import { Container } from './styles';
import { HomeHeader } from '../../components/HomeHeader';

export const Home: React.FC = () => {
  return (
    <Container>
      <HomeHeader />
    </Container>
  );
};
