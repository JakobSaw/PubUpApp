import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableHighlight } from 'react-native';
import { Plus_Without_Circle, Minus_Without_Circle } from '../../content/Icons';
import layout_styles from '../../styles/Layout_Styles';
import MainContext from '../../context/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChangeRadius = () => {
  const { mainState, setMainState } = useContext(MainContext);
  const token = '@radiusWorld';
  const [loading, setLoading] = useState(false)
  const factor = 100

  const storeBoolean = async (value) => {
    try {
      const stringValue = JSON.stringify(value);
      await AsyncStorage.setItem(token, stringValue);
      setLoading(false)
    } catch (e) {
      // saving error
    }
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 17.5,
        alignItems: 'center',
      }}>
      <TouchableHighlight
        style={mainState.radiusWorld === factor || loading ? { opacity: 0.3 } : {}}
        onPress={() => {
          setLoading(true)
          setMainState({
            ...mainState,
            radiusWorld: mainState.radiusWorld - factor,
          });
          storeBoolean(mainState.radiusWorld - factor);
        }}
        disabled={mainState.radiusWorld === factor || loading}>
        <Minus_Without_Circle styles={layout_styles.s_icon} />
      </TouchableHighlight>
      <Text
        style={[
          layout_styles.font_styling_h3_Bold,
          { marginLeft: 15, marginRight: 15 },
        ]}>
        {mainState.radiusWorld}km Radius
      </Text>
      <TouchableHighlight
        style={loading ? { opacity: 0.3 } : {}}
        onPress={() => {
          setLoading(true)
          setMainState({
            ...mainState,
            radiusWorld: mainState.radiusWorld + factor,
          });
          storeBoolean(mainState.radiusWorld + factor);
        }} disabled={loading}>
        <Plus_Without_Circle styles={layout_styles.s_icon} />
      </TouchableHighlight>
    </View>
  );
};
export default ChangeRadius;
