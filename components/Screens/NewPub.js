import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  TouchableHighlight,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Share,
  Pressable,
  Animated,
  Linking,
  Platform,
  Image,
} from 'react-native';
import {
  Billard,
  Category,
  Cocktails,
  CraftBeer,
  Darts,
  IndividualIcons,
  Kicker,
  Kitchen,
  LiveMusic,
  Outdoor,
  Payment,
  Rent,
  Smoking,
  Streaming,
  Wifi,
  Wine,
} from '../../content/PubInfos';
import MainContext from '../../context/MainContext';
import { screenHeight, screenWidth } from '../../utilities/WidthAndHeight';
import layout_styles from '../../styles/Layout_Styles';
import {
  Adress_Icon,
  Back_Icon,
  BarBundleFilled_Icon,
  BarBundle_Icon,
  Circle_95_Icon,
  ElementLink_Icon,
  FullHeart_Icon,
  Heart_Icon,
  Information_Icon,
  Instagram_Icon,
  Logo_Icon,
  Navigation_Icon,
  Overlay_Left_Icon,
  Overlay_Middle_Icon,
  Overlay_Right_Icon,
  PhotoGallery_Icon,
  Photo_Icon,
  Plus_Icon,
  Plus_Without_Circle,
  PubIn_Icon,
  Share_Icon,
  Time_Icon,
  World_Icon,
} from '../../content/Icons';
import {
  darkblue,
  green,
  lightblue,
  red,
  whiteColor,
  yellow,
} from '../../styles/Colors';
import GetValueLocally from '../../utilities/GetValueLocally';
import StoreValueLocally from '../../utilities/StoreValueLocally';
import { getDistance } from 'geolib';
import InputTextArea from '../Inputs/InputTextArea';
import PrimaryButton from '../Buttons/PrimaryButton';
import Loading from '../../utilities/Loading';
import ModalOverlay from '../Onboarding/ModalOverlay';
import Fonts from '../../content/Fonts';
import CountInteraction from '../../utilities/CountInteraction';
import firestore from '@react-native-firebase/firestore';
import QuickUploadPhoto from '../../utilities/QuickUploadPhoto';
import ListItemBarBundle_Small from '../ListItems/ListItemBarBundle_Small';
import MaskedView from '@react-native-masked-view/masked-view';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import i18n from 'i18next';
import '../../content/translation';
import { showAlert } from 'react-native-customisable-alert';
import CustomAlert from '../CustomAlert';
import { Emoji } from '../../content/Emoji';
import {
  addPubToPubBundle,
  removePubFromPubBundle,
} from '../../utilities/UpdatePubInPubBundle';
import FillUpComplete from '../../utilities/FillUpComplete';
import { normalizeFontSize } from '../../utilities/ResFontSize';
import GetGooglePhotos from '../../utilities/GetGooglePhotos';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { firebase } from '@react-native-firebase/crashlytics';
import PubInHorizontalWrapper from '../PubIn_Components/PubInHorizontalWrapper';
import PartnerItemCard from '../Cards/PartnerItemCard';
import LayoutContainer from '../../utilities/LayoutContainer';
import decodedAndroidSharingURL from '../../utilities/decodedAndroidSharingURL';
import HopfenHelden from '../IndividualPins/HopfenHelden';
import {
  ACCESS_ALLPUBS
} from '@env'
import MakeRequest from '../../utilities/MakeRequest';
import BaseUrl from '../../content/BaseUrl';

