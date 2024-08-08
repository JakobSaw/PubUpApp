import React, { useContext } from 'react';
import {
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Image,
  Share,
  Platform,
} from 'react-native';
import { darkblue, lightblue, whiteColor, yellow } from '../../styles/Colors';
import layout_styles from '../../styles/Layout_Styles';
import {
  Circle_95_Icon,
  ElementLink_Icon,
  Share_Icon,
} from '../../content/Icons';
import { screenHeight, screenWidth } from '../../utilities/WidthAndHeight';
import LinearGradient from 'react-native-linear-gradient';
import MainContext from '../../context/MainContext';
import i18next from 'i18next';
import { useNavigation } from '@react-navigation/native';
import CountInteraction from '../../utilities/CountInteraction';
import { useTranslation } from 'react-i18next';
import MaskedView from '@react-native-masked-view/masked-view';
import Fonts from '../../content/Fonts';
import { normalizeFontSize } from '../../utilities/ResFontSize';
import StoreValueLocally from '../../utilities/StoreValueLocally';
import decodedAndroidSharingURL from '../../utilities/decodedAndroidSharingURL';

const PartnerItemCard = ({ current, width, setImgHeight, openQRCode }) => {
  const {
    name,
    imgURL,
    link,
    description,
    cardIcons,
    hideOptions,
    noClick,
    _id,
    partnerID,
    type,
    rewardDescriptionShort,
    rewardDescriptionLong,
  } = current;
  const { mainState, setMainState } = useContext(MainContext);
  const navigation = useNavigation();
  const imgHeight = setImgHeight
    ? screenHeight * setImgHeight
    : screenHeight * 0.12;
  const cardWidth = width || screenWidth * 0.6;
  const borderC = whiteColor;
  const borderR = 5;
  const { t } = useTranslation();
  const setGermanArticle = () => {
    if (type === 'drink' || type === 'checkin') return 'diesen';
    if (type === 'bookable' || type === 'veranstaltung') return 'diese';
    return '';
  };
  const setType = () => {
    if (type === 'drink') return 'Drink';
    if (type === 'checkin') return t('checkin');
    if (type === 'bookable') return t('bookable');
    if (type === 'veranstaltung') return t('veranstaltung');
    return '';
  };
  const size = screenWidth * 0.25;
  const font = 15;
  const descShort = rewardDescriptionShort?.[i18next.language]
    ?.split('|')
    .join('\n');

  const openOnNoClick = () => {
    if (cardIcons.indexOf('link') > -1) {
      setMainState({
        ...mainState,
        showLink: link,
        complete: {
          ...mainState.complete,
          partnerInteractions: [
            ...mainState.complete.partnerInteractions,
            {
              partner_id: partnerID,
              action: `linkClicked: ${_id}`,
              item: true,
            },
          ],
        },
      });
      CountInteraction();
    }
  };

  const itemClick = () => {
    if (!!openQRCode) return navigation.push('QRCode');
    if (!noClick) {
      setMainState({
        ...mainState,
        complete: {
          ...mainState.complete,
          partnerInteractions: [
            ...mainState.complete.partnerInteractions,
            {
              partner_id: _id,
              action: 'clickOnIt',
              item: true,
            },
          ],
        },
      });
      CountInteraction();
      Image.getSize(imgURL, (width, height) => {
        if ((height / width) * screenWidth > screenHeight * 0.4) {
          navigation.push('PartnerItem', {
            ...current,
            bannerHeight: screenHeight * 0.4,
          });
        } else {
          navigation.push('PartnerItem', {
            ...current,
            bannerHeight: (height / width) * screenWidth,
          });
        }
      });
    } else {
      openOnNoClick();
    }
  };

  return (
    <>
      <TouchableOpacity
        style={[
          {
            borderColor: borderC,
            borderRadius: borderR,
            borderWidth: 1,
            overflow: 'hidden',
            maxWidth: cardWidth,
            width: cardWidth,
          },
          hideOptions ? { flex: 1, minHeight: imgHeight * 2 } : {},
        ]}
        onPress={itemClick}>
        <>
          <View
            style={{
              paddingVertical: 10,
              paddingHorizontal: 15,
              backgroundColor: darkblue,
              position: 'relative',
              height: hideOptions ? '100%' : imgHeight,
              borderRadius: borderR,
              overflow: 'hidden',
            }}>
            <Text
              numberOfLines={1}
              style={[
                layout_styles.font_styling_h2,
                { zIndex: 3, marginTop: 'auto' },
              ]}>
              {name[i18next.language]}
            </Text>
            {!!imgURL && (
              <>
                <LinearGradient
                  colors={
                    hideOptions
                      ? [
                        'rgba(23,30,52,1)',
                        'rgba(23,30,52,0.2)',
                        'rgba(23,30,52,0)',
                      ]
                      : ['rgba(23,30,52,1)', 'rgba(23,30,52,0)']
                  }
                  style={[
                    {
                      width: cardWidth,
                      position: 'absolute',
                      zIndex: 2,
                    },
                    hideOptions
                      ? { ...StyleSheet.absoluteFill }
                      : { height: imgHeight },
                  ]}
                  useAngle={true}
                  angle={0}
                />
                <ImageBackground
                  source={{
                    uri:
                      imgURL || 'https://i.ibb.co/6RqCCJJ/Banner-Default-1.jpg',
                    // cache: 'force-cache',
                  }}
                  resizeMode="cover"
                  style={[
                    {
                      width: cardWidth,
                      position: 'absolute',
                      // backgroundColor: whiteColor,
                    },
                    hideOptions
                      ? { ...StyleSheet.absoluteFill }
                      : { height: imgHeight },
                  ]}
                />
              </>
            )}
          </View>
          {!hideOptions && (
            <View
              style={{
                borderTopColor: borderC,
                borderTopWidth: 1,
                paddingVertical: 10,
                paddingHorizontal: 15,
                flexDirection: 'row',
                zIndex: 3,
                backgroundColor: lightblue,
                overflow: 'hidden',
              }}>
              <View style={{ maxWidth: '80%' }}>
                {!!description && !rewardDescriptionLong && (
                  <Text
                    numberOfLines={2}
                    style={[layout_styles.font_styling_h3]}>
                    {description[i18next.language]}
                  </Text>
                )}
                {!!rewardDescriptionLong && (
                  <>
                    {rewardDescriptionLong[i18next.language]?.indexOf('<c>') >
                      -1 ? (
                      <>
                        <Text
                          numberOfLines={2}
                          style={[layout_styles.font_styling_h3]}>
                          {rewardDescriptionLong[i18next.language]?.substring(
                            0,
                            rewardDescriptionLong[i18next.language]?.indexOf(
                              '<c>',
                            ),
                          )}
                        </Text>
                        <Text
                          numberOfLines={1}
                          style={[layout_styles.font_styling_h3_Bold]}>
                          {rewardDescriptionLong[i18next.language]?.substring(
                            rewardDescriptionLong[i18next.language]?.indexOf(
                              '<c>',
                            ) + 3,
                            rewardDescriptionLong[i18next.language]?.length,
                          )}
                        </Text>
                      </>
                    ) : (
                      <Text
                        numberOfLines={2}
                        style={[layout_styles.font_styling_h3]}>
                        {rewardDescriptionLong[i18next.language]}
                      </Text>
                    )}
                  </>
                )}
              </View>
              <View
                style={{ marginLeft: 'auto', padding: 10, flexDirection: 'row' }}>
                {cardIcons?.indexOf('share') > -1 && (
                  <>
                    <TouchableOpacity
                      style={{ padding: 5 }}
                      onPress={() => {
                        if (Platform.OS === 'android') {
                          StoreValueLocally('@DontTrackAppChange', 'True');
                        }
                        setTimeout(() => {
                          Share.share({
                            title: t('sharePartnerItem', {
                              article:
                                i18next.language === 'de'
                                  ? setGermanArticle()
                                  : null,
                              type: setType(),
                            }),
                            message:
                              Platform.OS === 'android'
                                ? decodedAndroidSharingURL(
                                  t('sharePartnerItemMsg', {
                                    article:
                                      i18next.language === 'de'
                                        ? setGermanArticle()
                                        : null,
                                    type: setType(),
                                    url: `https://www.pub-up.de/partner/item/${_id}`,
                                  }),
                                )
                                : t('sharePartnerItemMsgWithOutURL', {
                                  article:
                                    i18next.language === 'de'
                                      ? setGermanArticle()
                                      : null,
                                  type: setType(),
                                }),
                            url: `https://www.pub-up.de/partner/item/${_id}`,
                          });
                          setMainState({
                            ...mainState,
                            complete: {
                              ...mainState.complete,
                              partnerInteractions: [
                                ...mainState.complete.partnerInteractions,
                                {
                                  partner_id: partnerID,
                                  action: `share item: ${_id}`,
                                  item: true,
                                },
                              ],
                            },
                          });
                          CountInteraction();
                        }, 500);
                      }}>
                      <Share_Icon
                        styles={layout_styles.extra_s_icon}
                        color={yellow}
                      />
                    </TouchableOpacity>
                    {/* <View style={{width: 10}} /> */}
                  </>
                )}
                {cardIcons?.indexOf('link') > -1 && false && (
                  <>
                    <TouchableOpacity
                      style={{ padding: 5 }}
                      onPress={() => {
                        setMainState({
                          ...mainState,
                          showLink: link,
                          complete: {
                            ...mainState.complete,
                            partnerInteractions: [
                              ...mainState.complete.partnerInteractions,
                              {
                                partner_id: partnerID,
                                action: `linkClicked: ${_id}`,
                                item: true,
                              },
                            ],
                          },
                        });
                        CountInteraction();
                      }}>
                      <ElementLink_Icon
                        styles={layout_styles.extra_s_icon}
                        color={yellow}
                      />
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          )}
        </>
      </TouchableOpacity>
      {!!descShort && (
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: Platform.OS === 'android' ? 10 : 0,
            left: 'auto',
            right: Platform.OS === 'android' ? 10 : 0,
            zIndex: 3,
            transform: [{ rotate: '20deg' }],
          }}
          onPress={itemClick}>
          <MaskedView
            style={{
              width: size,
              height: size,
            }}
            maskElement={
              <Circle_95_Icon
                style={{
                  width: size,
                  height: size,
                }}
              />
            }>
            <View
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: yellow,
                padding: 10,
                justifyContent: 'center',
              }}>
              <Text
                style={[
                  {
                    fontFamily: Fonts.Bold,
                    color: darkblue,
                    fontSize: normalizeFontSize(font),
                    lineHeight: normalizeFontSize(font),
                    textAlign: 'center',
                  },
                ]}>
                {descShort}
              </Text>
            </View>
          </MaskedView>
        </TouchableOpacity>
      )}
    </>
  );
};

export default PartnerItemCard;
