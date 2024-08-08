import React, {Fragment} from 'react';
import {StyleSheet, Text, View, TouchableHighlight} from 'react-native';
import {screenWidth} from '../../utilities/WidthAndHeight';
import {Category_Icon} from '../../content/Icons';
import Fonts from '../../content/Fonts';
import {yellow, whiteColor} from '../../styles/Colors';
import {normalizeFontSize} from '../../utilities/ResFontSize';

const ListItemCity = ({current, buttonClicked}) => {
  const styles = StyleSheet.create({
    container_1: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    container_2: {
      flexGrow: 1,
      maxWidth: screenWidth * 0.7,
    },
    pub_text: {
      color: whiteColor,
      fontFamily: Fonts.Bold,
      marginLeft: 20,
      marginRight: 25,
      marginTop: 10,
      fontSize: normalizeFontSize(14), // before 16
      flexGrow: 1,
    },
    city_text: {
      color: whiteColor,
      fontFamily: Fonts.Light,
      marginLeft: 20,
      marginRight: 25,
      marginBottom: 10,
      fontSize: normalizeFontSize(12), // before 14
      flexGrow: 1,
    },
  });

  return (
    <View style={styles.container_1}>
      <Category_Icon category="City" />
      <TouchableHighlight style={styles.container_2} onPress={buttonClicked}>
        <Fragment>
          <Text style={styles.pub_text}>{current.city}</Text>
          <Text style={styles.city_text}>{current.pubCount} Pubs</Text>
        </Fragment>
      </TouchableHighlight>
    </View>
  );
};

export default ListItemCity;
