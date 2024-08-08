import React from 'react';
import {darkblue, lightblue, whiteColor} from '../styles/Colors';
import {Text, TouchableOpacity, View} from 'react-native';
import {closeAlert} from 'react-native-customisable-alert';
import {Cross_Icon} from '../content/Icons';
import layout_styles from '../styles/Layout_Styles';
import {useTranslation} from 'react-i18next';

const CustomAlert = ({
  title,
  sub,
  icon,
  click,
  clicks,
  buttonWordingNo,
  buttonWordingYes,
}) => {
  const setPadding = 20;
  const {t} = useTranslation();
  return (
    <View
      style={{
        width: '80%',
        backgroundColor: lightblue,
        borderRadius: 10,
        paddingTop: setPadding,
      }}>
      {(!!click || !!clicks) && (
        <TouchableOpacity
          onPress={() => closeAlert()}
          style={{
            position: 'absolute',
            left: 'auto',
            right: setPadding,
            top: setPadding,
            zIndex: 2,
          }}>
          <Cross_Icon styles={layout_styles.extra_s_icon} color={whiteColor} />
        </TouchableOpacity>
      )}
      {!icon && <View style={{marginTop: 50}} />}
      {!!icon && (
        <>
          <View style={{marginTop: 25}} />
          <View style={{alignItems: 'center'}}>{icon}</View>
          <View style={{marginTop: 20}} />
        </>
      )}
      <Text
        style={[
          layout_styles.font_styling_h1,
          {textAlign: 'center', paddingHorizontal: 20},
        ]}>
        {title}
      </Text>
      {!!sub && (
        <>
          <View style={{marginTop: 10}} />
          <Text
            style={[
              layout_styles.font_styling_h3,
              {textAlign: 'center', marginHorizontal: 30},
            ]}>
            {sub}
          </Text>
        </>
      )}
      <View style={{marginTop: 50}} />
      {!click && !clicks && (
        <>
          <TouchableOpacity
            style={{
              borderTopWidth: 1,
              borderTopColor: whiteColor,
              paddingTop: setPadding,
              paddingBottom: setPadding,
            }}
            onPress={() => closeAlert()}>
            <Text
              style={[layout_styles.font_styling_h2, {textAlign: 'center'}]}>
              {t('ok')}
            </Text>
          </TouchableOpacity>
        </>
      )}
      {!!click && (
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            style={{
              borderTopWidth: 1,
              borderTopColor: whiteColor,
              borderRightWidth: 1,
              borderRightColor: whiteColor,
              paddingTop: setPadding,
              paddingBottom: setPadding,
              width: '50%',
            }}
            onPress={() => closeAlert()}>
            <Text
              style={[layout_styles.font_styling_h2, {textAlign: 'center'}]}>
              {buttonWordingNo || t('no')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              borderTopWidth: 1,
              borderTopColor: whiteColor,
              paddingTop: setPadding,
              paddingBottom: setPadding,
              width: '50%',
            }}
            onPress={() => {
              click();
              closeAlert();
            }}>
            <Text
              style={[layout_styles.font_styling_h2, {textAlign: 'center'}]}>
              {buttonWordingYes || t('yes')}
            </Text>
          </TouchableOpacity>
        </View>
      )}
      {!!clicks && (
        <>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              style={[
                {
                  borderTopWidth: 1,
                  borderTopColor: whiteColor,
                  borderRightWidth: 1,
                  borderRightColor: whiteColor,
                  paddingTop: setPadding,
                  paddingBottom: setPadding,
                  width: '50%',
                },
                !!clicks[0].icon
                  ? {
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }
                  : {},
              ]}
              onPress={() => {
                if (!clicks[0].noClose) {
                  closeAlert();
                }
                clicks[0].click();
              }}>
              {!!clicks[0].icon && (
                <View style={{marginRight: 10}}>{clicks[0].icon}</View>
              )}
              <Text
                style={[
                  layout_styles.font_styling_h2,
                  !!clicks[0].icon ? {} : {textAlign: 'center'},
                ]}>
                {clicks[0].text}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                {
                  borderTopWidth: 1,
                  borderTopColor: whiteColor,
                  paddingTop: setPadding,
                  paddingBottom: setPadding,
                  width: '50%',
                },
                !!clicks[1].icon
                  ? {
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }
                  : {},
              ]}
              onPress={() => {
                if (!clicks[1].noClose) {
                  closeAlert();
                }
                clicks[1].click();
              }}>
              {!!clicks[1].icon && (
                <View style={{marginRight: 10}}>{clicks[1].icon}</View>
              )}
              <Text
                style={[
                  layout_styles.font_styling_h2,
                  !!clicks[1].icon ? {} : {textAlign: 'center'},
                ]}>
                {clicks[1].text}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

export default CustomAlert;
