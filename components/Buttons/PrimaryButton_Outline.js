import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { darkblue, whiteColor, yellow } from '../../styles/Colors';
import layout_styles from '../../styles/Layout_Styles';
import { KneipenBachelor_Icon } from '../../content/Icons';
import Loading from '../../utilities/Loading';
import { normalizeFontSize } from '../../utilities/ResFontSize';

const PrimaryButton_Outline = ({
  text,
  buttonClicked,
  marginTopAuto = true,
  setMarginTop,
  setPadding,
  disabled,
  showIcon,
}) => {
  return (
    <TouchableOpacity
      style={[
        layout_styles.primaryButton_touchable_outline,
        marginTopAuto ? { marginTop: 'auto' } : {},
        setMarginTop ? { marginTop: setMarginTop } : {},
        { borderWidth: 1, borderColor: whiteColor },
        disabled ? { opacity: 0.2 } : {},
      ]}
      onPress={() => buttonClicked()}
      disabled={disabled}>
      {!showIcon && (
        <LinearGradient
          colors={[darkblue, darkblue]}
          style={[
            layout_styles.eol_button,
            setPadding ? { padding: setPadding } : {},
          ]}
          useAngle={true}>
          <Text style={layout_styles.eol_button_text}>{text}</Text>
        </LinearGradient>
      )}
      {!!showIcon && (
        <LinearGradient
          colors={[darkblue, darkblue]}
          style={[
            layout_styles.eol_button,
            setPadding ? { padding: setPadding } : {},
            {
              flexDirection: 'row',
              justifyContent: 'center',
              paddingHorizontal: 30,
            },
          ]}
          useAngle={true}>
          <>
            <View style={{ marginRight: 10 }}>
              {showIcon}
            </View>
            <Text
              style={[layout_styles.eol_button_text, { textAlign: 'center' }]}>
              {text}
            </Text>
          </>
        </LinearGradient>
      )}
    </TouchableOpacity>
  );
};

export default PrimaryButton_Outline;
