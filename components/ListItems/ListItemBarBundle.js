import React from 'react';
import {StyleSheet, Text, View, TouchableHighlight} from 'react-native';
import layout_styles from '../../styles/Layout_Styles';
import {BarBundle_Icon} from '../../content/Icons';
import {darkblue, yellow} from '../../styles/Colors';

import Fonts from '../../content/Fonts';
import {normalizeFontSize} from '../../utilities/ResFontSize';
import layout_styles from '../../styles/Layout_Styles';

const ListItemBarBundle = ({itemClicked, title, sub}) => {
  const styles = StyleSheet.create({
    container: {
      backgroundColor: yellow,
      borderRadius: 5,
      paddingLeft: 10,
      paddingRight: 10,
      paddingTop: 17.5,
      paddingBottom: 17.5,
      flexDirection: 'row',
      alignItems: 'center',
    },
    sub_text: {
      color: darkblue,
      fontFamily: Fonts.Light,
      fontSize: normalizeFontSize(12), // before 14
    },
  });
  return (
    <TouchableHighlight style={{marginBottom: 15}} onPress={itemClicked}>
      <View style={styles.container}>
        <View style={{paddingHorizontal: 5}}>
          <BarBundle_Icon
            styles={[layout_styles.extra_s_icon]}
            color={darkblue}
          />
        </View>
        <View style={{flexDirection: 'column', marginLeft: 10}}>
          <Text style={[layout_styles.font_styling_h3_Bold, {color: darkblue}]}>
            {title}
          </Text>
          {sub && <Text style={styles.sub_text}>{sub}</Text>}
        </View>
      </View>
    </TouchableHighlight>
  );
};
export default ListItemBarBundle;
