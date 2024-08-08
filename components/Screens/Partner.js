import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Animated,
  Share,
  Image,
  TouchableHighlight,
  Linking,
  Platform,
} from 'react-native';
import layout_styles from '../../styles/Layout_Styles';
import { useTranslation } from 'react-i18next';
import {
  darkblue,
  green,
  lightblue,
  whiteColor,
  yellow,
} from '../../styles/Colors';
import { screenHeight, screenWidth } from '../../utilities/WidthAndHeight';
import MainContext from '../../context/MainContext';
import PubInBubbles from '../PubIn_Components/PubInBubbles';
import PubInHorizontalWrapper from '../PubIn_Components/PubInHorizontalWrapper';
import {
  Add_Friend_Icon,
  Friend_Icon,
  Instagram_Icon,
  Share_Icon,
  Special_Icon,
  World_Icon,
} from '../../content/Icons';
import { useNavigation } from '@react-navigation/native';
import PartnerItemCard from '../Cards/PartnerItemCard';
import { showAlert } from 'react-native-customisable-alert';
import CustomAlert from '../CustomAlert';
import firestore from '@react-native-firebase/firestore';
import PubCardHorizontal from '../Cards/PubCardHorizontal';
import CountInteraction from '../../utilities/CountInteraction';
import LayoutContainer from '../../utilities/LayoutContainer';
import { normalizeFontSize } from '../../utilities/ResFontSize';
import Fonts from '../../content/Fonts';
import i18n from 'i18next';
import PubBundleCard from '../Cards/PubBundleCard';
import ModalOverlay from '../Onboarding/ModalOverlay';
import StoreValueLocally from '../../utilities/StoreValueLocally';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import decodedAndroidSharingURL from '../../utilities/decodedAndroidSharingURL';

