import { useNavigation } from '@react-navigation/native';
import { useUser } from '@realm/react';
import { useRef, useState } from 'react';
import { TextInput, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { Container, Content } from './styles';
import { Button } from '../../components/Button';
import { Header } from '../../components/Header';
import { LicensePlateInput } from '../../components/LicensePlateInput';
import { TextAreaInput } from '../../components/TextAreaInput';
import { useRealm } from '../../libs/realm';
import { Historic } from '../../libs/realm/schemas/Historic';
import { licensePlateValidate } from '../../utils/licensePlateValidate';

export const Departure: React.FC = () => {
  const realm = useRealm();
  const user = useUser();

  const { goBack } = useNavigation();

  const descriptionRef = useRef<TextInput>(null);
  const licensePlateRef = useRef<TextInput>(null);

  const [descriptionState, setDescriptionState] = useState('');
  const [licensePlateState, setLicensePlateState] = useState('');
  const [isLoadingRegister, setIsLoadingRegister] = useState(false);

  function handleDepartureRegister() {
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

      setIsLoadingRegister(true);

      realm.write(() => {
        realm.create(
          'Historic',
          Historic.generate({
            user_id: user?.id!,
            license_plate: licensePlateState.toUpperCase(),
            description: descriptionState,
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

  return (
    <Container>
      <Header title="Saída" />

      <KeyboardAwareScrollView extraHeight={180} alwaysBounceVertical={false}>
        <Content>
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
