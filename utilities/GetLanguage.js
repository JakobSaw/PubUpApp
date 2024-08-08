import {Platform, NativeModules} from 'react-native';

export default () => {
  let getLanguageSetting;
  if (Platform.OS === 'ios') {
    getLanguageSetting =
      NativeModules.SettingsManager.settings.AppleLanguages[0];
  } else {
    getLanguageSetting = NativeModules.I18nManager.localeIdentifier;
  }
  let languageSubstring = getLanguageSetting.substring(0, 2);
  if (
    languageSubstring === 'de' ||
    languageSubstring === 'DE' ||
    languageSubstring === 'De'
  ) {
    return 'de';
  }
  return 'en';
};
