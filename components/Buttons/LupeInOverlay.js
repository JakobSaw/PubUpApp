import React from 'react';
import { StyleSheet, TouchableHighlight, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { yellow } from '../../styles/Colors';
import layout_styles from '../../styles/Layout_Styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Lupe = () => {
  const styles = StyleSheet.create({
    addlupe: {
      zIndex: 49,
      position: 'absolute',
      margin: 'auto',
      left: 'auto',
      backgroundColor: 'rgba(0,0,0,0)',
    },
  });
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.addlupe,
        layout_styles.absolute_padding_right,
        { top: layout_styles.absolute_padding_top_lupe_3.top + insets.top },
      ]}>
      <TouchableHighlight style={layout_styles.m_icon}>
        <Svg viewBox="0 0 79.37 79.37">
          <Path
            fill={yellow}
            d="M39.69 0A39.8 39.8 0 000 39.68a39.8 39.8 0 0039.68 39.69 39.8 39.8 0 0039.69-39.68A39.8 39.8 0 0039.69 0zm24.79 64.26a6.79 6.79 0 01-3.37 1.86 6.58 6.58 0 01-6.36-1.86l-7.67-7.62L44.3 54c-1.07.42-2.14.93-3.21 1.25a21.89 21.89 0 01-26.23-10.54 21.28 21.28 0 01-2.69-8.82A22 22 0 0125 14.25a21.11 21.11 0 017.29-2h3.44a13.2 13.2 0 012.69.42 21.21 21.21 0 0110.36 5.11 21.51 21.51 0 017 11.74A22 22 0 0154 43.74v.55l4.64 4.65 5.8 5.8a6.74 6.74 0 01.04 9.52z"
          />
          <Path
            fill={yellow}
            d="M56.19 51.4a1.68 1.68 0 00-2.37 0 1.64 1.64 0 00-.07 2.3l.07.07c1.53 1.62 3.11 3.2 4.64 4.64a4.47 4.47 0 001 .56 1.72 1.72 0 001.74-1.07 1.59 1.59 0 00-.37-1.9zM34.27 17.32a16.95 16.95 0 1016.9 17 16.94 16.94 0 00-16.9-17z"
          />
        </Svg>
      </TouchableHighlight>
    </View>
  );
};

export default Lupe;
