import { useNavigation, useRoute } from '@react-navigation/native';
import { X } from 'phosphor-react-native';
import { useMemo } from 'react';
import { Alert } from 'react-native';
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
import { useObject, useRealm } from '../../libs/realm';
import {
  Historic,
  HistoricStatusEnum,
} from '../../libs/realm/schemas/Historic';
import { ArrivalRouteParams } from '../../routes/routes.types';

export const Arrival: React.FC = () => {
  const { goBack } = useNavigation();
  const { params } = useRoute();
  const { id, isSync } = params as ArrivalRouteParams;

  const realm = useRealm();
  const vehicleInfo = useObject(Historic, new BSON.UUID(id));

  const pageTitle = useMemo(() => {
    return vehicleInfo?.status === HistoricStatusEnum.departure
      ? 'Chegada'
      : 'Detalhes';
  }, [vehicleInfo]);

  function handleArrivalRegister() {
    try {
      if (!vehicleInfo) {
        return Alert.alert(
          'Erro',
          'Não foi possível obter os dados do veículo em uso'
        );
      }

      realm.write(() => {
        vehicleInfo.status = HistoricStatusEnum.arrival;
        vehicleInfo.updated_at = new Date();
      });

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

  function removeFromRealm() {
    try {
      realm.write(() => {
        realm.delete(vehicleInfo);
      });

      goBack();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível cancelar a utilização');
      console.log(error);
    }
  }

  return (
    <Container>
      <Header title={pageTitle} />

      <Content>
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
