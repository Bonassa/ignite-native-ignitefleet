import { Car, FlagCheckered } from 'phosphor-react-native';

import { Container, Line } from './styles';
import { LocationInfo, LocationInfoProps } from '../LocationInfo';

type Props = {
  departure: LocationInfoProps;
  arrival: LocationInfoProps | null;
};

export const Locations: React.FC<Props> = ({ arrival, departure }) => {
  return (
    <Container>
      <LocationInfo
        icon={Car}
        label={departure.label}
        description={departure.description}
      />

      {arrival && (
        <>
          <Line />

          <LocationInfo
            icon={FlagCheckered}
            label={arrival.label}
            description={arrival.description}
          />
        </>
      )}
    </Container>
  );
};
