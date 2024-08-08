import React from 'react';
import {View, StyleSheet, Platform} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Navigators from './components/navigation';
import {darkblue} from './styles/Colors';
import CustomisableAlert from 'react-native-customisable-alert';
import layout_styles from './styles/Layout_Styles';

export default function RefactoredApp() {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        ...StyleSheet.absoluteFill,
        backgroundColor: darkblue,
        paddingBottom:
          Platform.OS === 'android'
            ? 0
            : insets.bottom ||
              layout_styles.just_modal_container_paddings_bottom.paddingBottom,
      }}>
      <Navigators />
      <CustomisableAlert
        dismissable
        modalProps={{backgroundColor: 'rgba(23,30,52,0.9)'}}
      />
    </View>
  );
}
