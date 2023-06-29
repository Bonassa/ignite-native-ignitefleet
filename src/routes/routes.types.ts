export enum AppRoutesNamesEnum {
  home = 'home',
  departure = 'departure',
  arrival = 'arrival',
}

export type ArrivalRouteParams = {
  id: string;
  isSync?: boolean;
};
