import { ANDROID_CLIENT_ID, IOS_CLIENT_ID } from '@env';
import { Realm, useApp } from '@realm/react';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

import { Container, Title, Slogan } from './styles';
import backgroundImg from '../../assets/background.png';
import { Button } from '../../components/Button';

WebBrowser.maybeCompleteAuthSession();

export function SignIn() {
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const app = useApp();

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
        const credentials = Realm.Credentials.jwt(token);
        app.logIn(credentials).catch(error => {
          console.log(error);
          Alert.alert('Entrar', 'Não foi possível se conectar a sua conta');
          setIsAuthenticating(false);
        });
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
}
