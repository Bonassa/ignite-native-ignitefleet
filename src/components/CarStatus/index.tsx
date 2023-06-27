import { Key, Car } from 'phosphor-react-native';
import { TouchableOpacityProps } from 'react-native';
import { useTheme } from 'styled-components';

import { Container, IconBox, Message, TextHighlight } from './styles';

type Props = TouchableOpacityProps & {
  licensePlate?: string | null;
};

export const CarStatus: React.FC<Props> = ({
  licensePlate = null,
  ...rest
}) => {
  const theme = useTheme();
  const Icon = licensePlate ? Car : Key;
  const message = licensePlate
    ? `Veículo ${licensePlate} em uso. `
    : 'Nenhum veículo em uso. ';
  const status = licensePlate ? 'chegada' : 'saída';

  return (
    <Container activeOpacity={0.7} {...rest}>
      <IconBox>
        <Icon size={32} color={theme.COLORS.BRAND_LIGHT} />
      </IconBox>

      <Message style={{ textAlignVertical: 'center' }}>
        {message}
        {'\n'}

        <TextHighlight>Clique aqui para registrar a {status}</TextHighlight>
      </Message>
    </Container>
  );
};