const Partner = ({ route }) => {
  const { t } = useTranslation();
  const {
    mainState,
    setToast,
    setMainState,
    getDistanceForEach,
    getDistanceDisplayForEach,
    noUserNavAfter,
  } = useContext(MainContext);
  const navigation = useNavigation();
  const { params } = route;
  const setMarginBottom = screenHeight * 0.05;
  const bannerHeight = screenHeight * 0.3;
  const [showBanner, setShowBanner] = useState(true);
  const scrollViewRef = useRef();
  const animateHeight = useRef(new Animated.Value(bannerHeight)).current;
  const [sortedPubs, setSortedPubs] = useState([]);
  const [sortedBases, setSortedBases] = useState([]);
  const [scrollSnaps, setScrollSnaps] = useState({});
  const [placeholderHeight, setPlaceholderHeight] = useState(0);
  const [triggerPreviews, setTriggerPreviews] = useState({
    bookables: {
      triggered: false,
      scrollY: null,
    },
    veranstaltungen: {
      triggered: false,
      scrollY: null,
    },
    drinks: {
      triggered: false,
      scrollY: null,
    },
    checkin: {
      triggered: false,
      scrollY: null,
    },
  });

  const handleScroll = (event) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    Object.keys(triggerPreviews).forEach((c) => {
      const current = triggerPreviews[c];
      if (!current.scrollY || scrollY < current.scrollY || !!current.triggered)
        return;
      const newState = {
        ...triggerPreviews,
        [c]: {
          ...current,
          triggered: true,
        },
      };
      setTriggerPreviews(newState);
    });
    if (scrollY > 0 && showBanner) {
      Animated.timing(animateHeight, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
      setShowBanner(false);
    } else if (scrollY <= 0 && !showBanner) {
      Animated.timing(animateHeight, {
        toValue: bannerHeight,
        duration: 300,
        useNativeDriver: false,
      }).start();
      setShowBanner(true);
    }
  };
  const becomeBuddy = async () => {
    try {
      await firestore()
        .collection('users')
        .doc(mainState.userID)
        .update({
          buddies: [...mainState.user?.buddies, params?.partnerID],
        });
      await firestore()
        .collection('partners')
        .doc(params?.partnerID)
        .update({
          buddyCount: params?.buddyCount + 1,
        });
      setMainState({
        ...mainState,
        partners: [
          ...mainState.partners.filter(
            (c) => c.partnerID !== params?.partnerID,
          ),
          {
            ...params,
            buddyCount: params?.buddyCount + 1,
          },
        ],
        complete: {
          ...mainState.complete,
          partnerInteractions: [
            ...mainState.complete.partnerInteractions,
            {
              partner_id: params?.partnerID,
              action: 'becomeBuddy',
              item: false,
            },
          ],
        },
        user: {
          ...mainState.user,
          buddies: [...mainState.user?.buddies, params?.partnerID],
        },
      });
      CountInteraction();
      navigation.setParams({
        ...params,
        buddyCount: params?.buddyCount + 1,
      });
      setToast({
        color: green,
        text: t('newBuddy', {
          name: params?.name,
        }),
      });
    } catch (err) {
      console.log('err :>> ', err);
    }
  };
  const buddyClick = (direct) => {
    if (!mainState.user)
      return noUserNavAfter('Partner', {
        ...params,
      });
    if (mainState.user?.buddies?.indexOf(params?.partnerID) > -1) {
      showAlert({
        alertType: 'custom',
        customAlert: (
          <CustomAlert
            title={t('removeBuddy')}
            icon={
              <Image
                source={{ uri: params?.profileIMG, cache: 'force-cache' }}
                style={{
                  width: layout_styles.l_icon.width,
                  height: layout_styles.l_icon.height,
                  backgroundColor: whiteColor,
                  borderRadius: 5,
                }}
              />
            }
            click={async () => {
              try {
                await firestore()
                  .collection('users')
                  .doc(mainState.userID)
                  .update({
                    buddies: [
                      ...mainState.user?.buddies?.filter(
                        (c) => c !== params?.partnerID,
                      ),
                    ],
                  });
                await firestore()
                  .collection('partners')
                  .doc(params?.partnerID)
                  .update({
                    buddyCount: params?.buddyCount - 1,
                  });
                setMainState({
                  ...mainState,
                  partners: [
                    ...mainState.partners.filter(
                      (c) => c.partnerID !== params?.partnerID,
                    ),
                    {
                      ...params,
                      buddyCount: params?.buddyCount - 1,
                    },
                  ],
                  complete: {
                    ...mainState.complete,
                    partnerInteractions: [
                      ...mainState.complete.partnerInteractions,
                      {
                        partner_id: params?.partnerID,
                        action: 'removeBuddy',
                        item: false,
                      },
                    ],
                  },
                  user: {
                    ...mainState.user,
                    buddies: [
                      ...mainState.user?.buddies?.filter(
                        (c) => c !== params?.partnerID,
                      ),
                    ],
                  },
                });
                CountInteraction();
                navigation.setParams({
                  ...params,
                  buddyCount: params?.buddyCount - 1,
                });
                setToast({
                  color: lightblue,
                  text: t('removedBuddy'),
                });
              } catch (err) {
                console.log('err :>> ', err);
              }
            }}
          />
        ),
      });
    } else {
      if (!!direct) {
        becomeBuddy();
      } else {
        showAlert({
          alertType: 'custom',
          customAlert: (
            <CustomAlert
              title={t('becomeBuddy')}
              sub={t('becomeBuddyMsg', { name: params?.name })}
              icon={
                <Image
                  source={{ uri: params?.profileIMG, cache: 'force-cache' }}
                  style={{
                    width: layout_styles.l_icon.width,
                    height: layout_styles.l_icon.height,
                    backgroundColor: whiteColor,
                    borderRadius: 5,
                  }}
                />
              }
              click={becomeBuddy}
            />
          ),
        });
      }
    }
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
  function sortAfterIndex(a, b) {
    if (a.setIndex > b.setIndex) {
      return -1;
    }
    if (a.setIndex < b.setIndex) {
      return 1;
    }
    return 0;
  }

  const insets = useSafeAreaInsets();

  const contentHeight =
    screenHeight -
    (insets.top + screenHeight * 0.02) -
    (insets.bottom ||
      layout_styles.just_modal_container_paddings_bottom.paddingBottom);

  useEffect(() => {
    if (!!params?.pubs.length) {
      if (mainState.locationGranted) {
        let resultsWithDistance = [];
        params?.pubs.map((current) => {
          let singlePub;
          singlePub = {
            ...current,
            distance: getDistanceForEach(current),
            distanceRouteDisplay: getDistanceDisplayForEach(current),
          };
          resultsWithDistance = [...resultsWithDistance, singlePub];
        });
        let getSortedPubs = resultsWithDistance.sort(compare);
        setSortedPubs(getSortedPubs);
      } else {
        setSortedPubs(params?.pubs);
      }
    }
  }, []);
  useEffect(() => {
    if (!!params?.bases?.length) {
      if (mainState.locationGranted) {
        let resultsWithDistance = [];
        mainState.kneipen
          .filter(
            (c) =>
              params?.bases?.indexOf(c._id) > -1 ||
              params?.bases?.indexOf(c.lokal_id) > -1,
          )
          .forEach((current) => {
            let singlePub;
            singlePub = {
              ...current,
              distance: getDistanceForEach(current),
              distanceRouteDisplay: getDistanceDisplayForEach(current),
            };
            resultsWithDistance = [...resultsWithDistance, singlePub];
          });
        const getSortedBases = resultsWithDistance.sort(compare);
        setSortedBases(getSortedBases);
      } else {
        setSortedBases(
          mainState.kneipen.filter(
            (c) =>
              params?.bases?.indexOf(c._id) > -1 ||
              params?.bases?.indexOf(c.lokal_id) > -1,
          ),
        );
      }
    }
  }, []);

  return (
    <LayoutContainer
      partnerBanner={!!params?.bannerIMG ? params?.bannerIMG : null}
      animateHeight={animateHeight}
      showBanner={showBanner}
      content={
        <View
          style={[
            {
              zIndex: 2,
            },
            showBanner ? { transform: [{ translateY: -75 }] } : {},
          ]}
          onLayout={(evt) => {
            const { height: layoutHeight } = evt.nativeEvent.layout;
            const getHeight = (screenHeight - bannerHeight) / layoutHeight;
            if (getHeight <= 1) {
              setPlaceholderHeight(screenHeight * (1 - getHeight));
            }
          }}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            ref={scrollViewRef}
            onScroll={handleScroll}
            scrollEventThrottle={16}>
            {/*  */}
            {/*  */}
            {/* PROFILEIMG && NAME */}
            <>
              {!showBanner && <View style={{ height: setMarginBottom * 3 }} />}
              {showBanner && (
                <View
                  style={{
                    alignItems: 'center',
                    marginBottom: setMarginBottom / 2,
                  }}>
                  <PubInBubbles
                    imgURL={params?.profileIMG || t('defaultBanner')}
                    setSize={screenWidth * 0.4}
                    noMarginLeft
                    setSizeOfSmall={0.325}
                  />
                </View>
              )}
              <View
                style={{
                  //   flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    if (Platform.OS === 'android') {
                      StoreValueLocally('@DontTrackAppChange', 'True');
                    }
                    setTimeout(() => {
                      Share.share({
                        title: t('sharePartner'),
                        message:
                          Platform.OS === 'android'
                            ? decodedAndroidSharingURL(
                              t('sharePartnerMsg', {
                                url: `https://www.pub-up.de/partner/${params?.partnerID}`,
                              }),
                            )
                            : t('sharePartnerMsgWithOutURL'),
                        url: `https://www.pub-up.de/partner/${params?.partnerID}`,
                      });
                      setMainState({
                        ...mainState,
                        complete: {
                          ...mainState.complete,
                          partnerInteractions: [
                            ...mainState.complete.partnerInteractions,
                            {
                              partner_id: params?.partnerID,
                              action: 'share',
                              item: false,
                            },
                          ],
                        },
                      });
                      CountInteraction();
                    }, 500);
                  }}
                  style={{
                    position: 'absolute',
                    left: 0,
                    padding: 15,
                  }}>
                  <Share_Icon
                    styles={layout_styles.extra_s_icon}
                    color={yellow}
                  />
                </TouchableOpacity>
                <Text
                  style={[
                    layout_styles.font_styling_h2,
                    {
                      textAlign: 'center',
                      maxWidth: '80%',
                    },
                  ]}>
                  {params?.name}
                </Text>
                {!!params?.buddyCount && (
                  <Text
                    style={[
                      layout_styles.font_styling_h3,
                      {
                        textAlign: 'center',
                        maxWidth: '80%',
                        marginTop: 5,
                      },
                    ]}>
                    {t('buddyCount', { num: params?.buddyCount })}
                  </Text>
                )}
                <TouchableOpacity
                  onPress={() => {
                    buddyClick(false);
                  }}
                  style={{
                    position: 'absolute',
                    left: 'auto',
                    padding: 15,
                    right: 0,
                  }}>
                  <>
                    {mainState.user?.buddies?.indexOf(params?.partnerID) > -1 &&
                      !!mainState.user ? (
                      <Friend_Icon styles={layout_styles.extra_s_icon} />
                    ) : (
                      <Add_Friend_Icon
                        styles={layout_styles.extra_s_icon}
                        color={yellow}
                      />
                    )}
                  </>
                </TouchableOpacity>
              </View>
              <View style={{ marginBottom: setMarginBottom / 2 }} />
            </>
            {/*  */}
            {/*  */}
            {/* BASES */}
            {!!sortedBases.length && (
              <>
                <>
                  <View style={{ marginBottom: setMarginBottom / 1.5 }} />
                  <PubInHorizontalWrapper
                    title={t('bases')}
                    arr={sortedBases || []}
                    intervalSnap={scrollSnaps.pubs || 270}
                    item={(current) => {
                      return (
                        <View
                          key={current._id}
                          style={{ marginRight: 20 }}
                          onLayout={(evt) => {
                            const { width: cardWidth } = evt.nativeEvent.layout;
                            setScrollSnaps({
                              ...scrollSnaps,
                              pubs: cardWidth + 20,
                            });
                          }}>
                          <PubCardHorizontal current={current} />
                        </View>
                      );
                    }}
                  />
                </>
              </>
            )}
            {/*  */}
            {/*  */}
            {/* BOOKABLES */}
            {params?.items?.some((c) => c.type === 'bookable') && (
              <>
                <View style={{ marginBottom: setMarginBottom }} />
                <PubInHorizontalWrapper
                  title={t('bookables')}
                  arr={
                    params?.items?.filter((c) => c.type === 'bookable') || []
                  }
                  intervalSnap={
                    screenWidth -
                    layout_styles.content_container.paddingLeft * 2
                  }
                  item={(current) => {
                    return (
                      <View
                        key={true ? Math.random() : current._id}
                        style={{ marginHorizontal: screenWidth * 0.015 }}>
                        <PartnerItemCard
                          current={current}
                          width={
                            screenWidth -
                            layout_styles.content_container.paddingLeft * 2 -
                            screenWidth * 0.03
                          }
                          setImgHeight={0.2}
                        />
                      </View>
                    );
                  }}
                  triggerPreview={triggerPreviews.bookables?.triggered}
                />
                <View
                  onLayout={(evt) => {
                    if (
                      !params?.items?.some((c) => c.type === 'bookable') ||
                      true
                    )
                      return;
                    const { y: positionY } = evt.nativeEvent.layout;
                    setTriggerPreviews({
                      ...triggerPreviews,
                      bookables: {
                        triggered: false,
                        scrollY: positionY - contentHeight,
                      },
                    });
                  }}
                />
              </>
            )}
            {/*  */}
            {/*  */}
            {/* VERANSTALTUNGEN */}
            {params?.items?.some((c) => c.type === 'veranstaltung') && (
              <>
                <View style={{ marginBottom: setMarginBottom }} />
                <PubInHorizontalWrapper
                  title={t('ourVeranstaltung')}
                  arr={
                    params?.items?.filter((c) => c.type === 'veranstaltung') ||
                    []
                  }
                  item={(current) => {
                    return (
                      <View
                        key={current._id}
                        style={{ marginHorizontal: screenWidth * 0.015 }}>
                        <PartnerItemCard
                          current={current}
                          width={
                            screenWidth -
                            layout_styles.content_container.paddingLeft * 2 -
                            screenWidth * 0.03
                          }
                          setImgHeight={0.175}
                        />
                      </View>
                    );
                  }}
                  intervalSnap={
                    screenWidth -
                    layout_styles.content_container.paddingLeft * 2
                  }
                  triggerPreview={triggerPreviews.veranstaltungen?.triggered}
                  type="veranstaltung"
                />
                <View
                  onLayout={(evt) => {
                    if (!params?.items?.some((c) => c.type === 'veranstaltung') || triggerPreviews.veranstaltungen?.triggered)
                      return;
                    const { y: positionY } = evt.nativeEvent.layout;
                    setTriggerPreviews({
                      ...triggerPreviews,
                      veranstaltungen: {
                        triggered: false,
                        scrollY: positionY - contentHeight,
                      },
                    });
                  }}
                />
              </>
            )}
            {/*  */}
            {/*  */}
            {/* DRINKS */}
            {params?.items?.some((c) => c.type === 'drink') && (
              <>
                <View style={{ marginBottom: setMarginBottom }} />
                <PubInHorizontalWrapper
                  title={t('drinks')}
                  arr={
                    params?.items
                      ?.filter((c) => c.type === 'drink')
                      .sort(sortAfterIndex) || []
                  }
                  item={(current) => {
                    return (
                      <View
                        key={current._id}
                        style={{ marginHorizontal: screenWidth * 0.015 }}>
                        <PartnerItemCard
                          current={current}
                          width={
                            screenWidth -
                            layout_styles.content_container.paddingLeft * 2 -
                            screenWidth * 0.03
                          }
                          setImgHeight={0.175}
                        />
                      </View>
                    );
                  }}
                  intervalSnap={
                    screenWidth -
                    layout_styles.content_container.paddingLeft * 2
                  }
                  triggerPreview={triggerPreviews.drinks?.triggered}
                  type="drink"
                />
                <View
                  onLayout={(evt) => {
                    if (!params?.items?.some((c) => c.type === 'drink') || triggerPreviews.drinks?.triggered) return;
                    const { y: positionY } = evt.nativeEvent.layout;
                    setTriggerPreviews({
                      ...triggerPreviews,
                      drinks: {
                        triggered: false,
                        scrollY: positionY - contentHeight,
                      },
                    });
                  }}
                />
              </>
            )}
            {/*  */}
            {/*  */}
            {/* CHECKINS */}
            {params?.items?.some((c) => c.type === 'checkin') && (
              <>
                <View style={{ marginBottom: setMarginBottom }} />
                <PubInHorizontalWrapper
                  title={t('ourCheckIns')}
                  arr={
                    params?.items
                      ?.filter((c) => c.type === 'checkin') || []
                  }
                  item={(current) => {
                    return (
                      <View
                        key={current._id}
                        style={{ marginHorizontal: screenWidth * 0.015 }}>
                        <PartnerItemCard
                          current={current}
                          width={
                            screenWidth -
                            layout_styles.content_container.paddingLeft * 2 -
                            screenWidth * 0.03
                          }
                          setImgHeight={0.175}
                          openQRCode={current.openQRCode}
                        />
                      </View>
                    );
                  }}
                  intervalSnap={
                    screenWidth -
                    layout_styles.content_container.paddingLeft * 2
                  }
                  triggerPreview={triggerPreviews.checkin?.triggered}
                  type="checkin"
                />
                <View
                  onLayout={(evt) => {
                    if (!params?.items?.some((c) => c.type === 'checkin') || triggerPreviews.checkin?.triggered) return;
                    const { y: positionY } = evt.nativeEvent.layout;
                    console.log('scrollY for checkin:', positionY - contentHeight);
                    setTriggerPreviews({
                      ...triggerPreviews,
                      checkin: {
                        triggered: false,
                        scrollY: positionY - contentHeight,
                      },
                    });
                  }}
                />
              </>
            )}
            {/*  */}
            {/*  */}
            {/* MY BUNDLES */}
            {mainState.allPublicPubBundles.some(
              (c) => c.admin === params?.partnerID,
            ) && (
                <>
                  <View style={{ marginBottom: setMarginBottom / 1.5 }} />
                  <PubInHorizontalWrapper
                    title={t('ourBundles')}
                    arr={
                      mainState.allPublicPubBundles.filter(
                        (c) => c.admin === params?.partnerID,
                      ) || []
                    }
                    item={(current) => {
                      return (
                        <View
                          key={current.bb_id || Math.random()}
                          style={{ marginRight: 20 }}
                          onLayout={(evt) => {
                            const { width: cardWidth } = evt.nativeEvent.layout;
                            setScrollSnaps({
                              ...scrollSnaps,
                              bundles: cardWidth + 20,
                            });
                          }}>
                          <PubBundleCard
                            click={() => {
                              setMainState({
                                ...mainState,
                                complete: {
                                  ...mainState.complete,
                                  bbInteractions: [
                                    ...mainState.complete.bbInteractions,
                                    {
                                      bb_id: current.bb_id,
                                      action: `clickOnIt`,
                                    },
                                  ],
                                },
                              });
                              navigation.push('PubBundle', {
                                selectedPubBundle: current,
                              });
                            }}
                            name={current.name}
                            pubCount={current.pubCount}
                            imgURL={current.imgURL || t('defaultBanner')}
                            bb_id={current.bb_id}
                          />
                        </View>
                      );
                    }}
                    intervalSnap={scrollSnaps.bundles || 268.5}
                  />
                </>
              )}
            {/*  */}
            {/*  */}
            {/* PUBS */}
            {!!sortedPubs.length && (
              <>
                <View style={{ marginBottom: setMarginBottom / 1.5 }} />
                <PubInHorizontalWrapper
                  title={t('ourPubs')}
                  arr={sortedPubs || []}
                  intervalSnap={scrollSnaps.pubs || 270}
                  item={(current) => {
                    return (
                      <View key={current._id} style={{ marginRight: 20 }}>
                        <PubCardHorizontal current={current} />
                      </View>
                    );
                  }}
                />
              </>
            )}
            {/*  */}
            {/*  */}
            {/* DESCRIPTION */}
            {!!params?.description && params?.description[i18n.language] !== '' && (
              <View
                style={[
                  {
                    backgroundColor: darkblue,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    // borderRadius: 5,
                    // borderWidth: 1,
                    borderColor: whiteColor,
                    marginBottom: 20,
                    paddingLeft: '5%',
                    paddingRight: '5%',
                    marginTop: setMarginBottom,
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
                  {params?.description[i18n.language]
                    ?.split('||')
                    .join('\n\n')
                    .split('|')
                    .join('\n')}
                </Text>
              </View>
            )}
            {/*  */}
            {/*  */}
            {/* SOCIALS */}
            {(!!params?.instagram || !!params?.web) && (
              <View
                style={[
                  layout_styles.social_media_container,
                  {
                    marginTop: params?.description[i18n.language] !== '' ? 0 : 40,
                    marginBottom: 0,
                    paddingHorizontal: '20%',
                  },
                ]}>
                {!!params?.instagram && (
                  <TouchableHighlight
                    onPress={() => {
                      setMainState({
                        ...mainState,
                        complete: {
                          ...mainState.complete,
                          partnerInteractions: [
                            ...mainState.complete.partnerInteractions,
                            {
                              partner_id: params?.partnerID,
                              action: 'instagramOpened',
                              item: false,
                            },
                          ],
                        },
                      });
                      Linking.openURL(params?.instagram);
                    }}>
                    <Instagram_Icon />
                  </TouchableHighlight>
                )}
                {!!params?.web && (
                  <TouchableHighlight
                    onPress={() => {
                      setMainState({
                        ...mainState,
                        complete: {
                          ...mainState.complete,
                          partnerInteractions: [
                            ...mainState.complete.partnerInteractions,
                            {
                              partner_id: params?.partnerID,
                              action: 'websiteOpened',
                              item: false,
                            },
                          ],
                        },
                        showLink: params?.web,
                      });
                    }}>
                    <World_Icon styles={layout_styles.l_icon} />
                  </TouchableHighlight>
                )}
              </View>
            )}
            <View style={{ height: placeholderHeight || screenHeight * 0.25 }} />
          </ScrollView>
        </View>
      }
      overlay={
        <ModalOverlay
          str="@FirstOpen_Partner"
          downSteps={[
            {
              eng: 'In the Buddy Profile you will find everything around our partnerships. Here you can discover locations, events, booking options, promotions, pubBundles and much more from our PubUp Buddies as well as connect with them.',
              deu: 'Im Buddy Profile findest du alles rund um unsere Partnerschaften. Hier kannst du Locations, Veranstaltungen, Buchungsmöglichkeiten, Aktionen, PubBundles und vieles mehr von unseren PubUp Buddies entdecken und dich mit ihnen vernetzen.',
              icon: (
                <Special_Icon styles={layout_styles.l_icon} color={yellow} />
              ),
              click: {
                text: t('connectToBuddy', { name: params?.name }),
                click: () => {
                  if (
                    mainState.user?.buddies?.indexOf(params?.partnerID) > -1
                  ) {
                    setToast({
                      text: t('alreadyBuddy', { name: params?.name }),
                      color: lightblue,
                    });
                  } else {
                    buddyClick(true);
                  }
                },
              },
            },
          ]}
          goOnAfterClick
        />
      }
    />
  );
};

export default Partner;
