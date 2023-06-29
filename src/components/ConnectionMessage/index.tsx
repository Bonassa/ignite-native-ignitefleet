import React from 'react';
import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Container, StyledIcon, Title } from './styles';

const ConnectionMessage: React.FC = () => {
  const { width } = useWindowDimensions();
  const { top } = useSafeAreaInsets();

  return (
    <Container width={width} paddingTop={top}>
      <StyledIcon />
      <Title>Você está offline</Title>
    </Container>
  );
};

export default React.memo(ConnectionMessage);
