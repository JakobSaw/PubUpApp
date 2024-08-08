import React, { Fragment, useState, useContext, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import MainContext from '../../context/MainContext';
import PrimaryButton_Outline from '../Buttons/PrimaryButton_Outline';
import layout_styles from '../../styles/Layout_Styles';
import { screenHeight, screenWidth } from '../../utilities/WidthAndHeight';
import OverlayCityButtons from './OverlayCityButtons';
import { Overlay_Up_Icon } from '../../content/Icons';
import OpenFormInOverlay from '../Buttons/OpenFormInOverlay';
import LupeInOverlay from '../Buttons/LupeInOverlay';
import NavBarInOverlay from './NavBarInOverlay';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ScanQRCodeInOverlay from '../Buttons/ScanQRCodeInOverlay';

const Overlay = () => {
  const [overlayState, setOverlayState] = useState({
    counter: 0,
  });
  const [hideCityButtons, setHideCityButtons] = useState(false);
  const inlineStyles = StyleSheet.create({
    pfeile: {
      width: 70 + 20,
      height: (70 + 20) * 1.778911641588415,
    },
    container: {
      ...StyleSheet.absoluteFill,
      // backgroundColor: 'yellow',
    },
  });
  const { mainState, newAppStart } = useContext(MainContext);
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const buttonClicked = async () => {
    if (overlayState.counter === 5 && mainState.activeCity != null) {
      setOverlayState({
        ...overlayState,
        counter: null,
      });
      newAppStart('finishOnboardingWithLocationGranted');
    } else {
      setOverlayState({
        ...overlayState,
        counter: overlayState.counter + 1,
      });
    }
  };
  useEffect(() => {
    if (mainState.skipOverlay && mainState.locationGranted) {
      setOverlayState({
        ...overlayState,
        counter: null,
      });
      newAppStart('finishOnboardingWithLocationGranted');
    } else if (mainState.skipOverlay) {
      setOverlayState({
        ...overlayState,
        counter: 6,
      });
    }
  }, [mainState.skipOverlay]);
  if (overlayState.counter == null) return <Fragment />;
  return (
    <>
      <View
        style={[
          layout_styles.modal_container,
          {
            backgroundColor: !hideCityButtons
              ? 'rgba(23,30,52,0.9)'
              : 'rgba(23,30,52,0)',
            zIndex: 50,
          },
        ]}>
        {/* Texts */}
        {overlayState.counter < 6 && (
          <View
            style={[
              { marginTop: 'auto', marginBottom: 'auto' },
              layout_styles.just_modal_container_paddings_left_right,
            ]}>
            <Text style={layout_styles.eol_intro}>{t('pubUpWorks')}</Text>
            <View style={[{ minHeight: 24 * 5 + 36, justifyContent: 'center' }]}>
              {overlayState.counter === 0 && (
                <Text style={[layout_styles.eoltext, { marginBottom: 30 }]}>
                  {t('overlay1')}
                </Text>
              )}
              {overlayState.counter === 1 && (
                <Text style={[layout_styles.eoltext, { marginBottom: 30 }]}>
                  {t('overlay2')}
                </Text>
              )}
              {overlayState.counter === 2 && (
                <Text style={[layout_styles.eoltext, { marginBottom: 30 }]}>
                  {t('overlay3')}
                </Text>
              )}
              {overlayState.counter === 3 && (
                <Text style={[layout_styles.eoltext, { marginBottom: 30 }]}>
                  {t('overlay6')}
                </Text>
              )}
              {overlayState.counter === 4 && (
                <Text style={[layout_styles.eoltext, { marginBottom: 30 }]}>
                  {t('overlay4')}
                </Text>
              )}
              {overlayState.counter === 5 && (
                <Text style={[layout_styles.eoltext, { marginBottom: 30 }]}>
                  {t('overlay5')}
                </Text>
              )}
            </View>
            {/* OK Button */}
            <PrimaryButton_Outline text="OK!" buttonClicked={buttonClicked} />
          </View>
        )}
        {/* Choose From City */}
        {overlayState.counter === 6 && !hideCityButtons && (
          <Fragment>
            <View
              style={[
                { marginTop: 'auto', marginBottom: 'auto' },
                layout_styles.just_modal_container_paddings_left_right,
              ]}>
              <Text style={layout_styles.eol_intro}>{t('overlay7')}</Text>
              <View style={{ height: screenHeight * 0.35 }}>
                <OverlayCityButtons
                  buttonClicked={(city) => {
                    console.log(
                      'finishOnboardingWithCityWithoutLocationGranted',
                    );
                    setHideCityButtons(true);
                    newAppStart(city);
                  }}
                />
              </View>
            </View>
          </Fragment>
        )}
        {(overlayState.counter === 3 || overlayState.counter === 4 || overlayState.counter === 5) && (
          <View
            style={[
              {
                position: 'absolute',
                margin: 'auto',
                left: screenWidth - 92.5,
                zIndex: 51,
              },
              overlayState.counter === 3
                ? {
                  top:
                    layout_styles.absolute_padding_top_lupe_overlaypfeil.top +
                    insets.top,
                }
                : overlayState.counter === 4
                  ? {
                    top:
                      layout_styles.absolute_padding_top_lupe_2_overlaypfeil
                        .top + insets.top,
                  } : {
                    top:
                      layout_styles.absolute_padding_top_lupe_3_overlaypfeil
                        .top + insets.top,
                  }
            ]}>
            <Overlay_Up_Icon styles={inlineStyles.pfeile} />
          </View>
        )}
        {overlayState.counter === 3 && <ScanQRCodeInOverlay />}
        {overlayState.counter === 4 && <OpenFormInOverlay />}
        {overlayState.counter === 5 && <LupeInOverlay />}
        {overlayState.counter !== 6 && (
          <View
            style={{
              position: 'absolute',
              margin: 'auto',
              bottom: 0,
              top: 'auto',
              width: '100%',
              zIndex: 100,
            }}>
            <NavBarInOverlay overlay={`${overlayState.counter}`} />
          </View>
        )}
      </View>
    </>
  );
};

export default Overlay;
