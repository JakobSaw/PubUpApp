import {NativeModules, Platform} from 'react-native';

export default () => {
  return {
    language:
      Platform.OS === 'ios'
        ? NativeModules.SettingsManager.settings.AppleLanguages[0] ||
          'Undefined'
        : NativeModules.I18nManager.localeIdentifier || 'Undefined',
    locale:
      Platform.OS === 'ios'
        ? NativeModules.SettingsManager.settings.AppleLocale || 'Undefined'
        : NativeModules.I18nManager.localeIdentifier || 'Undefined',
    os_version: Platform.constants['Release'],
  };
};
