import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import layout_styles from '../styles/Layout_Styles';
import Fonts from '../content/Fonts';
import { darkblue, red, whiteColor } from '../styles/Colors';
import i18n from 'i18next';
import '../content/translation';
import { useTranslation } from 'react-i18next';
import { normalizeFontSize } from '../utilities/ResFontSize';
import { screenHeight } from '../utilities/WidthAndHeight';

const GlobalMessage = ({ msg = {} }) => {
  const styles = StyleSheet.create({
    sv: {
      height: screenHeight * 0.35,
    },
    marginB: {
      marginBottom: 30,
    },
    eolbutton2: {
      padding: 17.5,
      borderRadius: 5,
      borderColor: whiteColor,
      borderWidth: 1,
      alignItems: 'center',
      backgroundColor: darkblue,
    },
    eolbuttontext: {
      color: whiteColor,
      fontFamily: Fonts.Bold,
    },
    eoltitle: {
      color: whiteColor,
      fontFamily: Fonts.Bold,
      fontSize: normalizeFontSize(14), // before 16
    },
    eoltitlemargin: {
      marginBottom: 30,
    },
    eoltext: {
      color: red,
      fontFamily: Fonts.Bold,
      fontSize: normalizeFontSize(18), // before 20
    },
    eol: {
      backgroundColor: 'rgba(23,30,52,1)',
      ...StyleSheet.absoluteFill,
      position: 'absolute',
      zIndex: 100,
      display: 'flex',
      justifyContent: 'center',
    },
  });

  const { t } = useTranslation();
  return (
    <View
      style={[
        styles.eol,
        layout_styles.just_modal_container_paddings_left_right,
      ]}>
      {/* <Text style={[styles.eoltitle, styles.eoltitlemargin]}>
        {t('importantNote')}
      </Text> */}
      <View
        style={{
          display: 'flex',
          // alignItems: 'center',
        }}>
        <Svg
          viewBox="0 0 89.91 79.37"
          style={[{ marginBottom: 25 }, layout_styles.m_icon]}>
          <Path
            fill={red}
            d="M45 53.79a1.22 1.22 0 01-1.26-1.17l-.83-27.7c0-.64 1.39-1.16 2.09-1.16s2.09.52 2.09 1.16l-.84 27.7A1.22 1.22 0 0145 53.79z"
          />
          <Circle fill={red} cx={44.96} cy={62.13} r={4.1} />
          <Path
            fill={red}
            d="M89.14 70.87l-39.27-68a5.67 5.67 0 00-9.82 0l-39.28 68a5.67 5.67 0 004.91 8.5h56.16a1.5 1.5 0 100-3H5.68a2.67 2.67 0 01-2.31-4l39.27-68a2.68 2.68 0 014.63 0l39.28 68a2.67 2.67 0 01-2.32 4H73a1.5 1.5 0 000 3h11.23a5.66 5.66 0 004.91-8.5z"
          />
        </Svg>
      </View>
      <Text style={[styles.eoltext, { marginBottom: 30 }]}>
        {msg[i18n.language]}
      </Text>
    </View>
  );
};

export default GlobalMessage;
