import layout_styles from '../styles/Layout_Styles';
import {View, Text, ImageBackground} from 'react-native';
import React from 'react';
import {whiteColor} from '../styles/Colors';
import {screenHeight} from '../utilities/WidthAndHeight';
import Fonts from '../content/Fonts';
import {normalizeFontSize} from '../utilities/ResFontSize';

const ModalHeaderNew = ({title, setPaddingBottom = 20, imgURL}) => {
  return (
    <>
      {!!imgURL && (
        <ImageBackground
          source={{
            uri: imgURL || 'https://i.ibb.co/6RqCCJJ/Banner-Default-1.jpg',
          }}
          resizeMode="cover"
          style={{width: '100%', height: screenHeight * 0.3}}
        />
      )}
      {!!title && (
        <View style={[layout_styles.just_modal_container_paddings_left_right]}>
          <Text
            style={[
              {
                color: whiteColor,
                fontFamily: Fonts.Bold,
                fontSize: normalizeFontSize(14), // before 16
                lineHeight: normalizeFontSize(16), // before 18
                flexGrow: 1,
              },
            ]}>
            {title}
          </Text>
        </View>
      )}
      <View style={{marginTop: setPaddingBottom}} />
    </>
  );
};

export default ModalHeaderNew;
