import {Platform, TouchableHighlight, View} from 'react-native';
import React, {useContext} from 'react';
import {JumpToLocation_Icon, World_Icon} from '../../content/Icons';
import layout_styles from '../../styles/Layout_Styles';
import MainContext from '../../context/MainContext';
import getUserLocation from '../../utilities/GetUserLocation';
import StoreValueLocally from '../../utilities/StoreValueLocally';
import {showAlert} from 'react-native-customisable-alert';
import CustomAlert from '../CustomAlert';
import {useTranslation} from 'react-i18next';
import GetLocationPermission from '../../utilities/GetLocationPermission';
import AsyncStorage from '@react-native-async-storage/async-storage';

const JumpToLocation = () => {
  const {mainState, setMainState, newAppStart} = useContext(MainContext);
  const {t} = useTranslation();
  const jumpToUser = async () => {
    const position = await getUserLocation();
    setMainState({
      ...mainState,
      regionToAnimate: {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      },
      userLocation: {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      },
      jumpToRegionOnNavigate: true,
    });
  };
  return (
    <TouchableHighlight
      style={[
        {position: 'absolute', margin: 'auto', top: 'auto', zIndex: 5},
        layout_styles.absolute_padding_left,
        layout_styles.absolute_padding_bottom_locationicon,
      ]}
      onPress={async () => {
        if (mainState.locationGranted) return jumpToUser();
        StoreValueLocally('@DontTrackAppChange', 'True');
        const responseLocationPermission = await GetLocationPermission();
        console.log(
          'responseLocationPermission :>> ',
          responseLocationPermission,
        );
        StoreValueLocally(
          '@locationPermissionAndroid',
          responseLocationPermission,
        );
        if (
          responseLocationPermission === 'granted' ||
          (Platform.OS === 'android' &&
            responseLocationPermission === 'blocked')
        ) {
          await AsyncStorage.removeItem('@DontTrackAppChange');
          newAppStart(undefined, undefined, true);
        } else {
          showAlert({
            alertType: 'custom',
            customAlert: (
              <CustomAlert
                title={t('locationGranted')}
                icon={<World_Icon styles={layout_styles.l_icon} />}
              />
            ),
          });
        }
      }}>
      <View>
        <JumpToLocation_Icon styles={layout_styles.m_icon} />
      </View>
    </TouchableHighlight>
  );
};
export default JumpToLocation;
