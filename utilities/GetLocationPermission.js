import { Platform, PermissionsAndroid } from 'react-native';
import { request, PERMISSIONS } from 'react-native-permissions';

export default async () => {
  const usePermissionsAndroid = false
  if (Platform.OS === 'ios') {
    let responseIOS = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    return responseIOS;
  } else {
    let responseANDROID
    if (usePermissionsAndroid) {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            'title': 'Location Access Required',
            'message': 'This App needs to Access your location'
          }
        )
        console.log('granted :>> ', granted);
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("You can use the location")
        } else {
          console.log("Location permission denied")
        }
        responseANDROID = granted
      } catch (err) {
        console.warn(err)
      }
    } else {
      responseANDROID = await request(
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      );
    }
    return responseANDROID;
  }
};
