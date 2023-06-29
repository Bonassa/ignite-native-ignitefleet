import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from 'styled-components/native';

import { Container, Title } from './styles';
import { IconBoxProps } from '../ButtonIcon';

type Props = {
  icon?: IconBoxProps;
  title: string;
};

export const SyncMessage: React.FC<Props> = ({ title, icon: Icon }) => {
  const { width } = useWindowDimensions();
  const { top } = useSafeAreaInsets();
  const { COLORS } = useTheme();

  return (
    <Container width={width} paddingTop={top}>
      {Icon && <Icon size={18} color={COLORS.GRAY_100} />}
      <Title>{title}</Title>
    </Container>
  );
};