const NewPub = ({ route }) => {
  // States
  const { mainState, setMainState, setToast, noUserNavAfter } =
    useContext(MainContext);
  const { params } = route;
  const [searchInput, setSearchInput] = useState('');
  const { t } = useTranslation();
  const [barBundles, setBarBundles] = useState([]);
  const [extraInfos, setExtraInfos] = useState(null);
  const navigation = useNavigation();
  const [step, setStep] = useState(1);
  const [showLoading, setShowLoading] = useState(false);
  const [showGoogleLoading, setShowGoogleLoading] = useState(true);
  const [thankYou, setThankYou] = useState(false);
  const [collapseSliderBox, setCollapseSliderBox] = useState(false);
  const [pubPhotos, setPubPhotos] = useState([]);
  const [pubPhotosSet, setPubPhotosSet] = useState(false);
  const [partnerItems, setPartnerItems] = useState([]);
  const [counter, setCounter] = useState(0);
  const scrollViewRef = useRef();
  const animateHeight = useRef(new Animated.Value(0)).current;
  const styles = StyleSheet.create({
    inner_container_1: {
      backgroundColor: darkblue,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 5,
      borderWidth: 1,
      borderColor: whiteColor,
      paddingLeft: '5%',
      paddingRight: '5%',
    },
    inner_container_2: {
      backgroundColor: darkblue,
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 5,
      borderWidth: 1,
      borderColor: whiteColor,
      marginBottom: 20,
      paddingLeft: '3.5%',
      paddingRight: '3.5%',
      paddingTop: 10,
      paddingBottom: 10,
    },
    text: {
      fontFamily: Fonts.Regular,
      color: whiteColor,
      fontSize: normalizeFontSize(12), // before 14
      lineHeight: normalizeFontSize(12 * 1.15), // before 14
    },
    small_text: {
      fontFamily: Fonts.Light,
      color: whiteColor,
      fontSize: normalizeFontSize(12), // before 14
      lineHeight: normalizeFontSize(12 * 1.15), // before 14
    },
    strich: {
      width: '100%',
      height: 2,
      backgroundColor: yellow,
      borderRadius: 1,
      marginTop: 20,
      marginBottom: 20,
    },
    pfeile: {
      width: layout_styles.s_icon.width + 60,
      height: (layout_styles.s_icon.width + 60) * 1.778911641588415,
    },
    container: {
      ...StyleSheet.absoluteFill,
      // backgroundColor: 'yellow',
    },
    navBarIcons: [
      layout_styles.s_icon,
      { marginHorizontal: 10, marginVertical: 10 },
    ],
  });
  const insets = useSafeAreaInsets();
  const [sub, setSub] = useState('');
  const notAnIndividualPin = params?.category?.substring(0, 3) !== 'hh-' && params?.category !== 'bierothek'

  // Utilities
  const openBundlesOverview = async () => {
    setMainState({
      ...mainState,
      complete: {
        ...mainState.complete,
        interactions: [
          ...mainState.complete.interactions,
          {
            lokal_name: params?.name,
            lokal_id: params?.lokal_id || params?._id,
            action: 'addToBundle',
            ...FillUpComplete(),
          },
        ],
      },
      collectPubsToPushToDB: [
        ...mainState.collectPubsToPushToDB,
        params?.lokal_id || params?._id,
      ],
    });
    CountInteraction();
    setSub('Pub_AddToBundle');
  };
  const addFavorite = async () => {
    if (!mainState.user)
      return noUserNavAfter('Pub', {
        ...params,
      });
    const getID = params.lokal_id || params._id;
    const newUser = {
      ...mainState.user,
      favorites: [...mainState.user?.favorites, getID],
    };
    await firestore()
      .collection('users')
      .doc(mainState.userID)
      .update({
        favorites: [...mainState.user?.favorites, getID],
      });
    setMainState({
      ...mainState,
      user: newUser,
    });
    setToast({
      color: lightblue,
      text: t('favoritesPubAdded'),
    });
    CountInteraction();
  };
  const removeFavorite = async () => {
    const getID = params.lokal_id || params._id;
    const newFavorites = mainState.user?.favorites.filter((c) => c !== getID);
    const newUser = {
      ...mainState.user,
      favorites: newFavorites,
    };
    await firestore().collection('users').doc(mainState.userID).update({
      favorites: newFavorites,
    });
    setMainState({
      ...mainState,
      user: newUser,
    });
    setToast({
      color: lightblue,
      text: t('favoritesPubRemoved'),
    });
  };
  const onSubmit = () => {
    setSub(null);
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({
        x: 0,
        y: 1,
        animated: true,
        duration: 100,
      });
      showAlert({
        alertType: 'custom',
        customAlert: (
          <CustomAlert
            title={t('youreGreat')}
            sub={t('betterApp')}
            icon={<Emoji emoji="love" styles={layout_styles.l_icon} />}
          />
        ),
      });
      setSearchInput('');
      setMainState({
        ...mainState,
        complete: {
          ...mainState.complete,
          mails: [
            ...mainState.complete.mails,
            {
              name: params?.name,
              adress: params?.adress,
              nachricht: searchInput,
            },
          ],
        },
      });
    }, 300);
  };
  const onNavigate = () => {
    let distanceRaw = getDistance(
      {
        latitude: mainState.userLocation.latitude,
        longitude: mainState.userLocation.longitude,
      },
      {
        latitude: params?.latitude,
        longitude: params?.longitude,
      },
    );
    let distanceRouteDisplay;
    let distanceKM1 = Math.ceil(distanceRaw / 100);
    let distanceKM2 = distanceKM1 / 10;
    if (distanceRaw > 1000) {
      distanceRouteDisplay = `${distanceKM2} km`;
    } else {
      distanceRouteDisplay = `${distanceRaw} m`;
    }
    setMainState({
      ...mainState,
      navigation: {
        destination: params,
        distance: distanceRouteDisplay,
      },
      complete: {
        ...mainState.complete,
        interactions: [
          ...mainState.complete.interactions,
          {
            lokal_name: params?.name,
            lokal_id: params?.lokal_id || params?._id,
            action: 'navigate',
            ...FillUpComplete(),
          },
        ],
      },
      collectPubsToPushToDB: [
        ...mainState.collectPubsToPushToDB,
        params?.lokal_id || params?._id,
      ],
    });
    CountInteraction();
    navigation.push('Map', {
      map: 'Navigate',
    });
  };
  const hideSliderBox = () => {
    scrollViewRef.current?.scrollTo({
      x: 0,
      y: 1,
      animated: true,
      duration: 0,
    });
    Animated.timing(animateHeight, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setCollapseSliderBox(true);
  };
  const showSliderBox = () => {
    Animated.timing(animateHeight, {
      toValue: screenHeight * 0.5,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setCollapseSliderBox(false);
  };
  const handleScroll = (event) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    if (!pubPhotos.length) return;
    if (scrollY > 0 && !collapseSliderBox) {
      hideSliderBox();
    } else if (scrollY <= 0 && collapseSliderBox) {
      showSliderBox();
    }
  };
  const addPhoto = async (type) => {
    const selectPhoto = async () => {
      try {
        setShowLoading(true);
        const imgURL = await QuickUploadPhoto(
          type,
          params?.lokal_id || params?._id,
          t,
        );
        if (imgURL === 'Cancel') return setShowLoading(false);
        setShowLoading(false);
        setThankYou(true);
      } catch (err) {
        // crashlytics
        firebase.crashlytics().log(`Error addPhoto to Pub :>> ${err}`);
        console.log('Error');
        setShowLoading(false);
        showAlert({
          alertType: 'custom',
          customAlert: (
            <CustomAlert
              title={t('nothingWasFound')}
              sub={t('tryDifferentLink')}
              icon={<Emoji emoji="drunk" styles={layout_styles.l_icon} />}
            />
          ),
        });
      }
    };
    const alreadyAccepted = await GetValueLocally('@first_picture');
    if (!alreadyAccepted)
      return showAlert({
        alertType: 'custom',
        customAlert: (
          <CustomAlert
            title={t('firstPic')}
            sub={t('firstPicSub')}
            clicks={[
              {
                text: t('read'),
                click: () => Linking.openURL('https://www.pub-up.de/agb_photo'),
                icon: (
                  <ElementLink_Icon
                    styles={layout_styles.extra_s_icon}
                    color={yellow}
                  />
                ),
                noClose: true,
              },
              {
                text: t('ok'),
                click: () => {
                  StoreValueLocally('@first_picture', 'Done');
                  setTimeout(() => {
                    selectPhoto();
                  }, 500);
                },
              },
            ]}
          />
        ),
      });
    selectPhoto();
  };
  const pubBundleClick = async (current) => {
    try {
      if (current.bb_id === 'Favs') {
        if (
          mainState.user?.favorites.indexOf(params.lokal_id || params._id) > -1
        ) {
          console.log('removeFavorite');
          removeFavorite();
        } else {
          console.log('addFavorite');
          addFavorite();
        }
      } else {
        // Add to PubBundle
        if (current.pubs.indexOf(params.lokal_id || params._id) > -1) {
          console.log('removePubFromPubBundle');
          removePubFromPubBundle(
            params,
            {
              mainState,
              params: {
                selectedPubBundle: current,
              },
            },
            (newMainState) => {
              setMainState(newMainState);
              setToast({
                color: lightblue,
                text: t('pubBundlePubAdded'),
              });
            },
          );
        } else {
          console.log('addPubToPubBundle');
          addPubToPubBundle(
            params,
            {
              mainState,
              params: {
                selectedPubBundle: current,
              },
            },
            (newMainState) => {
              console.log('callback', newMainState.user.bundles);
              setMainState(newMainState);
              setToast({
                color: lightblue,
                text: t('pubBundlePubAdded'),
              });
            },
          );
        }
      }
    } catch (err) {
      console.log('Error in BundleUpdate', err);
      showAlert({
        alertType: 'custom',
        customAlert: (
          <CustomAlert
            title={t('nothingWasFound')}
            sub={t('tryDifferentLink')}
            icon={<Emoji emoji="drunk" styles={layout_styles.l_icon} />}
          />
        ),
      });
    }
  };
  const getAndSetGoogleInfos = async () => {
    try {
      const collectImgURLs = [];
      if (!!params?.link1) {
        collectImgURLs.push(params?.link1);
      }
      if (!!params?.link2) {
        collectImgURLs.push(params?.link2);
      }
      if (!!params?.photos?.length) {
        collectImgURLs.push(...params?.photos);
      }

      let getExtraInfos
      let googleInfos

      if (params?.place_id !== 'none') {
        googleInfos = await GetGooglePhotos(
          params?.place_id,
          encodeURI(
            `${params?.name} ${params?.city !== 'World'
              ? params?.city
              : params?.city2 || params?.extracity
            }`,
          ),
          params?.lokal_id || params?._id,
        );
        if (!!googleInfos?.opening_hours) {
          getExtraInfos = {
            opening_hours: googleInfos?.opening_hours,
          };
        }
        if (typeof googleInfos?.open === 'boolean') {
          if (!!getExtraInfos) {
            getExtraInfos = {
              ...getExtraInfos,
              open: googleInfos?.open,
            };
          } else {
            getExtraInfos = {
              open: googleInfos?.open,
            };
          }
        }
      }
      if (!!getExtraInfos) {
        setExtraInfos(getExtraInfos);
      }
      if (!!googleInfos?.photos) {
        setPubPhotos([...collectImgURLs, ...googleInfos?.photos]);
      } else {
        setPubPhotos([...collectImgURLs]);
      }
      if (!getExtraInfos && !googleInfos && params?.place_id !== 'none') {
        console.log('No Google Infos found');
        await MakeRequest(
          'POST',
          `${BaseUrl}/complete/place_id`,
          ACCESS_ALLPUBS,
          {
            pub_id: params?.lokal_id || params?._id,
            place_id: 'none',
          },
        );
      }
      if (sub === 'Pub_AddToBundle') {
        hideSliderBox();
      }
    } catch (err) {
      console.log('err getAndSetGoogleInfos :>> ', err);
    } finally {
      setShowGoogleLoading(false)
    }
  };
  const navClickOne = () => {
    openBundlesOverview();
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({
        x: 0,
        y: 1,
        animated: true,
        duration: 100,
      });
    }, 300);
  };
  const navClickTwo = () => {
    if (Platform.OS === 'android') {
      StoreValueLocally('@DontTrackAppChange', 'True');
    }
    setTimeout(() => {
      Share.share({
        title: t('shareThePub'),
        message:
          Platform.OS === 'android'
            ? decodedAndroidSharingURL(
              t('shareThePubMsgURL', {
                name: params?.name,
                url: `https://www.pub-up.de/entry/${params?.lokal_id || params?._id
                  }`,
              }),
            )
            : t('shareThePubMsg', {
              name: params?.name,
            }),
        url: `https://www.pub-up.de/entry/${params?.lokal_id || params?._id}`,
      });
      setMainState({
        ...mainState,
        complete: {
          ...mainState.complete,
          interactions: [
            ...mainState.complete.interactions,
            {
              lokal_name: params?.name,
              lokal_id: params.lokal_id || params._id,
              action: 'share',
              ...FillUpComplete(),
            },
          ],
        },
        collectPubsToPushToDB: [
          ...mainState.collectPubsToPushToDB,
          params?.lokal_id || params?._id,
        ],
      });
      CountInteraction();
    }, 500);
  };

  useEffect(() => {
    GetValueLocally('@FirstOpen_Pub').then((res) => {
      GetValueLocally('@skipOverlay').then((resskipOverlay) => {
        if (res === null && resskipOverlay === null) {
          setCounter(1);
        }
      });
    });
  }, []);
  useEffect(() => {
    const mapBundles = !!mainState.user?.bundles ? mainState.user?.bundles : [];
    setBarBundles([
      {
        name: t('myfavorites'),
        bb_id: 'Favs',
      },
      ...mapBundles,
      ...mainState.allPublicPubBundles.filter(
        (c) => c.admin === mainState.userID,
      ),
    ]);
  }, [mainState, sub]);
  useEffect(() => {
    if (sub === 'Pub_Report' && !collapseSliderBox) {
      hideSliderBox();
    }
  }, [sub]);
  useEffect(() => {
    if (!params) return
    if (!extraInfos) {
      getAndSetGoogleInfos();
    } else {
      setShowGoogleLoading(false)
    }
    const findPartnerWithItemsWithCurrentPub = mainState.partners?.find(
      (cp) =>
        !!cp.items?.length &&
        cp.items?.some(
          (cpi) =>
            !!cpi.pubs?.length &&
            cpi.pubs?.indexOf(params?.lokal_id || params?._id) > -1 &&
            cpi.showInBarCard,
        ),
    )
    if (
      !partnerItems.length &&
      !!findPartnerWithItemsWithCurrentPub
    ) {
      const collectPartnerItems = [];
      findPartnerWithItemsWithCurrentPub.items?.forEach((ci) => {
        if (
          !!ci.pubs?.length &&
          ci.pubs?.indexOf(params?.lokal_id || params?._id) > -1 &&
          ci.showInBarCard
        ) {
          collectPartnerItems.push(ci);
        }
      });
      setPartnerItems(collectPartnerItems);
    }
  }, [params]);
  useEffect(() => {
    if (pubPhotos.length > 0 && !pubPhotosSet) {
      setCollapseSliderBox(false);
      Animated.timing(animateHeight, {
        toValue: screenHeight * 0.5,
        duration: 1,
        useNativeDriver: false,
      }).start();
      setPubPhotosSet(true);
    } else {
      setCollapseSliderBox(true);
      Animated.timing(animateHeight, {
        toValue: 0,
        duration: 1,
        useNativeDriver: false,
      }).start();
    }
    return () => {
      setPubPhotosSet(false)
      setShowGoogleLoading(true)
    }
  }, [pubPhotos]);

  const testOverlay = false
  function removeDuplicates(array) {
    return [...new Set(array)];
  }
  const singleBreweries = !!params?.breweries && !!params?.breweries?.length ? removeDuplicates(params?.breweries) : []

  useEffect(() => {
    if (__DEV__ && testOverlay) {
      setCounter(1);
    }
  }, []);

  return (
    <LayoutContainer
      animateHeight={animateHeight}
      noPaddingHorizontal
      scrollableHeaderIMG
      pubHeader={{
        pubPhotos
      }}
      content={
        <>
          {/*  */}
          {/*  */}
          {/* CONTENT */}
          <View
            style={[
              layout_styles.just_modal_container_paddings_vertical,
              {
                height: collapseSliderBox
                  ? screenHeight - insets.bottom
                  : screenHeight - screenHeight * 0.5,
                backgroundColor: darkblue,
              },
              collapseSliderBox ? { paddingTop: insets.top } : {},
            ]}>
            {/*  */}
            {/*  */}
            {/* GOOGLE LOADING */}
            {showGoogleLoading && params?.place_id !== 'none' && <View style={{ marginBottom: 20, alignItems: 'center' }}>
              <Loading downNum={0} styles={layout_styles.extra_large_icon} />
            </View>}
            {/*  */}
            {/*  */}
            {/* TITLE */}
            <View
              style={[
                layout_styles.innercontent_title_container,
                layout_styles.just_modal_container_paddings_left_right,
              ]}>
              <View style={layout_styles.innercontent_title_innercontainer}>
                <Text
                  style={[
                    layout_styles.innercontent_title,
                    {
                      paddingLeft:
                        layout_styles.innercontent_title.paddingLeft + 10,
                      paddingRight: 10,
                    },
                  ]}>
                  {params?.name}
                </Text>
                {sub === 'Pub_AddToBundle' && (
                  <View
                    style={[
                      layout_styles.setMinHeight_Small_Icon,
                      { justifyContent: 'center' },
                    ]}>
                    <Text
                      style={[
                        layout_styles.font_styling_h3_Bold,
                        { textAlign: 'center', marginTop: 7.5, paddingLeft: 25 },
                        // {marginTop: 30, textAlign: 'center'},
                      ]}>
                      {t('addToBundle')}
                    </Text>
                  </View>
                )}
                {sub === 'Pub_Report' && (
                  <View
                    style={[
                      layout_styles.setMinHeight_Small_Icon,
                      { justifyContent: 'center' },
                    ]}>
                    <Text
                      style={[
                        layout_styles.font_styling_h3_Bold,
                        { textAlign: 'center', marginTop: 7.5, paddingLeft: 25 },
                      ]}>
                      {t('demandChanges')}
                    </Text>
                  </View>
                )}
                {!sub && (!collapseSliderBox || !pubPhotos.length) && (
                  <Category category={params?.category} />
                )}
              </View>
            </View>
            <ScrollView
              style={[
                layout_styles.margin_elements_top,
                layout_styles.just_modal_container_paddings_left_right,
              ]}
              scrollEnabled
              showsVerticalScrollIndicator={false}
              ref={scrollViewRef}
              onScroll={handleScroll}
              scrollEventThrottle={16}
              keyboardShouldPersistTaps="never">
              {!collapseSliderBox && (
                <View
                  style={{
                    position: 'absolute',
                    width: screenWidth,
                    height: screenHeight,
                    top: 0,
                    left: 0,
                    zIndex: 10000
                  }}
                  onTouchStart={hideSliderBox}
                />
              )}
              {collapseSliderBox && <View style={{ height: 30 }} />}
              {!sub && (
                <>
                  {/*  */}
                  {/*  */}
                  {/* OPEN NOW */}
                  {!!extraInfos && typeof extraInfos?.open === 'boolean' && (
                    <>
                      <View
                        style={[
                          styles.inner_container_1,
                          layout_styles.padding_elements_bottom,
                          layout_styles.padding_elements_top,
                          { paddingLeft: 0, marginBottom: 20 },
                        ]}>
                        <Time_Icon
                          styles={[layout_styles.s_icon, { marginRight: 10 }]}
                          color={extraInfos?.open ? green : red}
                        />
                        <Text
                          style={[
                            styles.text,
                            {
                              maxWidth: screenWidth * 0.4,
                              paddingRight: 0,
                              fontFamily: Fonts.Bold,
                              color: extraInfos?.open ? green : red,
                            },
                          ]}>
                          {extraInfos?.open ? t('open') : t('notopen')}
                        </Text>
                      </View>
                    </>
                  )}
                  {typeof extraInfos?.open !== 'boolean' &&
                    !params?.plus &&
                    !!extraInfos &&
                    extraInfos?.opening_hours && (
                      <View
                        style={[
                          styles.inner_container_1,
                          layout_styles.padding_elements_bottom,
                          layout_styles.padding_elements_top,
                          {
                            marginBottom: 20,
                            paddingLeft: '5%',
                            paddingRight: '5%',
                            flexDirection: 'column',
                          },
                        ]}>
                        <Text
                          style={[
                            styles.text,
                            { textAlign: 'center' },
                            { fontFamily: Fonts.Bold },
                          ]}>
                          {extraInfos?.opening_hours}
                        </Text>
                      </View>
                    )}
                  {typeof extraInfos?.open !== 'boolean' && !extraInfos?.opening_hours && !!params?.hours && <View
                    style={[
                      styles.inner_container_1,
                      layout_styles.padding_elements_bottom,
                      layout_styles.padding_elements_top,
                      {
                        marginBottom: 20,
                        paddingLeft: '5%',
                        paddingRight: '5%',
                        flexDirection: 'column',
                      },
                    ]}>
                    <Text
                      style={[
                        styles.text,
                        { textAlign: 'center' },
                        { fontFamily: Fonts.Bold },
                      ]}>
                      {params?.hours}
                    </Text>
                  </View>}
                  {/*  */}
                  {/*  */}
                  {/* PARTNERS BASE? */}
                  {mainState.partners?.some(
                    (cp) =>
                      cp.bases?.indexOf(params?.lokal_id || params?._id) > -1,
                  ) && (
                      <>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginBottom: 5,
                          }}>
                          <Text
                            style={[
                              styles.text,
                              {
                                fontFamily: Fonts.Bold,
                              },
                            ]}>
                            {mainState.partners?.find(
                              (cp) =>
                                cp.bases?.indexOf(
                                  params?.lokal_id || params?._id,
                                ) > -1,
                            ).bases?.length > 1
                              ? t('thatsTheBases')
                              : t('thatsTheBase')}
                          </Text>
                        </View>
                        <View style={[styles.inner_container_2]}>
                          {mainState.partners
                            ?.filter(
                              (cp) =>
                                cp.bases?.indexOf(params.lokal_id || params._id) >
                                -1,
                            )
                            ?.map((c) => {
                              const findPartner = mainState.partners?.find(
                                (cb) =>
                                  cb.bases?.indexOf(
                                    params.lokal_id || params._id,
                                  ) > -1,
                              );
                              if (!findPartner) return null;
                              return (
                                <TouchableOpacity
                                  key={Math.random()}
                                  style={{
                                    width: '80%',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginBottom: 10,
                                    justifyContent: 'center',
                                    paddingVertical: 10,
                                  }}
                                  onPress={() => {
                                    setMainState({
                                      ...mainState,
                                      complete: {
                                        ...mainState.complete,
                                        partnerInteractions: [
                                          ...mainState.complete
                                            .partnerInteractions,
                                          {
                                            partner_id: findPartner.partnerID,
                                            action: 'clickOnIt',
                                            item: false,
                                          },
                                        ],
                                      },
                                    });
                                    CountInteraction();
                                    navigation.push('Partner', findPartner);
                                  }}>
                                  <MaskedView
                                    style={[
                                      layout_styles.m_icon,
                                      { backgroundColor: whiteColor },
                                    ]}
                                    maskElement={
                                      <>
                                        <Circle_95_Icon
                                          style={layout_styles.m_icon}
                                        />
                                      </>
                                    }>
                                    <Image
                                      source={{
                                        uri: findPartner?.profileIMG,
                                        cache: 'force-cache',
                                      }}
                                      style={[
                                        layout_styles.m_icon,
                                        { backgroundColor: whiteColor },
                                      ]}
                                    />
                                  </MaskedView>
                                  <Text
                                    style={[
                                      layout_styles.normal_font,
                                      {
                                        fontSize: normalizeFontSize(10),
                                        marginLeft: 10,
                                        textDecorationLine: 'underline',
                                      },
                                    ]}>
                                    {findPartner?.name}
                                  </Text>
                                  <View style={{ width: 10 }} />
                                  <ElementLink_Icon
                                    styles={layout_styles.extra_extra_s_icon}
                                    color={yellow}
                                  />
                                </TouchableOpacity>
                              );
                            })}
                        </View>
                      </>
                    )}
                  {/*  */}
                  {/*  */}
                  {/* PARTNER ITEMS? */}
                  {!!partnerItems.length && (
                    <>
                      <PubInHorizontalWrapper
                        title={t('discover')}
                        arr={partnerItems}
                        intervalSnap={
                          screenWidth -
                          layout_styles.content_container.paddingLeft * 2
                        }
                        item={(current) => {
                          return (
                            <View
                              key={true ? Math.random() : current._id}
                              style={{
                                marginHorizontal:
                                  partnerItems.length === 1
                                    ? 0
                                    : screenWidth * 0.015,
                              }}>
                              <PartnerItemCard
                                current={current}
                                width={
                                  partnerItems.length === 1
                                    ? screenWidth -
                                    layout_styles.content_container
                                      .paddingLeft *
                                    2
                                    : screenWidth -
                                    layout_styles.content_container
                                      .paddingLeft *
                                    2 -
                                    screenWidth * 0.03
                                }
                                setImgHeight={0.2}
                                openQRCode={current.openQRCode}
                              />
                            </View>
                          );
                        }}
                      />
                      <View style={{ marginBottom: 20 }} />
                    </>
                  )}
                  {/*  */}
                  {/*  */}
                  {/* ADD PHOTO */}
                  <TouchableHighlight
                    onPress={async () => {
                      if (step === 1) {
                        setStep(2);
                      }
                    }}
                    style={[
                      {
                        marginBottom: 20,
                        backgroundColor: lightblue,
                        borderRadius: 5,
                      },
                    ]}>
                    <View
                      style={[
                        // styles.inner_container_1,
                        layout_styles.padding_elements_bottom,
                        layout_styles.padding_elements_top,
                        {
                          paddingLeft: 0,
                          borderRadius: 5,
                          borderWidth: 1,
                          borderColor: lightblue,
                        },
                      ]}>
                      {thankYou && (
                        <View
                          style={{
                            alignItems: 'center',
                            paddingHorizontal: 20,
                          }}>
                          <Text
                            style={[
                              styles.text,
                              {
                                color: whiteColor,
                                fontFamily: Fonts.Bold,
                                // maxWidth: screenWidth * 0.4,
                                // paddingRight: 0,
                                textAlign: 'center',
                              },
                            ]}>
                            {t('photoThankYou')}
                          </Text>
                          <Pressable
                            onPress={() => {
                              setThankYou(false);
                            }}>
                            <Text
                              style={[
                                styles.text,
                                {
                                  color: whiteColor,
                                  fontFamily: Fonts.Bold,
                                  textDecorationLine: 'underline',
                                  marginTop: 10,
                                  // maxWidth: screenWidth * 0.4,
                                  // paddingRight: 0,
                                },
                              ]}>
                              {t('addAnotherPhoto')}
                            </Text>
                          </Pressable>
                        </View>
                      )}
                      {!showLoading && step === 1 && (
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Photo_Icon
                            styles={[layout_styles.s_icon, { marginRight: 10 }]}
                          />
                          <Text
                            style={[
                              styles.text,
                              {
                                maxWidth: screenWidth * 0.4,
                                paddingRight: 0,
                                fontFamily: Fonts.Bold,
                              },
                            ]}>
                            {t('addPhotoToThisPub')}
                          </Text>
                        </View>
                      )}
                      {!showLoading && step === 2 && !thankYou && (
                        <>
                          <View
                            style={{
                              flexDirection: 'row',
                              width: '100%',
                            }}>
                            <TouchableHighlight
                              onPress={() => addPhoto('gallery')}
                              style={{
                                // width: Platform.OS !== 'android' ? '50%' : '100%',
                                width: '50%',
                              }}>
                              <View
                                style={{
                                  alignItems: 'center',
                                  // paddingVertical: 20,
                                }}>
                                <PhotoGallery_Icon
                                  styles={layout_styles.s_icon}
                                />
                                <Text
                                  style={[
                                    layout_styles.font_styling_h3_Bold,
                                    {
                                      fontSize: normalizeFontSize(12),
                                      marginTop: 5,
                                    },
                                  ]}>
                                  {t('library')}
                                </Text>
                              </View>
                            </TouchableHighlight>
                            <TouchableHighlight
                              onPress={() => addPhoto('camera')}
                              style={{ width: '50%' }}>
                              <View
                                style={{
                                  alignItems: 'center',
                                  // paddingVertical: 20,
                                }}>
                                <Photo_Icon styles={layout_styles.s_icon} />
                                <Text
                                  style={[
                                    layout_styles.font_styling_h3_Bold,
                                    {
                                      fontSize: normalizeFontSize(12),
                                      marginTop: 5,
                                    },
                                  ]}>
                                  {t('camera')}
                                </Text>
                              </View>
                            </TouchableHighlight>
                          </View>
                        </>
                      )}
                      {showLoading && (
                        <View
                          style={{
                            width: '100%',
                            alignItems: 'center',
                          }}>
                          <Loading styles={layout_styles.m_icon} downNum={3} />
                        </View>
                      )}
                    </View>
                  </TouchableHighlight>
                  {/*  */}
                  {/*  */}
                  {/* ADRESS */}
                  <TouchableHighlight
                    onPress={() => {
                      if (mainState.locationGranted) return onNavigate()
                      const laDF = 0.005;
                      const loDF = laDF / 1.204;
                      setMainState({
                        ...mainState,
                        filters: {
                          category: [],
                          breweries: [],
                        },
                        filtersOn: false,
                        regionToAnimate: {
                          latitude: params?.latitude,
                          longitude: params?.longitude,
                          latitudeDelta: laDF,
                          longitudeDelta: loDF,
                        },
                      });
                      navigation.push('Map');
                    }}
                    style={{ marginBottom: 20 }}>
                    <View
                      style={[
                        styles.inner_container_1,
                        layout_styles.padding_elements_bottom,
                        layout_styles.padding_elements_top,
                        { paddingLeft: 0 },
                      ]}>
                      <Adress_Icon
                        styles={[layout_styles.s_icon, { marginRight: 10 }]}
                      />
                      <Text
                        style={[
                          styles.text,
                          {
                            maxWidth: screenWidth * 0.4,
                            paddingRight: 0,
                            fontFamily: Fonts.Bold,
                          },
                        ]}>
                        {params?.adress}
                      </Text>
                    </View>
                  </TouchableHighlight>
                  {/*  */}
                  {/*  */}
                  {/* INFOS */}
                  <View style={[styles.inner_container_2, { marginBottom: 5 }]}>
                    {notAnIndividualPin && <Smoking smoking={params?.smoking} />}
                    {params?.craft && <CraftBeer />}
                    {params?.cocktails && <Cocktails />}
                    {params?.wine && <Wine />}
                    {params?.outdoor && <Outdoor />}
                    {params?.billards && <Billard />}
                    {params?.darts && <Darts />}
                    {params?.kicker && <Kicker />}
                    {params?.streaming && <Streaming />}
                    {params?.music && <LiveMusic />}
                    {params?.wlan && <Wifi />}
                    {params?.plus && <Payment payment_info={params?.payment} />}
                    {params?.rent && <Rent />}
                    {notAnIndividualPin && <Kitchen kitchen={params?.kitchen} />}
                    {!!params?.extra && <>

                      {params?.extra?.indexOf('only') > -1 && <IndividualIcons type='only' />}
                      {params?.extra?.indexOf('food') > -1 && <IndividualIcons type='food' />}
                      {params?.extra?.indexOf('ausschank') > -1 && <IndividualIcons type='ausschank' />}
                      {params?.extra?.indexOf('braukurs') > -1 && <IndividualIcons type='braukurs' />}
                      {params?.extra?.indexOf('fuehrung') > -1 && <IndividualIcons type='fuehrung' />}

                    </>}
                  </View>
                  {/*  */}
                  {/*  */}
                  {/* OPEN REPORT */}
                  <TouchableHighlight
                    onPress={() => {
                      setSub('Pub_Report');
                      setTimeout(() => {
                        scrollViewRef.current?.scrollTo({
                          x: 0,
                          y: 1,
                          animated: true,
                          duration: 100,
                        });
                      }, 300);
                    }}
                    style={{
                      marginLeft: 'auto',
                      marginBottom: 20,
                    }}>
                    <View
                      style={{
                        // width: '100%',
                        justifyContent: 'flex-end',
                        flexDirection: 'row',
                      }}>
                      <Text
                        style={[
                          layout_styles.font_styling_h4,
                          { marginRight: 10 },
                        ]}>
                        {t('demandChanges')}
                      </Text>
                      <Information_Icon styles={[layout_styles.extra_s_icon]} />
                    </View>
                  </TouchableHighlight>
                  {/*  */}
                  {/*  */}
                  {/* BREWERIES */}
                  {!!singleBreweries?.length && <>
                    {singleBreweries?.length === 1 && (singleBreweries?.indexOf('hopfenhelden') > -1 || singleBreweries?.indexOf('bierothek') > -1) ? <></> : <View
                      style={[styles.inner_container_2, { marginBottom: 20 }]}>
                      {singleBreweries?.map((c) => {
                        const findPartner = mainState.partners?.find(
                          (cb) => cb.partnerID === c,
                        );
                        if (!findPartner) return null;
                        return (
                          <TouchableOpacity
                            key={Math.random()}
                            style={{
                              width: '80%',
                              flexDirection: 'row',
                              alignItems: 'center',
                              marginBottom: 10,
                              justifyContent: 'center',
                              paddingVertical: 10,
                            }}
                            onPress={() => {
                              setMainState({
                                ...mainState,
                                complete: {
                                  ...mainState.complete,
                                  partnerInteractions: [
                                    ...mainState.complete.partnerInteractions,
                                    {
                                      partner_id: findPartner.partnerID,
                                      action: 'clickOnIt',
                                      item: false,
                                    },
                                  ],
                                },
                              });
                              CountInteraction();
                              navigation.push('Partner', findPartner);
                            }}>
                            <MaskedView
                              style={layout_styles.m_icon}
                              maskElement={
                                <>
                                  <Circle_95_Icon
                                    style={layout_styles.m_icon}
                                  />
                                </>
                              }>
                              <Image
                                source={{
                                  uri: findPartner?.profileIMG,
                                  cache: 'force-cache',
                                }}
                                style={layout_styles.m_icon}
                              />
                            </MaskedView>
                            <Text
                              style={[
                                layout_styles.normal_font,
                                {
                                  fontSize: normalizeFontSize(10),
                                  marginLeft: 10,
                                  textDecorationLine: 'underline',
                                },
                              ]}>
                              {findPartner?.name}
                            </Text>
                            <View style={{ width: 10 }} />
                            <ElementLink_Icon
                              styles={layout_styles.extra_extra_s_icon}
                              color={yellow}
                            />
                          </TouchableOpacity>
                        );
                      })}
                    </View>}
                  </>
                  }
                  {/*  */}
                  {/*  */}
                  {/* IMG */}
                  {!!params?.img && <View style={{ alignItems: 'center', marginBottom: 0 }}>
                    <MaskedView
                      style={[
                        layout_styles.extra_large_icon,
                        { backgroundColor: whiteColor },
                      ]}
                      maskElement={
                        <>
                          <Circle_95_Icon
                            style={layout_styles.extra_large_icon}
                          />
                        </>
                      }>
                      <Image
                        source={{
                          uri: params?.img,
                          cache: 'force-cache',
                        }}
                        resizeMode='contain'
                        style={[
                          layout_styles.extra_large_icon,
                          { backgroundColor: whiteColor },
                        ]}
                      />
                    </MaskedView>

                  </View>}
                  {/*  */}
                  {/*  */}
                  {/* BIEROTHEK */}
                  {!!params?.bierothek_link && <TouchableHighlight
                    onPress={async () => setMainState({
                      ...mainState,
                      interactions: [
                        ...mainState.complete.interactions,
                        {
                          lokal_name: params?.name,
                          lokal_id: params?.lokal_id || params?._id,
                          action: 'bierothekLinkOpened',
                          ...FillUpComplete(),
                        },
                      ],
                      showLink: params?.bierothek_link
                    })}
                    style={[
                      {
                        marginBottom: 20,
                        borderRadius: 5,
                      },
                    ]}>
                    <View
                      style={[
                        // styles.inner_container_1,
                        layout_styles.padding_elements_bottom,
                        layout_styles.padding_elements_top,
                        {
                          paddingLeft: 0,
                          borderRadius: 5,
                          borderWidth: 0,
                          borderColor: lightblue,
                        },
                      ]}>
                      <View
                        style={{
                          // flexDirection: 'row',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Image source={require('../../assets/bierothek-Logo.png')} style={{ width: screenWidth * 0.65, height: screenWidth * 0.65 * 0.515593220338983 }} />
                        <Text
                          style={[
                            styles.text,
                            {
                              maxWidth: screenWidth * 0.5,
                              paddingRight: 0,
                              fontFamily: Fonts.Bold,
                            },
                          ]}>
                          {t("bierothek")}
                        </Text>
                      </View>
                    </View>
                  </TouchableHighlight>}
                  {/*  */}
                  {/*  */}
                  {/* HOPFENHELDEN */}
                  {(params?.category?.substring(0, 3) === 'hh-' || !!params?.hhlink) && <HopfenHelden />}
                  {!!params?.hhlink &&
                    <TouchableHighlight
                      onPress={() => setMainState({
                        ...mainState,
                        interactions: [
                          ...mainState.complete.interactions,
                          {
                            lokal_name: params?.name,
                            lokal_id: params?.lokal_id || params?._id,
                            action: 'hhLinkOpened',
                            ...FillUpComplete(),
                          },
                        ],
                        showLink: params?.hhlink
                      })}
                      style={[
                        {
                          marginBottom: 20,
                          backgroundColor: lightblue,
                          borderRadius: 5,
                        },
                      ]}>
                      <View
                        style={[
                          // styles.inner_container_1,
                          layout_styles.padding_elements_bottom,
                          layout_styles.padding_elements_top,
                          {
                            paddingLeft: 0,
                            borderRadius: 5,
                            borderWidth: 1,
                            borderColor: lightblue,
                          },
                        ]}>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <ElementLink_Icon
                            styles={[layout_styles.extra_s_icon, { marginRight: 10 }]}
                          />
                          <Text
                            style={[
                              styles.text,
                              {
                                maxWidth: screenWidth * 0.5,
                                paddingRight: 0,
                                fontFamily: Fonts.Bold,
                              },
                            ]}>
                            {t("toHHArticle")}
                          </Text>
                        </View>
                      </View>
                    </TouchableHighlight>}
                  {!!params?.description && (
                    <View
                      style={[
                        styles.inner_container_1,
                        {
                          marginBottom: !!params?.hhlink ? 0 : 20,
                          paddingLeft: '5%',
                          paddingRight: '5%',
                        },
                      ]}>
                      <Text
                        style={[
                          styles.text,
                          layout_styles.padding_elements_bottom,
                          layout_styles.padding_elements_top,
                          { fontFamily: Fonts.Bold },
                          // {maxWidth: screenWidth * 0.4, paddingRight: 0},
                        ]}>
                        {params?.description}
                      </Text>
                    </View>
                  )}
                  {(params?.category?.substring(0, 3) === 'hh-' || !!params?.hhlink) && <View style={[styles.strich, { backgroundColor: whiteColor, width: '75%', marginLeft: '12.5%', marginBottom: 40 }]} />}
                  {/*  */}
                  {/*  */}
                  {/* DESCRIPTION */}
                  {
                    !!params?.beschreibungE &&
                    !!params?.beschreibungD && (
                      <View
                        style={[
                          styles.inner_container_1,
                          {
                            marginBottom: 20,
                            paddingLeft: '5%',
                            paddingRight: '5%',
                          },
                        ]}>
                        <Text
                          style={[
                            styles.text,
                            layout_styles.padding_elements_bottom,
                            layout_styles.padding_elements_top,
                            { fontFamily: Fonts.Bold },
                            // {maxWidth: screenWidth * 0.4, paddingRight: 0},
                          ]}>
                          {i18n.language === 'en'
                            ? params?.beschreibungE
                            : params?.beschreibungD}
                        </Text>
                      </View>
                    )}
                  {/*  */}
                  {/*  */}
                  {/* OPENING HOURS */}
                  {!!params?.openingHoursE &&
                    !!params?.openingHoursE && (
                      <>
                        <View
                          style={[
                            styles.inner_container_1,
                            layout_styles.padding_elements_bottom,
                            layout_styles.padding_elements_top,
                            {
                              marginBottom: 20,
                              paddingLeft: '5%',
                              paddingRight: '5%',
                              flexDirection: 'column',
                            },
                          ]}>
                          <Text
                            style={[
                              styles.text,
                              { textAlign: 'center' },
                              { fontFamily: Fonts.Bold },
                            ]}>
                            {i18n.language === 'en'
                              ? params?.openingHoursE
                              : params?.openingHoursD}
                          </Text>
                        </View>
                      </>
                    )}
                  {typeof extraInfos?.open === 'boolean' &&
                    !params?.plus &&
                    !!extraInfos &&
                    extraInfos?.opening_hours && (
                      <>
                        <View
                          style={[
                            styles.inner_container_1,
                            layout_styles.padding_elements_bottom,
                            layout_styles.padding_elements_top,
                            {
                              marginBottom: 20,
                              paddingLeft: '5%',
                              paddingRight: '5%',
                              flexDirection: 'column',
                            },
                          ]}>
                          <Text
                            style={[
                              styles.text,
                              { textAlign: 'center' },
                              { fontFamily: Fonts.Bold },
                            ]}>
                            {extraInfos?.opening_hours}
                          </Text>
                        </View>
                      </>
                    )}
                  {/*  */}
                  {/*  */}
                  {/* CREATE PUBIN */}
                  <View
                    style={[
                      {
                        marginBottom: 20,
                      },
                    ]}>
                    <TouchableHighlight
                      style={[
                        styles.inner_container_1,
                        {
                          paddingVertical: 20,
                          borderWidth: 0,
                          backgroundColor: lightblue,
                        },
                      ]}
                      onPress={() => {
                        if (!mainState.user)
                          return noUserNavAfter('Pub', {
                            ...params,
                          });
                        navigation.push('NewPubIn', {
                          selectedPub: params,
                        });
                      }}>
                      <View
                        style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <PubIn_Icon styles={layout_styles.s_icon} />
                        <Text
                          style={[
                            layout_styles.normal_font,
                            { marginLeft: 10, fontSize: normalizeFontSize(12) },
                          ]}>
                          {t('createPubIn')}
                        </Text>
                      </View>
                    </TouchableHighlight>
                  </View>
                  {/*  */}
                  {/*  */}
                  {/* PUBLIC PUBBUNDLES */}
                  <>
                    {params?.bundles?.length > 0 && (
                      <>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginBottom: 5,
                          }}>
                          <Text
                            style={[
                              styles.text,
                              {
                                fontFamily: Fonts.Bold,
                              },
                            ]}>
                            PubBundles
                          </Text>
                          {params?.bundles?.length > 1 && (
                            <View
                              style={{
                                transform: [{ rotate: '180deg' }],
                                marginLeft: 5,
                              }}>
                              <Back_Icon
                                styles={layout_styles.extra_extra_s_icon}
                              />
                            </View>
                          )}
                        </View>
                        <ListItemBarBundle_Small arr={params?.bundles} />
                      </>
                    )}
                  </>
                  {/*  */}
                  {/*  */}
                  {/* SOCIALS */}
                  {(params?.instagram || params?.website) && (
                    <View
                      style={[
                        {
                          marginBottom: 20,
                          flexDirection: 'row',
                          justifyContent: 'center',
                        },
                      ]}>
                      {!!params?.instagram && (
                        <TouchableHighlight
                          onPress={() => {
                            setMainState({
                              ...mainState,
                              complete: {
                                ...mainState.complete,
                                interactions: [
                                  ...mainState.complete.interactions,
                                  {
                                    lokal_name: params?.name,
                                    lokal_id: params?.lokal_id || params?._id,
                                    action: 'instagramOpened',
                                    ...FillUpComplete(),
                                  },
                                ],
                              },
                            });
                            Linking.openURL(params?.instagram)
                          }}>
                          <Instagram_Icon />
                        </TouchableHighlight>
                      )}
                      {!!params?.website && (
                        <TouchableHighlight
                          onPress={() => {
                            let openLink = params?.website
                            if (openLink?.startsWith('http://')) {
                              openLink = `https://${openLink.replace('http://', '')}`
                            }
                            return setMainState({
                              ...mainState,
                              interactions: [
                                ...mainState.complete.interactions,
                                {
                                  lokal_name: params?.name,
                                  lokal_id: params?.lokal_id || params?._id,
                                  action: 'websiteOpened',
                                  ...FillUpComplete(),
                                },
                              ],
                              showLink: openLink
                            })
                          }}
                          style={[
                            params?.instagram
                              ? { marginLeft: screenWidth * 0.2 }
                              : {},
                          ]}>
                          <World_Icon styles={layout_styles.l_icon} />
                        </TouchableHighlight>
                      )}
                    </View>
                  )}
                </>
              )}
              {/*  */}
              {/*  */}
              {/* ADD PUB TO BUNDLE */}
              {sub === 'Pub_AddToBundle' && (
                <>
                  <>
                    <TouchableHighlight
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingTop: 5,
                        paddingBottom: 5,
                        // marginTop: 30,
                        paddingLeft: 15,
                      }}
                      onPress={() => {
                        setMainState({
                          ...mainState,
                          filters: {
                            category: [],
                            breweries: [],
                          },
                          filtersOn: false,
                          complete: {
                            ...mainState.complete,
                            interactions: [
                              ...mainState.complete.interactions,
                              {
                                lokal_name: params?.name,
                                lokal_id: params?.lokal_id || params?._id,
                                action: 'newBarBundle',
                                ...FillUpComplete(),
                              },
                            ],
                          },
                          collectPubsToPushToDB: [
                            ...mainState.collectPubsToPushToDB,
                            params?.lokal_id || params?._id,
                          ],
                        });
                        CountInteraction();
                        if (!mainState.user)
                          return noUserNavAfter('Pub', {
                            ...params,
                          });
                        navigation.push('NewPubBundle', {
                          selectedPub: params,
                        });
                      }}>
                      <>
                        <Plus_Without_Circle
                          styles={layout_styles.extra_s_icon}
                        />
                        <Text
                          style={[
                            layout_styles.font_styling_h3_Bold,
                            { marginLeft: 20 },
                          ]}>
                          {t('pub_addToBundles_newBundle')}
                        </Text>
                      </>
                    </TouchableHighlight>
                    <View style={styles.strich} />
                  </>
                  {barBundles?.map((current) => {
                    return (
                      <TouchableHighlight
                        key={current.bb_id}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          paddingTop: 5,
                          paddingBottom: 5,
                          paddingLeft: 15,
                          paddingRight: 15,
                          marginBottom: 15,
                        }}
                        onPress={() => pubBundleClick(current)}>
                        <>
                          {!mainState.user && (
                            <Heart_Icon
                              color={yellow}
                              styles={layout_styles.extra_s_icon}
                            />
                          )}
                          {current.bb_id === 'Favs' &&
                            mainState.user?.favorites.indexOf(
                              params.lokal_id || params._id,
                            ) === -1 && (
                              <Heart_Icon
                                color={yellow}
                                styles={layout_styles.extra_s_icon}
                              />
                            )}
                          {current.bb_id === 'Favs' &&
                            mainState.user?.favorites.indexOf(
                              params.lokal_id || params._id,
                            ) > -1 && (
                              <FullHeart_Icon
                                color={yellow}
                                styles={layout_styles.extra_s_icon}
                              />
                            )}
                          {current.bb_id !== 'Favs' &&
                            current.pubs.indexOf(
                              params.lokal_id || params._id,
                            ) === -1 && (
                              <BarBundle_Icon
                                styles={layout_styles.extra_s_icon}
                                color={yellow}
                              />
                            )}
                          {current.bb_id !== 'Favs' &&
                            current.pubs.indexOf(
                              params.lokal_id || params._id,
                            ) > -1 && (
                              <BarBundleFilled_Icon
                                styles={layout_styles.extra_s_icon}
                                color={yellow}
                              />
                            )}
                          <View style={{ marginRight: 'auto' }}>
                            <Text
                              style={[
                                layout_styles.font_styling_h3_Bold,
                                { marginLeft: 20 },
                              ]}>
                              {current.name}
                            </Text>
                            {current.bb_id !== 'Favs' &&
                              current.pubs.indexOf(
                                params.lokal_id || params._id,
                              ) === -1 && (
                                <Text
                                  style={[styles.small_text, { marginLeft: 20 }]}>
                                  {t('add')}
                                </Text>
                              )}
                            {current.bb_id !== 'Favs' &&
                              current.pubs.indexOf(
                                params.lokal_id || params._id,
                              ) > -1 && (
                                <Text
                                  style={[styles.small_text, { marginLeft: 20 }]}>
                                  {t('remove')}
                                </Text>
                              )}
                            {current.bb_id === 'Favs' &&
                              mainState.user?.favorites.indexOf(
                                params.lokal_id || params._id,
                              ) === -1 && (
                                <Text
                                  style={[styles.small_text, { marginLeft: 20 }]}>
                                  {t('add')}
                                </Text>
                              )}
                            {current.bb_id === 'Favs' &&
                              mainState.user?.favorites.indexOf(
                                params.lokal_id || params._id,
                              ) > -1 && (
                                <Text
                                  style={[styles.small_text, { marginLeft: 20 }]}>
                                  {t('remove')}
                                </Text>
                              )}
                          </View>
                          <TouchableHighlight
                            onPress={() => {
                              if (current.bb_id === 'Favs') {
                                setMainState({
                                  ...mainState,
                                  filters: {
                                    category: [],
                                    breweries: [],
                                  },
                                  filtersOn: false,
                                });
                                if (!mainState.user)
                                  return noUserNavAfter('Pub', {
                                    ...params,
                                  });
                                navigation.push('Favorites');
                              } else {
                                setMainState({
                                  ...mainState,
                                  filters: {
                                    category: [],
                                    breweries: [],
                                  },
                                  filtersOn: false,
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
                                if (!mainState.user)
                                  return noUserNavAfter('Pub', {
                                    ...params,
                                  });
                                navigation.push('PubBundle', {
                                  selectedPubBundle: current,
                                });
                              }
                            }}
                            style={{ padding: 7.5 }}>
                            <ElementLink_Icon
                              styles={layout_styles.extra_s_icon}
                              color={yellow}
                            />
                          </TouchableHighlight>
                        </>
                      </TouchableHighlight>
                    );
                  })}
                  <View style={{ marginBottom: screenHeight * 0.6 }} />
                </>
              )}
              {/*  */}
              {/*  */}
              {/* REPORT */}
              {sub === 'Pub_Report' && (
                <>
                  <InputTextArea
                    title={t('whatsWrong')}
                    onChange={(text) => {
                      setSearchInput(text);
                    }}
                    value={searchInput}
                    placeholder={t('yourMessage')}
                  />
                  <PrimaryButton
                    disabled={!searchInput}
                    text={t('send')}
                    buttonClicked={onSubmit}
                  />
                  <View style={{ marginBottom: screenHeight * 0.6 }} />
                </>
              )}
              <View style={{ height: screenHeight * 0.2 }} />
            </ScrollView>
            {/*  */}
            {/*  */}
            {/* BACK BTN ON SUB */}
            {!!sub && (
              <View
                style={[
                  layout_styles.padding_elements_top,
                  layout_styles.padding_elements_bottom,
                  layout_styles.just_modal_container_paddings_left_right,
                ]}>
                <TouchableHighlight
                  onPress={() => {
                    setSub(null);
                    setTimeout(() => {
                      scrollViewRef.current?.scrollTo({
                        x: 0,
                        y: 1,
                        animated: true,
                        duration: 100,
                      });
                    }, 300);
                  }}>
                  <Back_Icon />
                </TouchableHighlight>
              </View>
            )}
          </View>
        </>
      }
      overlayPfeilePub={
        <>
          {counter > 0 && (
            <>
              {counter === 1 && (
                <View
                  style={{
                    position: 'absolute',
                    zIndex: 100,
                    margin: 'auto',
                    bottom: 0,
                    top: 'auto',
                    left: mainState.locationGranted
                      ? screenWidth * 0.08
                      : screenWidth * 0.17,
                  }}>
                  <Overlay_Left_Icon styles={styles.pfeile} />
                </View>
              )}
              {counter === 2 && (
                <View
                  style={{
                    position: 'absolute',
                    zIndex: 100,
                    margin: 'auto',
                    bottom: 0,
                    top: 'auto',
                    left: mainState.locationGranted
                      ? screenWidth * 0.4
                      : screenWidth * 0.62,
                  }}>
                  {mainState.locationGranted ? (
                    <Overlay_Middle_Icon styles={styles.pfeile} />
                  ) : (
                    <Overlay_Right_Icon styles={styles.pfeile} />
                  )}
                </View>
              )}
              {counter === 3 && mainState.locationGranted && (
                <View
                  style={{
                    position: 'absolute',
                    zIndex: 100,
                    margin: 'auto',
                    bottom: 0,
                    top: 'auto',
                    left: screenWidth * 0.7,
                  }}>
                  <Overlay_Right_Icon styles={styles.pfeile} />
                </View>
              )}
            </>
          )}
        </>
      }
      navBarPub={
        <>
          {!sub && (
            <View
              style={{
                backgroundColor: darkblue,
                flexDirection: 'row',
                justifyContent: 'space-around',
                position: 'absolute',
                bottom: 0,
                zIndex: 60,
                width: '100%',
                paddingVertical: 10,
              }}>
              <TouchableOpacity onPress={navClickOne}>
                <BarBundle_Icon color={yellow} styles={styles.navBarIcons} />
              </TouchableOpacity>
              <TouchableOpacity onPress={navClickTwo}>
                <Share_Icon color={yellow} styles={styles.navBarIcons} />
              </TouchableOpacity>
              {mainState.locationGranted && (
                <TouchableOpacity onPress={onNavigate}>
                  <Navigation_Icon color={yellow} styles={styles.navBarIcons} />
                </TouchableOpacity>
              )}
            </View>
          )}
        </>
      }
      overlay={
        <>
          <ModalOverlay
            str="@FirstOpen_Pub"
            downSteps={
              mainState.locationGranted
                ? [
                  {
                    title: t('overlayPub2'),
                  },
                  {
                    title: t('overlayPub3'),
                  },
                  {
                    title: t('overlayPub4'),
                  },
                ]
                : [
                  {
                    title: t('overlayPub2'),
                  },
                  {
                    title: t('overlayPub3'),
                  },
                ]
            }
            stepUp={(num) => {
              if (typeof num === 'string') {
                setCounter(null);
              } else {
                setCounter(num + 1);
              }
            }}
            test={testOverlay}
          />
        </>
      }
    />
  );
};

export default NewPub;
