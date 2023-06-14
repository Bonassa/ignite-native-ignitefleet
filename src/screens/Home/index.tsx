import React from 'react';

import { Container, Content } from './styles';
import { CarStatus } from '../../components/CarStatus';
import { HomeHeader } from '../../components/HomeHeader';

export const Home: React.FC = () => {
  return (
    <Container>
      <HomeHeader />

      <Content>
        <CarStatus licensePlate="XXX-0000" />
      </Content>
    </Container>
  );
};
