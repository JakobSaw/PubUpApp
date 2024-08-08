import React from 'react';
import {Text, View, TouchableHighlight} from 'react-native';
import layout_styles from '../../styles/Layout_Styles';
import {Unchecked, Checked} from '../../content/Icons';
import {whiteColor, yellow} from '../../styles/Colors';

const ListItemOptions = ({
  icon,
  title,
  sub,
  checked,
  optionClicked,
  styles,
}) => {
  const setMarginLeft = () => {
    if (icon) {
      return 15;
    } else {
      return 0;
    }
  };
  return (
    <TouchableHighlight onPress={optionClicked} style={styles}>
      <View style={layout_styles.checkboxcontainer}>
        {icon}
        <View
          style={{
            marginLeft: setMarginLeft(),
            width: '70%',
          }}>
          <Text
            style={[layout_styles.font_styling_h3_Bold, {color: whiteColor}]}>
            {title}
          </Text>
          {sub && <Text style={layout_styles.font_styling_h4}>{sub}</Text>}
        </View>
        {checked ? (
          <Checked styles={layout_styles.s_icon} />
        ) : (
          <Unchecked styles={layout_styles.s_icon} />
        )}
      </View>
    </TouchableHighlight>
  );
};

export default ListItemOptions;
