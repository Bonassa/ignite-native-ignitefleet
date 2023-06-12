import { AppRoutesNamesEnum } from '../routes/app.routes';

export declare global {
  namespace ReactNavigation {
    interface RootParamList {
      [AppRoutesNamesEnum.home]: undefined;
    }
  }
}
