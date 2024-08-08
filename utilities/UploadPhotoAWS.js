import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {AWS_KEY_ID, AWS_SECRET, S3_REGION, BUCKET_NAME} from '@env';
import {S3} from 'aws-sdk';
import GetID from './GetID';
import ImageResizer from '@bam.tech/react-native-image-resizer';
import {Platform} from 'react-native';
import RequestCameraPermission from './RequestCameraPermission';
import StoreValueLocally from './StoreValueLocally';

export default (type, t) => {
  return new Promise(async (resolve, reject) => {
    if (Platform.OS === 'android') {
      StoreValueLocally('@DontTrackAppChange', 'True');
    }
    setTimeout(async () => {
      const options = {
        selectionLimit: 1,
        mediaType: 'photo',
        includeBase64: false,
      };

      let result;
      if (type === 'gallery') {
        result = await launchImageLibrary(options);
      } else {
        if (Platform.OS === 'android') {
          const resCamera = await RequestCameraPermission(t);
          if (resCamera !== 'granted') return resolve('Cancel');
        }
        result = await launchCamera();
      }

      if (result.didCancel || result.errorCode) {
        return resolve('Cancel');
      }
      const s3 = new S3({
        accessKeyId: AWS_KEY_ID,
        secretAccessKey: AWS_SECRET,
        region: S3_REGION,
      });

      const response = await fetch(result.assets[0].uri);
      const blob = await response.blob();
      const fileName = await GetID();
      const params = {
        Bucket: BUCKET_NAME,
        Key: `${fileName}.jpg`,
        Body: blob,
      };

      const sizeMB = +response._bodyBlob._data.size / 1000000;

      if (sizeMB > 1) {
        ImageResizer.createResizedImage(
          result.assets[0].uri,
          1500,
          1500,
          'JPEG',
          80,
        )
          .then(async (comResponse) => {
            const compressedSizeMB = +comResponse.size / 1000000;
            console.log('compressedSizeMB :>> ', compressedSizeMB);
            const compressedResponse = await fetch(comResponse.uri);
            const compressedBlob = await compressedResponse.blob();
            s3.upload(
              {
                ...params,
                Body: compressedBlob,
              },
              function (err, data) {
                if (err) {
                  console.log('err in s3.upload :>> ', err);
                }
                console.log(`File uploaded successfully. ${data.Location}`);
                resolve(data.Location);
              },
            );
          })
          .catch((err) => {
            console.log('err :>> ', err);
            // Oops, something went wrong. Check that the filename is correct and
            // inspect err to get more details.
            resolve('Error');
          });
      } else {
        s3.upload(params, function (err, data) {
          if (err) {
            console.log('err in s3.upload :>> ', err);
          }
          console.log(`File uploaded successfully. ${data.Location}`);
          resolve(data.Location);
        });
      }
    }, 500);
  });
};
