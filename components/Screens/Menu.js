import React, { useContext, useState } from 'react';
import {
  View,
  TouchableHighlight,
  Text,
  ScrollView,
  Linking,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showAlert } from 'react-native-customisable-alert';
import { darkblue, green, red } from '../../styles/Colors';
import { Instagram_Icon, LinkedIn_Icon } from '../../content/Icons';
import { useTranslation } from 'react-i18next';
import CustomAlert from '../CustomAlert';
import { screenWidth } from '../../utilities/WidthAndHeight';
import layout_styles from '../../styles/Layout_Styles';
import { Emoji } from '../../content/Emoji';
import firestore from '@react-native-firebase/firestore';
import MainContext from '../../context/MainContext';
import auth from '@react-native-firebase/auth';
import retrieveEncryptedStorage from '../../utilities/GetEncryptedStorage';
import { useNavigation } from '@react-navigation/native';
import i18next from 'i18next';
import StoreValueLocally from '../../utilities/StoreValueLocally';
import Fonts from '../../content/Fonts';
import LayoutContainer from '../../utilities/LayoutContainer';
import OneSignalSetup from '../../utilities/OneSignalSetup';
import GetValueLocally from '../../utilities/GetValueLocally';
import crashlytics from '@react-native-firebase/crashlytics';
import InputText from '../Inputs/InputText';
import PrimaryButton_Outline from '../Buttons/PrimaryButton_Outline';
import Loading from '../../utilities/Loading';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import OneSignal from 'react-native-onesignal';

