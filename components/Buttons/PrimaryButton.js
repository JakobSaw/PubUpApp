import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import layout_styles from '../../styles/Layout_Styles';
import { red, yellow } from '../../styles/Colors';
import { normalizeFontSize } from '../../utilities/ResFontSize';
import { screenWidth } from '../../utilities/WidthAndHeight';

const PrimaryButton = ({ disabled, text, buttonClicked, smallerFont }) => {
  const opacityButton = () => {
    if (disabled) {
      return 0.2;
    } else {
      return 1;
    }
  };
  return (
    <TouchableOpacity
      style={[
        { opacity: opacityButton() },
        layout_styles.primaryButton_touchable,
      ]}
      disabled={disabled}
      onPress={() => buttonClicked()}>
      <LinearGradient
        colors={[yellow, red]}
        style={layout_styles.primaryButton_gradient}
        useAngle={true}>
        <Text style={[layout_styles.primaryButton_text, { textAlign: 'center' }, !!smallerFont ? { fontSize: normalizeFontSize(14), paddingHorizontal: screenWidth * 0.1 } : {}]}>
          {text}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default PrimaryButton;
