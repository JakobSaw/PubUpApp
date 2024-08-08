import AsyncStorage from '@react-native-async-storage/async-storage';

export default (token) => {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem(token)
      .then((response) => {
        if (response != null) {
          const jsonValue = JSON.parse(response);
          resolve(jsonValue);
        } else {
          resolve(null);
        }
      })
      .catch((err) => {
        reject(new Error(err));
      });
  });
};
