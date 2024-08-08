import React, { useContext, useState } from 'react';
import {
  Text,
  View,
  ImageBackground,
  Platform,
  TouchableHighlight
} from 'react-native';
import layout_styles from '../../styles/Layout_Styles';
import firestore from '@react-native-firebase/firestore';
import { useTranslation } from 'react-i18next';
import { red, yellow } from '../../styles/Colors';
import MainContext from '../../context/MainContext';
import InputText from '../Inputs/InputText';
import PrimaryButton_Outline from '../Buttons/PrimaryButton_Outline';
import { Logo_Icon } from '../../content/Icons';
import auth from '@react-native-firebase/auth';
import Fonts from '../../content/Fonts';
import { useNavigation } from '@react-navigation/native';
import GetEntireProfile from '../../utilities/GetEntireProfile';
import LayoutContainer from '../../utilities/LayoutContainer';
import OneSignalSetup from '../../utilities/OneSignalSetup';
import { screenHeight, screenWidth } from '../../utilities/WidthAndHeight';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import GetIMGSize from '../../utilities/GetIMGSize';

const Login = () => {
  const { t } = useTranslation();
  const { mainState, setToast, setMainState } = useContext(MainContext);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const [loginUser, setLoginUser] = useState({
    mail: '',
    password: '',
  });
  const validateEMail = (text) => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    return reg.test(text);
  };

  return (
    <LayoutContainer
      scrollableHeaderIMG
      content={
        <KeyboardAwareScrollView
          enableOnAndroid={true}
          enableAutomaticScroll={Platform.OS === 'ios'}
          showsVerticalScrollIndicator={false}>
          <ImageBackground
            source={{
              uri: 'https://pubup-images.s3.eu-central-1.amazonaws.com/bg-login.jpg',
            }}
            resizeMode="cover"
            style={{
              width: '100%',
              height: screenHeight * 0.3,
              marginBottom: 20,
            }}
          />
          <View
            style={{
              paddingLeft: layout_styles.content_container.paddingLeft,
              paddingRight: layout_styles.content_container.paddingRight,
            }}>
            <Logo_Icon
              styles={[layout_styles.extra_large_icon, { marginBottom: 20 }]}
              color={yellow}
            />
            <Text style={[layout_styles.font_styling_h1, { marginBottom: 20 }]}>
              {!!mainState.navAfterProfileCreateCode ? t('loginWithCode') : t('welcomeToPubUp')}
            </Text>
            {!mainState.navAfterProfileCreateCode && <Text
              style={[
                layout_styles.eol_intro,
                { marginBottom: 40, fontFamily: Fonts.Regular },
              ]}>
              {t('loginMsg')}
            </Text>}
            <InputText
              placeholder={t('mail')}
              value={loginUser.mail}
              onChange={(txt) =>
                setLoginUser({
                  ...loginUser,
                  mail: txt,
                })
              }
            />
            <InputText
              placeholder={t('password')}
              value={loginUser.password}
              marginTop={40}
              password
              onChange={(txt) =>
                setLoginUser({
                  ...loginUser,
                  password: txt,
                })
              }
            />
            <PrimaryButton_Outline
              text={t('login')}
              buttonClicked={() => {
                if (!validateEMail(loginUser.mail))
                  return setToast({
                    text: t('invalidMail'),
                    color: red,
                  });
                setLoading(true);
                auth()
                  .signInWithEmailAndPassword(
                    loginUser.mail,
                    loginUser.password,
                  )
                  .then(async (data) => {
                    let addToMainStateUser = {}
                    let addToMainStateComplete = {}
                    const safeAfterProfileCreateCode = mainState.navAfterProfileCreateCode
                    try {
                      const loginUserID = data.user.uid
                      const getUser = await GetEntireProfile(loginUserID);
                      OneSignalSetup(loginUserID);

                      if (!!mainState.navAfterProfileCreateCode) {
                        if (getUser?.codes?.some((c) => c.checkInID === mainState.navAfterProfileCreateCode.checkInID)) {
                          setToast({
                            color: red,
                            text: t('codeAlreadyUsed'),
                          });
                        } else {
                          await firestore()
                            .collection('users')
                            .doc(loginUserID)
                            .update({
                              codes: [...getUser?.codes, mainState.navAfterProfileCreateCode],
                            });
                          addToMainStateUser = {
                            codes: [...getUser?.codes, mainState.navAfterProfileCreateCode],
                          }
                          addToMainStateComplete = {
                            partnerInteractions: [
                              ...mainState.complete.partnerInteractions,
                              {
                                partner_id: mainState.navAfterProfileCreateCode.checkInID,
                                action: 'codeRedeemed',
                                item: true,
                              },
                            ],
                          }
                        }
                      }
                      if (!!mainState.navAfterProfileCreate) {
                        const safeAfterProfileCreate =
                          mainState.navAfterProfileCreate;
                        setMainState({
                          ...mainState,
                          userID: loginUserID,
                          user: {
                            ...getUser,
                            ...addToMainStateUser
                          },
                          navAfterProfileCreate: null,
                          navAfterProfileCreateCode: null,
                          complete: {
                            ...mainState.complete,
                            ...addToMainStateComplete,
                            counterUsers: [
                              ...mainState.complete.counterUsers,
                              {
                                action: 'Login',
                                os_version: Platform.OS,
                              },
                            ],
                          },
                        });
                        if (!!safeAfterProfileCreateCode) {
                          const { width, height } = await GetIMGSize(safeAfterProfileCreateCode.imgURL);
                          if ((height / width) * screenWidth > screenHeight * 0.4) {
                            navigation.reset({
                              index: 0,
                              routes: [{ name: 'Map' }, {
                                name: 'PartnerItem', params: {
                                  ...safeAfterProfileCreateCode,
                                  bannerHeight: screenHeight * 0.4,
                                }
                              }],
                            });
                          } else {
                            navigation.reset({
                              index: 0,
                              routes: [{ name: 'Map' }, {
                                name: 'PartnerItem', params: {
                                  ...safeAfterProfileCreateCode,
                                  bannerHeight: (height / width) * screenWidth,
                                }
                              }],
                            });
                          }
                        } else {
                          navigation.reset({
                            index: 0,
                            routes: [
                              { name: 'Map' },
                              {
                                name: safeAfterProfileCreate?.route,
                                params: safeAfterProfileCreate?.params || {},
                              },
                            ],
                          });
                        }
                      } else {
                        setMainState({
                          ...mainState,
                          userID: loginUserID,
                          user: {
                            ...getUser,
                            ...addToMainStateUser
                          },
                          navAfterProfileCreateCode: null,
                          complete: {
                            ...mainState.complete,
                            ...addToMainStateComplete,
                            counterUsers: [
                              ...mainState.complete.counterUsers,
                              {
                                action: 'Login',
                                os_version: Platform.OS,
                              },
                            ],
                          },
                        });
                        if (!!safeAfterProfileCreateCode) {
                          const { width, height } = await GetIMGSize(safeAfterProfileCreateCode.imgURL);
                          if ((height / width) * screenWidth > screenHeight * 0.4) {
                            navigation.reset({
                              index: 0,
                              routes: [{ name: 'Map' }, {
                                name: 'PartnerItem', params: {
                                  ...safeAfterProfileCreateCode,
                                  bannerHeight: screenHeight * 0.4,
                                }
                              }],
                            });
                          } else {
                            navigation.reset({
                              index: 0,
                              routes: [{ name: 'Map' }, {
                                name: 'PartnerItem', params: {
                                  ...safeAfterProfileCreateCode,
                                  bannerHeight: (height / width) * screenWidth,
                                }
                              }],
                            });
                          }
                        } else {
                          navigation.reset({
                            index: 0,
                            routes: [{ name: 'Map' }, { name: 'MyProfile' }],
                          });
                        }
                      }
                    } catch (err) {
                      console.log(
                        'err in firestore().collection(users).add :>>',
                        err,
                      );
                      setToast({
                        text: t('errorBasic'),
                        color: red,
                      });
                      setLoading(false);
                    }
                  })
                  .catch((error) => {
                    setToast({
                      text: t('errorBasic'),
                      color: red,
                    });
                    setLoading(false);
                  });
              }}
              marginTopAuto={false}
              setMarginTop={40}
              disabled={!loginUser.mail || !loginUser.password || loading}
            />
            <TouchableHighlight
              style={{ padding: 10, marginTop: 40 }}
              onPress={() => navigation.push('Register')}>
              <Text
                style={[
                  layout_styles.font_styling_h3,
                  {
                    textDecorationLine: 'underline',
                    textAlign: 'center',
                  },
                ]}>
                {t('registerHere')}
              </Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={{ padding: 10, marginTop: 20 }}
              onPress={() => navigation.push('Password')}>
              <Text
                style={[
                  layout_styles.font_styling_h3,
                  {
                    textDecorationLine: 'underline',
                    textAlign: 'center',
                  },
                ]}>
                {t('passwordForgotten')}
              </Text>
            </TouchableHighlight>
            <View style={{ marginTop: screenHeight * 0.1 }} />
          </View>
        </KeyboardAwareScrollView>
      }
    />
  );
};

export default Login;
