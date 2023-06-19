import { useRef, useState } from 'react';
import {
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  View,
  useWindowDimensions,
} from 'react-native';

import { Container, Content } from './styles';
import { Button } from '../../components/Button';
import { Header } from '../../components/Header';
import { LicensePlateInput } from '../../components/LicensePlateInput';
import { TextAreaInput } from '../../components/TextAreaInput';

const keyboardAvoidingViewBehavior =
  Platform.OS === 'android' ? 'height' : 'position';

export const Departure: React.FC = () => {
  const descriptionRef = useRef<TextInput>(null);
  const { height } = useWindowDimensions();
  const [keyboardOffset, setKeyboardOffset] = useState<number>(0);

  function handleDepartureRegister() {
    console.log('OK');
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
              label="Placa do veículo"
              placeholder="BRA1234"
              onSubmitEditing={() => descriptionRef.current?.focus()}
              returnKeyType="next"
            />

            <TextAreaInput
              ref={descriptionRef}
              label="Finalidade"
              placeholder="Vou utilizar esse veículo para..."
              onSubmitEditing={handleDepartureRegister}
              returnKeyType="send"
              blurOnSubmit
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
