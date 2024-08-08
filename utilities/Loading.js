import React from 'react';
import {Platform, Image, View} from 'react-native';
import FastImage from 'react-native-fast-image';

const Loading = ({styles, downNum}) => {
  let num;
  if (typeof downNum === 'number') {
    num = downNum;
  } else {
    num = Math.floor(Math.random() * Math.floor(4));
  }
  if (num === 0) {
    if (Platform.OS === 'android')
      return (
        <FastImage style={styles} source={require('../assets/Billard.gif')} />
      );
    return <Image style={styles} source={require('../assets/Billard.gif')} />;
  } else if (num === 1) {
    if (Platform.OS === 'android')
      return (
        <FastImage style={styles} source={require('../assets/Dart.gif')} />
      );
    return <Image style={styles} source={require('../assets/Dart.gif')} />;
  } else if (num === 2) {
    if (Platform.OS === 'android')
      return (
        <FastImage style={styles} source={require('../assets/Kicker.gif')} />
      );
    return <Image style={styles} source={require('../assets/Kicker.gif')} />;
  } else if (num === 3) {
    if (Platform.OS === 'android')
      return (
        <FastImage style={styles} source={require('../assets/Saxo.gif')} />
      );
    return <Image style={styles} source={require('../assets/Saxo.gif')} />;
  } else {
    return null;
  }
};

export default Loading;
