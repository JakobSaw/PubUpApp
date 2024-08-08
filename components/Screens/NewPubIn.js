import { getDistance } from 'geolib';
import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Platform } from 'react-native';
import Fonts from '../../content/Fonts';
import { Category_Icon } from '../../content/Icons';
import MainContext from '../../context/MainContext';
import { green, whiteColor } from '../../styles/Colors';
import GetID from '../../utilities/GetID';
import UploadPhotoWrapper from '../Favorites_Components/UploadPhotoWrapper';
import InputTextArea from '../Inputs/InputTextArea';
import PrimaryButton from '../Buttons/PrimaryButton';
import PubInBubbles from '../PubIn_Components/PubInBubbles';
import PubInHorizontalWrapper from '../PubIn_Components/PubInHorizontalWrapper';
import ListItemOptions from '../ListItems/ListItemOptions';
import { screenHeight, screenWidth } from '../../utilities/WidthAndHeight';
import { useTranslation } from 'react-i18next';
import firestore from '@react-native-firebase/firestore';
import PubCardHorizontal from '../Cards/PubCardHorizontal';
import { useNavigation } from '@react-navigation/native';
import Emojis from '../../content/Emojis';
import { normalizeFontSize } from '../../utilities/ResFontSize';
import LayoutContainer from '../../utilities/LayoutContainer';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import SentPush from '../../utilities/SentPush';
import PushTexts from '../../content/PushTexts';

