import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Animated,
  Share,
  Platform,
} from 'react-native';
import layout_styles from '../../styles/Layout_Styles';
import { useTranslation } from 'react-i18next';
import { lightblue, whiteColor, yellow } from '../../styles/Colors';
import { screenHeight, screenWidth } from '../../utilities/WidthAndHeight';
import MainContext from '../../context/MainContext';
import i18next from 'i18next';
import {
  Copied_Icon,
  Copy_Icon,
  Share_Icon,
  Time_Icon,
} from '../../content/Icons';
import ListItemFilter from '../ListItems/ListItemFilter';
import PubCardHorizontal from '../Cards/PubCardHorizontal';
import PubInHorizontalWrapper from '../PubIn_Components/PubInHorizontalWrapper';
import CountInteraction from '../../utilities/CountInteraction';
import LayoutContainer from '../../utilities/LayoutContainer';
import GetFullDate from '../../utilities/GetFullDate';
import GetTimeString from '../../utilities/GetTimeString';
import { week, woche } from '../../content/WeekDays';
import { normalizeFontSize } from '../../utilities/ResFontSize';
import Fonts from '../../content/Fonts';
import StoreValueLocally from '../../utilities/StoreValueLocally';
import Clipboard from '@react-native-clipboard/clipboard';
import decodedAndroidSharingURL from '../../utilities/decodedAndroidSharingURL';
import PrimaryButton_Outline from '../Buttons/PrimaryButton_Outline';

