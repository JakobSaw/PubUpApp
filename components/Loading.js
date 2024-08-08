import React from 'react';
import {StyleSheet, Platform, Image} from 'react-native';
import {screenWidth, screenHeight} from '../utilities/WidthAndHeight';
import FastImage from 'react-native-fast-image';

const Loading = ({randomNumber = 0}) => {
  const styles = StyleSheet.create({
    loadingpic: {
      width: 150,
      height: 150,
      marginLeft: screenWidth / 2 - 75,
      position: 'absolute',
      zIndex: 3,
      marginTop: screenHeight / 2 - 75,
    },
  });

  if (randomNumber === 0) {
    if (Platform.OS === 'android')
      return (
        <FastImage
          style={styles.loadingpic}
          source={require('../assets/Billard.gif')}
        />
      );
    return (
      <Image
        style={styles.loadingpic}
        source={require('../assets/Billard.gif')}
      />
    );
  } else if (randomNumber === 1) {
    if (Platform.OS === 'android')
      return (
        <FastImage
          style={styles.loadingpic}
          source={require('../assets/Dart.gif')}
        />
      );
    return (
      <Image style={styles.loadingpic} source={require('../assets/Dart.gif')} />
    );
  } else if (randomNumber === 2) {
    if (Platform.OS === 'android')
      return (
        <FastImage
          style={styles.loadingpic}
          source={require('../assets/Kicker.gif')}
        />
      );
    return (
      <Image
        style={styles.loadingpic}
        source={require('../assets/Kicker.gif')}
      />
    );
  } else if (randomNumber === 3) {
    if (Platform.OS === 'android')
      return (
        <FastImage
          style={styles.loadingpic}
          source={require('../assets/Saxo.gif')}
        />
      );
    return (
      <Image style={styles.loadingpic} source={require('../assets/Saxo.gif')} />
    );
  } else {
    return null;
  }
};

export default Loading;
