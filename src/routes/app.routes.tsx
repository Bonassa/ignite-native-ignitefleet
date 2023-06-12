import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Home } from '../screens/Home';

export enum AppRoutesNamesEnum {
  home = 'home',
}

const { Navigator, Screen } = createNativeStackNavigator();

export function AppRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name={AppRoutesNamesEnum.home} component={Home} />
    </Navigator>
  );
}
