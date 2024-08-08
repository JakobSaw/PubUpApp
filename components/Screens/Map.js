// Components
import {
  View,
  StyleSheet,
  TouchableHighlight,
  Text,
  Platform,
} from 'react-native';
import { Logo } from '../../content/Icons';
import MapViewWrapper from '../MapViewWrapper';
import MenuButton from '../Buttons/MenuButton';
import Lupe from '../Buttons/Lupe';
import OpenForm from '../Buttons/OpenForm';
import JumpToLocation from '../Buttons/JumpToLocation';
import { darkblue, whiteColor } from '../../styles/Colors';
import { screenHeight, screenWidth } from '../../utilities/WidthAndHeight';
import React, { useCallback, useContext, useState } from 'react';
import MainContext from '../../context/MainContext';
import NavBar from '../NavBar';
import { normalizeFontSize } from '../../utilities/ResFontSize';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import GetValueLocally from '../../utilities/GetValueLocally';
import PrimaryButton from '../Buttons/PrimaryButton';
import { useTranslation } from 'react-i18next';
import ScanQRCode from '../Buttons/ScanQRCode';

const Map = ({ route }) => {
  const { mainState, newAppStart, testing, setMainState } =
    useContext(MainContext);
  const { params } = route;
  const navigation = useNavigation();
  const { t } = useTranslation()

  useFocusEffect(
    useCallback(() => {
      const checkWelcomeAfterDeepLink = async () => {
        const resOne = await GetValueLocally('@firstload_Update_14');
        const resTwo = await GetValueLocally('@skipOverlay');
        if (!resOne && !resTwo) {
          let state = {
            ...mainState,
            nav: 'Welcome',
          };
          delete state.showWelcomeOnMap;
          setMainState(state);
        }
      };
      if (mainState.showWelcomeOnMap) {
        checkWelcomeAfterDeepLink();
      }
    }, [mainState]),
  );

  return (
    <>
      <Logo />
      {params?.map === 'Map' && (
        <>
          <MenuButton />
          <ScanQRCode />
          <OpenForm />
          <Lupe />
        </>
      )}
      {(mainState.locationGranted || Platform.OS === 'android') && (
        <JumpToLocation />
      )}
      {/* {__DEV__ && ( */}
      {false && (
        <>
          <TouchableHighlight
            style={{
              position: 'absolute',
              marginTop: screenHeight * 0.5,
              zIndex: 1000,
            }}
            onPress={() => {
              console.log('');
              console.log('');
              console.log('');
              Object.keys(mainState).forEach((current) => {
                if (
                  current !== 'kneipen' &&
                  current !== 'english' &&
                  current !== 'clusterFilters' &&
                  current !== 'cities' &&
                  current !== 'nav' &&
                  current !== 'mainCities' &&
                  current !== 'partners' &&
                  current !== 'allPublicPubBundles' &&
                  current !== 'publicPubBundles'
                ) {
                  console.log(current, ':>>', mainState[current]);
                }
              });
              console.log('');
              console.log('');
              console.log('');
            }}>
            <Text
              style={{
                color: 'pink',
                fontSize: normalizeFontSize(18), // before 20
                maxWidth: screenWidth * 0.2,
                transform: [{ translateY: 50 }]
              }}>
              {mainState.kneipen.length}
            </Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={{
              position: 'absolute',
              marginTop: screenHeight * 0.3,
              zIndex: 1000,
            }}
            onPress={async () => {
              /* try {
                throw 'Testing Crashlytics';
              } catch (err) {
                console.log('err :>> ', err);
                crashlytics().log(`Error :>> ${err}`);
              } */
              // CountInteraction(true);
              // newAppStart();
              testing();
              // setTimeout(() => {
              //   navigation.push('QRCode');
              // }, 500);
            }}>
            <Text
              style={{
                color: 'pink',
                fontSize: normalizeFontSize(18), // before 20
                maxWidth: screenWidth * 0.2,
              }}>
              START
            </Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={{
              position: 'absolute',
              marginTop: screenHeight * 0.45,
              zIndex: 1000,
            }}
            onPress={async () => {
              /* try {
                throw 'Testing Crashlytics';
              } catch (err) {
                console.log('err :>> ', err);
                crashlytics().log(`Error :>> ${err}`);
              } */
              // CountInteraction(true);
              // newAppStart();
              testing(true);
              // setTimeout(() => {
              //   navigation.push('QRCode');
              // }, 500);
            }}>
            <Text
              style={{
                color: 'pink',
                fontSize: normalizeFontSize(18), // before 20
                maxWidth: screenWidth * 0.2,
              }}>
              STARTL
            </Text>
          </TouchableHighlight>
        </>
      )}
      <View
        style={{
          backgroundColor: darkblue,
          ...StyleSheet.absoluteFill,
          position: 'absolute',
          zIndex: -1,
        }}
      />
      <MapViewWrapper route={route} />
      {params?.map === 'Map' && !!mainState.kneipen?.length && false && (
        <View style={{ position: 'absolute', zIndex: 10, top: 'auto', bottom: screenHeight * 0.05, alignItems: 'center', width: screenWidth }}>
          <PrimaryButton buttonClicked={() => {
            setTimeout(() => {
              testing();
            }, 3000)
          }} text={t('noPinsShown')} smallerFont />
        </View>
      )}
      {params?.map === 'Map' && !!mainState.kneipen?.length && (
        <NavBar />
      )}
    </>
  );
};

export default Map;
