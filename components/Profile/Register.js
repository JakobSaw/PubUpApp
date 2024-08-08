import React, { useContext, useState } from 'react';
import {
  Text,
  View,
  ImageBackground,
  Platform,
  TouchableHighlight
} from 'react-native';
import layout_styles from '../../styles/Layout_Styles';
import { useTranslation } from 'react-i18next';
import { red, yellow } from '../../styles/Colors';
import MainContext from '../../context/MainContext';
import InputText from '../Inputs/InputText';
import PrimaryButton_Outline from '../Buttons/PrimaryButton_Outline';
import { Logo_Icon } from '../../content/Icons';
import auth from '@react-native-firebase/auth';
import Fonts from '../../content/Fonts';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import LayoutContainer from '../../utilities/LayoutContainer';
import GetIMGSize from '../../utilities/GetIMGSize';
import { screenHeight, screenWidth } from '../../utilities/WidthAndHeight';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import OneSignalSetup from '../../utilities/OneSignalSetup';

const Register = () => {
  const { t } = useTranslation();
  const { mainState, setToast, setMainState } = useContext(MainContext);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const [newUser, setNewUser] = useState({
    username: '',
    mail: '',
    password: '',
    city: mainState.activeCity || 'World',
    joined: Date.now(),
    bundles: [],
    favorites: [],
    pub_ins: [],
    pubs: [],
    profileIMG: t('defaultBanner'),
    buddies: [],
    codes: [],
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
              {!!mainState.navAfterProfileCreateCode ? t('registerWithCode') : t('welcomeToPubUp')}
            </Text>
            {!mainState.navAfterProfileCreateCode && <Text
              style={[
                layout_styles.eol_intro,
                { marginBottom: 40, fontFamily: Fonts.Regular },
              ]}>
              {t('registerMsg')}
            </Text>}
            <InputText
              placeholder={t('username')}
              setMaxLength={20}
              value={newUser.username}
              onChange={(txt) =>
                setNewUser({
                  ...newUser,
                  username: txt,
                })
              }
            />
            <InputText
              placeholder={t('mail')}
              value={newUser.mail}
              marginTop={20}
              onChange={(txt) =>
                setNewUser({
                  ...newUser,
                  mail: txt,
                })
              }
            />
            <InputText
              placeholder={t('password')}
              value={newUser.password}
              marginTop={40}
              password
              onChange={(txt) =>
                setNewUser({
                  ...newUser,
                  password: txt,
                })
              }
            />
            <PrimaryButton_Outline
              text={t('register')}
              buttonClicked={() => {
                if (!validateEMail(newUser.mail))
                  return setToast({
                    text: t('invalidMail'),
                    color: red,
                  });
                setLoading(true);
                auth()
                  .createUserWithEmailAndPassword(
                    newUser.mail,
                    newUser.password,
                  )
                  .then(async (created) => {
                    // Create new User in Firestore
                    const collectNewUser = {
                      ...newUser,
                    };
                    delete collectNewUser.password;
                    delete collectNewUser.mail;
                    if (!!mainState.navAfterProfileCreateCode) {
                      collectNewUser.codes = [mainState.navAfterProfileCreateCode]
                    }
                    const safeAfterProfileCreateCode = mainState.navAfterProfileCreateCode
                    try {
                      await firestore()
                        .collection('users')
                        .doc(created.user.uid)
                        .set(collectNewUser);
                      OneSignalSetup(created.user.uid);
                      if (!!mainState.navAfterProfileCreate) {
                        const safeAfterProfileCreate =
                          mainState.navAfterProfileCreate;
                        setMainState({
                          ...mainState,
                          userID: created.user.uid,
                          user: collectNewUser,
                          navAfterProfileCreate: null,
                          navAfterProfileCreateCode: null,
                          complete: {
                            ...mainState.complete,
                            counterUsers: [
                              ...mainState.complete.counterUsers,
                              {
                                action: 'AccountCreation',
                                os_version: Platform.OS,
                              },
                            ],
                            partnerInteractions: !!mainState.navAfterProfileCreateCode ? [
                              ...mainState.complete.partnerInteractions,
                              {
                                partner_id: collectNewUser.codes[0].checkInID,
                                action: 'codeRedeemed',
                                item: true,
                              },
                            ] : mainState.complete.partnerInteractions,
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
                          userID: created.user.uid,
                          user: collectNewUser,
                          navAfterProfileCreateCode: null,
                          complete: {
                            ...mainState.complete,
                            counterUsers: [
                              ...mainState.complete.counterUsers,
                              {
                                action: 'AccountCreation',
                                os_version: Platform.OS,
                              },
                            ],
                            partnerInteractions: !!mainState.navAfterProfileCreateCode ? [
                              ...mainState.complete.partnerInteractions,
                              {
                                partner_id: collectNewUser.codes[0].checkInID,
                                action: 'codeRedeemed',
                                item: true,
                              },
                            ] : mainState.complete.partnerInteractions,
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
                    }
                  })
                  .catch((error) => {
                    setLoading(false);
                    if (error.code === 'auth/email-already-in-use') {
                      console.log('That email address is already in use!');
                      setToast({
                        text: t('mailAlreadyUsed'),
                        color: red,
                      });
                    }
                    if (error.code === 'auth/invalid-email') {
                      console.log('That email address is invalid!');
                      setToast({
                        text: t('invalidMail'),
                        color: red,
                      });
                    }
                  });
              }}
              marginTopAuto={false}
              setMarginTop={40}
              disabled={
                !newUser.username ||
                !newUser.mail ||
                !newUser.password ||
                newUser.password.length < 6 ||
                loading
              }
            />
            <TouchableHighlight
              style={{ padding: 10, marginTop: 40 }}
              onPress={() => navigation.push('Login')}>
              <Text
                style={[
                  layout_styles.font_styling_h3,
                  {
                    textDecorationLine: 'underline',
                    textAlign: 'center',
                  },
                ]}>
                {t('loginHere')}
              </Text>
            </TouchableHighlight>
            <View style={{ marginTop: screenHeight * 0.1 }} />
          </View>
        </KeyboardAwareScrollView>
      }
    />
  );
};

export default Register;
