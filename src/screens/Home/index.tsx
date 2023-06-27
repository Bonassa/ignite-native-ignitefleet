import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

import { Container, Content } from './styles';
import { CarStatus } from '../../components/CarStatus';
import { HomeHeader } from '../../components/HomeHeader';
import { useQuery, useRealm } from '../../libs/realm';
import {
  Historic,
  HistoricStatusEnum,
} from '../../libs/realm/schemas/Historic';
import { AppRoutesNamesEnum } from '../../routes/routes.types';

export const Home: React.FC = () => {
  const navigation = useNavigation();
  const historic = useQuery(Historic);
  const realm = useRealm();

  const [vehicleInUse, setVehicleInUse] = useState<Historic | null>(null);

  function handleRegisterMovement() {
    if (vehicleInUse?._id) {
      return navigation.navigate(AppRoutesNamesEnum.arrival, {
        id: vehicleInUse._id.toString(),
      });
    }

    return navigation.navigate(AppRoutesNamesEnum.departure);
  }

  function fetchVehicleInUse() {
    try {
      const vehicle = historic.filtered(
        `status = '${HistoricStatusEnum.departure}'`
      )[0];
      setVehicleInUse(vehicle);
    } catch (error) {
      Alert.alert(
        'Veículo em uso',
        'Não foi possível carregar o veículo em uso'
      );
      console.log(error);
    }
  }

  useEffect(() => {
    fetchVehicleInUse();
  }, []);

  useEffect(() => {
    realm.addListener('change', () => fetchVehicleInUse());

    return () => realm.removeListener('change', fetchVehicleInUse);
  }, []);

  return (
    <Container>
      <HomeHeader />

      <Content>
        <CarStatus
          onPress={handleRegisterMovement}
          licensePlate={vehicleInUse?.license_plate}
        />
      </Content>
    </Container>
  );
};
