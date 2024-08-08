import {Image} from 'react-native';

export default (url) => {
  return new Promise(
    (resolve) => {
      Image.getSize(url, (width, height) => {
        resolve({width, height});
      });
    },
    (error) => resolve(null),
  );
};
