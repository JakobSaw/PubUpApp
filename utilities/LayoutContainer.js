import React, { useState } from 'react';
import {
  Animated,
  ImageBackground,
  SafeAreaView,
  View,
  Image,
  Platform,
  TouchableHighlight,
} from 'react-native';
import { darkblue, whiteColor } from '../styles/Colors';
import { screenHeight, screenWidth } from './WidthAndHeight';
import ModalHeaderNew from '../components/ModalHeaderNew';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import layout_styles from '../styles/Layout_Styles';
import LinearGradient from 'react-native-linear-gradient';
import { SliderBox } from 'react-native-image-slider-box';

const LayoutContainer = ({
  content,
  title,
  titleIMG,
  overlay,
  partnerBanner,
  partnerItemBanner,
  partnerItemBannerHeight,
  bundleIMG,
  animateHeight,
  showBanner,
  pubin,
  scrollableHeaderIMG,
  noPaddingHorizontal,
  pubHeader,
  overlayPfeilePub,
  navBarPub,
}) => {
  const [headerHeight, setHeaderHeight] = useState(0);
  const insets = useSafeAreaInsets();
  const bannerHeight = screenHeight * 0.3;
  const setHeight = 0.35;
  const addToInsets = 0.02;

  const check =
    (!titleIMG &&
      !partnerBanner &&
      !partnerItemBanner &&
      !bundleIMG &&
      !pubin &&
      !scrollableHeaderIMG) ||
    (typeof showBanner === 'boolean' && !showBanner && !scrollableHeaderIMG);

  const subtractHeight = check
    ? insets.top + screenHeight * addToInsets ||
    layout_styles.just_modal_container_paddings_top.paddingTop
    : 0;

  const subtractOnAndroid =
    Platform.OS === 'android'
      ? 0
      : insets.bottom ||
      layout_styles.just_modal_container_paddings_bottom.paddingBottom;

  const googleIMGSize = 12.5;

  const setCompleteHeight =
    screenHeight - subtractHeight - subtractOnAndroid - headerHeight;

  return (
    <SafeAreaView
      style={{
        backgroundColor: darkblue,
        // minHeight: screenHeight,
        flex: 1,
      }}>
      <View
        style={[
          layout_styles.modal_container,
          check
            ? {
              paddingTop:
                insets.top + screenHeight * addToInsets ||
                layout_styles.just_modal_container_paddings_top.paddingTop,
            }
            : {},
        ]}>
        {!!pubHeader?.pubPhotos?.length && !!animateHeight && (
          <>
            <Animated.View
              style={[
                {
                  height: animateHeight,
                },
              ]}>
              {!!pubHeader?.pubPhotos?.length && (
                <View style={[{ backgroundColor: darkblue }]}>
                  <SliderBox
                    images={pubHeader?.pubPhotos}
                    sliderBoxHeight={screenHeight * 0.5}
                    dotColor={whiteColor}
                    inactiveDotColor="rgba(255,255,255,0.3)"
                  />
                  <View
                    style={{
                      position: 'absolute',
                      zIndex: 2,
                      bottom: 30,
                      left: 10,
                    }}>
                    <Image
                      source={require('../assets/google.png')}
                      style={{
                        height: googleIMGSize,
                        width: googleIMGSize * 7.171673819742489,
                      }}
                    />
                  </View>
                </View>
              )}
            </Animated.View>
          </>
        )}
        {!!partnerBanner && !!animateHeight && (
          <>
            <Animated.View
              style={[
                {
                  height: animateHeight,
                  width: screenWidth,
                  overflow: 'hidden',
                },
              ]}>
              <ImageBackground
                source={{
                  uri: partnerBanner,
                  cache: 'force-cache',
                }}
                resizeMode="cover"
                style={{
                  width: '100%',
                  height: '100%',
                }}
              />
              <LinearGradient
                colors={['rgba(23,30,52,1)', 'rgba(23,30,52,0)']}
                style={[
                  {
                    width: '100%',
                    height: bannerHeight * 0.25,
                    position: 'absolute',
                    top: bannerHeight * 0.75,
                  },
                ]}
                useAngle={true}
                angle={0}
              />
            </Animated.View>
          </>
        )}
        {!!partnerItemBanner && !!animateHeight && (
          <Animated.View
            style={[
              {
                height: animateHeight,
                overflow: 'hidden',
              },
            ]}>
            <Image
              source={{
                uri: partnerItemBanner,
                cache: 'force-cache',
              }}
              style={{
                width: screenWidth,
                height: partnerItemBannerHeight,
              }}
            />
          </Animated.View>
        )}
        {!!bundleIMG && !!animateHeight && (
          <Animated.View
            style={[
              {
                height: animateHeight,
                overflow: 'hidden',
              },
            ]}>
            <ImageBackground
              source={{
                uri: bundleIMG,
                cache: 'force-cache',
              }}
              resizeMode="cover"
              style={{ width: '100%', height: screenHeight * setHeight }}
            />
          </Animated.View>
        )}
        {(!!title || !!titleIMG) && (
          <View
            onLayout={(evt) => {
              const { height: layoutHeight } = evt.nativeEvent.layout;
              setHeaderHeight(layoutHeight);
            }}>
            <ModalHeaderNew title={title} imgURL={titleIMG} />
          </View>
        )}
        <View
          style={[
            !pubin
              ? layout_styles.content_container
              : { justifyContent: 'space-between' },
            // {backgroundColor: 'green'},
            !!scrollableHeaderIMG ? { paddingLeft: 0, paddingRight: 0 } : {},
            {
              height: setCompleteHeight,
            },
            !!noPaddingHorizontal ? { paddingLeft: 0, paddingRight: 0 } : {},
          ]}>
          <>{content}</>
        </View>
      </View>
      {!!overlay && <>{overlay}</>}
      {!!overlayPfeilePub && <>{overlayPfeilePub}</>}
      {!!navBarPub && <>{navBarPub}</>}
    </SafeAreaView>
  );
};

export default LayoutContainer;
