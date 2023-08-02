import { useNavigation, useRoute } from '@react-navigation/native';
import dayjs from 'dayjs';
import { X } from 'phosphor-react-native';
import { useEffect, useMemo, useState } from 'react';
import { Alert, View } from 'react-native';
import { LatLng } from 'react-native-maps';
import { BSON } from 'realm';

import {
  Container,
  Content,
  Description,
  Footer,
  Label,
  LicensePlate,
  NotSyncMessage,
} from './styles';
import { Button } from '../../components/Button';
import { ButtonIcon } from '../../components/ButtonIcon';
import { Header } from '../../components/Header';
import { LoadIndicator } from '../../components/Loading/styles';
import { LocationInfoProps } from '../../components/LocationInfo';
import { Locations } from '../../components/Locations';
import { Map } from '../../components/Map';
import { getStorageLocations } from '../../libs/asyncStorage/locationStorage';
import { useObject, useRealm } from '../../libs/realm';
import {
  Historic,
  HistoricStatusEnum,
} from '../../libs/realm/schemas/Historic';
import { ArrivalRouteParams } from '../../routes/routes.types';
import { stopLocationTask } from '../../tasks/backgroundLocationTask';
import { getAddressLocation } from '../../utils/getAddressLocation';

export const Arrival: React.FC = () => {
  const { goBack } = useNavigation();
  const { params } = useRoute();
  const { id, isSync } = params as ArrivalRouteParams;

  const realm = useRealm();
  const vehicleInfo = useObject(Historic, new BSON.UUID(id));

  const [isLoading, setIsLoading] = useState(true);
  const [coordinates, setCoordinates] = useState<LatLng[]>([]);
  const [departure, setDeparture] = useState<LocationInfoProps>(
    {} as LocationInfoProps
  );
  const [arrival, setArrival] = useState<LocationInfoProps | null>(null);

  const pageTitle = useMemo(() => {
    return vehicleInfo?.status === HistoricStatusEnum.departure
      ? 'Chegada'
      : 'Detalhes';
  }, [vehicleInfo]);

  async function handleArrivalRegister() {
    try {
      if (!vehicleInfo) {
        return Alert.alert(
          'Erro',
          'Não foi possível obter os dados do veículo em uso'
        );
      }

      const locations = await getStorageLocations();

      realm.write(() => {
        vehicleInfo.status = HistoricStatusEnum.arrival;
        vehicleInfo.updated_at = new Date();
        vehicleInfo.coords.push(...locations);
      });

      await stopLocationTask();

      Alert.alert('Chegada', 'Chegada registrada com sucesso!');
      goBack();
    } catch (error) {
      console.log(error);
      Alert.alert('Erro', 'Não foi possível registar a chegada do veículo');
    }
  }

  function handleRemoveVehicleUsage() {
    Alert.alert('Cancelar', 'Cancelar a utilização do veículo?', [
      { text: 'Não', style: 'cancel', isPreferred: true },
      { text: 'Sim', style: 'destructive', onPress: removeFromRealm },
    ]);
  }

  async function removeFromRealm() {
    try {
      realm.write(() => {
        realm.delete(vehicleInfo);
      });

      goBack();
      await stopLocationTask();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível cancelar a utilização');
      console.log(error);
    }
  }

  async function getLocationsInfo() {
    if (vehicleInfo?.status === HistoricStatusEnum.departure) {
      const locationsStorage = await getStorageLocations();
      setCoordinates(locationsStorage);
    } else {
      setCoordinates(vehicleInfo?.coords ?? []);
    }

    if (vehicleInfo?.coords[0]) {
      const departureStreetName = await getAddressLocation(
        vehicleInfo.coords[0]
      );

      setDeparture({
        label: `Saindo em ${departureStreetName ?? ''}`,
        description: dayjs(new Date(vehicleInfo.coords[0].timestamp)).format(
          'DD/MM/YYYY [às] HH:mm'
        ),
      });
    }

    if (vehicleInfo?.status === HistoricStatusEnum.arrival) {
      const lastLocation = vehicleInfo.coords[vehicleInfo.coords.length - 1];
      const arrivalStreetName = await getAddressLocation(lastLocation);

      setArrival({
        label: `Chegando em ${arrivalStreetName ?? ''}`,
        description: dayjs(new Date(lastLocation.timestamp)).format(
          'DD/MM/YYYY [às] HH:mm'
        ),
      });
    }

    setIsLoading(false);
  }

  useEffect(() => {
    getLocationsInfo();
  }, []);

  if (isLoading) {
    return (
      <Container>
        <Header title="Saída" />
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <LoadIndicator />
        </View>
      </Container>
    );
  }

  return (
    <Container>
      <Header title={pageTitle} />

      {coordinates.length > 0 && <Map coordinates={coordinates} />}

      <Content>
        <Locations departure={departure} arrival={arrival} />

        <Label>Placa do veículo</Label>
        <LicensePlate>{vehicleInfo?.license_plate}</LicensePlate>

        <Label>Finalidade</Label>
        <Description>{vehicleInfo?.description}</Description>
      </Content>

      {vehicleInfo?.status === HistoricStatusEnum.departure && (
        <Footer>
          <ButtonIcon icon={X} onPress={handleRemoveVehicleUsage} />

          <Button title="Registrar Chegada" onPress={handleArrivalRegister} />
        </Footer>
      )}

      {vehicleInfo?.status === HistoricStatusEnum.arrival && !isSync && (
        <NotSyncMessage>
          Este registro ainda não foi sincronizado
        </NotSyncMessage>
      )}
    </Container>
  );
};
