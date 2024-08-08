import React, { useContext, useEffect, useState, useRef } from 'react';
import {
  ScrollView,
  TouchableHighlight,
  View,
  Text,
  Animated,
  Share,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  NativeModules,
  Platform,
} from 'react-native';
import Fonts from '../../content/Fonts';
import {
  Back_Icon,
  BarBundle_Icon,
  Light_Edit_Icon,
  Logo_Icon,
  PinsMap_Icon,
  Report_Icon,
  Share_Icon,
  Thin_Lupe_Icon,
} from '../../content/Icons';
import MainContext from '../../context/MainContext';
import { darkblue, lightblue, whiteColor, yellow } from '../../styles/Colors';
import { ACCESS_ALLPUBS } from '@env';
import InputText from '../Inputs/InputText';
import InputTextArea from '../Inputs/InputTextArea';
import ListItemPub from '../ListItems/ListItemPub';
import layout_styles from '../../styles/Layout_Styles';
import { screenHeight } from '../../utilities/WidthAndHeight';
import PrimaryButton from '../Buttons/PrimaryButton';
import UploadPhotoWrapper from './UploadPhotoWrapper';
import PrimaryButton_Outline from '../Buttons/PrimaryButton_Outline';
import { getDistance } from 'geolib';
import EmptyList from '../EmptyList';
import { showAlert } from 'react-native-customisable-alert';
import CustomAlert from '../CustomAlert';
import { useTranslation } from 'react-i18next';
import { Emoji } from '../../content/Emoji';
import ModalHeaderNew from '../ModalHeaderNew';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import CountInteraction from '../../utilities/CountInteraction';
import {
  addPubToPubBundle,
  removePubFromPubBundle,
} from '../../utilities/UpdatePubInPubBundle';
import FillUpComplete from '../../utilities/FillUpComplete';
import { normalizeFontSize } from '../../utilities/ResFontSize';
import LayoutContainer from '../../utilities/LayoutContainer';
import ListItemFilter from '../ListItems/ListItemFilter';
import StoreValueLocally from '../../utilities/StoreValueLocally';
import MakeRequest from '../../utilities/MakeRequest';
import BaseUrl from '../../content/BaseUrl';
import decodedAndroidSharingURL from '../../utilities/decodedAndroidSharingURL';

