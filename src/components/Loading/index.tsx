import React from 'react';

import { Container, LoadIndicator } from './styles';

export const Loading: React.FC = () => {
  return (
    <Container>
      <LoadIndicator />
    </Container>
  );
};
