import { AppRoutesNamesEnum } from '../routes/routes.types';

export declare global {
  namespace ReactNavigation {
    interface RootParamList {
      [AppRoutesNamesEnum.home]: undefined;
      [AppRoutesNamesEnum.departure]: undefined;
    }
  }
}
