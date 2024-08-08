import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import Fonts from '../../content/Fonts';
import {whiteColor} from '../../styles/Colors';
import layout_styles from '../../styles/Layout_Styles';
import {normalizeFontSize} from '../../utilities/ResFontSize';
import {Eye_Icon} from '../../content/Icons';

const InputText = ({
  title,
  value,
  onChange,
  placeholder,
  marginTop,
  setMaxLength = 900,
  editable = true,
  password = false,
}) => {
  const styles = StyleSheet.create({
    angabe2: {
      fontFamily: Fonts.Bold,
      marginBottom: 5,
      fontSize: normalizeFontSize(14), // before 16
      // flexGrow: 1,
    },
    searchinputstyling: {
      borderColor: whiteColor,
      color: whiteColor,
      borderWidth: 1,
      fontFamily: Fonts.Bold,
      borderRadius: 5,
      paddingLeft: 15,
      paddingRight: 15,
    },
  });
  const [hidePassword, setHidePassword] = useState(!!password);
  return (
    <View>
      {!!title && typeof title !== 'object' && (
        <Text
          style={[
            styles.angabe2,
            {
              color: whiteColor,
              marginTop: marginTop || 0,
            },
          ]}>
          {title}
        </Text>
      )}
      <TextInput
        style={[
          styles.searchinputstyling,
          layout_styles.paddingTopBottomTextInputsiOS,
          !title
            ? {
                marginTop: marginTop || 0,
              }
            : {},
        ]}
        keyboardType={
          Platform.OS === 'android' && !hidePassword
            ? 'visible-password'
            : 'default'
        }
        onChangeText={(text) => onChange(text)}
        value={value}
        placeholder={placeholder}
        placeholderTextColor="rgba(255,255,255,0.7)"
        maxLength={setMaxLength}
        editable={editable}
        secureTextEntry={hidePassword}
      />
      {setMaxLength !== 900 && (
        <Text
          style={[
            layout_styles.normal_font,
            {
              textAlign: 'right',
              fontSize: normalizeFontSize(10) /* before 12 */,
              marginTop: 5,
            },
          ]}>
          {value?.length || 0} / {setMaxLength}
        </Text>
      )}
      {!!password && (
        <TouchableOpacity
          style={{
            paddingHorizontal: 10,
            position: 'absolute',
            top: 'auto',
            zIndex: 10,
            bottom: Platform.OS === 'android' ? 10 : 0,
            height:
              Platform.OS === 'android'
                ? 22
                : layout_styles.paddingTopBottomTextInputsiOS.paddingBottom +
                  layout_styles.paddingTopBottomTextInputsiOS.paddingTop +
                  22,
            left: 'auto',
            right: 10,
            justifyContent: 'center',
          }}
          onPress={() => setHidePassword(!hidePassword)}>
          <Eye_Icon styles={layout_styles.extra_s_icon} />
        </TouchableOpacity>
      )}
    </View>
  );
};
export default InputText;
