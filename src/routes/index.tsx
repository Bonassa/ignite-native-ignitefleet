import { NavigationContainer } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

import { AppRoutes } from './app.routes';
import { SyncMessage } from '../components/SyncMessage';

export function Routes() {
  return (
    <NavigationContainer>
      <AppRoutes />

      <Toast
        config={{
          info: ({ text1 }) => <SyncMessage title={String(text1)} />,
        }}
      />
    </NavigationContainer>
  );
}
