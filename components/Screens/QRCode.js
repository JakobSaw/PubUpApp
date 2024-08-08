import React, { useContext, useEffect, useRef } from 'react';
import { TouchableHighlight, View, StyleSheet, Text, Image } from 'react-native';
import { RNCamera } from 'react-native-camera';
import MainContext from '../../context/MainContext';
import { useTranslation } from 'react-i18next';
import { darkblue, lightblue, red, whiteColor } from '../../styles/Colors';
import { screenHeight, screenWidth } from '../../utilities/WidthAndHeight';
import layout_styles from '../../styles/Layout_Styles';
import { Cross_Icon } from '../../content/Icons';
import { useNavigation } from '@react-navigation/native';
import MakeRequest from '../../utilities/MakeRequest';
import BaseUrl from '../../content/BaseUrl';
import { ACCESS_ALLPUBS } from '@env';
import firestore from '@react-native-firebase/firestore';
import ClearItemFromAsyncStorage from '../../utilities/ClearItemFromAsyncStorage';

const QRCode = () => {
  const { t } = useTranslation();
  const { setToast, mainState, setMainState, noUserButCode } = useContext(MainContext);
  const addToCircle = 20;
  const navigation = useNavigation();
  const usedLink = useRef();
  const handleBarCodeRead = async (e) => {
    const url = e.data;
    if (!!usedLink.current) return;
    usedLink.current = true;
    try {
      if (!!e.data) {
        const partnerID = url.substring(
          url.indexOf('partner/') + 8,
          url.indexOf('?checkin='),
        );
        const checkInID = url.substring(
          url.indexOf('?checkin=') + 9,
          url.length,
        );
        const code = await MakeRequest(
          'POST',
          `${BaseUrl}/complete/code`,
          ACCESS_ALLPUBS,
          {
            partnerID,
            checkInID,
          },
        );
        if (!code || code === 'NoMoreCodes') {
          throw '!code || code === NoMoreCodes';
        }

        if (code.once) {
          await MakeRequest(
            'POST',
            `${BaseUrl}/complete/code/delete`,
            ACCESS_ALLPUBS,
            {
              code: code.code,
            },
          );
        }

        const newCodeForProfile = {
          ...code,
          checkInID,
          deactivated: false,
        };

        // Register and Save Code in newly created Profile
        if (!mainState.user) return noUserButCode(newCodeForProfile)

        if (mainState.user?.codes?.some((c) => c.checkInID === checkInID)) {
          navigation.goBack();
          return setToast({
            color: red,
            text: t('codeAlreadyUsed'),
          });
        }

        await firestore()
          .collection('users')
          .doc(mainState.userID)
          .update({
            codes: [...mainState.user?.codes, newCodeForProfile],
          });
        setMainState({
          ...mainState,
          user: {
            ...mainState.user,
            codes: [...mainState.user?.codes, newCodeForProfile],
          },
          complete: {
            ...mainState.complete,
            partnerInteractions: [
              ...mainState.complete.partnerInteractions,
              {
                partner_id: checkInID,
                action: 'codeRedeemed',
                item: true,
              },
            ],
          },
        });
        Image.getSize(code.imgURL, (width, height) => {
          if ((height / width) * screenWidth > screenHeight * 0.4) {
            navigation.replace('PartnerItem', {
              ...newCodeForProfile,
              code: code.code,
              bannerHeight: screenHeight * 0.4,
            });
          } else {
            navigation.replace('PartnerItem', {
              ...newCodeForProfile,
              code: code.code,
              bannerHeight: (height / width) * screenWidth,
            });
          }
        });

      } else {
        throw '!e.data';
      }
    } catch (err) {
      console.log('err :>> ', err);
      navigation.goBack();
      setToast({
        color: red,
        text: t('errorBasic'),
      });
    } finally {
      setTimeout(() => {
        usedLink.current = false;
      }, 5000);
    }
  };
  useEffect(() => {
    return () => ClearItemFromAsyncStorage('@DontTrackAppChange')
  }, [])
  return (
    <View
      style={{
        // flex: 1,
        backgroundColor: darkblue,
        ...StyleSheet.absoluteFill,
      }}>
      <TouchableHighlight
        style={{
          width: layout_styles.m_icon.width + addToCircle,
          height: layout_styles.m_icon.width + addToCircle,
          padding: addToCircle,
          backgroundColor: darkblue,
          borderRadius: 300,
          position: 'absolute',
          top: screenHeight * 0.15,
          left: 'auto',
          right: layout_styles.content_container.paddingRight,
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
        }}
        onPress={() => {
          if (navigation.canGoBack()) return navigation.goBack();
          navigation.push('Map');
        }}>
        <Cross_Icon color={whiteColor} styles={layout_styles.s_icon} />
      </TouchableHighlight>
      <TouchableHighlight
        style={{
          position: 'absolute',
          top: 'auto',
          bottom: screenHeight * 0.05,
          backgroundColor: lightblue,
          zIndex: 10,
          width: '80%',
          left: '10%',
          borderRadius: 10,
          paddingHorizontal: 10,
          paddingVertical: 20,
        }}
        disabled={!__DEV__}
        onPress={() =>
          handleBarCodeRead({
            data: 'https://pub-up.de/partner/mampe?checkin=2874ghr7wfbw4g48g8fgff',
          })
        }>
        <Text style={[layout_styles.font_styling_h3, { textAlign: 'center' }]}>
          {t('pleaseScanQRCode')}
        </Text>
      </TouchableHighlight>
      <RNCamera
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}
        type={RNCamera.Constants.Type.back}
        flashMode={RNCamera.Constants.FlashMode.off}
        onBarCodeRead={handleBarCodeRead}
        // onGoogleVisionBarcodesDetected={handleBarCodeRead}
        captureAudio={false}
        androidCameraPermissionOptions={{
          title: t('cameraPermissionTitle'),
          message: t('cameraPermissionMSG'),
          buttonPositive: t('cameraPermissionBTNNeutral'),
          buttonNegative: t('cameraPermissionBTNCancel'),
          buttonNeutral: t('cameraPermissionBTNOK'),
        }}
      />
    </View>
  );
};

export default QRCode;
