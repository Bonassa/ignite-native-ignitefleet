import { useNavigation } from '@react-navigation/native';
import React from 'react';

import { Container, Content } from './styles';
import { CarStatus } from '../../components/CarStatus';
import { HomeHeader } from '../../components/HomeHeader';
import { AppRoutesNamesEnum } from '../../routes/routes.types';

export const Home: React.FC = () => {
  const navigation = useNavigation();

  function handleRegisterMovement() {
    navigation.navigate(AppRoutesNamesEnum.departure);
  }

  return (
    <Container>
      <HomeHeader />

      <Content>
        <CarStatus onPress={handleRegisterMovement} />
      </Content>
    </Container>
  );
};
