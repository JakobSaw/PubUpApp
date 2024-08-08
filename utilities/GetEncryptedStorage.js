import EncryptedStorage from 'react-native-encrypted-storage';
import {Alert} from 'react-native';

async function retrieveEncryptedStorage(STORAGE_KEY) {
  try {
    const data = await EncryptedStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsedData = JSON.parse(data);
      return parsedData;
    } else {
      return undefined;
    }
  } catch {
    Alert.alert(
      'Wert konnte nicht gefunden werden, bitte probiere es nochmal',
      'Value could not be stored, please try again',
    );
  }
}

export default retrieveEncryptedStorage;
