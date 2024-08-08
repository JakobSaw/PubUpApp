import React, {useContext, useEffect, useState} from 'react';
import {Logo, PushNotification_Icon} from '../../content/Icons';
import {AppState, Platform, Text, View} from 'react-native';
import {screenHeight, screenWidth} from '../../utilities/WidthAndHeight';
import layout_styles from '../../styles/Layout_Styles';
import {useTranslation} from 'react-i18next';
import PrimaryButton_Outline from '../Buttons/PrimaryButton_Outline';
import MainContext from '../../context/MainContext';
import {yellow} from '../../styles/Colors';
import Loading from '../../utilities/Loading';
import OneSignal from 'react-native-onesignal';
import StoreValueLocally from '../../utilities/StoreValueLocally';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AskNotificationGranted = () => {
  const {t} = useTranslation();
  const {newAppStart, mainState} = useContext(MainContext);
  const [deactivate, setDeactivate] = useState(false);
  useEffect(() => {
    setDeactivate(false);
  }, []);
  return (
    <View style={[layout_styles.eol_single]}>
      <Logo />
      <View
        style={[
          {
            position: 'absolute',
            height: screenHeight,
            width: screenWidth,
            justifyContent: 'center',
          },
          layout_styles.just_modal_container_paddings_left_right,
        ]}>
        <View style={[{minHeight: 24 * 3 + 36, justifyContent: 'center'}]}>
          <PushNotification_Icon styles={layout_styles.m_icon} color={yellow} />
          <View style={{marginBottom: 20}} />
          <Text style={layout_styles.eol_intro}>{t('pushnotifications')}</Text>
          <View style={{marginBottom: 16}} />
          <Text style={[layout_styles.eoltext, {marginBottom: 30}]}>
            {t('notificationdesc')}
          </Text>
        </View>
        {!deactivate && (
          <PrimaryButton_Outline
            text={t('asknotificationpermission')}
            buttonClicked={async () => {
              if (Platform.OS === 'android') {
                StoreValueLocally('@DontTrackAppChange', 'True');
              }
              setDeactivate(true);
              try {
                OneSignal.promptForPushNotificationsWithUserResponse();
                setTimeout(async () => {
                  if (
                    AppState.currentState === 'active' &&
                    mainState.nav === 'AskNotifications'
                  ) {
                    await AsyncStorage.removeItem('@DontTrackAppChange');
                    newAppStart();
                  }
                }, 500);
              } catch (err) {
                console.log('err in requestPermission :>> ', err);
              }
            }}
            marginTopAuto={false}
          />
        )}
        {!!deactivate && (
          <View
            style={{
              width: '100%',
              alignItems: 'center',
            }}>
            <Loading styles={layout_styles.extra_large_icon} downNum={2} />
          </View>
        )}
      </View>
    </View>
  );
};

export default AskNotificationGranted;
