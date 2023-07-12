import 'react-native-get-random-values';
import './src/libs/dayjs';

import { REALM_APP_ID } from '@env';
import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto';
import { useNetInfo } from '@react-native-community/netinfo';
import { AppProvider, UserProvider } from '@realm/react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from 'styled-components/native';

import ConnectionMessage from './src/components/ConnectionMessage';
import { Loading } from './src/components/Loading';
import { RealmProvider, syncConfig } from './src/libs/realm';
import { Routes } from './src/routes';
import { SignIn } from './src/screens/SignIn';
import theme from './src/theme';

export default function App() {
  const { isConnected } = useNetInfo();
  const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold });

  if (!fontsLoaded) {
    return <Loading />;
  }

  return (
    <AppProvider id={REALM_APP_ID}>
      <ThemeProvider theme={theme}>
        <SafeAreaProvider
          style={{ flex: 1, backgroundColor: theme.COLORS.GRAY_800 }}
        >
          {!isConnected && <ConnectionMessage />}
          <StatusBar
            barStyle="light-content"
            backgroundColor="transparent"
            translucent
          />
          <UserProvider fallback={SignIn}>
            <RealmProvider sync={syncConfig} fallback={Loading}>
              <Routes />
            </RealmProvider>
          </UserProvider>
        </SafeAreaProvider>
      </ThemeProvider>
    </AppProvider>
  );
}
