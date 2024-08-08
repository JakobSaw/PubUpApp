import React, {useContext, useEffect, useState} from 'react';
import {View, Text, AppState, Platform} from 'react-native';
import layout_styles from '../../styles/Layout_Styles';
import MainContext from '../../context/MainContext';
import PrimaryButton_Outline from '../Buttons/PrimaryButton_Outline';
import {Logo, World_Icon} from '../../content/Icons';
import {yellow} from '../../styles/Colors';
import Loading from '../../utilities/Loading';
import GetLocationPermission from '../../utilities/GetLocationPermission';
import {useTranslation} from 'react-i18next';
import StoreValueLocally from '../../utilities/StoreValueLocally';

const AskLocationGranted = () => {
  const {mainState, setMainState} = useContext(MainContext);
  const {t} = useTranslation();

  const [deactivate, setDeactivate] = useState(false);

  useEffect(() => {
    setDeactivate(false);
  }, []);

  return (
    <View style={[layout_styles.eol_single]}>
      <Logo />
      <View style={[{minHeight: 24 * 3 + 36, justifyContent: 'center'}]}>
        <World_Icon styles={layout_styles.m_icon} color={yellow} />
        <View style={{marginBottom: 20}} />
        <Text style={layout_styles.eol_intro}>{t('welcomeToPubUp')}</Text>
        <View style={{marginBottom: 16}} />
        <Text style={[layout_styles.eoltext, {marginBottom: 30}]}>
          {t('shareLocation')}
        </Text>
      </View>
      {!deactivate && (
        <PrimaryButton_Outline
          text={t('askLocation')}
          buttonClicked={async () => {
            if (Platform.OS === 'android') {
              StoreValueLocally('@DontTrackAppChange', 'True');
            }
            setDeactivate(true);
            const firstLocationPermissionAsk = await GetLocationPermission();
            console.log(
              'firstLocationPermissionAsk :>> ',
              firstLocationPermissionAsk,
            );
            StoreValueLocally(
              '@locationPermissionAndroid',
              firstLocationPermissionAsk,
            );
            setTimeout(() => {
              if (
                AppState.currentState === 'active' &&
                mainState.nav === 'AskLocation'
              ) {
                setMainState({
                  ...mainState,
                  nav: 'AskNotifications',
                });
              }
            }, 500);
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
          <Loading styles={layout_styles.extra_large_icon} downNum={0} />
        </View>
      )}
    </View>
  );
};

export default AskLocationGranted;
