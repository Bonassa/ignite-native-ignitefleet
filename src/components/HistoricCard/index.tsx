import { TouchableOpacityProps } from 'react-native';

import {
  Container,
  Departure,
  Info,
  LicensePlate,
  StyledCheckIcon,
  StyledClockIcon,
} from './styles';

export type HistoricCardProps = {
  id: string;
  licensePlate: string;
  created: string;
  isSync: boolean;
};

type Props = TouchableOpacityProps & {
  data: HistoricCardProps;
};

export const HistoricCard: React.FC<Props> = ({ data, ...rest }) => {
  return (
    <Container activeOpacity={0.7} {...rest}>
      <Info>
        <LicensePlate>{data.licensePlate}</LicensePlate>

        <Departure>{data.created}</Departure>
      </Info>

      {data.isSync ? <StyledCheckIcon /> : <StyledClockIcon />}
    </Container>
  );
};
