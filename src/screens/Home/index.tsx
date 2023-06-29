import { useNavigation } from '@react-navigation/native';
import { useUser } from '@realm/react';
import dayjs from 'dayjs';
import { CloudArrowUp } from 'phosphor-react-native';
import { useEffect, useState } from 'react';
import { Alert, FlatList } from 'react-native';
import Toast from 'react-native-toast-message';

import { Container, Content, Label, Title } from './styles';
import { CarStatus } from '../../components/CarStatus';
import { HistoricCard, HistoricCardProps } from '../../components/HistoricCard';
import { HomeHeader } from '../../components/HomeHeader';
import { SyncMessage } from '../../components/SyncMessage';
import {
  getLastAsyncTimestamp,
  saveLastSyncTimestamp,
} from '../../libs/asyncStorage/syncStorage';
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
  const user = useUser();

  const [vehicleInUse, setVehicleInUse] = useState<Historic | null>(null);
  const [historicState, setHistoricState] = useState<HistoricCardProps[]>([]);
  const [percentageToSync, setPercentageToSync] = useState<string | null>(null);

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

  async function fetchHistoric() {
    try {
      const response = historic.filtered(
        `status = '${HistoricStatusEnum.arrival}' SORT(created_at DESC)`
      );

      const lastSync = await getLastAsyncTimestamp();

      const formattedHistoric: HistoricCardProps[] = response.map(item => {
        return {
          id: item._id.toString(),
          licensePlate: item.license_plate,
          created: dayjs(item.created_at).format(
            '[Saída em] DD/MM/YYYY [às] HH:mm'
          ),
          isSync: lastSync > item.updated_at.getTime(),
        };
      });

      setHistoricState(formattedHistoric);
    } catch (error) {
      console.log(error);
      Alert.alert('Erro', 'Não foi possível carregar o histórico');
    }
  }

  function handleHistoricDetails(id: string, isSync: boolean) {
    navigation.navigate(AppRoutesNamesEnum.arrival, { id, isSync });
  }

  async function progressNotification(
    transferred: number,
    transferable: number
  ) {
    const percentage = (transferred / transferable) * 100;

    if (percentage === 100) {
      await saveLastSyncTimestamp();
      await fetchHistoric();
      setPercentageToSync(null);

      Toast.show({
        type: 'info',
        text1: 'Todas as informações foram sincronizadas',
      });
    }

    if (percentage < 100) {
      setPercentageToSync(`${percentage.toFixed(0)}% sincronizado.`);
    }
  }

  useEffect(() => {
    fetchVehicleInUse();
  }, []);

  useEffect(() => {
    realm.addListener('change', () => fetchVehicleInUse());

    return () => {
      if (realm && !realm.isClosed) {
        realm.removeListener('change', fetchVehicleInUse);
      }
    };
  }, []);

  useEffect(() => {
    fetchHistoric();
  }, [historic]);

  useEffect(() => {
    realm.subscriptions.update((mutableSubs, realm) => {
      const historicByUserQuery = realm
        .objects('Historic')
        .filtered(`user_id = '${user!.id}'`);

      mutableSubs.add(historicByUserQuery, { name: 'historic_by_user' });
    });
  }, [realm]);

  useEffect(() => {
    const syncSession = realm.syncSession;

    if (!syncSession) {
      return;
    }

    syncSession.addProgressNotification(
      Realm.ProgressDirection.Upload,
      Realm.ProgressMode.ReportIndefinitely,
      progressNotification
    );

    return () => syncSession.removeProgressNotification(progressNotification);
  }, []);

  return (
    <Container>
      {percentageToSync && (
        <SyncMessage title={percentageToSync} icon={CloudArrowUp} />
      )}

      <HomeHeader />

      <Content>
        <CarStatus
          onPress={handleRegisterMovement}
          licensePlate={vehicleInUse?.license_plate}
        />

        <Title>Histórico</Title>

        <FlatList
          data={historicState}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <HistoricCard
              data={item}
              onPress={() => handleHistoricDetails(item.id, item.isSync)}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          ListEmptyComponent={<Label>Nenhum registro de utilização</Label>}
        />
      </Content>
    </Container>
  );
};
