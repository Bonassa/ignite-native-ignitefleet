import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AppRoutesNamesEnum } from './routes.types';
import { Departure } from '../screens/Departure';
import { Home } from '../screens/Home';

const { Navigator, Screen } = createNativeStackNavigator();

export function AppRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name={AppRoutesNamesEnum.home} component={Home} />
      <Screen name={AppRoutesNamesEnum.departure} component={Departure} />
    </Navigator>
  );
}
