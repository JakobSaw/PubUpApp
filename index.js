/**
 * @format
 */
import React from 'react';
import { AppRegistry } from 'react-native';
import RefactoredApp from './NewApp2023';
import { name as appName } from './app.json';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-gesture-handler';

const renderApp = () => (
  <>
    <SafeAreaProvider>
      <RefactoredApp />
    </SafeAreaProvider>
  </>
);

AppRegistry.registerComponent(appName, () => renderApp);
