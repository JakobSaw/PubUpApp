import React, {useContext, useEffect, useRef} from 'react';
import MainContext from '../../context/MainContext';
import {Animated, Text, Vibration} from 'react-native';
import {lightblue, whiteColor} from '../../styles/Colors';
import {screenWidth} from '../../utilities/WidthAndHeight';
import Fonts from '../../content/Fonts';
import {normalizeFontSize} from '../../utilities/ResFontSize';

const Toast = ({down}) => {
  const {toast, setToast} = useContext(MainContext);
  const selectToast = !!down ? down?.toast : toast;
  const funcToast = !!down ? down?.setToast : setToast;
  const animateBottom = useRef(new Animated.Value(-100)).current;
  const length = 2000;
  useEffect(() => {
    if (!!selectToast) {
      Vibration.vibrate();
      Animated.timing(animateBottom, {
        toValue: 100,
        duration: 300,
        useNativeDriver: false,
      }).start();
      setTimeout(() => {
        Animated.timing(animateBottom, {
          toValue: -100,
          duration: 300,
          useNativeDriver: false,
        }).start();
      }, length);
      setTimeout(() => {
        funcToast({
          ...selectToast,
          text: '',
        });
      }, length + 300);
    }
  }, []);
  return (
    <Animated.View
      style={{
        position: 'absolute',
        backgroundColor: selectToast?.color || lightblue,
        margin: 'auto',
        bottom: animateBottom,
        zIndex: 1000,
        padding: 10,
        left: screenWidth * 0.2,
        minWidth: screenWidth * 0.6,
        maxWidth: screenWidth * 0.6,
        alignItems: 'center',
        borderRadius: 5,
      }}>
      <Text
        style={{
          color: whiteColor,
          fontSize: normalizeFontSize(14), // before 16
          fontFamily: Fonts.Bold,
          textAlign: 'center',
        }}>
        {selectToast?.text}
      </Text>
    </Animated.View>
  );
};

export default Toast;
