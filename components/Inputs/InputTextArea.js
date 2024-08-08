import React from 'react';
import {StyleSheet, Text, TextInput} from 'react-native';
import Fonts from '../../content/Fonts';
import {whiteColor} from '../../styles/Colors';
import {screenHeight} from '../../utilities/WidthAndHeight';
import {normalizeFontSize} from '../../utilities/ResFontSize';

const InputTextArea = ({
  title,
  value,
  onChange,
  placeholder,
  marginTop,
  setMaxLength,
  setHeight = 0,
}) => {
  const styles = StyleSheet.create({
    angabe2: {
      fontFamily: Fonts.Bold,
      marginBottom: 5,
      fontSize: normalizeFontSize(14), // before 16
      flexGrow: 1,
    },
    searchinputstyling: {
      borderColor: whiteColor,
      color: whiteColor,
      borderWidth: 1,
      fontFamily: Fonts.Bold,
      borderRadius: 5,
      paddingLeft: 15,
      paddingRight: 15,
    },
  });
  return (
    <>
      <Text
        style={[
          styles.angabe2,
          {
            color: whiteColor,
            marginTop: marginTop || 0,
          },
        ]}>
        {title}
      </Text>
      <TextInput
        multiline
        numberOfLines={4}
        style={[
          styles.searchinputstyling,
          {
            height: !!setHeight ? setHeight : screenHeight * 0.2,
            textAlignVertical: 'top',
            paddingTop: 15,
            paddingBottom: 15,
          },
          {fontSize: normalizeFontSize(10)},
        ]}
        onChangeText={(text) => onChange(text)}
        value={value}
        placeholder={placeholder}
        placeholderTextColor="rgba(255,255,255,0.7)"
        maxLength={setMaxLength}
      />
    </>
  );
};
export default InputTextArea;
