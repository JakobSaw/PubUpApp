import AsyncStorage from '@react-native-async-storage/async-storage';

export default (token) => {
  AsyncStorage.removeItem(token);
};