const PartnerItem = ({ route }) => {
  const { t } = useTranslation();
  const {
    mainState,
    setMainState,
    getDistanceForEach,
    getDistanceDisplayForEach,
    setToast,
  } = useContext(MainContext);
  const [scrollSnap, setScrollSnap] = useState(270);
  const { params } = route;
  const setMarginBottom = screenHeight * 0.05;
  const [showBanner, setShowBanner] = useState(true);
  const [copied, setCopied] = useState(false);
  const [copiedBeforeRedeming, setCopiedBeforeRedeming] = useState(false);
  const imgHeight = params?.bannerHeight || screenHeight * 0.3;
  const scrollViewRef = useRef();
  const animateHeight = useRef(new Animated.Value(0)).current;
  const [sortedPubs, setSortedPubs] = useState([]);

  const handleScroll = (event) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    if (scrollY > 0 && showBanner) {
      Animated.timing(animateHeight, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
      setShowBanner(false);
    } else if (scrollY <= 0 && !showBanner) {
      Animated.timing(animateHeight, {
        toValue: imgHeight,
        duration: 300,
        useNativeDriver: false,
      }).start();
      setShowBanner(true);
    }
  };
  useEffect(() => {
    Animated.timing(animateHeight, {
      toValue: imgHeight,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [imgHeight]);

  const partner = mainState.partners.find(
    (c) => c.partnerID === params?.partnerID,
  ) || mainState.partners.find(
    (c) => !!c.items?.length && c.items?.some((ci) => ci?._id === params?.checkInID),
  );


  const setGermanArticle = () => {
    if (params?.type === 'drink' || params?.type === 'checkin') return 'diesen';
    if (params?.type === 'bookable' || params?.type === 'veranstaltung')
      return 'diese';
    return '';
  };
  const setType = () => {
    if (params?.type === 'drink') return 'Drink';
    if (params?.type === 'checkin') return t('checkin');
    if (params?.type === 'bookable') return t('bookable');
    if (params?.type === 'veranstaltung') return t('veranstaltung');
    return '';
  };
  function compare(a, b) {
    if (a.distance < b.distance) {
      return -1;
    }
    if (a.distance > b.distance) {
      return 1;
    }
    return 0;
  }
  const setRepeatTime = (str) => {
    if (i18next.language === 'en' && str.indexOf('AM') > -1) return 'AM';
    if (i18next.language === 'en') return 'PM';
    return 'Uhr';
  };

  useEffect(() => {
    if (!!params?.pubs?.length) {
      if (mainState.locationGranted) {
        const collectSortedPubs = [];
        mainState.kneipen
          .filter((c) => {
            const ID = c.lokal_id || c._id;
            return params?.pubs?.indexOf(ID) > -1;
          })
          .forEach((current) => {
            collectSortedPubs.push({
              ...current,
              distance: getDistanceForEach(current),
              distanceRouteDisplay: getDistanceDisplayForEach(current),
            });
          });
        setSortedPubs(collectSortedPubs.sort(compare));
      } else {
        setSortedPubs(
          mainState.kneipen.filter((c) => {
            const ID = c.lokal_id || c._id;
            return params?.pubs?.indexOf(ID) > -1;
          }),
        );
      }
    }

  }, []);

  return (
    <LayoutContainer
      partnerItemBanner={!!params?.imgURL ? params?.imgURL : null}
      partnerItemBannerHeight={imgHeight}
      animateHeight={animateHeight}
      content={
        <View
          style={[
            {
              zIndex: 2,
            },
          ]}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            ref={scrollViewRef}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            style={{ minHeight: screenHeight }}>
            {/*  */}
            {/*  */}
            {/* IMG && NAME && DESCRIPTION */}
            <>
              {!showBanner && <View style={{ height: setMarginBottom * 2 }} />}
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: setMarginBottom / 2,
                }}>
                <Text
                  style={[
                    layout_styles.font_styling_h2,
                    {
                      textAlign: 'center',
                      maxWidth: '70%',
                    },
                  ]}>
                  {params?.name[i18next.language]}
                </Text>
                {!!params?.description && (
                  <Text
                    style={[
                      layout_styles.font_styling_h3,
                      {
                        textAlign: 'center',
                        maxWidth: '60%',
                        marginTop: 5,
                      },
                    ]}>
                    {params?.description[i18next.language]}
                  </Text>
                )}
                <TouchableOpacity
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
                                url: `https://www.pub-up.de/partner/item/${params?._id}`,
                              }),
                            )
                            : t('sharePartnerItemMsgWithOutURL', {
                              article:
                                i18next.language === 'de'
                                  ? setGermanArticle()
                                  : null,
                              type: setType(),
                            }),
                        url: `https://www.pub-up.de/partner/item/${params?._id}`,
                      });
                      setMainState({
                        ...mainState,
                        complete: {
                          ...mainState.complete,
                          partnerInteractions: [
                            ...mainState.complete.partnerInteractions,
                            {
                              partner_id: params?.partnerID,
                              action: `share item: ${params?._id}`,
                              item: true,
                            },
                          ],
                        },
                      });
                      CountInteraction();
                    }, 500);
                  }}
                  style={{
                    position: 'absolute',
                    left: 'auto',
                    padding: 15,
                    right: 0,
                  }}>
                  <Share_Icon
                    styles={layout_styles.extra_s_icon}
                    color={yellow}
                  />
                </TouchableOpacity>
              </View>
              {params?.type !== 'checkin' && (
                <>
                  {params?.cardIcons?.indexOf('link') > -1 && !!params?.link ? (
                    <>
                      {!!partner && (
                        <View style={{ alignItems: 'center' }}>
                          <ListItemFilter
                            title={
                              params?.type === 'bookable'
                                ? t('toBooking')
                                : 'Link'
                            }
                            partnerID={partner?.partnerID}
                            tight
                            link={params?.link}
                            _id={params?._id}
                          />
                        </View>
                      )}
                    </>
                  ) : (
                    <Text
                      style={[
                        layout_styles.font_styling_h3_Bold,
                        {
                          textAlign: 'center',
                          marginTop: setMarginBottom / 2,
                          marginBottom: setMarginBottom / 2,
                        },
                      ]}>
                      {setType()}
                    </Text>
                  )}
                </>
              )}
            </>
            {/*  */}
            {/*  */}
            {/* PARTNER */}
            {!!partner && (
              <>
                <View style={{ alignItems: 'center' }}>
                  <ListItemFilter
                    title={partner?.name}
                    imgURL={partner?.profileIMG}
                    partnerID={partner?.partnerID}
                    tight
                  />
                </View>
                <View style={{ marginBottom: setMarginBottom / 2 }} />
              </>
            )}
            {/*  */}
            {/*  */}
            {/* CODE */}
            {params?.type === 'checkin' && (
              <>
                {!!params?.code && (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                    <Text
                      style={[
                        layout_styles.font_styling_h1,
                        {
                          textAlign: 'center',
                          maxWidth: '90%',
                          fontSize: normalizeFontSize(20),
                        },
                      ]}>
                      {params?.code}
                    </Text>
                  </View>
                )}
                <PrimaryButton_Outline
                  text={copiedBeforeRedeming ? t('copiedCode') : t('redeemCode')}
                  buttonClicked={async () => {
                    Clipboard.setString(params?.code);
                    setToast({
                      color: lightblue,
                      text: t('copiedToClipboard'),
                    });
                    setCopiedBeforeRedeming(true);
                    setTimeout(() => {
                      setCopiedBeforeRedeming(false)
                      setMainState({
                        ...mainState,
                        showLink: params?.link,
                        complete: {
                          ...mainState.complete,
                          partnerInteractions: [
                            ...mainState.complete.partnerInteractions,
                            {
                              partner_id: params?.partnerID,
                              action: `linkClicked: ${params?._id || params?.checkInID}`,
                              item: true,
                            },
                          ],
                        },
                      });
                    }, 1000);
                  }}
                  marginTopAuto={false}
                  setMarginTop={30}
                />
                <PrimaryButton_Outline
                  text={copied ? t('copiedCode') : t('copyCode')}
                  // text={t('copyCode')}
                  buttonClicked={async () => {
                    Clipboard.setString(params?.code);
                    setToast({
                      color: lightblue,
                      text: t('copiedToClipboard'),
                    });
                    setCopied(true);
                    setTimeout(() => {
                      setCopied(false);
                    }, 2000);
                  }}
                  marginTopAuto={false}
                  setMarginTop={30}
                  showIcon={<>{copied ? (
                    <Copied_Icon styles={layout_styles.extra_s_icon} />
                  ) : (
                    <Copy_Icon styles={layout_styles.extra_s_icon} />
                  )}</>}
                />
              </>
            )}
            {/*  */}
            {/*  */}
            {/* DESCRIPTION */}
            {!!params?.rewardDescriptionLong && (
              <View
                style={[
                  {
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 5,
                    marginTop: params?.type === 'checkin' ? 30 : 0,
                    marginBottom: 30,
                    paddingLeft: '5%',
                    paddingRight: '5%',
                  },
                ]}>
                <Text
                  style={[
                    {
                      color: whiteColor,
                      fontSize: normalizeFontSize(12),
                      lineHeight: normalizeFontSize(12 * 1.2),
                    },
                    layout_styles.padding_elements_bottom,
                    layout_styles.padding_elements_top,
                    { fontFamily: Fonts.Bold },
                  ]}>
                  {i18next.language === 'en'
                    ? params?.rewardDescriptionLong?.en?.replace('<c>', '')
                    : params?.rewardDescriptionLong?.de?.replace('<c>', '')}
                </Text>
              </View>
            )}
            {/*  */}
            {/*  */}
            {/* DATES */}
            {!!params?.dates?.length && (
              <View style={{ paddingHorizontal: screenWidth * 0.1 }}>
                {params?.dates?.map((current) => {
                  return (
                    <View
                      key={Math.random()}
                      style={{ marginBottom: setMarginBottom / 4 }}>
                      {!!current.start &&
                        !current.end &&
                        !current.repeat &&
                        typeof current.start === 'number' && (
                          <>
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginBottom: !!current.end ? 20 : 0,
                                paddingHorizontal: screenWidth * 0.05,
                              }}>
                              <Time_Icon
                                styles={layout_styles.s_icon}
                                color={yellow}
                              />
                              <View style={{ marginLeft: 20 }}>
                                <Text style={[layout_styles.font_styling_h4]}>
                                  {t('startTime')}
                                </Text>
                                <Text
                                  style={[layout_styles.font_styling_h4_Bold]}>
                                  {GetFullDate(current.start)}
                                </Text>
                                <Text
                                  style={[layout_styles.font_styling_h4_Bold]}>
                                  {GetTimeString(current.start)}
                                </Text>
                              </View>
                            </View>
                          </>
                        )}
                      {!!current.start &&
                        !!current.end &&
                        !current.repeat &&
                        typeof current.start === 'number' && (
                          <>
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingHorizontal: screenWidth * 0.05,
                              }}>
                              <Time_Icon
                                styles={layout_styles.s_icon}
                                color={yellow}
                              />
                              <View style={{ marginLeft: 20 }}>
                                <Text style={[layout_styles.font_styling_h4]}>
                                  {t('time')}
                                </Text>
                                <Text
                                  style={[layout_styles.font_styling_h4_Bold]}>
                                  {GetFullDate(current.start)}
                                </Text>
                                <Text
                                  style={[layout_styles.font_styling_h4_Bold]}>
                                  {GetTimeString(current.start)} -{' '}
                                  {GetTimeString(current.end)}
                                </Text>
                              </View>
                            </View>
                          </>
                        )}
                      {!!current.repeat && (
                        <>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              paddingHorizontal: screenWidth * 0.05,
                            }}>
                            <Time_Icon
                              styles={layout_styles.s_icon}
                              color={yellow}
                            />
                            <View style={{ marginLeft: 20 }}>
                              <Text
                                style={[layout_styles.font_styling_h4_Bold]}>
                                {current.repeat === 'weekly'
                                  ? t('eachWeek')
                                  : t('eachDay')}
                              </Text>
                              <Text
                                style={[layout_styles.font_styling_h4_Bold]}>
                                {current.repeat === 'weekly'
                                  ? `${i18next.language === 'en'
                                    ? week[current.day]
                                    : woche[current.day]
                                  } | ${current.start
                                    .replace('AM', '')
                                    .replace('PM', '')} ${setRepeatTime(
                                      current.start,
                                    )} - ${current.end
                                      .replace('AM', '')
                                      .replace('PM', '')} ${setRepeatTime(
                                        current.end,
                                      )}`
                                  : `${current.start
                                    .replace('AM', '')
                                    .replace('PM', '')} ${setRepeatTime(
                                      current.start,
                                    )} - ${current.end
                                      .replace('AM', '')
                                      .replace('PM', '')} ${setRepeatTime(
                                        current.end,
                                      )}`}
                              </Text>
                            </View>
                          </View>
                        </>
                      )}
                      <View
                        style={{
                          backgroundColor: whiteColor,
                          width: '100%',
                          height: 1,
                          borderRadius: 50,
                          marginTop: setMarginBottom / 4,
                        }}
                      />
                    </View>
                  );
                })}
                <View style={{ marginBottom: setMarginBottom }} />
              </View>
            )}
            {/*  */}
            {/*  */}
            {/* LOCATIONS */}
            {!!sortedPubs.length && (
              <>
                <PubInHorizontalWrapper
                  title={t('participatingLocations')}
                  arr={sortedPubs || []}
                  item={(current) => {
                    return (
                      <View
                        key={current._id}
                        style={{ marginRight: 20 }}
                        onLayout={(evt) => {
                          const { width: cardWidth } = evt.nativeEvent.layout;
                          setScrollSnap(cardWidth + 20);
                        }}>
                        <PubCardHorizontal current={current} />
                      </View>
                    );
                  }}
                  intervalSnap={scrollSnap || 270}
                />
                <View style={{ marginBottom: setMarginBottom / 2 }} />
              </>
            )}
            <View style={{ marginTop: screenHeight * 0.3 }} />
          </ScrollView>
        </View>
      }
    />
  );
};

export default PartnerItem;
