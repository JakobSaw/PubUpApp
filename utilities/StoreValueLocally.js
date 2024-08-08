import AsyncStorage from '@react-native-async-storage/async-storage';

export default (token, value) => {
  const stringValue = JSON.stringify(value);
  AsyncStorage.setItem(token, stringValue);
};
