import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Plus_With_Circle } from '../../content/Icons';
import layout_styles from '../../styles/Layout_Styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const OpenFormInOverlay = () => {
  const styles = StyleSheet.create({
    container: {
      zIndex: 49,
      position: 'absolute',
      margin: 'auto',
      left: 'auto',
    },
  });
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.container,
        layout_styles.absolute_padding_right,
        {
          top: layout_styles.absolute_padding_top_lupe_2.top + insets.top,
        },
      ]}>
      <Plus_With_Circle styles={layout_styles.m_icon} />
    </View>
  );
};
export default OpenFormInOverlay;
