import { useNavigation } from '@react-navigation/native';
import { useUser } from '@realm/react';
import {
  LocationAccuracy,
  LocationObjectCoords,
  LocationSubscription,
  useForegroundPermissions,
  requestBackgroundPermissionsAsync,
  watchPositionAsync,
} from 'expo-location';
import { Car } from 'phosphor-react-native';
import { useEffect, useRef, useState } from 'react';
import { TextInput, Alert, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { Container, Content, Message, MessageContent } from './styles';
import { Button } from '../../components/Button';
import { Header } from '../../components/Header';
import { LicensePlateInput } from '../../components/LicensePlateInput';
import { LoadIndicator } from '../../components/Loading/styles';
import { LocationInfo } from '../../components/LocationInfo';
import { Map } from '../../components/Map';
import { TextAreaInput } from '../../components/TextAreaInput';
import { useRealm } from '../../libs/realm';
import { Historic } from '../../libs/realm/schemas/Historic';
import { startLocationTask } from '../../tasks/backgroundLocationTask';
import { getAddressLocation } from '../../utils/getAddressLocation';
import { licensePlateValidate } from '../../utils/licensePlateValidate';
import { openSettings } from '../../utils/openSettings';

export const Departure: React.FC = () => {
  const realm = useRealm();
  const user = useUser();

  const { goBack } = useNavigation();

  const [locationForegroundPermission, requestLocationForegroundPermission] =
    useForegroundPermissions();

  const descriptionRef = useRef<TextInput>(null);
  const licensePlateRef = useRef<TextInput>(null);

  const [descriptionState, setDescriptionState] = useState('');
  const [licensePlateState, setLicensePlateState] = useState('');
  const [currentAddress, setCurrentAddress] = useState<string | null>(null);
  const [isLoadingRegister, setIsLoadingRegister] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [currentCoords, setCurrentCoords] =
    useState<LocationObjectCoords | null>(null);

  async function handleDepartureRegister() {
    try {
      if (!licensePlateValidate(licensePlateState)) {
        setLicensePlateState('');
        licensePlateRef.current?.focus();
        return Alert.alert('Placa Inválida', 'Informe uma placa válida.');
      }

      if (descriptionState.trim().length === 0) {
        setDescriptionState('');
        descriptionRef.current?.focus();
        return Alert.alert(
          'Finalidade',
          'Informe a finalidade da utilização do veículo'
        );
      }

      if (!currentCoords?.latitude && !currentCoords?.longitude) {
        return Alert.alert(
          'Localização!',
          'Não foi possível obter a localização atual. Tente novamente mais tarde'
        );
      }

      setIsLoadingRegister(true);

      const backgroundPermissions = await requestBackgroundPermissionsAsync();

      if (!backgroundPermissions.granted) {
        setIsLoadingRegister(false);

        return Alert.alert(
          'Localização',
          'É necessário permitir que o app tenha acesso a localização em segundo plano.'
        );
      }

      await startLocationTask();

      realm.write(() => {
        realm.create(
          'Historic',
          Historic.generate({
            user_id: user?.id!,
            license_plate: licensePlateState.toUpperCase(),
            description: descriptionState,
            coords: [
              {
                latitude: currentCoords.latitude,
                longitude: currentCoords.longitude,
                timestamp: new Date().getTime(),
              },
            ],
          })
        );
      });

      Alert.alert('Saída', 'Saída do veículo registrada com sucesso!');
      goBack();
    } catch (error) {
      console.log('ERROR on [handleDepartureRegister] -> ', error);
      Alert.alert(
        'Erro ao Registrar Saída',
        'Não foi possível registrar a saída do veículo'
      );
      setIsLoadingRegister(false);
    }
  }

  useEffect(() => {
    requestLocationForegroundPermission();
  }, []);

  useEffect(() => {
    if (!locationForegroundPermission?.granted) {
      return;
    }

    let subscription: LocationSubscription;

    watchPositionAsync(
      {
        accuracy: LocationAccuracy.High,
        timeInterval: 1000,
      },
      location => {
        setCurrentCoords(location.coords);

        getAddressLocation(location.coords)
          .then(address => address && setCurrentAddress(address))
          .finally(() => setIsLoadingLocation(false));
      }
    ).then(closeListener => {
      subscription = closeListener;
    });

    return () => subscription?.remove();
  }, [locationForegroundPermission]);

  if (!locationForegroundPermission?.granted) {
    return (
      <Container>
        <Header title="Saída" />
        <MessageContent>
          <Message>
            Você precisa permitir que o aplicativo tenha acesso a localização
            para acessar essa funcionalidade. Por favor, acesse as configurações
            do seu dispositivo para conceder a permissão ao aplicativo.
          </Message>

          <Button title="Abrir configurações" onPress={openSettings} />
        </MessageContent>
      </Container>
    );
  }

  if (isLoadingLocation) {
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
      <Header title="Saída" />

      <KeyboardAwareScrollView extraHeight={180} alwaysBounceVertical={false}>
        {currentCoords && <Map coordinates={[currentCoords]} />}

        <Content>
          {currentAddress && (
            <LocationInfo
              label="Localização atual"
              description={currentAddress}
              icon={Car}
            />
          )}

          <LicensePlateInput
            ref={licensePlateRef}
            label="Placa do veículo"
            placeholder="BRA1234"
            onSubmitEditing={() => descriptionRef.current?.focus()}
            returnKeyType="next"
            onChangeText={setLicensePlateState}
            value={licensePlateState}
          />

          <TextAreaInput
            ref={descriptionRef}
            label="Finalidade"
            placeholder="Vou utilizar esse veículo para..."
            onSubmitEditing={handleDepartureRegister}
            returnKeyType="send"
            blurOnSubmit
            onChangeText={setDescriptionState}
            value={descriptionState}
          />

          <Button
            title="Registrar Saída"
            onPress={handleDepartureRegister}
            isLoading={isLoadingRegister}
          />
        </Content>
      </KeyboardAwareScrollView>
    </Container>
  );
};
