import { forwardRef } from 'react';
import { TextInput, TextInputProps } from 'react-native';

import { Container, Input, Label } from './styles';

type Props = Omit<TextInputProps, 'placeholderTextColor'> & {
  label: string;
};

export const TextAreaInput = forwardRef<TextInput, Props>(
  ({ label, ...rest }, ref) => {
    return (
      <Container>
        <Label>{label}</Label>

        <Input ref={ref} multiline autoCapitalize="sentences" {...rest} />
      </Container>
    );
  }
);
