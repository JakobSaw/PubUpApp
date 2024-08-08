import React from 'react';
import { StyleSheet, View, TouchableHighlight } from 'react-native';
import { Plus_With_Circle } from '../../content/Icons';
import layout_styles from '../../styles/Layout_Styles';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const OpenForm = () => {
  const navigation = useNavigation();
  const styles = StyleSheet.create({
    container: {
      zIndex: 1,
      position: 'absolute',
      margin: 'auto',
      left: 'auto',
    },
  });
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.container,
        layout_styles.absolute_padding_right,
        { top: layout_styles.absolute_padding_top_lupe_2.top + insets.top },
      ]}>
      <TouchableHighlight onPress={() => navigation.push('Form')}>
        <Plus_With_Circle styles={layout_styles.m_icon} />
      </TouchableHighlight>
    </View>
  );
};
export default OpenForm;
