import { useRef, useState } from 'react';
import {
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  View,
  useWindowDimensions,
  Alert,
} from 'react-native';

import { Container, Content } from './styles';
import { Button } from '../../components/Button';
import { Header } from '../../components/Header';
import { LicensePlateInput } from '../../components/LicensePlateInput';
import { TextAreaInput } from '../../components/TextAreaInput';
import { licensePlateValidate } from '../../utils/licensePlateValidate';

const keyboardAvoidingViewBehavior =
  Platform.OS === 'android' ? 'height' : 'position';

export const Departure: React.FC = () => {
  const descriptionRef = useRef<TextInput>(null);
  const licensePlateRef = useRef<TextInput>(null);

  const { height } = useWindowDimensions();

  const [keyboardOffset, setKeyboardOffset] = useState<number>(0);
  const [descriptionState, setDescriptionState] = useState('');
  const [licensePlateState, setLicensePlateState] = useState('');

  function handleDepartureRegister() {
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
  }

  return (
    <Container>
      <Header title="Saída" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={keyboardAvoidingViewBehavior}
        keyboardVerticalOffset={keyboardOffset}
      >
        <ScrollView alwaysBounceVertical={false}>
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

            <Button title="Registrar Saída" onPress={handleDepartureRegister} />
          </Content>
        </ScrollView>
        <View
          onLayout={({ nativeEvent }) => {
            setKeyboardOffset(nativeEvent.layout.y - height);
          }}
        />
      </KeyboardAvoidingView>
    </Container>
  );
};
