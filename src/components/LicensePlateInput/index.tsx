import { forwardRef } from 'react';
import { TextInput, TextInputProps } from 'react-native';

import { Container, Input, Label } from './styles';

type Props = Omit<TextInputProps, 'placeholderTextColor'> & {
  label: string;
};

export const LicensePlateInput = forwardRef<TextInput, Props>(
  ({ label, ...rest }, ref) => {
    return (
      <Container>
        <Label>{label}</Label>

        <Input maxLength={7} autoCapitalize="characters" ref={ref} {...rest} />
      </Container>
    );
  }
);
