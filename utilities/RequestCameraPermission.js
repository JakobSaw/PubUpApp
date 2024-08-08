import {PermissionsAndroid} from 'react-native';

export default (t) => {
  return new Promise(async (resolve) => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: t('cameraPermissionTitle'),
          message: t('cameraPermissionMSG'),
          buttonNeutral: t('cameraPermissionBTNNeutral'),
          buttonNegative: t('cameraPermissionBTNCancel'),
          buttonPositive: t('cameraPermissionBTNOK'),
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        resolve('granted');
      } else {
        resolve('denied');
      }
    } catch (err) {
      resolve('denied');
    }
  });
};
