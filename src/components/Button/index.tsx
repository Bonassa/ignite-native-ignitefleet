import React from 'react';
import { TouchableOpacityProps } from 'react-native';

import { Container, Loading, Title } from './styles';

type Props = TouchableOpacityProps & {
  title: string;
  isLoading?: boolean;
};

export const Button: React.FC<Props> = ({ title, isLoading = false, ...nativeProps }) => {
  return (
    <Container activeOpacity={0.7} disabled={isLoading} {...nativeProps}>
      {isLoading ? <Loading /> : <Title>{title}</Title>}
    </Container>
  );
};
