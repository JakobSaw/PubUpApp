import layout_styles from '../styles/Layout_Styles';
import {View, Text, StyleSheet, TouchableHighlight} from 'react-native';
import React, {useContext} from 'react';
import MainContext from '../context/MainContext';
import Fonts from '../content/Fonts';
import {Light_Plus_Icon, Lupe_Icon, Plus_With_Circle} from '../content/Icons';
import {whiteColor, yellow} from '../styles/Colors';
import {normalizeFontSize} from '../utilities/ResFontSize';

const EmptyList = ({
  title,
  sub,
  marginTop,
  btnText1,
  btnClick1,
  btnText2,
  btnClick2,
}) => {
  const styles = StyleSheet.create({
    noFavorites_main_text: {
      color: whiteColor,
      fontFamily: Fonts.Bold,
      fontSize: normalizeFontSize(18), // before 20
    },
    noFavorites_small_text: {
      color: whiteColor,
      fontFamily: Fonts.Regular,
      fontSize: normalizeFontSize(12), // before 14
    },
  });
  return (
    <View style={[layout_styles.leer_container, {marginTop: marginTop}]}>
      <Text style={styles.noFavorites_main_text}>
        {title}
        {!!sub ? '\n' : ''}
      </Text>
      {!!sub && <Text style={styles.noFavorites_small_text}>{sub}</Text>}
      {!!btnText1 && (
        <TouchableHighlight
          onPress={btnClick1}
          style={{
            marginTop: 30,
            borderColor: whiteColor,
            borderWidth: 1,
            borderRadius: 5,
            paddingHorizontal: 25,
            paddingVertical: 15,
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Light_Plus_Icon
              styles={[layout_styles.extra_s_icon, {marginRight: 10}]}
              color={yellow}
            />
            <Text
              style={[styles.noFavorites_small_text, {fontFamily: Fonts.Bold}]}>
              {btnText1}
            </Text>
          </View>
        </TouchableHighlight>
      )}
      {!!btnText2 && (
        <TouchableHighlight
          onPress={btnClick2}
          style={{
            marginTop: 30,
            borderColor: whiteColor,
            borderWidth: 1,
            borderRadius: 5,
            paddingHorizontal: 25,
            paddingVertical: 15,
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Lupe_Icon
              styles={[layout_styles.extra_s_icon, {marginRight: 10}]}
              color={yellow}
            />
            <Text
              style={[styles.noFavorites_small_text, {fontFamily: Fonts.Bold}]}>
              {btnText2}
            </Text>
          </View>
        </TouchableHighlight>
      )}
    </View>
  );
};

export default EmptyList;