const NewPubIn = ({ route }) => {
  const { mainState, setMainState, setToast } = useContext(MainContext);
  const [showLoading, setShowLoading] = useState(false);
  const [scrollSnap, setScrollSnap] = useState(270);
  const [rendered, setRendered] = useState(false);
  const defaultPubIn = {
    // imgURL: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXcMInItd5KUjpfldQqDKUNTij_ttIqX0YRQ&usqp=CAU',
    imgURL: null,
    mood: null,
    friends: [],
    comment: '',
    pub_id: null,
    selectedFromPubs: [],
    public: false,
  };
  const { params } = route;
  const { t } = useTranslation();
  const [newPubIn, setNewPubIn] = useState(defaultPubIn);
  const large = screenHeight * 0.05;
  const sortAfterDistanceRaw = (a, b) => {
    if (a.distanceRaw > b.distanceRaw) {
      return 1;
    } else if (a.distanceRaw < b.distanceRaw) {
      return -1;
    }
    return 0;
  };
  const setRouteDisplay = (c) => {
    const distanceRaw = getDistance(
      {
        latitude: mainState.userLocation.latitude,
        longitude: mainState.userLocation.longitude,
      },
      {
        latitude: c.latitude,
        longitude: c.longitude,
      },
    );
    const distanceKM1 = Math.ceil(distanceRaw / 100);
    const distanceKM2 = distanceKM1 / 10;
    const distanceRouteDisplay =
      distanceRaw > 1000
        ? t('distance', { distance: `${distanceKM2}km` })
        : t('distance', { distance: `${distanceRaw}m` });
    return {
      distanceRouteDisplay,
      distanceRaw,
    };
  };
  const navigation = useNavigation();
  const createPubIn = async () => {
    setShowLoading(true);
    let pubin_id = await GetID();
    const entireNewPubIn = {
      ...newPubIn,
      pubin_id,
      userID: mainState.userID,
      username: mainState.user?.username,
      time: Math.floor(Date.now() / 1000),
      imgURL_Bubble: mainState.user?.profileIMG,
      reactions: [],
    };
    delete entireNewPubIn.selectedFromPubs;
    const newUser = {
      ...mainState.user,
      pub_ins: [...mainState.user?.pub_ins, entireNewPubIn],
    };
    await firestore()
      .collection('users')
      .doc(mainState.userID)
      .update({
        pub_ins: [...mainState.user?.pub_ins, entireNewPubIn],
      });
    setMainState({
      ...mainState,
      user: newUser,
    });
    // update User
    if (!!entireNewPubIn.friends.length) {
      for (friend of entireNewPubIn.friends) {
        const getFriend = await firestore()
          .collection('users')
          .doc(friend.userID)
          .get();
        await firestore()
          .collection('users')
          .doc(friend.userID)
          .update({
            pub_ins: [...getFriend._data.pub_ins, entireNewPubIn],
          });
      }
    }
    // sentPush
    navigation.replace('PubIn', {
      selectedPubIn: entireNewPubIn,
    });
    setToast({
      color: green,
      text: t('newPubInCreated'),
    });
    setShowLoading(false);
    if (!!mainState.user?.friends?.length) {
      const collectFriendsIDs = [];
      mainState.user?.friends?.forEach((c) =>
        collectFriendsIDs.push(
          c.friend1 === mainState.userID ? c.friend2 : c.friend1,
        ),
      );
      SentPush({
        allIDs: collectFriendsIDs,
        de: PushTexts('newPubIn', 'de', mainState.user?.username),
        en: PushTexts('newPubIn', 'en', mainState.user?.username),
        url: `people/pubin${mainState.userID}_${pubin_id}`,
      });
    }
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
  useEffect(() => {
    if (mainState.locationGranted && !params?.selectedPub) {
      const getClosest = [];
      mainState.kneipen.forEach((c) => {
        if (!c.category.includes('district') && !c.category.includes('city')) {
          const { distanceRaw, distanceRouteDisplay } = setRouteDisplay(c);
          if (distanceRaw <= 1000) {
            const findID = c.lokal_id || c._id;
            getClosest.push({
              pub_id: findID,
              name: c.name,
              category: c.category,
              city: c.city,
              city2: c.city2 || c.extracity,
              distanceRaw,
              distanceRouteDisplay,
            });
          }
        }
      });
      if (!!getClosest.length) {
        setNewPubIn({
          ...defaultPubIn,
          selectedFromPubs: [...getClosest],
        });
      } else {
        console.log('No Location near');
        setNewPubIn(defaultPubIn);
      }
    } else if (!!params?.selectedPub) {
      const { distanceRaw, distanceRouteDisplay } = setRouteDisplay(
        params?.selectedPub,
      );
      const findID = params?.selectedPub.lokal_id || params?.selectedPub._id;
      setNewPubIn({
        ...defaultPubIn,
        selectedFromPubs: [
          {
            pub_id: findID,
            name: params?.selectedPub.name,
            category: params?.selectedPub.category,
            city: params?.selectedPub.city,
            city2: params?.selectedPub.city2 || params?.selectedPub.extracity,
            distanceRaw,
            distanceRouteDisplay,
          },
        ],
        pub_id: params?.selectedPub.lokal_id || params?.selectedPub._id,
      });
    }
  }, []);
  return (
    <LayoutContainer
      content={
        <>
          <KeyboardAwareScrollView
            enableOnAndroid={true}
            enableAutomaticScroll={Platform.OS === 'ios'}
            showsVerticalScrollIndicator={false}>
            <>
              <UploadPhotoWrapper
                showLoading={showLoading}
                displayURL={newPubIn.imgURL}
                showImage={!!newPubIn.imgURL}
                setShowLoading={setShowLoading}
                setDisplayURL={(link) => {
                  setNewPubIn({
                    ...newPubIn,
                    imgURL: link,
                  });
                }}
                roundImage={true}
                setTitle={t('newPubInAddPhoto')}
              />
              {/*  */}
              {/*  */}
              {/* SELECT PUB */}
              {!!newPubIn.selectedFromPubs.length && (
                <>
                  <View style={{ marginBottom: large }} />
                  <PubInHorizontalWrapper
                    title={t('newPubInWhere')}
                    arr={newPubIn.selectedFromPubs.sort(sortAfterDistanceRaw)}
                    intervalSnap={scrollSnap}
                    item={(current, index) => (
                      <View
                        key={Math.random()}
                        style={{ marginRight: 20 }}
                        onLayout={(evt) => {
                          if (rendered) return;
                          const { width: cardWidth } = evt.nativeEvent.layout;
                          setScrollSnap(cardWidth + 20);
                          setRendered(true);
                        }}>
                        <PubCardHorizontal
                          current={current}
                          click={() => {
                            if (showLoading) return;
                            if (newPubIn.pub_id === current.pub_id) {
                              setNewPubIn({
                                ...newPubIn,
                                pub_id: null,
                              });
                            } else {
                              setNewPubIn({
                                ...newPubIn,
                                pub_id: current.pub_id,
                              });
                            }
                          }}
                          selected={newPubIn.pub_id === current.pub_id}
                        />
                      </View>
                    )}
                  />
                  <View style={{ marginBottom: large }} />
                </>
              )}
              {/*  */}
              {/*  */}
              {/* SELECT MOOD */}
              <PubInHorizontalWrapper
                title={t('selectMood')}
                arr={Emojis}
                item={(current) => (
                  <View
                    key={Math.random()}
                    style={newPubIn.mood === current ? {} : { opacity: 0.3 }}>
                    <PubInBubbles
                      emoji={current}
                      primaryClick={() => {
                        if (showLoading) return;
                        setNewPubIn({
                          ...newPubIn,
                          mood: current,
                        });
                      }}
                      setSize={screenWidth * 0.225}
                      noMarginLeft
                    />
                  </View>
                )}
              />
              {/*  */}
              {/*  */}
              {/* SELECT FRIENDS */}
              {!!mainState.user?.friends?.length && (
                <>
                  <View style={{ marginBottom: large }} />
                  <PubInHorizontalWrapper
                    title={t('newPubInFriends')}
                    arr={mainState.user?.friends.sort(compareNames) || []}
                    item={(current) => {
                      return (
                        <View key={current.userID || Math.random()}>
                          <PubInBubbles
                            imgURL={
                              current.friend1 === mainState.userID
                                ? current.friend2IMG
                                : current.friend1IMG
                            }
                            imgBack={
                              current.friend1 === mainState.userID
                                ? current.friend2username
                                : current.friend1username
                            }
                            setSize={screenWidth * 0.225}
                            secondaryClick={() => {
                              if (showLoading) return;
                              const ID =
                                current.friend1 === mainState.userID
                                  ? current.friend2
                                  : current.friend1;
                              if (
                                newPubIn.friends.some((c) => c.userID === ID)
                              ) {
                                setNewPubIn({
                                  ...newPubIn,
                                  friends: [
                                    ...newPubIn.friends.filter(
                                      (c) => c.userID !== current.userID,
                                    ),
                                  ],
                                });
                              } else {
                                setNewPubIn({
                                  ...newPubIn,
                                  friends: [
                                    ...newPubIn.friends,
                                    {
                                      userID: ID,
                                      username:
                                        current.friend1 === mainState.userID
                                          ? current.friend2username
                                          : current.friend1username,
                                      profileIMG:
                                        current.friend1 === mainState.userID
                                          ? current.friend2IMG
                                          : current.friend1IMG,
                                      uid: current.uid,
                                    },
                                  ],
                                });
                              }
                            }}
                            btnIcon={
                              newPubIn.friends.some(
                                (c) =>
                                  c.userID ===
                                  (current.friend1 === mainState.userID
                                    ? current.friend2
                                    : current.friend1),
                              )
                                ? 'cross'
                                : 'add'
                            }
                          />
                        </View>
                      );
                    }}
                  />
                </>
              )}
              {/*  */}
              {/*  */}
              {/* COMMENT */}
              <View style={{ marginBottom: large }} />
              <InputTextArea
                title={t('say')}
                onChange={(text) => {
                  setNewPubIn({
                    ...newPubIn,
                    comment: text,
                  });
                }}
                value={newPubIn.comment}
                placeholder={t('yourMessage')}
                setMaxLength={140}
                setHeight={100}
              />
              <Text
                style={{
                  width: '100%',
                  textAlign: 'right',
                  fontSize: normalizeFontSize(10), // before 12
                  color: whiteColor,
                  fontFamily: Fonts.Bold,
                  marginTop: 5,
                }}>
                {newPubIn.comment.length} / 140
              </Text>
              <View style={{ marginBottom: large }} />
              {false && (
                <>
                  <ListItemOptions
                    icon={<Category_Icon category="City" />}
                    title={t('newPubInPublic')}
                    sub={t('newPubInPublicMsg')}
                    checked={newPubIn.public}
                    optionClicked={() =>
                      setNewPubIn({
                        ...newPubIn,
                        public: !newPubIn.public,
                      })
                    }
                  />
                  <View style={{ marginBottom: large }} />
                </>
              )}
            </>
          </KeyboardAwareScrollView>
          <PrimaryButton
            disabled={showLoading || !newPubIn.imgURL || !newPubIn.mood}
            text={t('go')}
            buttonClicked={createPubIn}
          />
        </>
      }
    />
  );
};

export default NewPubIn;
