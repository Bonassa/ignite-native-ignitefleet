import { TextInputProps } from 'react-native';

import { Container, Input, Label } from './styles';

type Props = Omit<TextInputProps, 'placeholderTextColor'> & {
  label: string;
};

export const LicensePlateInput: React.FC<Props> = ({ label, ...rest }) => {
  return (
    <Container>
      <Label>{label}</Label>

      <Input maxLength={7} autoCapitalize="characters" {...rest} />
    </Container>
  );
};
