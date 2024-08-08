import React, {useContext} from 'react';
import {StyleSheet, Text} from 'react-native';
import Fonts from '../content/Fonts';
import MainContext from '../context/MainContext';
import {yellow, whiteColor} from '../styles/Colors';
import {normalizeFontSize} from '../utilities/ResFontSize';

const InnerTitle = ({title, marginTop}) => {
  const styles = StyleSheet.create({
    styling: {
      fontFamily: Fonts.Bold,
      marginTop: marginTop || 30,
      marginBottom: 5,
      fontSize: normalizeFontSize(14), // before 16
      flexGrow: 1,
      color: whiteColor,
    },
  });
  return <Text style={styles.styling}>{title}</Text>;
};
export default InnerTitle;
