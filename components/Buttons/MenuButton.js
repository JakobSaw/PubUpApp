import React from 'react';
import {View, TouchableHighlight} from 'react-native';
import {Menu_Icon} from '../../content/Icons';
import layout_styles from '../../styles/Layout_Styles';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const MenuButton = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        {
          position: 'absolute',
          margin: 'auto',
          zIndex: 3,
          left: 'auto',
        },
        layout_styles.absolute_padding_right,
        {top: layout_styles.absolute_padding_top.top + insets.top},
      ]}>
      <TouchableHighlight
        style={layout_styles.m_icon}
        onPress={() => navigation.push('Menu')}>
        <Menu_Icon />
      </TouchableHighlight>
    </View>
  );
};

export default MenuButton;
