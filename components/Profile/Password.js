import React, {useContext, useState} from 'react';
import {Text, View, ScrollView, TouchableHighlight} from 'react-native';
import layout_styles from '../../styles/Layout_Styles';
import {useTranslation} from 'react-i18next';
import {red} from '../../styles/Colors';
import MainContext from '../../context/MainContext';
import InputText from '../Inputs/InputText';
import PrimaryButton_Outline from '../Buttons/PrimaryButton_Outline';
import auth from '@react-native-firebase/auth';
import Fonts from '../../content/Fonts';
import {useNavigation} from '@react-navigation/native';
import LayoutContainer from '../../utilities/LayoutContainer';
import {screenWidth} from '../../utilities/WidthAndHeight';

const Password = () => {
  const {t} = useTranslation();
  const {setToast} = useContext(MainContext);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const [resetPasswort, setResetPasswort] = useState({
    mail: '',
    mailSent: false,
  });
  const validateEMail = (text) => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    return reg.test(text);
  };
  return (
    <LayoutContainer
      content={
        <ScrollView showsVerticalScrollIndicator={false}>
          <View
            style={[
              // layout_styles.content_container,
              {justifyContent: 'flex-start', paddingTop: screenWidth * 0.1},
            ]}>
            {!resetPasswort.mailSent && (
              <>
                <Text style={[layout_styles.font_styling_h1]}>
                  {t('resetPassword')}
                </Text>
                <Text
                  style={[
                    layout_styles.eol_intro,
                    {marginBottom: 40, fontFamily: Fonts.Regular},
                  ]}>
                  {t('resetPasswordDesc')}
                </Text>
                <InputText
                  placeholder={t('mail')}
                  value={resetPasswort.mail}
                  onChange={(txt) =>
                    setResetPasswort({
                      ...resetPasswort,
                      mail: txt,
                    })
                  }
                />
                <PrimaryButton_Outline
                  text={t('resetPassword')}
                  buttonClicked={() => {
                    if (!validateEMail(resetPasswort.mail))
                      return setToast({
                        text: t('invalidMail'),
                        color: red,
                      });
                    setLoading(true);
                    auth()
                      .sendPasswordResetEmail(resetPasswort.mail)
                      .then(() =>
                        setResetPasswort({
                          ...resetPasswort,
                          mailSent: true,
                        }),
                      )
                      .catch(() =>
                        setToast({
                          text: t('errorBasic'),
                          color: red,
                        }),
                      )
                      .finally(() => setLoading(false));
                  }}
                  marginTopAuto={false}
                  setMarginTop={40}
                  disabled={!resetPasswort.mail || loading}
                />
              </>
            )}
            {resetPasswort.mailSent && (
              <>
                <Text
                  style={[
                    layout_styles.font_styling_h2,
                    {textAlign: 'center'},
                  ]}>
                  {t('mailSent')}
                </Text>
                <TouchableHighlight
                  style={{padding: 10, marginTop: 40}}
                  onPress={() => navigation.push('Login')}>
                  <Text
                    style={[
                      layout_styles.font_styling_h3,
                      {
                        textDecorationLine: 'underline',
                        textAlign: 'center',
                      },
                    ]}>
                    {t('backToLogin')}
                  </Text>
                </TouchableHighlight>
              </>
            )}
          </View>
        </ScrollView>
      }
    />
  );
};

export default Password;
