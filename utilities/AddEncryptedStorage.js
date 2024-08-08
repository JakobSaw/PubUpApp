import EncryptedStorage from 'react-native-encrypted-storage';
import {
    Alert
} from 'react-native';

async function storeEncryptedStorage(STORAGE_KEY, data) {
    try {
        await EncryptedStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch (error) {
        // There was an error on the native side
        Alert.alert("Wert konnte nicht gespeichert werden, bitte probiere es nochmal", "Value could not be stored, please try again")
    }
}

export default storeEncryptedStorage;