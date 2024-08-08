import React from 'react';
import {TouchableOpacity, Text} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {lightblue} from '../../styles/Colors';
import layout_styles from '../../styles/Layout_Styles';

const PrimaryButton_Light = ({text, buttonClicked}) => {
  return (
    <TouchableOpacity
      style={[layout_styles.primaryButton_touchable_outline, {borderWidth: 0}]}
      onPress={buttonClicked}>
      <LinearGradient
        colors={[lightblue, lightblue]}
        style={layout_styles.primaryButton_gradient}
        useAngle={true}>
        <Text
          style={[
            layout_styles.primaryButton_text_outline,
            {textAlign: 'center'},
          ]}>
          {text}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default PrimaryButton_Light;
