import {
  Accuracy,
  startLocationUpdatesAsync,
  hasStartedLocationUpdatesAsync,
  stopLocationUpdatesAsync,
} from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { LatLng } from 'react-native-maps';

import {
  LocationProps,
  removeStorageLocations,
  saveStorageLocation,
} from '../libs/asyncStorage/locationStorage';

export const BACKGROUND_TASK_NAME = 'location-tracking';

let lastLocation: LatLng | null = null;

TaskManager.defineTask(BACKGROUND_TASK_NAME, async ({ data, error }: any) => {
  try {
    if (error) {
      throw error;
    }

    if (data) {
      const { coords, timestamp } = data.locations[0];

      const currentLocation: LocationProps = {
        latitude: coords.latitude,
        longitude: coords.longitude,
        timestamp,
      };

      if (lastLocation) {
        if (
          currentLocation.latitude === lastLocation.latitude &&
          currentLocation.longitude === lastLocation.longitude
        ) {
          return;
        }
      }

      lastLocation = {
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
      };

      await saveStorageLocation(currentLocation);
    }
  } catch (error) {
    console.log('Erro na Task -> ', error);
    stopLocationTask();
  }
});

export async function startLocationTask() {
  try {
    const hasStarted = await hasStartedLocationUpdatesAsync(
      BACKGROUND_TASK_NAME
    );

    if (hasStarted) {
      await stopLocationUpdatesAsync(BACKGROUND_TASK_NAME);
    }

    await startLocationUpdatesAsync(BACKGROUND_TASK_NAME, {
      accuracy: Accuracy.High,
      timeInterval: 5000,
    });
  } catch (error) {
    console.log(error);
  }
}

export async function stopLocationTask() {
  try {
    const hasStarted = await hasStartedLocationUpdatesAsync(
      BACKGROUND_TASK_NAME
    );

    if (hasStarted) {
      await stopLocationUpdatesAsync(BACKGROUND_TASK_NAME);
      await removeStorageLocations();
    }
  } catch (error) {
    console.log(error);
  }
}
