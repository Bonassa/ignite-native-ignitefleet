import { IconProps } from 'phosphor-react-native';
import { TouchableOpacityProps } from 'react-native';
import { useTheme } from 'styled-components/native';

import { Container } from './styles';

export type IconBoxProps = (props: IconProps) => JSX.Element;

type Props = TouchableOpacityProps & {
  icon: IconBoxProps;
};

export const ButtonIcon: React.FC<Props> = ({ icon: Icon, ...rest }) => {
  const { COLORS } = useTheme();

  return (
    <Container activeOpacity={0.7} {...rest}>
      <Icon size={24} color={COLORS.BRAND_MID} />
    </Container>
  );
};
