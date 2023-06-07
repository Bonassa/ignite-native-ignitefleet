import { ANDROID_CLIENT_ID, IOS_CLIENT_ID } from '@env';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

import { Container, Title, Slogan } from './styles';
import backgroundImg from '../../assets/background.png';
import { Button } from '../../components/Button';

WebBrowser.maybeCompleteAuthSession();

export const SignIn: React.FC = () => {
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [, response, googleSignIn] = Google.useAuthRequest({
    androidClientId: ANDROID_CLIENT_ID,
    iosClientId: IOS_CLIENT_ID,
    scopes: ['profile', 'email'],
  });

  function handleGoogleSignIn() {
    setIsAuthenticating(true);

    googleSignIn().then(response => {
      if (response.type !== 'success') {
        setIsAuthenticating(false);
      }
    });
  }

  useEffect(() => {
    if (response?.type === 'success') {
      const token = response.authentication?.idToken;

      if (token) {
        console.log('Token -> ', token);

        fetch(
          `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${token}`
        )
          .then(response => response.json())
          .then(console.log);
      } else {
        Alert.alert('Entrar', 'Não foi possível se conectar a sua conta');
        setIsAuthenticating(false);
      }
    }
  }, [response]);

  return (
    <Container source={backgroundImg}>
      <Title>Ignite Fleet</Title>

      <Slogan>Gestão de uso de veículos</Slogan>

      <Button
        title="Entrar com o Google"
        onPress={handleGoogleSignIn}
        isLoading={isAuthenticating}
      />
    </Container>
  );
};
