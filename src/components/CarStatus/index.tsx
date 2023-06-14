import { Key, Car } from 'phosphor-react-native';
import { useTheme } from 'styled-components';

import { Container, IconBox, Message, TextHighlight } from './styles';

type Props = {
  licensePlate?: string | null;
};

export const CarStatus: React.FC<Props> = ({ licensePlate = null }) => {
  const theme = useTheme();
  const Icon = licensePlate ? Key : Car;
  const message = licensePlate
    ? `Veículo ${licensePlate} em uso. `
    : 'Nenhum veículo em uso. ';
  const status = licensePlate ? 'chegada' : 'saída';

  return (
    <Container>
      <IconBox>
        <Icon size={32} color={theme.COLORS.BRAND_LIGHT} />
      </IconBox>

      <Message style={{ textAlignVertical: 'center' }}>
        {message}

        <TextHighlight>Clique aqui para registrar a {status}</TextHighlight>
      </Message>
    </Container>
  );
};