const Menu = () => {
  const { t } = useTranslation();
  const { mainState, setMainState, setToast, newAppStart } =
    useContext(MainContext);
  const navigation = useNavigation();
  const [showInput, setShowInput] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [password, setPassword] = useState('');
  const deleteAccount = async () => {
    try {
      setShowLoading(true);
      await firestore().collection('users').doc(mainState.userID).delete();
      const getFriends1 = await firestore()
        .collection('friends')
        .where('friend1', '==', mainState.userID)
        .get();
      getFriends1?.forEach(function (doc) {
        doc.ref.delete();
      });
      const getFriends2 = await firestore()
        .collection('friends')
        .where('friend2', '==', mainState.userID)
        .get();
      getFriends2?.forEach(function (doc) {
        doc.ref.delete();
      });
      const user = auth().currentUser;
      if (!!user) {
        // await auth().signOut();
        await user.delete();
      }
      const userID = await retrieveEncryptedStorage('@userID');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Map' }],
      });
      setTimeout(() => {
        setToast({
          color: green,
          text: t('deleteAccountMsg'),
        });
        setMainState({
          ...mainState,
          userID,
          user: null,
          complete: {
            ...mainState.complete,
            counterUsers: [
              ...mainState.complete.counterUsers,
              {
                action: 'deleteAccount',
                os_version: Platform.OS,
              },
            ],
          },
          collectPubsToPushToDB: [],
        });
        // OneSignalSetup(userID);
        OneSignal.removeExternalUserId();
      }, 500);
    } catch (err) {
      console.log('err :>> ', err);
      crashlytics().log(`Error on deleteAccount :>> ${err}`);
      showAlert({
        alertType: 'custom',
        customAlert: (
          <CustomAlert
            title={t('errorBasic')}
            sub={`Error: ${err}`}
            icon={<Emoji emoji="drunk" styles={layout_styles.l_icon} />}
          />
        ),
      });
    } finally {
      setShowLoading(false);
    }
  };
  const resetApp = async () => {
    if (true) {
      auth().signOut();
      await AsyncStorage.clear();
    } else {
      const lastActiveCity = await GetValueLocally('@activeCity');
      const userID = await retrieveEncryptedStorage('@userID');
      setMainState({
        ...mainState,
        userID,
        user: null,
        complete: {
          ...mainState.complete,
          counterUsers: [
            ...mainState.complete.counterUsers,
            {
              action: 'resetApp',
              os_version: Platform.OS,
            },
          ],
        },
      });
      // OneSignalSetup(userID);
      OneSignal.removeExternalUserId();
      auth().signOut();
      await AsyncStorage.clear();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Map' }],
      });
      setTimeout(() => {
        setToast({
          color: green,
          text: t('resetappMsg'),
        });
        if (!mainState.locationGranted) {
          newAppStart(lastActiveCity, true, false, true);
        } else {
          newAppStart(null, true, false, true);
        }
      }, 500);
    }
  };
  return (
    <LayoutContainer
      content={
        // <ScrollView scrollEnabled={true} showsVerticalScrollIndicator={false}>
        <KeyboardAwareScrollView
          enableOnAndroid={true}
          enableAutomaticScroll={Platform.OS === 'ios'}
          showsVerticalScrollIndicator={false}>
          <View style={layout_styles.social_media_container}>
            <TouchableHighlight
              onPress={() => {
                Linking.openURL('https://www.instagram.com/pubup_app/');
              }}>
              <Instagram_Icon />
            </TouchableHighlight>
            <TouchableHighlight
              onPress={() => {
                Linking.openURL('https://www.linkedin.com/company/pubup-gmbh');
              }}>
              <LinkedIn_Icon />
            </TouchableHighlight>
          </View>
          <TouchableHighlight
            style={layout_styles.container_1}
            onPress={() => {
              Linking.openURL('https://www.pub-up.de/policy-app');
            }}>
            <Text
              style={[layout_styles.font_styling_h3_Bold, { color: darkblue }]}>
              {t('privacy')}
            </Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={layout_styles.container_1}
            onPress={() => {
              Linking.openURL('https://www.pub-up.de');
            }}>
            <Text
              style={[layout_styles.font_styling_h3_Bold, { color: darkblue }]}>
              {t('homepage')}
            </Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={layout_styles.container_1}
            onPress={() => {
              Linking.openURL('https://www.pub-up.de/faq');
            }}>
            <Text
              style={[layout_styles.font_styling_h3_Bold, { color: darkblue }]}>
              {t('faqs')}
            </Text>
          </TouchableHighlight>
          {!!mainState.user && !showLoading && (
            <>
              <TouchableHighlight
                style={layout_styles.container_1}
                onPress={() => setShowInput(true)}>
                <Text
                  style={[
                    layout_styles.font_styling_h3_Bold,
                    { color: darkblue },
                  ]}>
                  {t('deleteAccount')}
                </Text>
              </TouchableHighlight>
              {showInput && (
                <>
                  <InputText
                    placeholder={t('justPassword')}
                    title={t('reEnterPassword')}
                    value={password}
                    password
                    onChange={(txt) => setPassword(txt)}
                  />
                  <View style={{ marginTop: 20 }} />
                  <PrimaryButton_Outline
                    text="OK!"
                    disabled={!password || password.length < 6}
                    buttonClicked={() => {
                      showAlert({
                        alertType: 'custom',
                        customAlert: (
                          <CustomAlert
                            title={t('sure')}
                            sub={t('undone')}
                            icon={
                              <Emoji
                                emoji="fire"
                                styles={layout_styles.l_icon}
                              />
                            }
                            click={async () => {
                              try {
                                await auth().signInWithEmailAndPassword(
                                  auth().currentUser.email,
                                  password,
                                );
                                deleteAccount();
                              } catch (err) {
                                console.log('err :>> ', err);
                                setToast({
                                  color: red,
                                  text: t('errorBasic'),
                                });
                              }
                            }}
                          />
                        ),
                      });
                    }}
                  />
                  <View style={{ marginTop: 40 }} />
                </>
              )}
            </>
          )}
          {showLoading && (
            <View
              style={{
                alignItems: 'center',
                marginBottom: layout_styles.container_1.marginBottom,
              }}>
              <Loading styles={layout_styles.extra_large_icon} downNum={1} />
            </View>
          )}
          <TouchableHighlight
            style={layout_styles.container_1}
            onPress={() =>
              showAlert({
                alertType: 'custom',
                customAlert: (
                  <CustomAlert
                    title={t('sure')}
                    sub={t('undone')}
                    icon={<Emoji emoji="fire" styles={layout_styles.l_icon} />}
                    click={resetApp}
                  />
                ),
              })
            }>
            <React.Fragment>
              <Text
                style={[layout_styles.font_styling_h3_Bold, { color: darkblue }]}>
                {t('resetapp')}
              </Text>
              <Text style={layout_styles.font_styling_h4_dark}>
                {t('resetdesc')}
              </Text>
            </React.Fragment>
          </TouchableHighlight>
          <View
            style={[
              layout_styles.social_media_container,
              { paddingHorizontal: screenWidth * 0.2 },
            ]}>
            <TouchableHighlight
              onPress={() => {
                i18next.changeLanguage('en');
                StoreValueLocally('@sprache', 'en');
              }}>
              <Text
                style={[
                  layout_styles.font_styling_h2,
                  i18next.language === 'de' ? { fontFamily: Fonts.Light } : {},
                ]}>
                ENG
              </Text>
            </TouchableHighlight>
            <Text style={[layout_styles.font_styling_h2]}>|</Text>
            <TouchableHighlight
              onPress={() => {
                i18next.changeLanguage('de');
                StoreValueLocally('@sprache', 'de');
              }}>
              <Text
                style={[
                  layout_styles.font_styling_h2,
                  i18next.language === 'en' ? { fontFamily: Fonts.Light } : {},
                ]}>
                DEU
              </Text>
            </TouchableHighlight>
          </View>
          {/* </ScrollView> */}
        </KeyboardAwareScrollView>
      }
      title={t('menuheadertitle')}
    />
  );
};

export default Menu;
