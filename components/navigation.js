import {
  AppState,
  Linking,
  Modal,
  TouchableHighlight,
  View,
  StatusBar,
  Platform
} from 'react-native';
import { ACCESS_ALLPUBS, ACCESS_GET_KNEIPE, ACCESS_BARBUNDLES } from '@env';
import Map from './Screens/Map';
import { createStackNavigator } from '@react-navigation/stack';
import MainContext from '../context/MainContext';
import React, { useEffect, useRef, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Menu from './Screens/Menu';
import MakeRequest from '../utilities/MakeRequest';
import BaseUrl from '../content/BaseUrl';
import GetValueLocally from '../utilities/GetValueLocally';
import retrieveEncryptedStorage from '../utilities/GetEncryptedStorage';
import storeEncryptedStorage from '../utilities/AddEncryptedStorage';
import StoreValueLocally from '../utilities/StoreValueLocally';
import GetLocationPermission from '../utilities/GetLocationPermission';
import AskLocationGranted from './Onboarding/AskLocationGranted';
import AskNotificationGranted from './Onboarding/AskNotificationGranted';
import GetID from '../utilities/GetID';
import OneSignalSetup from '../utilities/OneSignalSetup';
import WelcomeOverlay from './Onboarding/WelcomeOverlay';
import GetUserLocation from '../utilities/GetUserLocation';
import GetCity from '../utilities/GetCity';
import Overlay from './Onboarding/Overlay';
import Loading from './Loading';
import Form from './Screens/Form';
import AddMarkerToKneipen from '../utilities/AddMarkerToKneipen';
import GetCities from '../utilities/GetCities';
import Search from './Screens/Search';
import AllFilters from './Screens/AllFilters';
import ResultsList from './Screens/ResultsList';
import Toast from './Buttons/Toast';
import firestore from '@react-native-firebase/firestore';
import Login from './Profile/Login';
import auth from '@react-native-firebase/auth';
import { darkblue, green, lightblue, red, whiteColor } from '../styles/Colors';
import Register from './Profile/Register';
import MyProfile from './Profile/MyProfile';
import Password from './Profile/Password';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import ChooseCityAgain from './ChooseCityAgain';
import GetCityCenter from '../utilities/GetCityCenter';
import { navigate, navigationRef } from '../utilities/CreateNavigationRef';
import { showAlert } from 'react-native-customisable-alert';
import CustomAlert from './CustomAlert';
import { Emoji } from '../content/Emoji';
import layout_styles from '../styles/Layout_Styles';
import WebView from 'react-native-webview';
import { screenHeight, screenWidth } from '../utilities/WidthAndHeight';
import PubBundle from './Favorites_Components/PubBundle';
import NewPubBundle from './Favorites_Components/NewPubBundle';
import Favorites from './Favorites_Components/Favorites';
import NewPubIn from './Screens/NewPubIn';
import Profile from './Profile/Profile';
import GetEntireProfile from '../utilities/GetEntireProfile';
import PubIn from './Screens/PubIn';
import Partner from './Screens/Partner';
import { Back_Icon, Cross_Icon, ElementLink_Icon } from '../content/Icons';
import PartnerItem from './Screens/PartnerItem';
import PartnerOverview from './Screens/PartnerOverview';
import FillUpComplete from '../utilities/FillUpComplete';
import GetLanguage from '../utilities/GetLanguage';
import i18next from 'i18next';
import GlobalMessage from './GlobalMessage';
import GetIMGSize from '../utilities/GetIMGSize';
import ClearItemFromAsyncStorage from '../utilities/ClearItemFromAsyncStorage';
import SentPush from '../utilities/SentPush';
import PushTexts from '../content/PushTexts';
import { getDistance } from 'geolib';
import QRCode from './Screens/QRCode';
import OneSignal from 'react-native-onesignal';
import NewPub from './Screens/NewPub';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Navigators() {
  const [mainState, setMainState] = useState({
    nav: null,
    kneipen: [],
    cities: [],
    mainCities: [
      'Berlin',
      'Hamburg',
      'München',
      'Köln',
      'Frankfurt am Main',
      'Leipzig',
      'Heidelberg',
      'Münster',
      'Dortmund',
      'Bonn',
    ],
    partners: [],
    showLink: null,
    activeCity: null,
    locationGranted: false,
    userLocation: {
      latitude: null,
      longitude: null,
    },
    filters: {
      category: [],
      breweries: [],
    },
    clusterFilters: {
      category: [],
      breweries: [],
    },
    navigation: {
      destination: null,
      distance: null,
    },
    regionToAnimate: {
      latitude: 51.30587154654041,
      longitude: 10.36651481083793,
      latitudeDelta: 10,
      longitudeDelta: 10,
    },
    coordsToFitToMap: {
      latitude: null,
      longitude: null,
    },
    coordsToFitToMap_Full: [],
    radiusWorld: 5,
    randomNumber: Math.floor(Math.random() * Math.floor(4)),
    complete: {
      interactions: [],
      filterSearches: [],
      mails: [],
      newentries: [],
      bbInteractions: [],
      partnerInteractions: [],
      counterUsers: [],
    },
    userID: null,
    user: null,
    skipOverlay: false,
    globalMSG: {},
    publicPubBundles: [],
    allPublicPubBundles: [],
    pubBundlePins: [],
    navAfterProfileCreate: null,
    collectPubsToPushToDB: [],
    dontAnimateToRegion: null,
  });
  const emptyComplete = {
    interactions: [],
    filterSearches: [],
    mails: [],
    newentries: [],
    bbInteractions: [],
    partnerInteractions: [],
    counterUsers: [],
  }
  const [showLoading, setShowLoading] = useState(false);
  const [modalURL, setModalURL] = useState(mainState.showLink);
  const [toast, setToast] = useState({
    text: '',
    color: lightblue,
  });
  const Stack = createStackNavigator();
  const linkRef = useRef();
  const initialUrlWasAlreadyUsed = useRef(false);
  const { t } = useTranslation();
  const useBackgroundURL = useRef(false);
  const navRef = useRef();
  const getCanGoBack = useRef();

  // Utilities
  const sendAllInformation = async () => {
    if (
      !mainState.complete.interactions.length &&
      !mainState.complete.filterSearches.length &&
      !mainState.complete.mails.length &&
      !mainState.complete.newentries.length &&
      !mainState.complete.bbInteractions.length &&
      !mainState.complete.partnerInteractions.length &&
      !mainState.complete.counterUsers.length &&
      !mainState.collectPubsToPushToDB.length
    )
      return console.log('Nothing To Send');
    try {
      const resCompleteSent = await GetValueLocally('@CompleteWasSent');
      if (!!resCompleteSent) return;
      StoreValueLocally('@CompleteWasSent', 'True');
      if (false) {
        await MakeRequest(
          'POST',
          `${BaseUrl}/complete/refactored`,
          ACCESS_ALLPUBS,
          {
            ...mainState.complete
          },
        );
      }
      if (!!mainState.collectPubsToPushToDB.length && !!mainState.user) {
        const newPubsForUser = [
          ...mainState.collectPubsToPushToDB,
          ...mainState.user?.pubs,
        ];
        await firestore().collection('users').doc(mainState.userID).update({
          pubs: newPubsForUser,
        });
      }
    } catch (err) {
      console.log('Error in SendAllInformation', err);
    }
  };
  const checkForInitialLink = () => {
    return new Promise(async (resolve) => {
      const initialUrl = await Linking.getInitialURL();
      if (!!initialUrl) {
        initialUrlWasAlreadyUsed.current = true;
        resolve(initialUrl);
      } else resolve('NoURL');
    });
  };
  const transformLink = (url) => {
    // if (!url.startsWith('https://www.')) return `https://www.${url}`;
    if (url.startsWith('http://')) return `https://${url.replace('http://', '')}`;
    if (!url.startsWith('https://')) return `https://${url}`;
    return url;
  };

  function getDistanceForEach(el) {
    let distance = getDistance(
      {
        latitude: mainState.userLocation.latitude,
        longitude: mainState.userLocation.longitude,
      },
      { latitude: el.latitude, longitude: el.longitude },
    );
    return distance;
  }
  function getDistanceDisplayForEach(el) {
    let distance = getDistance(
      {
        latitude: mainState.userLocation.latitude,
        longitude: mainState.userLocation.longitude,
      },
      { latitude: el.latitude, longitude: el.longitude },
    );
    let distanceKM1 = Math.ceil(distance / 100);
    let distanceKM2 = distanceKM1 / 10;
    if (distance > 1000) {
      return t('distance', {
        distance: `${distanceKM2}km`,
      });
    } else {
      return t('distance', {
        distance: `${distance}m`,
      });
    }
  }

  // Get Data from MongoDB
  const getAndSetMongoDBData = async () => {
    try {
      const resp = await axios.get(`${BaseUrl}/complete/refactored`, {
        headers: {
          authorization: `Bearer ${ACCESS_ALLPUBS}`,
        },
      });
      if (resp.data) {
        StoreValueLocally('@allPubs', resp.data.kneipen);
        const kneipenWithMarker = await AddMarkerToKneipen(resp.data.kneipen);
        const allCities = GetCities(kneipenWithMarker);
        return {
          kneipen: kneipenWithMarker,
          globalMSG: resp.data.globalMessage,
          cities: allCities,
        };
      }
    } catch {
      const localPubs = await GetValueLocally('@allPubs');
      if (!localPubs) {
        return {
          kneipen: [],
          globalMSG: {
            de: t('appError'),
            en: t('appError'),
          },
          cities: [],
        };
      } else {
        const kneipenWithMarker = await AddMarkerToKneipen(localPubs);
        const allCities = GetCities(kneipenWithMarker);
        return {
          kneipen: kneipenWithMarker,
          globalMSG: {},
          cities: allCities,
        };
      }
    }
  };

  const alreadyFriends = () =>
    showAlert({
      alertType: 'custom',
      customAlert: (
        <CustomAlert
          title={t('alreadyFriends')}
          icon={<Emoji emoji="love" styles={layout_styles.l_icon} />}
        />
      ),
    });
  const noUser = () =>
    showAlert({
      alertType: 'custom',
      customAlert: (
        <CustomAlert
          title={t('loginMsg')}
          sub={t('registerNow')}
          icon={<Emoji emoji="love" styles={layout_styles.l_icon} />}
          click={() => {
            navigate('Register');
          }}
          buttonWordingNo={t('noThanks')}
          buttonWordingYes={t('register')}
        />
      ),
    });
  const noUserNavAfter = (setRoute, setP) =>
    showAlert({
      alertType: 'custom',
      customAlert: (
        <CustomAlert
          title={t('loginMsg')}
          sub={t('registerNow')}
          icon={<Emoji emoji="love" styles={layout_styles.l_icon} />}
          click={() => {
            setMainState({
              ...mainState,
              navAfterProfileCreate: {
                route: setRoute,
                params: setP,
              },
            });
            navigate('Register');
          }}
          buttonWordingNo={t('noThanks')}
          buttonWordingYes={t('register')}
        />
      ),
    });
  const noUserButCode = (code) =>
    showAlert({
      alertType: 'custom',
      customAlert: (
        <CustomAlert
          title={t('loginMsg')}
          sub={t('registerNow')}
          icon={<Emoji emoji="love" styles={layout_styles.l_icon} />}
          clicks={[
            {
              text: t('login'),
              click: () => {
                setMainState({
                  ...mainState,
                  navAfterProfileCreateCode: code
                });
                navigate('Login');
              }
            },
            {
              text: t('register'),
              click: () => {
                setMainState({
                  ...mainState,
                  navAfterProfileCreateCode: code
                });
                navigate('Register');
              },
            },
          ]}
        />
      ),
    });
  const noUserNoInteraction = () =>
    showAlert({
      alertType: 'custom',
      customAlert: (
        <CustomAlert
          title={t('loginMsg')}
          sub={t('registerNowNoLink')}
          icon={<Emoji emoji="love" styles={layout_styles.l_icon} />}
        />
      ),
    });

  // Handle Deep Link
  const handleDeepLink = async (url, newMainState) => {
    if (url.includes('entry')) {
      // Pub
      const ID = url.substring(url.indexOf('entry/') + 6, url.length);
      const pub = await MakeRequest(
        'GET',
        `${BaseUrl}/kneipe/withid?id=${ID}`,
        ACCESS_GET_KNEIPE,
      );
      return {
        navTo: 'Pub',
        setParams: {
          ...pub,
        },
        state: {
          regionToAnimate: {
            latitude: pub.latitude,
            longitude: pub.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          },
          filters: {
            category: [],
            breweries: [],
          },
          filtersOn: false,
        },
        addInteraction: {
          lokal_name: pub.name,
          lokal_id: pub.lokal_id || pub._id,
          action: 'deepLinkOpened',
          ...FillUpComplete(),
        },
      };
    } else if (url.includes('barbundle')) {
      // PubBundle
      const ID = url.substring(url.indexOf('barbundle/') + 10, url.length);
      const bundle = await MakeRequest(
        'GET',
        `${BaseUrl}/complete/bundle?id=${ID}`,
        ACCESS_BARBUNDLES,
      );
      if (!bundle) return 'NotFound';
      return {
        navTo: 'PubBundle',
        setParams: {
          selectedPubBundle: bundle,
        },
        addBBInteraction: {
          bb_id: bundle.bb_id,
          action: 'deepLinkOpened',
        },
      };
    } else if (url.includes('people/pubin')) {
      const userIDPubIn = url.substring(
        url.indexOf('pubin') + 5,
        url.indexOf('_'),
      );
      const pubin_id = url.substring(url.indexOf('_') + 1, url.length);
      if (!userIDPubIn || !pubin_id) return 'NotFound';
      if (!newMainState.user) {
        noUser();
      }
      if (
        !!newMainState.user &&
        (userIDPubIn === newMainState.userID ||
          newMainState.user?.friends?.some(
            (c) => c.friend1 === userIDPubIn || c.friend2 === userIDPubIn,
          ))
      ) {
        let findFriendsPubIn;
        if (userIDPubIn !== newMainState.userID) {
          findFriendsPubIn = await GetEntireProfile(userIDPubIn, true);
        }
        const selectedPubIn =
          newMainState.user?.pub_ins?.find((c) => c.pubin_id === pubin_id) ||
          findFriendsPubIn?.pub_ins?.find((c) => c.pubin_id === pubin_id);
        if (!selectedPubIn) return 'NotFound';
        return {
          navTo: 'PubIn',
          setParams: {
            selectedPubIn,
          },
        };
      }
      // return 'NotFound';
    } else if (url.includes('people')) {
      // People
      const ID = url.substring(url.indexOf('people/') + 7, url.length);
      if (!newMainState.user) {
        // No User
        noUser();
      } else if (!!newMainState.user && ID === newMainState.userID) {
        // That's the User itself
        showAlert({
          alertType: 'custom',
          customAlert: (
            <CustomAlert
              title={t('yourself')}
              icon={<Emoji emoji="drunk" styles={layout_styles.l_icon} />}
            />
          ),
        });
      } else {
        let findPerson = await firestore().collection('users').doc(ID).get();
        findPerson = findPerson._data;
        if (!findPerson) return 'NotFound';
        const findFriendRequestOne = await firestore()
          .collection('friends')
          .where('friend1', '==', newMainState.userID)
          .where('friend2', '==', ID)
          .get();
        if (
          !!findFriendRequestOne.docs?.length &&
          findFriendRequestOne.docs[0]?._data?.accepted
        ) {
          // Already Friends
          alreadyFriends();
          return {
            navTo: 'MyProfile',
          };
        } else if (!!findFriendRequestOne.docs?.length) {
          // That is a Friend Request that the User sent
          showAlert({
            alertType: 'custom',
            customAlert: (
              <CustomAlert
                title={t('openFriendsRequest')}
                icon={<Emoji emoji="love" styles={layout_styles.l_icon} />}
              />
            ),
          });
        } else {
          const findFriendRequestTwo = await firestore()
            .collection('friends')
            .where('friend1', '==', ID)
            .where('friend2', '==', newMainState.userID)
            .get();
          if (
            !!findFriendRequestTwo.docs?.length &&
            findFriendRequestTwo.docs[0]?._data?.accepted
          ) {
            // Already Friends
            alreadyFriends();
            return {
              navTo: 'MyProfile',
            };
          } else if (!!findFriendRequestTwo.docs?.length) {
            showAlert({
              alertType: 'custom',
              customAlert: (
                <CustomAlert
                  title={t('acceptFriendsRequest')}
                  sub={t('acceptFriendsRequestMsg', {
                    name: findPerson.username,
                  })}
                  icon={<Emoji emoji="love" styles={layout_styles.l_icon} />}
                  click={async () => {
                    try {
                      let getFriendRequest = await firestore()
                        .collection('friends')
                        .where('friend1', '==', ID)
                        .where('friend2', '==', newMainState.userID)
                        .get();
                      const uid =
                        getFriendRequest.docs[0]?._ref._documentPath._parts[1];
                      await firestore().collection('friends').doc(uid).update({
                        accepted: true,
                      });
                      // Open User Profile
                      const getUser = await GetEntireProfile(ID, true);
                      setMainState({
                        ...newMainState,
                        user: {
                          ...newMainState.user,
                          openFriendsRequests: [
                            ...newMainState.user?.openFriendsRequests?.filter(
                              (c) =>
                                c.friend1 !== ID &&
                                c.friend2 !== newMainState.userID,
                            ),
                          ],
                          friends: [
                            ...newMainState.user?.friends,
                            {
                              ...findFriendRequestTwo.docs[0]?._data,
                              accepted: true,
                            },
                          ],
                        },
                      });
                      navigate('Profile', {
                        userID: ID,
                        ...getUser,
                      });
                      setToast({
                        color: green,
                        text: t('acceptedFriendsRequest'),
                      });
                      SentPush({
                        allIDs: [ID],
                        de: PushTexts(
                          'acceptedFriendsRequest',
                          'de',
                          newMainState.user?.username,
                        ),
                        en: PushTexts(
                          'acceptedFriendsRequest',
                          'en',
                          newMainState.user?.username,
                        ),
                        url: `people/${newMainState.userID}`,
                      });
                    } catch (err) {
                      console.log('err in acceptFriendsRequest :>> ', err);
                      setToast({
                        color: red,
                        text: t('errorBasic'),
                      });
                    }
                  }}
                  buttonWordingYes={t('accept')}
                />
              ),
            });
          } else {
            // Send a Friends Request
            showAlert({
              alertType: 'custom',
              customAlert: (
                <CustomAlert
                  title={t('sendFriendsRequest', {
                    name: findPerson.username,
                  })}
                  icon={<Emoji emoji="love" styles={layout_styles.l_icon} />}
                  click={async () => {
                    await firestore()
                      .collection('friends')
                      .add({
                        accepted: false,
                        friend1: newMainState.userID,
                        friend1IMG: newMainState.user?.profileIMG,
                        friend1username: newMainState.user?.username,
                        friend2: ID,
                        friend2IMG: findPerson.profileIMG || t('defaultBanner'),
                        friend2username: findPerson.username,
                      });
                    setToast({
                      color: green,
                      text: t('sentFriendsRequest'),
                    });
                    SentPush({
                      allIDs: [ID],
                      de: PushTexts(
                        'newFriendRequest',
                        'de',
                        newMainState.user?.username,
                      ),
                      en: PushTexts(
                        'newFriendRequest',
                        'en',
                        newMainState.user?.username,
                      ),
                      url: `people/${newMainState.userID}`,
                    });
                  }}
                  buttonWordingYes={t('send')}
                />
              ),
            });
          }
        }
      }
    } else if (url.includes('partner') && url.includes('checkin')) {
      if (!newMainState.user) {
        noUserNoInteraction();
        return {
          state: {
            navAfterProfileCreate: {
              route: 'QRCode',
              params: {},
            },
          },
          navTo: 'Register',
        };
      } else {
        const partnerID = url.substring(
          url.indexOf('partner/') + 8,
          url.indexOf('?checkin='),
        );
        const checkInID = url.substring(
          url.indexOf('?checkin=') + 9,
          url.length,
        );
        const code = await MakeRequest(
          'POST',
          `${BaseUrl}/complete/code`,
          ACCESS_ALLPUBS,
          {
            partnerID,
            checkInID,
          },
        );
        if (!code || code === 'NoMoreCodes') return 'NoMoreCodes';
        return {
          navTo: 'QRCode',
        };
      }
    } else if (url.includes('partner/item/')) {
      const itemID = url.substring(
        url.indexOf('partner/item/') + 13,
        url.length,
      );
      let item;
      newMainState.partners?.forEach((current) => {
        if (
          !!current.items?.length &&
          current.items?.some((c) => c._id === itemID)
        ) {
          item = current.items?.find((c) => c._id === itemID);
        }
      });
      if (!item) return 'NotFound';
      const size = await GetIMGSize(item.imgURL);
      let bannerHeight;
      if (!!size) {
        if ((size.height / size.width) * screenWidth > screenHeight * 0.4) {
          bannerHeight = screenHeight * 0.4;
        } else {
          bannerHeight = (size.height / size.width) * screenWidth;
        }
      }
      if (!bannerHeight) {
        bannerHeight = screenHeight * 0.4;
      }
      return {
        navTo: 'PartnerItem',
        setParams: {
          ...item,
          bannerHeight,
        },
        addPartnerInteractions: {
          action: 'deepLinkOpened',
          partner_id: item.partnerID,
          item: true,
        },
      };
    } else if (url.includes('partner/')) {
      const ID = url.substring(url.indexOf('partner/') + 8, url.length);
      const partner = newMainState.partners?.find(
        (current) => current.partnerID === ID,
      );
      if (!partner) return 'NotFound';
      return {
        navTo: 'Partner',
        setParams: {
          ...partner,
        },
        addPartnerInteractions: {
          action: 'deepLinkOpened',
          partner_id: partner.partnerID,
          item: false,
        },
      };
    }
    return {
      state: {},
      navTo: null,
      addInteraction: null,
    };
  };

  // App Start
  const newAppStart = async (
    finishOnboardingWithCity,
    skipToWelcome,
    triggerAndroidRestart,
    addAppResetToComplete
  ) => {
    let newMainState = {
      ...mainState,
    };
    if (!!addAppResetToComplete) {
      newMainState = {
        ...newMainState,
        complete: {
          ...emptyComplete,
          counterUsers: [
            {
              action: 'resetApp',
              os_version: Platform.OS,
            },
          ]
        }
      };
    }
    const checkDontTrackAppChange = await GetValueLocally(
      '@DontTrackAppChange',
    );
    const resCompleteSent = await GetValueLocally('@CompleteWasSent');
    if (!!resCompleteSent) {
      AsyncStorage.removeItem('@CompleteWasSent');
      newMainState = {
        ...newMainState,
        complete: {
          interactions: [],
          filterSearches: [],
          mails: [],
          newentries: [],
          bbInteractions: [],
          partnerInteractions: [],
          counterUsers: [],
        },
        collectPubsToPushToDB: [],
      };
    }
    console.log('newAppStart', {
      finishOnboardingWithCity,
      skipToWelcome,
      checkDontTrackAppChange,
    });
    if (!!checkDontTrackAppChange) {
      if (!!resCompleteSent) {
        setMainState(newMainState);
      }
      return ClearItemFromAsyncStorage('@DontTrackAppChange');
    }

    const res = await GetValueLocally('@firstload_Update_14');

    // Utilities
    const noLocation = async () => {
      const lastActiveCity = await GetValueLocally('@activeCity');
      if (!!lastActiveCity != null && lastActiveCity !== 'World') {
        const getRegion = GetCityCenter(lastActiveCity);
        if (!getRegion) {
          newMainState = {
            ...newMainState,
            nav: 'ChooseCityAgain',
            locationGranted: false,
          };
        } else {
          const laDF = 0.067;
          const loDF = laDF / 1.204;
          newMainState = {
            ...newMainState,
            locationGranted: false,
            regionToAnimate: {
              latitude: getRegion.latitude - 0.00002,
              longitude: getRegion.longitude - 0.00002,
              latitudeDelta: laDF,
              longitudeDelta: loDF,
            },
            activeCity: lastActiveCity,
          };
        }
      } else {
        newMainState = {
          ...newMainState,
          nav: 'ChooseCityAgain',
          locationGranted: false,
        };
      }
    };

    // Deep Links
    let checkForDeepLink = null;
    let checkForInitialURL;
    if (!initialUrlWasAlreadyUsed.current) {
      checkForInitialURL = await checkForInitialLink();
    }
    if (linkRef.current) {
      checkForDeepLink = linkRef.current;
      linkRef.current = undefined;
    } else if (checkForInitialURL && checkForInitialURL !== 'NoURL') {
      checkForDeepLink = checkForInitialURL;
    }
    if (!!checkForDeepLink && checkForDeepLink?.endsWith('/')) {
      checkForDeepLink = checkForDeepLink?.substring(
        0,
        checkForDeepLink.length - 1,
      );
    }

    const resLocation = await GetValueLocally('@DontAskLocationRightAway');
    console.log('resLocation :>> ', resLocation);
    const resFirstLocationAsk = await GetValueLocally(
      '@locationPermissionAndroid',
    );
    console.log('resFirstLocationAsk :>> ', resFirstLocationAsk);
    let responseLocationPermission;
    let lastLocationPermission;
    if (!!resLocation) {
      if (Platform.OS === 'android') {
        responseLocationPermission = resFirstLocationAsk;
        lastLocationPermission = resFirstLocationAsk;
      } else {
        responseLocationPermission = await GetLocationPermission();
        lastLocationPermission = await GetValueLocally(
          '@lastLocationPermission',
        );
        StoreValueLocally(
          '@lastLocationPermission',
          responseLocationPermission,
        );
      }
    }

    const radius = await GetValueLocally('@radiusWorld');
    if (!!radius) {
      newMainState = {
        ...newMainState,
        radiusWorld: radius,
      };
    }

    const checkLang = GetLanguage();
    const getLocalLang = await GetValueLocally('@sprache');
    i18next.changeLanguage(getLocalLang || checkLang);

    const currUser = auth().currentUser;
    if (!currUser || !currUser?.uid) {
      //

      // temporary userID
      let userID = await retrieveEncryptedStorage('@userID');
      if (!userID) {
        try {
          userID = await GetID();
        } catch {
          userID = Math.random().toString().replace('.', '');
        }
        await storeEncryptedStorage('@userID', userID);
      }
      // OneSignalSetup(userID);
      newMainState = {
        ...newMainState,
        userID,
      };
    } else {
      //

      // Get User Data
      const getUser = await GetEntireProfile(currUser.uid);
      newMainState = {
        ...newMainState,
        userID: currUser.uid,
        user: getUser,
      };
      OneSignalSetup(currUser.uid);
    }

    if (!finishOnboardingWithCity) {
      //

      // Check First App Open
      if (!res && newMainState.nav !== 'AskNotifications' && !skipToWelcome) {
        if (mainState.nav === 'AskLocation') {
          // Case 2
          newMainState = {
            ...newMainState,
            nav: 'AskNotifications',
          };
        } else {
          // Case 1
          newMainState = {
            ...newMainState,
            nav: 'AskLocation',
          };
          StoreValueLocally('@DontAskLocationRightAway', 'Done');
        }
        if (!checkForDeepLink) return setMainState(newMainState);
      }
      if (newMainState.nav === 'AskNotifications' || !!skipToWelcome) {
        //

        // AppInit
        newMainState = {
          ...newMainState,
          nav: 'Welcome',
        };

        if (
          responseLocationPermission === 'granted' ||
          (Platform.OS === 'android' &&
            responseLocationPermission === 'blocked')
        ) {
          const userLocation = await GetUserLocation();
          console.log('initiate && granted || blocked', userLocation.coords.latitude, userLocation.coords.longitude);
          const city = GetCity(userLocation);
          StoreValueLocally('@activeCity', city);
          newMainState = {
            ...newMainState,
            locationGranted: true,
            activeCity: city,
            userLocation: {
              latitude: userLocation.coords.latitude,
              longitude: userLocation.coords.longitude,
            },
            regionToAnimate: {
              latitude: userLocation.coords.latitude,
              longitude: userLocation.coords.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            },
          };
        }
      } else {
        console.log(
          'AppReopen or ReFocus',
          newMainState.kneipen.length,
          responseLocationPermission,
          lastLocationPermission,
        );
        if (
          (!!responseLocationPermission &&
            responseLocationPermission === lastLocationPermission &&
            !newMainState.kneipen.length) || (!responseLocationPermission &&
              responseLocationPermission === lastLocationPermission &&
              !newMainState.kneipen.length) ||
          responseLocationPermission !== lastLocationPermission ||
          !!triggerAndroidRestart
        ) {
          const currentRoute = navigationRef.current.getCurrentRoute().name
          const currentMap = navigationRef.current.getCurrentRoute().params?.map
          console.log('Start With Changes | current route :>>', currentRoute, currentMap);
          if (currentRoute !== 'Map' || (currentRoute === 'Map' && currentMap !== 'Map')) {
            newMainState = {
              ...newMainState,
              filters: {
                category: [],
                breweries: [],
              },
              filtersOn: false,
            };
            navigate('Map', {
              map: 'Map',
            })
          }
          setShowLoading(true);
          const addToNewMainState = await getAndSetMongoDBData();
          newMainState = {
            ...newMainState,
            ...addToNewMainState,
          };
          if (
            responseLocationPermission === 'granted' ||
            (Platform.OS === 'android' &&
              responseLocationPermission === 'blocked')
          ) {
            const userLocation = await GetUserLocation();
            if (userLocation === 'Error') {
              await noLocation();
            } else {
              const city = GetCity(userLocation);
              StoreValueLocally('@activeCity', city);
              newMainState = {
                ...newMainState,
                locationGranted: true,
                activeCity: city,
                userLocation: {
                  latitude: userLocation.coords.latitude,
                  longitude: userLocation.coords.longitude,
                },
                regionToAnimate: {
                  latitude: userLocation.coords.latitude,
                  longitude: userLocation.coords.longitude,
                  latitudeDelta: 0.005,
                  longitudeDelta: 0.005,
                },
              };
            }
          } else {
            await noLocation();
          }
        } else {
          console.log('App is active again without changes');
        }
      }
    } else {
      setShowLoading(true);
      StoreValueLocally('@firstload_Update_14', 'Done');
      const addToNewMainState = await getAndSetMongoDBData();
      newMainState = {
        ...newMainState,
        ...addToNewMainState,
        complete: {
          ...newMainState.complete,
          counterUsers: [
            ...newMainState.complete.counterUsers,
            {
              action: 'AppOpen',
              os_version: Platform.OS,
            },
          ],
        },
      };
      if (!!newMainState.directlyToQRCode) {
        delete newMainState.directlyToQRCode
        if (Platform.OS === 'android') {
          StoreValueLocally('@DontTrackAppChange', 'True');
        }
        navigate('QRCode')
      }
      if (finishOnboardingWithCity === 'finishOnboardingWithLocationGranted') {
        setShowLoading(false);
      } else {
        StoreValueLocally('@activeCity', finishOnboardingWithCity);
        const CityMarker = newMainState.kneipen.filter(
          (current) =>
            current.category.includes('citymarker') &&
            current.World === finishOnboardingWithCity,
        );
        const MapCluster = 0.05;
        if (!CityMarker?.length || !CityMarker) {
          newMainState = {
            ...newMainState,
            nav: null,
            activeCity: finishOnboardingWithCity,
          };
        } else {
          newMainState = {
            ...newMainState,
            nav: null,
            activeCity: finishOnboardingWithCity,
            regionToAnimate: {
              latitude: CityMarker[0].latitude - 0.00002,
              longitude: CityMarker[0].longitude - 0.00002,
              latitudeDelta: MapCluster,
              longitudeDelta: MapCluster / 1.204,
            },
          };
        }
      }
    }

    // Partners
    const partnersCheck = await firestore().collection('partners').get();
    if (!!partnersCheck.docs && Array.isArray(partnersCheck.docs)) {
      const collectData = [];
      partnersCheck.docs.forEach((c) => {
        if (
          c._data.cities.indexOf(newMainState.activeCity) > -1 ||
          c._data.cities.indexOf('All') > -1 ||
          !newMainState.activeCity || (!newMainState.activeCity && !newMainState.locationGranted)
        ) {
          const getPartnerID = c._ref._documentPath._parts[1];
          collectData.push({
            ...c._data,
            pubs: newMainState.kneipen.filter(
              (cf) =>
                !!cf.breweries?.length &&
                cf.breweries?.some((cs) => cs === getPartnerID),
            ),
            partnerID: getPartnerID,
          });
        }
      });
      if (!!collectData.length) {
        newMainState = {
          ...newMainState,
          partners: collectData,
        };
      }
    }

    // PublicPubBundles
    const publicPubBundlesCheck = await firestore()
      .collection('publicPubBundles')
      .get();
    if (
      !!publicPubBundlesCheck.docs &&
      Array.isArray(publicPubBundlesCheck.docs) &&
      !!publicPubBundlesCheck.docs?.length
    ) {
      const collectData = [];
      const collectAllData = [];
      publicPubBundlesCheck.docs.forEach((c) => {
        if (
          c._data.city === newMainState.activeCity ||
          !newMainState.activeCity
        ) {
          collectData.push(c._data);
        }
        collectAllData.push(c._data);
      });
      newMainState = {
        ...newMainState,
        publicPubBundles: collectData,
        allPublicPubBundles: collectAllData,
      };
    }

    if (checkForDeepLink)
      console.log('checkForDeepLink :>> ', checkForDeepLink);
    if (!checkForDeepLink) return setMainState(newMainState);
    const resOne = await GetValueLocally('@firstload_Update_14');
    if (!resOne && !newMainState.kneipen?.length) {
      // App Opened with Deep Link :>> Load kneipen
      const addToNewMainState = await getAndSetMongoDBData();
      newMainState = {
        ...newMainState,
        ...addToNewMainState,
        showWelcomeOnMap: true,
      };
    }
    try {
      const setDeepLinkState = await handleDeepLink(
        checkForDeepLink,
        newMainState,
      );
      if (setDeepLinkState === 'NotFound') {
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
      } else if (setDeepLinkState === 'NoMoreCodes') {
        showAlert({
          alertType: 'custom',
          customAlert: (
            <CustomAlert
              title={t('noCodesLeft')}
              sub={t('noCodesLeftRequest')}
              icon={<Emoji emoji="drunk" styles={layout_styles.l_icon} />}
              click={async () => {
                Linking.openURL(
                  `mailto:kontakt@pub-up.de?subject=Neue%20Codes`,
                );
              }}
            />
          ),
        });
      } else {
        if (!!setDeepLinkState.navTo && !!setDeepLinkState.setParams) {
          navigate(setDeepLinkState.navTo, setDeepLinkState.setParams);
        } else if (!!setDeepLinkState.navTo) {
          navigate(setDeepLinkState.navTo);
        }
        if (!!setDeepLinkState.addInteraction) {
          newMainState = {
            ...newMainState,
            complete: {
              ...newMainState.complete,
              interactions: [
                ...newMainState.complete.interactions,
                setDeepLinkState.addInteraction,
              ],
            },
            collectPubsToPushToDB: [
              ...newMainState.collectPubsToPushToDB,
              setDeepLinkState.addInteraction?.lokal_id,
            ],
          };
        }
        if (!!setDeepLinkState.addBBInteraction) {
          newMainState = {
            ...newMainState,
            complete: {
              ...newMainState.complete,
              bbInteractions: [
                ...newMainState.complete.bbInteractions,
                setDeepLinkState.addInteraction,
              ],
            },
          };
        }
        if (!!setDeepLinkState.addPartnerInteractions) {
          newMainState = {
            ...newMainState,
            complete: {
              ...newMainState.complete,
              partnerInteractions: [
                ...newMainState.complete.partnerInteractions,
                setDeepLinkState.addPartnerInteractions,
              ],
            },
          };
        }
        newMainState = {
          ...newMainState,
          ...setDeepLinkState.state,
        };
      }
    } catch (err) {
      console.log('err in handleDeepLink :>> ', err);
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
    } finally {
      setMainState(newMainState);
    }
  };

  // Hooks
  useEffect(() => {
    if (showLoading && !!mainState.kneipen.length) {
      setShowLoading(false);
    }
  }, [mainState.kneipen]);
  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      async (appState) => {
        const currentRoute = navigationRef.current.getCurrentRoute().name
        console.log('appState :>> ', appState);
        console.log('currentRoute :>> ', currentRoute);
        if (currentRoute === 'QRCode') return ClearItemFromAsyncStorage('@DontTrackAppChange');
        if (appState === 'active') return newAppStart();
        console.log("sendAllInformation")
        sendAllInformation();
      },
    );
    return () => subscription.remove();
  }, [mainState]);
  useEffect(() => {
    //Method for handling notifications received while app in foreground
    OneSignal.setNotificationWillShowInForegroundHandler(
      async (notificationReceivedEvent) => {
        let notification = notificationReceivedEvent.getNotification();
        useBackgroundURL.current = true;
        notificationReceivedEvent.complete(notification);
      },
    );

    //Method for handling notifications opened
    OneSignal.setNotificationOpenedHandler(async (notification) => {
      const launchForegroundURL = notification.notification.launchURL;
      linkRef.current = launchForegroundURL;
      if (useBackgroundURL.current) {
        console.log(
          'Open Push Notification from Foreground',
          launchForegroundURL,
        );
        linkRef.current = launchForegroundURL;
        newAppStart();
      }
    });
  }, []);

  const testing = (withLink) => {
    if (withLink) {
      // linkRef.current = 'https://pub-up.de/people/uxHEu7sCv6beAPgfwXwfDme7zlf1';
      /* linkRef.current =
        'https://pub-up.de/partner/mampe?checkin=2874ghr7wfbw4g48g8fgff'; */
      linkRef.current = 'https://pub-up.de/people/LPfiAcNtyWTvcVaGUqUIyCt6OIq1';
    }
    newAppStart();
  };
  useEffect(() => {
    const subscriptionURL = Linking.addEventListener('url', (url) => {
      linkRef.current = url.url;
    });
    return () => {
      subscriptionURL.remove();
    };
  }, []);

  return (
    <MainContext.Provider
      value={{
        mainState,
        setMainState,
        toast,
        setToast,
        newAppStart,
        getDistanceForEach,
        getDistanceDisplayForEach,
        testing,
        noUserNavAfter,
        noUserButCode
      }}>
      <View style={layout_styles.container}>
        <NavigationContainer ref={navigationRef}>
          {Platform.OS === 'android' && (
            <StatusBar translucent={true} backgroundColor="transparent" />
          )}
          <Stack.Navigator initialRouteName="Map">
            <Stack.Screen
              name="Map"
              component={Map}
              initialParams={{
                map: 'Map',
              }}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Menu"
              component={Menu}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Form"
              component={Form}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Search"
              component={Search}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Filters"
              component={AllFilters}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="ResultsList"
              component={ResultsList}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Login"
              component={Login}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Register"
              component={Register}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="MyProfile"
              component={MyProfile}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Profile"
              component={Profile}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Password"
              component={Password}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="PubBundle"
              component={PubBundle}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="NewPubBundle"
              component={NewPubBundle}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Favorites"
              component={Favorites}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="NewPubIn"
              component={NewPubIn}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="PubIn"
              component={PubIn}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Partner"
              component={Partner}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="PartnerItem"
              component={PartnerItem}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="PartnerOverview"
              component={PartnerOverview}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="QRCode"
              component={QRCode}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Pub"
              component={NewPub}
              options={{
                headerShown: false,
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
        {/* ONBOARDING */}
        {mainState.nav === 'AskLocation' && <AskLocationGranted />}
        {mainState.nav === 'AskNotifications' && <AskNotificationGranted />}
        {mainState.nav === 'Welcome' && !mainState.showWelcomeOnMap && (
          <WelcomeOverlay
            yesClicked={() => {
              setMainState({
                ...mainState,
                nav: 'Overlay',
              });
            }}
            qrCodeClicked={() => {
              // Direct to QR Code After
              setMainState({
                ...mainState,
                nav: 'Overlay',
                skipOverlay: true,
                directlyToQRCode: true
              });
            }}
            noClicked={() => {
              StoreValueLocally('@skipOverlay', 'True');
              setMainState({
                ...mainState,
                nav: 'Overlay',
                skipOverlay: true,
              });
            }}
          />
        )}
        {mainState.nav === 'Overlay' && <Overlay />}
        {mainState.nav === 'ChooseCityAgain' && <ChooseCityAgain />}
        {showLoading &&
          mainState.nav !== 'AskLocation' &&
          mainState.nav !== 'AskNotifications' &&
          mainState.nav !== 'Welcome' && (
            <Loading randomNumber={mainState.randomNumber} />
          )}
        {!!toast.text && <Toast />}
        {!!mainState.globalMSG?.de && (
          <GlobalMessage msg={mainState.globalMSG} />
        )}
        {!!mainState.showLink && (
          <>
            <View style={{ flex: 1 }}>
              <Modal
                style={{ flex: 1, backgroundColor: darkblue }}
                animationType="slide">
                <View
                  style={{
                    flexDirection: 'row',
                  }}>
                  <TouchableHighlight
                    onPress={() => {
                      if (getCanGoBack.current) {
                        navRef.current.goBack();
                      } else {
                        setMainState({
                          ...mainState,
                          showLink: null,
                        });
                      }
                    }}
                    style={{
                      backgroundColor: darkblue,
                      paddingBottom: 20,
                      paddingTop: screenHeight * 0.06,
                      paddingHorizontal: screenWidth * 0.045,
                    }}>
                    <Back_Icon white styles={layout_styles.extra_s_icon} />
                  </TouchableHighlight>
                  <TouchableHighlight
                    onPress={() => {
                      if (!!modalURL) {
                        Linking.openURL(transformLink(modalURL))
                      } else {
                        Linking.openURL(transformLink(mainState.showLink))
                      }
                      setTimeout(() => {
                        setMainState({
                          ...mainState,
                          showLink: null,
                        });
                        setModalURL(null)
                      }, 2000)
                    }}
                    style={{
                      paddingBottom: 20,
                      backgroundColor: darkblue,
                      paddingTop: screenHeight * 0.06,
                      paddingHorizontal: screenWidth * 0.045,
                    }}>
                    <ElementLink_Icon color={whiteColor} styles={layout_styles.extra_s_icon} />
                  </TouchableHighlight>
                  <TouchableHighlight
                    onPress={() =>
                      setMainState({
                        ...mainState,
                        showLink: null,
                      })
                    }
                    style={{
                      backgroundColor: darkblue,
                      paddingBottom: 20,
                      paddingTop: screenHeight * 0.06,
                      flex: 1,
                      alignItems: 'flex-end',
                      paddingHorizontal: screenWidth * 0.07,
                    }}>
                    <Cross_Icon
                      styles={layout_styles.extra_s_icon}
                      color={whiteColor}
                    />
                  </TouchableHighlight>
                </View>
                <WebView
                  source={{ uri: transformLink(mainState.showLink) }}
                  onNavigationStateChange={(webViewState) => {
                    setModalURL(webViewState.url)
                  }}
                  originWhitelist={['*']}
                  style={{
                    width: screenWidth,
                  }}
                  ref={navRef}
                  onLoadEnd={(e) => {
                    const { nativeEvent } = e;
                    getCanGoBack.current = nativeEvent.canGoBack;
                  }}
                />
              </Modal>
            </View>
          </>
        )}
      </View>
    </MainContext.Provider>
  );
}
