import Geolocation from 'react-native-geolocation-service';
import StoreValueLocally from './StoreValueLocally';
import { Platform } from 'react-native';

export default async () => {
  return new Promise(function (resolve) {
    Geolocation.getCurrentPosition(
      (position) => {
        resolve(position);
      },
      (err) => {
        console.log('err.message :>> ', err.message);
        if (
          err.message?.indexOf('permission not granted') > -1 &&
          Platform.OS === 'android'
        ) {
          StoreValueLocally('@locationPermissionAndroid', 'denied');
        }
        resolve('Error');
      },
      { enableHighAccuracy: true, timeout: 30000, maximumAge: 30000 },
    );
  });
};