const PubBundle = ({ route }) => {
  const { mainState, setMainState, setToast } = useContext(MainContext);
  const { t } = useTranslation();
  const { params } = route;
  const insets = useSafeAreaInsets();
  const styles = StyleSheet.create({
    container: {
      backgroundColor: darkblue,
      borderWidth: 1,
      borderColor: whiteColor,
      borderRadius: 3,
      minHeight: 100,
    },
    image: {
      height: 150,
      width: '100%',
    },
    info_container: {
      // paddingVertical: 20,
      paddingHorizontal: 30,
      paddingBottom: 20,
    },
    sub_text: {
      color: whiteColor,
      fontFamily: Fonts.Light,
      fontSize: normalizeFontSize(12), // before 14
    },
    strich: {
      backgroundColor: whiteColor,
      width: '100%',
      height: 1,
      borderRadius: 50,
    },
  });
  const animateHeight = useRef(new Animated.Value(0)).current;
  const setHeight = 0.35;
  const [collapseSliderBox, setCollapseSliderBox] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [nav, setNav] = useState('Root');
  const navigation = useNavigation();
  const [searchInputPubsInBundle, setSearchInputPubsInBundle] = useState('');
  const [reportText, setReportText] = useState('');
  const [showReport, setShowReport] = useState(false);
  const [changedPubBundle, setChangedPubBundle] = useState(null);
  const [navBarHeight, setNavBarHeight] = useState(50);
  const [placeholderHeight, setPlaceholderHeight] = useState(0);

  // Utilities
  const scrollViewRefPubsInBundle = useRef();
  const onSubmit = () => {
    setMainState({
      ...mainState,
      complete: {
        ...mainState.complete,
        mails: [
          ...mainState.complete.mails,
          {
            name: `PubBundle: ${params?.selectedPubBundle?.bb_id}`,
            adress: 'PubBundle',
            nachricht: reportText,
          },
        ],
      },
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
    setReportText('');
    setShowReport(false);
  };
  function compareNames(a, b) {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  }
  const sortAfterLatitude = (a, b) => {
    if (a.latitude > b.latitude) {
      return -1;
    } else if (a.latitude < b.latitude) {
      return 1;
    } else {
      return 0;
    }
  };
  const sortAfterLongitude = (a, b) => {
    if (a.longitude > b.longitude) {
      return -1;
    } else if (a.longitude < b.longitude) {
      return 1;
    } else {
      return 0;
    }
  };
  const compareAfterDistance = (a, b) => {
    if (a.distance > b.distance) {
      return 1;
    } else if (a.distance < b.distance) {
      return -1;
    } else {
      return 0;
    }
  };
  const handleScroll = (event) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    if (scrollY > 0 && !collapseSliderBox) {
      Animated.timing(animateHeight, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
      setCollapseSliderBox(true);
    } else if (
      scrollY <= 0 &&
      collapseSliderBox &&
      !!params?.selectedPubBundle?.pubs?.length
    ) {
      Animated.timing(animateHeight, {
        toValue: screenHeight * setHeight,
        duration: 300,
        useNativeDriver: false,
      }).start();
      setCollapseSliderBox(false);
    }
  };
  const checkIfPubIsAlreadyInBundle = (pub) => !params?.selectedPubBundle?.pubs.some(
    (current) => current === pub.lokal_id || current === pub._id
  )
  const openMaps = () => {
    if (params?.selectedPubBundle?.pubsWithFullInfo.length === 1) {
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
          latitude: params?.selectedPubBundle?.pubsWithFullInfo[0].latitude,
          longitude: params?.selectedPubBundle?.pubsWithFullInfo[0].longitude,
          latitudeDelta: laDF,
          longitudeDelta: loDF,
        },
      });
      return navigation.push('Map');
    }
    // Sort
    const sortedAfterLatitude =
      params?.selectedPubBundle?.pubsWithFullInfo.sort(sortAfterLatitude);
    const sortedAfterLongitude =
      params?.selectedPubBundle?.pubsWithFullInfo.sort(sortAfterLongitude);
    setMainState({
      ...mainState,
      pubBundlePins: params?.selectedPubBundle?.pubsWithFullInfo,
      coordsToFitToMap_Full: [
        {
          latitude: sortedAfterLatitude[0].latitude,
          longitude: sortedAfterLongitude[0].longitude,
        },
        {
          latitude:
            sortedAfterLongitude[sortedAfterLatitude.length - 1].latitude,
          longitude:
            sortedAfterLongitude[sortedAfterLongitude.length - 1].longitude,
        },
      ],
      dontAnimateToRegion: true,
    });
    navigation.push('Map', {
      map: 'PubBundles_Map',
    });
  };
  const openPub = (current) => {
    setMainState({
      ...mainState,
      regionToAnimate: {
        latitude: current.latitude,
        longitude: current.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      },
      complete: {
        ...mainState.complete,
        interactions: [
          ...mainState.complete.interactions,
          {
            lokal_name: current.name,
            lokal_id: current.lokal_id || current._id,
            action: 'clickOnIt',
            ...FillUpComplete(),
          },
        ],
      },
      collectPubsToPushToDB: [
        ...mainState.collectPubsToPushToDB,
        current.lokal_id || current._id,
      ],
    });
    CountInteraction();
    navigation.push('Pub', {
      ...current,
    });
  };
  const deletePubBundle = async () => {
    if (params?.selectedPubBundle?.public) {
      await firestore()
        .collection('publicPubBundles')
        .doc(params?.selectedPubBundle?.bb_id)
        .delete();
      const newPublicPubBundles = await firestore()
        .collection('publicPubBundles')
        .get();
      const collectData = [];
      const collectAllData = [];
      newPublicPubBundles.docs.forEach((c) => {
        if (c._data.city === mainState.activeCity) {
          collectData.push(c._data);
        }
        collectAllData.push(c._data);
      });
      setMainState({
        ...mainState,
        publicPubBundles: collectData,
        allPublicPubBundles: collectAllData,
      });
    } else {
      const newUserBundles = mainState.user?.bundles.filter(
        (c) => c.bb_id !== params?.selectedPubBundle?.bb_id,
      );
      const newUser = {
        ...mainState.user,
        bundles: newUserBundles,
      };
      await firestore().collection('users').doc(mainState.userID).update({
        bundles: newUserBundles,
      });
      setMainState({
        ...mainState,
        user: newUser,
      });
    }
    setToast({
      color: lightblue,
      text: t('pubBundleDeleted'),
    });
    navigation.replace('MyProfile');
  };
  const updatePubBundle = async () => {
    const newPubBundle = {
      ...params?.selectedPubBundle,
      ...changedPubBundle,
    };
    delete newPubBundle.pubsWithFullInfo;
    if (newPubBundle.public) {
      await firestore()
        .collection('publicPubBundles')
        .doc(newPubBundle.bb_id)
        .set(newPubBundle);

      const newPublicPubBundles = await firestore()
        .collection('publicPubBundles')
        .get();
      const collectData = [];
      const collectAllData = [];
      newPublicPubBundles.docs.forEach((c) => {
        if (c._data.city === mainState.activeCity) {
          collectData.push(c._data);
        }
        collectAllData.push(c._data);
      });
      setMainState({
        ...mainState,
        publicPubBundles: collectData,
        allPublicPubBundles: collectAllData,
      });

      await MakeRequest('POST', `${BaseUrl}/complete/pbb`, ACCESS_ALLPUBS, {
        ...newPubBundle,
      });
    } else {
      const newUserBundles = mainState.user?.bundles.filter(
        (c) =>
          typeof c === 'string' || c.bb_id !== params?.selectedPubBundle?.bb_id,
      );
      const newUser = {
        ...mainState.user,
        bundles: [...newUserBundles, newPubBundle],
      };
      await firestore()
        .collection('users')
        .doc(mainState.userID)
        .update({
          bundles: [...newUserBundles, newPubBundle],
        });
      setMainState({
        ...mainState,
        user: newUser,
      });
    }
    setToast({
      color: lightblue,
      text: t('pubBundleChanged'),
    });
    navigation.setParams({
      selectedPubBundle: {
        ...newPubBundle,
        pubsWithFullInfo: params?.selectedPubBundle?.pubsWithFullInfo,
      },
    });
    setNav('Root');
  };
  const slideUP = () => {
    Animated.timing(animateHeight, {
      toValue: 0,
      duration: 1,
      useNativeDriver: false,
    }).start();
    setCollapseSliderBox(true);
  };

  // Hooks
  useEffect(() => {
    if (searchInputPubsInBundle) {
      // Check if scroll is
      scrollViewRefPubsInBundle.current?.scrollTo({
        x: 0,
        y: 0,
        animated: true,
        duration: 100,
      });
    }
  }, [searchInputPubsInBundle]);
  useEffect(() => {
    Animated.timing(animateHeight, {
      toValue: screenHeight * setHeight,
      duration: 1,
      useNativeDriver: false,
    }).start();
    return () => {
      setShowReport(false);
      setSearchInputPubsInBundle('');
      setCollapseSliderBox(false);
    };
  }, []);
  useEffect(() => {
    if (nav === 'Root') {
      const collectPubsWithFullInfo = [];
      mainState.kneipen.forEach((current) => {
        const getID = current.lokal_id || current._id;
        if (params?.selectedPubBundle?.pubs.indexOf(getID) > -1) {
          if (mainState.locationGranted) {
            const distance = getDistance(
              {
                latitude: mainState.userLocation.latitude,
                longitude: mainState.userLocation.longitude,
              },
              { latitude: current.latitude, longitude: current.longitude },
            );
            const distanceKM1 = Math.ceil(distance / 100);
            const distanceKM2 = distanceKM1 / 10;
            collectPubsWithFullInfo.push({
              ...current,
              distance,
              distanceDisplay:
                distance > 1000
                  ? t('distance', { distance: `${distanceKM2}km` })
                  : t('distance', { distance: `${distance}m` }),
            });
          } else {
            collectPubsWithFullInfo.push(current);
          }
        }
      });
      navigation.setParams({
        selectedPubBundle: {
          ...params?.selectedPubBundle,
          pubsWithFullInfo: collectPubsWithFullInfo,
        },
      });
    }
    setChangedPubBundle(params?.selectedPubBundle);
  }, [nav]);

  useEffect(() => {
    if (showReport) {
      slideUP();
    }
  }, [showReport]);

  const subtractOnAndroid = Platform.OS === 'android' ? 0 : insets.bottom;

  return (
    <LayoutContainer
      bundleIMG={
        (nav === 'Root' || nav === 'Add') &&
          !!params?.selectedPubBundle?.imgURL &&
          params?.selectedPubBundle?.imgURL !==
          'https://i.ibb.co/6RqCCJJ/Banner-Default-1.jpg'
          ? params?.selectedPubBundle?.imgURL
          : null
      }
      animateHeight={animateHeight}
      showBanner={!collapseSliderBox}
      content={
        <>
          {/*  */}
          {/*  */}
          {/* Add Container */}
          {nav === 'Add' && nav !== 'Edit' && (
            <>
              <View style={{ marginTop: 20 }} />
              <InputText
                title={t('addPubsToBundle')}
                value={searchInputPubsInBundle}
                onChange={(text) => setSearchInputPubsInBundle(text)}
                placeholder={t('searchNumber', {
                  num: mainState.kneipen.length,
                })}
              />
              <View style={{ marginTop: 20 }} />
            </>
          )}
          {/*  */}
          {/*  */}
          {/* Content */}
          {!showReport && nav !== 'Edit' && (
            <ScrollView
              scrollEnabled={true}
              showsVerticalScrollIndicator={false}
              ref={scrollViewRefPubsInBundle}
              onScroll={handleScroll}
              scrollEventThrottle={16}
              style={{
                paddingTop: nav === 'Add' ? 0 : collapseSliderBox ? 60 : 30,
              }}>
              <View
                onLayout={(evt) => {
                  const { height: layoutHeight } = evt.nativeEvent.layout;
                  const collectHeight =
                    screenHeight -
                    layoutHeight -
                    navBarHeight -
                    insets.top -
                    insets.bottom;
                  if (placeholderHeight !== layoutHeight && collectHeight > 0) {
                    setPlaceholderHeight(collectHeight + screenHeight * 0.2);
                  }
                }}>
                {nav !== 'Add' && nav !== 'Edit' && !showReport && (
                  <>
                    <View style={styles.info_container}>
                      <Text
                        style={[
                          layout_styles.font_styling_h1,
                          { marginBottom: 7.5 },
                        ]}>
                        {params?.selectedPubBundle?.name}
                      </Text>
                      {!!params?.selectedPubBundle?.info && (
                        <Text style={[styles.sub_text, { marginBottom: 7.5 }]}>
                          {params?.selectedPubBundle?.info}
                        </Text>
                      )}
                      {params?.selectedPubBundle?.pubCount > 0 && (
                        <Text
                          style={[
                            styles.sub_text,
                            { fontFamily: Fonts.Bold, marginBottom: 7.5 },
                          ]}>
                          {params?.selectedPubBundle?.pubCount > 1
                            ? `${params?.selectedPubBundle?.pubCount} Pubs`
                            : `${params?.selectedPubBundle?.pubCount} Pub`}
                        </Text>
                      )}
                      {mainState.partners.some(
                        (c) => c.partnerID === params?.selectedPubBundle?.admin,
                      ) && (
                          <ListItemFilter
                            title={
                              mainState.partners.find(
                                (c) =>
                                  c.partnerID ===
                                  params?.selectedPubBundle?.admin,
                              )?.name
                            }
                            imgURL={
                              mainState.partners.find(
                                (c) =>
                                  c.partnerID ===
                                  params?.selectedPubBundle?.admin,
                              )?.profileIMG
                            }
                            partnerID={params?.selectedPubBundle?.admin}
                            clickOnPartnerFromFilters={
                              params?.selectedPubBundle?.admin
                            }
                            tight
                          />
                        )}
                    </View>
                    <View style={styles.strich} />
                  </>
                )}
                {!params?.selectedPubBundle?.pubsWithFullInfo?.length &&
                  nav !== 'Add' && (
                    <EmptyList
                      title={t('emptyPubBundle')}
                      sub={t('emptyPubBundleMsg')}
                      marginTop={30}
                    />
                  )}
                {nav !== 'Root' && (
                  <>
                    {!!searchInputPubsInBundle && (
                      <>
                        {mainState.kneipen
                          .filter((current) => {
                            if (
                              (!current.category.includes('citymarker') &&
                                current.category !== 'districtmarker' &&
                                !searchInputPubsInBundle &&
                                checkIfPubIsAlreadyInBundle(current)) ||
                              (!current.category.includes('citymarker') &&
                                current.category !== 'districtmarker' &&
                                searchInputPubsInBundle !== '' &&
                                current.name
                                  .toLowerCase()
                                  .includes(
                                    searchInputPubsInBundle
                                      .toLowerCase()
                                      .trim(),
                                  ) &&
                                checkIfPubIsAlreadyInBundle(current))
                            )
                              return current;
                          })
                          .sort(compareNames)
                          .map((current) => (
                            <ListItemPub
                              key={current._id}
                              current={current}
                              buttonClicked={() =>
                                addPubToPubBundle(
                                  current,
                                  {
                                    mainState,
                                    params,
                                  },
                                  (newMainState, newPubBundle) => {
                                    setMainState(newMainState);
                                    setToast({
                                      color: lightblue,
                                      text: t('pubBundlePubAdded'),
                                    });
                                    const getID = current.lokal_id
                                      || current._id;
                                    const newPubWithFullInfo =
                                      mainState.kneipen.find(
                                        (c) =>
                                          c.lokal_id === getID ||
                                          c._id === getID,
                                      );
                                    if (mainState.locationGranted) {
                                      const distance = getDistance(
                                        {
                                          latitude:
                                            mainState.userLocation.latitude,
                                          longitude:
                                            mainState.userLocation.longitude,
                                        },
                                        {
                                          latitude: current.latitude,
                                          longitude: current.longitude,
                                        },
                                      );
                                      const distanceKM1 = Math.ceil(
                                        distance / 100,
                                      );
                                      const distanceKM2 = distanceKM1 / 10;
                                      newPubWithFullInfo.distance = distance;
                                      newPubWithFullInfo.distanceDisplay =
                                        distance > 1000
                                          ? t('distance', {
                                            distance: `${distanceKM2}km`,
                                          })
                                          : t('distance', {
                                            distance: `${distance}m`,
                                          });
                                    }
                                    navigation.setParams({
                                      selectedPubBundle: {
                                        ...newPubBundle,
                                        pubs: newPubBundle.pubs.filter(
                                          (c) => !!c,
                                        ),
                                        pubsWithFullInfo: [
                                          ...params?.selectedPubBundle
                                            .pubsWithFullInfo,
                                          newPubWithFullInfo,
                                        ],
                                      },
                                    });
                                  },
                                )
                              }
                            />
                          ))}
                      </>
                    )}
                    {!!searchInputPubsInBundle &&
                      !mainState.kneipen.filter((current) => {
                        if (
                          !current.category.includes('citymarker') &&
                          current.category !== 'districtmarker' &&
                          !searchInputPubsInBundle &&
                          checkIfPubIsAlreadyInBundle(current)
                        ) {
                          return current;
                        } else if (
                          !current.category.includes('citymarker') &&
                          current.category !== 'districtmarker' &&
                          searchInputPubsInBundle !== '' &&
                          current.name
                            .toLowerCase()
                            .includes(
                              searchInputPubsInBundle.toLowerCase().trim(),
                            ) &&
                          checkIfPubIsAlreadyInBundle(current)
                        ) {
                          return current;
                        }
                      }).length && (
                        <EmptyList
                          title={t('noResults')}
                          sub={t('keepOnSearching')}
                          marginTop={30}
                        />
                      )}
                    {!searchInputPubsInBundle && (
                      <EmptyList
                        title={t('inputSomething')}
                        // sub={t('keepOnSearching')}
                        marginTop={30}
                      />
                    )}
                    <View style={{ marginBottom: screenHeight * 0.5 }} />
                  </>
                )}
                {!!params?.selectedPubBundle?.pubsWithFullInfo?.length &&
                  nav !== 'Add' && (
                    <>
                      <View style={{ marginTop: 15, paddingHorizontal: 30 }}>
                        {params?.selectedPubBundle?.pubsWithFullInfo
                          .sort(
                            mainState.locationGranted &&
                              !!params?.selectedPubBundle?.pubsWithFullInfo[0]
                                ?.distanceDisplay
                              ? compareAfterDistance
                              : compareNames,
                          )
                          .map((current) => {
                            return (
                              <ListItemPub
                                key={current._id || Math.random()}
                                current={current}
                                buttonClicked={() => openPub(current)}
                                withCross={
                                  params?.selectedPubBundle?.admin ===
                                  mainState.userID
                                }
                                crossClicked={() =>
                                  removePubFromPubBundle(
                                    current,
                                    {
                                      mainState,
                                      params,
                                    },
                                    (newMainState, newPubBundle) => {
                                      const getID = current.lokal_id
                                        || current._id;
                                      setToast({
                                        color: lightblue,
                                        text: t('pubBundlePubRemoved'),
                                      });
                                      setMainState(newMainState);
                                      navigation.setParams({
                                        selectedPubBundle: {
                                          ...newPubBundle,
                                          pubs: newPubBundle.pubs.filter(
                                            (c) => !!c,
                                          ),
                                          pubsWithFullInfo: [
                                            ...params?.selectedPubBundle?.pubsWithFullInfo.filter(
                                              (c) =>
                                                c.lokal_id !== getID &&
                                                c._id !== getID,
                                            ),
                                          ],
                                        },
                                      });
                                    },
                                  )
                                }
                                setSub={
                                  mainState.locationGranted
                                    ? current.distanceDisplay
                                    : null
                                }
                              />
                            );
                          })}
                      </View>
                    </>
                  )}
              </View>
              {nav === 'Root' &&
                params?.selectedPubBundle?.pubsWithFullInfo?.length < 13 &&
                !!placeholderHeight && (
                  <View
                    style={{
                      height: placeholderHeight,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Logo_Icon
                      color={whiteColor}
                      styles={layout_styles.l_icon}
                    />
                  </View>
                )}
            </ScrollView>
          )}
          {/*  */}
          {/*  */}
          {/* NavBar */}
          {nav === 'Root' && !showReport && (
            <View
              style={[
                layout_styles.STNavbar,
                { zIndex: 51, width: '100%', backgroundColor: darkblue },
                !collapseSliderBox &&
                  params?.selectedPubBundle?.pubsWithFullInfo?.length > 0 &&
                  !!params?.selectedPubBundle?.imgURL &&
                  params?.selectedPubBundle?.imgURL !==
                  'https://i.ibb.co/6RqCCJJ/Banner-Default-1.jpg'
                  ? {
                    position: 'absolute',
                    top:
                      screenHeight -
                      screenHeight * setHeight -
                      navBarHeight -
                      subtractOnAndroid,
                    left: layout_styles.content_container.paddingLeft,
                  }
                  : {},
                // layout_styles.padding_elements_top,
              ]}
              onLayout={(evt) => {
                const { height: layoutHeight } = evt.nativeEvent.layout;
                setNavBarHeight(layoutHeight);
              }}>
              {/* Edit PubBundle */}
              {mainState.userID === params?.selectedPubBundle?.admin && (
                <TouchableHighlight
                  style={layout_styles.STNavbar_Button}
                  onPress={() => setNav('Edit')}>
                  <Light_Edit_Icon styles={layout_styles.s_icon} />
                </TouchableHighlight>
              )}
              {/* Show Pubs on Map */}
              {params?.selectedPubBundle?.pubsWithFullInfo?.length > 0 && (
                <TouchableHighlight
                  style={[layout_styles.STNavbar_Button]}
                  onPress={openMaps}>
                  <PinsMap_Icon styles={layout_styles.s_icon} color={yellow} />
                </TouchableHighlight>
              )}
              {/* Add to PubBundle */}
              {mainState.userID === params?.selectedPubBundle?.admin && (
                <TouchableHighlight
                  style={layout_styles.STNavbar_Button}
                  onPress={() => {
                    slideUP();
                    setNav('Add');
                  }}>
                  <Thin_Lupe_Icon styles={layout_styles.s_icon} />
                </TouchableHighlight>
              )}
              {/* Report PubBundle */}
              {mainState.userID !== params?.selectedPubBundle?.admin &&
                nav === 'Root' && (
                  <TouchableHighlight
                    style={[layout_styles.STNavbar_Button]}
                    onPress={() => setShowReport(true)}>
                    <Report_Icon color={yellow} styles={layout_styles.s_icon} />
                  </TouchableHighlight>
                )}
              {/* Share PubBundle */}
              <TouchableHighlight
                style={[layout_styles.STNavbar_Button]}
                onPress={() => {
                  if (Platform.OS === 'android') {
                    StoreValueLocally('@DontTrackAppChange', 'True');
                  }
                  setTimeout(() => {
                    Share.share({
                      title: t('shareThePubBundle'),
                      message:
                        Platform.OS === 'android'
                          ? decodedAndroidSharingURL(
                            t('shareThePubBundleMsg', {
                              name: params?.selectedPubBundle?.name,
                              url: `https://www.pub-up.de/barbundle/${params?.selectedPubBundle?.bb_id}`,
                            }),
                          )
                          : t('shareThePubBundleMsgWithOutURL', {
                            name: params?.selectedPubBundle?.name,
                          }),
                      url: `https://www.pub-up.de/barbundle/${params?.selectedPubBundle?.bb_id}`,
                    });
                    setMainState({
                      ...mainState,
                      complete: {
                        ...mainState.complete,
                        bbInteractions: [
                          ...mainState.complete.bbInteractions,
                          {
                            bb_id: params?.selectedPubBundle?.bb_id,
                            action: `share`,
                          },
                        ],
                      },
                    });
                  }, 500);
                }}>
                <Share_Icon styles={layout_styles.s_icon} color={yellow} />
              </TouchableHighlight>
            </View>
          )}
          {/*  */}
          {/*  */}
          {/* Report */}
          {showReport && (
            <ScrollView
              scrollEnabled={true}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="never">
              <>
                {/* <View style={{marginBottom: 60}} /> */}
                <InputTextArea
                  title={t('whatsWrong')}
                  onChange={(text) => {
                    setReportText(text);
                  }}
                  value={reportText}
                  placeholder={t('yourMessage')}
                  marginTop={0}
                />
                <PrimaryButton
                  disabled={!reportText}
                  text={t('send')}
                  buttonClicked={onSubmit}
                />
              </>
            </ScrollView>
          )}
          {/*  */}
          {/*  */}
          {/* EDIT */}
          {nav === 'Edit' && (
            <>
              <ScrollView
                scrollEnabled={true}
                showsVerticalScrollIndicator={false}>
                <>
                  <InputText
                    title={t('pubBundleName')}
                    value={changedPubBundle.name}
                    onChange={(text) =>
                      setChangedPubBundle({
                        ...changedPubBundle,
                        name: text,
                      })
                    }
                    placeholder="Name"
                  />
                  <InputTextArea
                    title={t('pubBundleDesc')}
                    value={changedPubBundle.info}
                    marginTop={30}
                    onChange={(text) =>
                      setChangedPubBundle({
                        ...changedPubBundle,
                        info: text,
                      })
                    }
                    placeholder="Info"
                  />
                  <View style={{ marginBottom: 30 }} />
                  <UploadPhotoWrapper
                    showLoading={showLoading}
                    displayURL={changedPubBundle.imgURL}
                    showImage={
                      !!changedPubBundle &&
                      changedPubBundle.imgURL &&
                      !showLoading
                    }
                    setShowLoading={setShowLoading}
                    setDisplayURL={(link) =>
                      setChangedPubBundle({
                        ...changedPubBundle,
                        imgURL: link,
                      })
                    }
                    changePhoto={true}
                  />
                </>
              </ScrollView>
              <PrimaryButton
                disabled={
                  (params?.selectedPubBundle?.name === changedPubBundle.name &&
                    params?.selectedPubBundle?.info === changedPubBundle.info &&
                    params?.selectedPubBundle?.imgURL ===
                    changedPubBundle.imgURL) ||
                  !changedPubBundle.name ||
                  showLoading
                }
                text={t('save')}
                buttonClicked={updatePubBundle}
              />
              <PrimaryButton_Outline
                text={t('delete')}
                buttonClicked={async () =>
                  showAlert({
                    alertType: 'custom',
                    customAlert: (
                      <CustomAlert
                        title={t('sure')}
                        sub={t('undone')}
                        icon={<BarBundle_Icon styles={layout_styles.l_icon} />}
                        click={deletePubBundle}
                        buttonWordingYes={t('delete')}
                      />
                    ),
                  })
                }
                setMarginTop={17.5}
              />
            </>
          )}
          {/*  */}
          {/*  */}
          {/* Back Button Left Bottom */}
          {((nav === 'Root' && showReport) ||
            nav === 'Add' ||
            nav === 'Edit') && (
              <>
                <View
                  style={[
                    // styles.inner_container_3,
                    layout_styles.padding_elements_top,
                    // layout_styles.padding_elements_bottom,
                  ]}>
                  <TouchableHighlight
                    onPress={() => {
                      setNav('Root');
                      /* if (nav === 'Add') {
              } else if (nav === 'Add') {
                setNav('Root');
              } */
                      setShowReport(false);
                    }}>
                    <Back_Icon />
                  </TouchableHighlight>
                </View>
              </>
            )}
        </>
      }
    />
  );
};

export default PubBundle;
