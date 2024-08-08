// OneSignal
import {Platform} from 'react-native';
import {ONESIGNAL_ANDROID_APPID, ONESIGNAL_APPLE_APPID} from '@env';
import OneSignal from 'react-native-onesignal';

export default (userID) => {
  OneSignal.setAppId(
    Platform.OS === 'android' ? ONESIGNAL_ANDROID_APPID : ONESIGNAL_APPLE_APPID,
  );
  // OneSignal.removeExternalUserId();
  OneSignal.setExternalUserId(userID);
};
