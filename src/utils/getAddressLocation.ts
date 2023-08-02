import { reverseGeocodeAsync } from 'expo-location';
import { LatLng } from 'react-native-maps';

export async function getAddressLocation({ latitude, longitude }: LatLng) {
  try {
    const addressResponse = await reverseGeocodeAsync({ latitude, longitude });

    return addressResponse[0]?.street;
  } catch (error) {
    console.log(error);
  }
}
