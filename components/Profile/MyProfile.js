import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  Text,
  View,
  ScrollView,
  Linking,
  TouchableOpacity,
  Share,
  Platform,
} from 'react-native';
import layout_styles from '../../styles/Layout_Styles';
import { useTranslation } from 'react-i18next';
import { green, lightblue, red, whiteColor, yellow } from '../../styles/Colors';
import { screenHeight, screenWidth } from '../../utilities/WidthAndHeight';
import MainContext from '../../context/MainContext';
import PubInBubbles from '../PubIn_Components/PubInBubbles';
import PubInHorizontalWrapper from '../PubIn_Components/PubInHorizontalWrapper';
import {
  Add_Friend_Icon,
  BarBundleFilled_Icon,
  ElementLink_Icon,
  Friend_Icon,
  Logo_Icon,
  Logout_Icon,
  PhotoGallery_Icon,
  Photo_Icon,
  Plus_With_Circle,
  PubIn_Icon,
} from '../../content/Icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { showAlert } from 'react-native-customisable-alert';
import CustomAlert from '../CustomAlert';
import GetValueLocally from '../../utilities/GetValueLocally';
import StoreValueLocally from '../../utilities/StoreValueLocally';
import UploadPhotoAWS from '../../utilities/UploadPhotoAWS';
import { Badge } from '../../content/Badges';
import PubBundleCard from '../Cards/PubBundleCard';
import PubCardHorizontal from '../Cards/PubCardHorizontal';
import ListItemPubIn from '../PubIn_Components/ListItemPubIn';
import auth from '@react-native-firebase/auth';
import retrieveEncryptedStorage from '../../utilities/GetEncryptedStorage';
import { Emoji } from '../../content/Emoji';
import firestore from '@react-native-firebase/firestore';
import GetEntireProfile from '../../utilities/GetEntireProfile';
import ModalOverlay from '../Onboarding/ModalOverlay';
import PrimaryButton_Outline from '../Buttons/PrimaryButton_Outline';
import { normalizeFontSize } from '../../utilities/ResFontSize';
import LayoutContainer from '../../utilities/LayoutContainer';
import PartnerCard from '../Cards/PartnerCard';
import SentPush from '../../utilities/SentPush';
import PushTexts from '../../content/PushTexts';
import OneSignalSetup from '../../utilities/OneSignalSetup';
import CodeCardProfile from '../Cards/CodeCardProfile';
import OneSignal from 'react-native-onesignal';
import decodedAndroidSharingURL from '../../utilities/decodedAndroidSharingURL';

const MyProfile = () => {
  const { t } = useTranslation();
  const { mainState, setToast, setMainState } = useContext(MainContext);
  const [loading, setLoading] = useState(false);
  const [badges, setBadges] = useState([]);
  const navigation = useNavigation();
  const setMarginBottom = screenHeight * 0.05;
  const [scrollSnaps, setScrollSnaps] = useState({});
  const [favoritePubs, setFavoritePubs] = useState([]);

  // Utilities
  const selectPhoto = async (type) => {
    try {
      setLoading(true);
      const imgURL = await UploadPhotoAWS(type, t);
      setLoading(false);
      if (imgURL === 'Cancel') return;
      await firestore().collection('users').doc(mainState.userID).update({
        profileIMG: imgURL,
      });
      const collectNewFriends = [];
      if (!!mainState.user?.friends?.length) {
        for (friend of mainState.user?.friends) {
          if (friend.friend1 === mainState.userID) {
            await firestore().collection('friends').doc(friend.uid).update({
              friend1IMG: imgURL,
            });
            collectNewFriends.push({
              ...friend,
              friend1IMG: imgURL,
            });
          } else {
            await firestore().collection('friends').doc(friend.uid).update({
              friend2IMG: imgURL,
            });
            collectNewFriends.push({
              ...friend,
              friend2IMG: imgURL,
            });
          }
        }
      }
      setToast({
        color: lightblue,
        text: t('photoChanged'),
      });
      setMainState({
        ...mainState,
        user: {
          ...mainState.user,
          profileIMG: imgURL,
          friends: collectNewFriends,
        },
      });
    } catch (err) {
      console.log('Error', err);
      setLoading(false);
      setToast({
        color: red,
        text: t('errorBasic'),
      });
    }
  };
  const changePhoto = async (type) => {
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
                    color={whiteColor}
                  />
                ),
                noClose: true,
              },
              {
                text: t('ok'),
                click: () => {
                  StoreValueLocally('@first_picture', 'Done');
                  setTimeout(() => {
                    selectPhoto(type);
                  }, 500);
                },
              },
            ]}
          />
        ),
      });
    setTimeout(() => {
      selectPhoto(type);
    }, 500);
  };
  const acceptFriendRequest = async (current) => {
    showAlert({
      alertType: 'custom',
      customAlert: (
        <CustomAlert
          title={t('acceptFriendsRequest')}
          sub={t('acceptFriendsRequestMsg', {
            name: current.friend1username,
          })}
          icon={<Emoji emoji="love" styles={layout_styles.l_icon} />}
          click={async () => {
            try {
              let getFriendRequest = await firestore()
                .collection('friends')
                .where('friend1', '==', current.friend1)
                .where('friend2', '==', mainState.userID)
                .get();
              const ID = getFriendRequest.docs[0]?._ref._documentPath._parts[1];
              await firestore().collection('friends').doc(ID).update({
                accepted: true,
              });
              setMainState({
                ...mainState,
                user: {
                  ...mainState.user,
                  openFriendsRequests: [
                    ...mainState.user?.openFriendsRequests.filter(
                      (c) =>
                        c.friend1 !== current.friend1 &&
                        c.friend2 !== mainState.userID,
                    ),
                  ],
                  friends: [
                    ...mainState.user?.friends,
                    {
                      ...getFriendRequest.docs[0]?._data,
                      accepted: true,
                    },
                  ],
                },
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
                  mainState.user?.username,
                ),
                en: PushTexts(
                  'acceptedFriendsRequest',
                  'en',
                  mainState.user?.username,
                ),
                url: `people/${mainState.userID}`,
              });
            } catch (err) {
              console.log('err :>> ', err);
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
  };
  const rejectFriendRequest = async (current) => {
    showAlert({
      alertType: 'custom',
      customAlert: (
        <CustomAlert
          title={t('rejectFriendsRequest')}
          sub={t('rejectFriendsRequestMsg', {
            name: current.friend1username,
          })}
          icon={<Emoji emoji="drunk" styles={layout_styles.l_icon} />}
          click={async () => {
            try {
              let getFriendRequest = await firestore()
                .collection('friends')
                .where('friend1', '==', current.friend1)
                .where('friend2', '==', mainState.userID)
                .get();
              const ID = getFriendRequest.docs[0]?._ref._documentPath._parts[1];
              await firestore().collection('friends').doc(ID).delete();
              setMainState({
                ...mainState,
                user: {
                  ...mainState.user,
                  openFriendsRequests: [
                    ...mainState.user?.openFriendsRequests.filter(
                      (c) =>
                        c.friend1 !== current.friend1 &&
                        c.friend2 !== mainState.userID,
                    ),
                  ],
                },
              });
              setToast({
                color: lightblue,
                text: t('deletedFriendsRequest'),
              });
            } catch (err) {
              console.log('err :>> ', err);
              setToast({
                color: red,
                text: t('errorBasic'),
              });
            }
          }}
          buttonWordingYes={t('reject')}
        />
      ),
    });
  };
  const deleteFriend = (current) => {
    showAlert({
      alertType: 'custom',
      customAlert: (
        <CustomAlert
          title={t('reallyDeleteFriend')}
          sub={t('undone')}
          icon={<Emoji emoji="drunk" styles={layout_styles.l_icon} />}
          click={async () => {
            const friendsID =
              current.friend1 === mainState.userID
                ? current.friend2
                : current.friend1;
            const getFriend1 =
              current.friend1 === mainState.userID
                ? mainState.userID
                : friendsID;
            const getFriend2 =
              current.friend1 === mainState.userID
                ? friendsID
                : mainState.userID;
            try {
              const getFriend = await firestore()
                .collection('friends')
                .where('friend1', '==', getFriend1)
                .where('friend2', '==', getFriend2)
                .get();
              const ID = getFriend.docs[0]?._ref._documentPath._parts[1];
              console.log('ID :>> ', ID);
              await firestore().collection('friends').doc(ID).delete();
              setMainState({
                ...mainState,
                user: {
                  ...mainState.user,
                  friends: [
                    ...mainState.user.friends.filter((c) => c.uid !== ID),
                  ],
                },
              });
              setToast({
                color: lightblue,
                text: t('deletedFriend'),
              });
            } catch (err) {
              console.log('err :>> ', err);
              setToast({
                color: red,
                text: t('errorBasic'),
              });
            }
          }}
          buttonWordingYes={t('delete')}
        />
      ),
    });
  };
  const openProfile = async (current) => {
    try {
      const ID =
        current.friend1 === mainState.userID
          ? current.friend2
          : current.friend1;
      const getUser = await GetEntireProfile(ID, true);
      navigation.push('Profile', {
        userID: ID,
        ...getUser,
      });
    } catch {
      setToast({
        color: red,
        text: t('errorBasic'),
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
  function sortAfterTime(a, b) {
    if (a.time > b.time) {
      return -1;
    }
    if (a.time < b.time) {
      return 1;
    }
    return 0;
  }
  function sortAfterNum(a, b) {
    if (a.num > b.num) {
      return -1;
    }
    if (a.num < b.num) {
      return 1;
    }
    return 0;
  }
  function sortAfterPubCount(a, b) {
    if (a.pubCount > b.pubCount) {
      return -1;
    }
    if (a.pubCount < b.pubCount) {
      return 1;
    }
    return 0;
  }

  // setBadges
  useFocusEffect(
    useCallback(() => {
      const collectBadges = [];
      const getBundlesNum = [
        ...mainState.user?.bundles,
        ...mainState.allPublicPubBundles.filter(
          (c) => c.admin === mainState.userID,
        ),
      ].length;
      if (!!getBundlesNum) {
        collectBadges.push('Bundle_1');
        if (getBundlesNum >= 5) {
          collectBadges.push('Bundle_5');
        }
        if (getBundlesNum >= 10) {
          collectBadges.push('Bundle_10');
        }
        if (getBundlesNum >= 25) {
          collectBadges.push('Bundle_25');
        }
        if (getBundlesNum >= 50) {
          collectBadges.push('Bundle_50');
        }
        if (getBundlesNum >= 75) {
          collectBadges.push('Bundle_75');
        }
        if (getBundlesNum >= 100) {
          collectBadges.push('Bundle_100');
        }
      }
      const getPubInsNum = mainState.user?.pub_ins?.length;
      if (!!getPubInsNum) {
        collectBadges.push('PubIn_1');
        if (getPubInsNum >= 5) {
          collectBadges.push('PubIn_5');
        }
        if (getPubInsNum >= 10) {
          collectBadges.push('PubIn_10');
        }
        if (getPubInsNum >= 25) {
          collectBadges.push('PubIn_25');
        }
        if (getPubInsNum >= 50) {
          collectBadges.push('PubIn_50');
        }
        if (getPubInsNum >= 75) {
          collectBadges.push('PubIn_75');
        }
        if (getPubInsNum >= 100) {
          collectBadges.push('PubIn_100');
        }
      }
      setBadges(collectBadges);
      let collectFavoritePubIDs = [];
      const collectFavoritePubs = [];
      if (!!mainState.collectPubsToPushToDB?.length) {
        collectFavoritePubIDs = [
          ...collectFavoritePubIDs,
          ...mainState.collectPubsToPushToDB,
        ];
      }
      if (!!mainState.user?.pubs?.length) {
        collectFavoritePubIDs = [
          ...collectFavoritePubIDs,
          ...mainState.user?.pubs,
        ];
      }
      let occurrences;
      if (!!collectFavoritePubIDs.length) {
        occurrences = collectFavoritePubIDs.reduce(function (acc, curr) {
          return acc[curr] ? ++acc[curr] : (acc[curr] = 1), acc;
        }, {});
      }
      if (!!collectFavoritePubIDs.length && !!occurrences) {
        mainState.kneipen.forEach((current) => {
          const getID = current.lokal_id || current._id;
          if (collectFavoritePubIDs.indexOf(getID) > -1) {
            collectFavoritePubs.push({
              ...current,
              num: occurrences[getID],
            });
          }
        });
        setFavoritePubs(collectFavoritePubs.sort(sortAfterNum));
      }
    }, []),
  );

  return (
    <LayoutContainer
      content={
        <ScrollView showsVerticalScrollIndicator={false}>
          {/*  */}
          {/*  */}
          {/* PROFILEIMG && NAME */}
          <View
            style={{
              alignItems: 'center',
              marginBottom: setMarginBottom / 2,
              marginTop: setMarginBottom / 2,
            }}>
            <PubInBubbles
              imgURL={mainState.user?.profileIMG || t('defaultBanner')}
              setSize={screenWidth * 0.4}
              btnIcon={loading ? 'loading' : 'photo'}
              secondaryClick={() => {
                showAlert({
                  alertType: 'custom',
                  customAlert: (
                    <CustomAlert
                      title={'Change your Profile Pick'}
                      sub={'Choose your Photo'}
                      clicks={[
                        {
                          text: 'Gallery',
                          click: () => changePhoto('gallery'),
                          icon: (
                            <PhotoGallery_Icon
                              styles={layout_styles.extra_s_icon}
                              color={yellow}
                            />
                          ),
                        },
                        {
                          text: 'Camera',
                          click: () => changePhoto('camera'),
                          icon: (
                            <Photo_Icon
                              styles={layout_styles.extra_s_icon}
                              color={yellow}
                            />
                          ),
                        },
                      ]}
                    />
                  ),
                });
              }}
              bgColorOfSmall={lightblue}
              noMarginLeft
              setSizeOfSmall={0.325}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <TouchableOpacity
              onPress={() =>
                showAlert({
                  alertType: 'custom',
                  customAlert: (
                    <CustomAlert
                      title={t('wantToLogout')}
                      icon={
                        <Emoji emoji="beer" styles={layout_styles.l_icon} />
                      }
                      click={async () => {
                        const userID = await retrieveEncryptedStorage(
                          '@userID',
                        );
                        navigation.reset({
                          index: 0,
                          routes: [{ name: 'Map' }, { name: 'Login' }],
                        });
                        setTimeout(() => {
                          setMainState({
                            ...mainState,
                            userID,
                            user: null,
                            complete: {
                              ...mainState.complete,
                              counterUsers: [
                                ...mainState.complete.counterUsers,
                                {
                                  action: 'Logout',
                                  os_version: Platform.OS,
                                },
                              ],
                            },
                          });
                          // OneSignalSetup(userID);
                          OneSignal.removeExternalUserId();
                          auth().signOut();
                        }, 500);
                      }}
                      buttonWordingYes={t('logout')}
                    />
                  ),
                })
              }
              style={{ position: 'absolute', left: 0, padding: 5 }}>
              <Logout_Icon styles={layout_styles.extra_s_icon} color={yellow} />
            </TouchableOpacity>
            <Text
              style={[layout_styles.font_styling_h2, { textAlign: 'center' }]}>
              {t('welcomeBack', { name: mainState.user?.username })}
            </Text>
            <TouchableOpacity
              onPress={() => {
                if (Platform.OS === 'android') {
                  StoreValueLocally('@DontTrackAppChange', 'True');
                }
                setTimeout(() => {
                  Share.share({
                    title: t('inviteFriends'),
                    message:
                      Platform.OS === 'android'
                        ? decodedAndroidSharingURL(
                          t('inviteFriendsMsg', {
                            url: `https://www.pub-up.de/people/${mainState.userID}`,
                          }),
                        )
                        : t('inviteFriendsMsgWithOutURL'),
                    url: `https://www.pub-up.de/people/${mainState.userID}`,
                  });
                }, 500);
              }}
              style={{
                position: 'absolute',
                left: 'auto',
                padding: 5,
                right: 0,
              }}>
              <Add_Friend_Icon
                styles={layout_styles.extra_s_icon}
                color={yellow}
              />
            </TouchableOpacity>
          </View>
          <View style={{ marginBottom: setMarginBottom / 1.5 }} />
          {/*  */}
          {/*  */}
          {/* OPEN FRIENDS REQUESTS */}
          {!!mainState.user?.openFriendsRequests?.length && (
            <>
              <View style={{ marginBottom: setMarginBottom / 1.5 }} />
              <PubInHorizontalWrapper
                title={t('openFriendsRequests')}
                arr={mainState.user?.openFriendsRequests || []}
                item={(current) => {
                  return (
                    <View key={current.friend1} style={{ marginBottom: 10 }}>
                      <PubInBubbles
                        imgURL={current.friend1IMG}
                        imgBack={current.friend1username}
                        secondaryClick={() => acceptFriendRequest(current)}
                        btnIcon={'tick'}
                        setSize={screenWidth * 0.225}
                        setSizeOfSmall={0.4}
                        bgColorOfSmall={lightblue}
                        secondBTNIcon={'cross'}
                        thirdClick={() => rejectFriendRequest(current)}
                      />
                    </View>
                  );
                }}
              />
            </>
          )}
          {/*  */}
          {/*  */}
          {/* FRIENDS */}
          {!!mainState.user?.friends?.length && (
            <>
              <View style={{ marginBottom: setMarginBottom / 3 }} />
              <PubInHorizontalWrapper
                title={t('friends', {
                  num: mainState.user?.friends?.length,
                })}
                arr={mainState.user?.friends.sort(compareNames) || []}
                item={(current) => (
                  <View key={Math.random()} style={{ marginBottom: 10 }}>
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
                      primaryClick={() => openProfile(current)}
                      secondaryClick={() => deleteFriend(current)}
                      btnIcon={'cross'}
                      setSize={screenWidth * 0.225}
                      setSizeOfSmall={0.4}
                      bgColorOfSmall={lightblue}
                    />
                  </View>
                )}
              />
            </>
          )}
          {/*  */}
          {/*  */}
          {/* CODES */}
          {!!mainState.user?.codes?.filter((c) => !c.deactivated).length && (
            <>
              <View style={{ marginBottom: setMarginBottom / 1.5 }} />
              <PubInHorizontalWrapper
                title={t('yourCodes')}
                arr={mainState.user?.codes?.filter((c) => !c.deactivated) || []}
                item={(current) => {
                  return (
                    <View
                      key={current.checkInID || Math.random()}
                      style={{ marginRight: 20 }}
                      onLayout={(evt) => {
                        const { width: cardWidth } = evt.nativeEvent.layout;
                        if (
                          !!scrollSnaps.codes &&
                          scrollSnaps.codes > cardWidth
                        )
                          return;
                        setScrollSnaps({
                          ...scrollSnaps,
                          codes: cardWidth + 20,
                        });
                      }}>
                      <CodeCardProfile
                        code={current.code}
                        name={current.name}
                        link={current.link}
                        checkInID={current.checkInID}
                      />
                    </View>
                  );
                }}
                intervalSnap={scrollSnaps.codes || 270}
              />
            </>
          )}
          {/*  */}
          {/*  */}
          {/* BUDDIES */}
          {mainState.partners.some(
            (c) => mainState.user?.buddies?.indexOf(c.partnerID) > -1,
          ) && (
              <>
                <View style={{ marginBottom: setMarginBottom / 1.5 }} />
                <PubInHorizontalWrapper
                  title={t('buddyCount', {
                    num: mainState.partners.filter(
                      (c) => mainState.user?.buddies?.indexOf(c.partnerID) > -1,
                    ).length,
                  })}
                  arr={
                    mainState.partners
                      .filter(
                        (c) => mainState.user?.buddies?.indexOf(c.partnerID) > -1,
                      )
                      .sort(compareNames) || []
                  }
                  intervalSnap={layout_styles.content_card_width.width}
                  item={(current) => (
                    <View key={current.partnerID}>
                      <PartnerCard current={current} horizontal />
                    </View>
                  )}
                />
              </>
            )}
          {/*  */}
          {/*  */}
          {/* MY BUNDLES */}
          <View style={{ marginBottom: setMarginBottom / 1.5 }} />
          <PubInHorizontalWrapper
            title={t('myBundles')}
            arr={
              [
                {
                  name: t('myfavorites'),
                  pubCount: mainState.user?.favorites.length,
                  bb_id: 'Favs',
                  imgURL:
                    'https://www.telegraph.co.uk/content/dam/news/2022/06/14/TELEMMGLPICT000299652219_trans_NvBQzQNjv4BqJkc7NmLJYb7Qeh76GYfdoUGbA3a35YtVF-k8BRxqJlY.jpeg',
                },
                ...mainState.user?.bundles,
                ...mainState.allPublicPubBundles.filter(
                  (c) => c.admin === mainState.userID,
                ),
              ] || []
            }
            item={(current) => {
              return (
                <View
                  key={current.bb_id || Math.random()}
                  style={[{ marginRight: 20 }]}
                  onLayout={(evt) => {
                    const { width: cardWidth } = evt.nativeEvent.layout;
                    setScrollSnaps({
                      ...scrollSnaps,
                      bundles: cardWidth + 20,
                    });
                  }}>
                  <PubBundleCard
                    click={() => {
                      if (current.bb_id !== 'Favs')
                        return navigation.push('PubBundle', {
                          selectedPubBundle: current,
                        });
                      return navigation.push('Favorites');
                    }}
                    name={current.name}
                    pubCount={current.pubCount}
                    imgURL={current.imgURL || t('defaultBanner')}
                    bb_id={current.bb_id}
                  />
                </View>
              );
            }}
            click1={{
              icon: (
                <Plus_With_Circle
                  styles={layout_styles.extra_s_icon}
                  color={yellow}
                />
              ),
              click: () => navigation.push('NewPubBundle'),
            }}
            intervalSnap={scrollSnaps.bundles || 268.5}
          />
          {/*  */}
          {/*  */}
          {/* PUBS */}
          {!!favoritePubs.length && (
            <>
              <View style={{ marginBottom: setMarginBottom / 1.5 }} />
              <PubInHorizontalWrapper
                title={t('favoritePubs')}
                arr={favoritePubs || []}
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
                      <PubCardHorizontal
                        current={{
                          ...current,
                          // distanceRouteDisplay: '1.3km',
                        }}
                      />
                    </View>
                  );
                }}
                intervalSnap={scrollSnaps.pubs || 270}
              />
            </>
          )}
          {/*  */}
          {/*  */}
          {/* BADGES */}
          {!!badges.length && (
            <>
              <View style={{ marginBottom: setMarginBottom / 1.5 }} />
              <PubInHorizontalWrapper
                title={t('badges')}
                arr={badges}
                item={(current) => {
                  return (
                    <View key={Math.random()} style={{ marginRight: 20 }}>
                      <Badge
                        num={current}
                        styles={{
                          width: screenWidth * 0.225,
                          height: screenWidth * 0.225 * 1.1638275,
                        }}
                      />
                    </View>
                  );
                }}
              />
            </>
          )}
          {/*  */}
          {/*  */}
          {/* PUBLIC BUNDLES */}
          {!!mainState.publicPubBundles.length && (
            <>
              <View style={{ marginBottom: setMarginBottom / 1.5 }} />
              <PubInHorizontalWrapper
                title={t('publicBundles')}
                arr={
                  mainState.publicPubBundles?.filter(
                    (c) => c.admin !== mainState.userID,
                  ).sort(sortAfterPubCount) || []
                }
                item={(current) => {
                  return (
                    <View
                      key={current.bb_id}
                      style={{ marginRight: 20 }}
                      onLayout={(evt) => {
                        const { width: cardWidth } = evt.nativeEvent.layout;
                        setScrollSnaps({
                          ...scrollSnaps,
                          public: cardWidth + 20,
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
                        imgURL={current.imgURL}
                        bb_id={current.bb_id}
                      />
                    </View>
                  );
                }}
                intervalSnap={scrollSnaps.public || 268.5}
              />
            </>
          )}
          {/*  */}
          {/*  */}
          {/* MY PUBINS */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingTop: setMarginBottom,
              paddingBottom: setMarginBottom / 2,
            }}>
            <Text
              style={[
                layout_styles.normal_font,
                {
                  fontSize: normalizeFontSize(14), // before 16
                  lineHeight: normalizeFontSize(16), // 18
                  marginRight: 10,
                  color: whiteColor,
                },
              ]}>
              {t('myPubIns')}
            </Text>
            <TouchableOpacity
              style={{ marginLeft: 'auto' }}
              onPress={() => navigation.push('NewPubIn')}>
              <Plus_With_Circle styles={layout_styles.extra_s_icon} />
            </TouchableOpacity>
          </View>
          {!!mainState.user?.pub_ins?.length ? (
            <>
              {mainState.user?.pub_ins?.sort(sortAfterTime).map((current) => {
                return (
                  <View key={current.pubin_id}>
                    <ListItemPubIn
                      imgURL={
                        current.imgURL ||
                        'https://i.ibb.co/bzQ4cK7/Default-IMG.jpg'
                      }
                      itemClicked={() =>
                        navigation.push('PubIn', {
                          selectedPubIn: current,
                        })
                      }
                      pub_id={current.pub_id}
                      userID={current.userID}
                      createdAt={current.time}
                    />
                  </View>
                );
              })}
            </>
          ) : (
            <>
              <PrimaryButton_Outline
                text={t('firstPubInBTN')}
                buttonClicked={() => navigation.push('NewPubIn')}
              />
            </>
          )}
          <View style={{ height: screenWidth * 0.25 }} />
        </ScrollView>
      }
      overlay={
        <ModalOverlay
          str="@FirstOpen_Profile"
          ignoreSkip
          downSteps={[
            {
              title: t('welcomeToProfile'),
              icon: <Logo_Icon styles={layout_styles.l_icon} color={yellow} />,
            },
            {
              title: t('inviteFriendsOverlay'),
              icon: (
                <Friend_Icon styles={layout_styles.m_icon} color={yellow} />
              ),
              click: {
                text: t('inviteFriendsBTN'),
                click: () => {
                  if (Platform.OS === 'android') {
                    StoreValueLocally('@DontTrackAppChange', 'True');
                  }
                  setTimeout(() => {
                    Share.share({
                      title: t('inviteFriends'),
                      message:
                        Platform.OS === 'android'
                          ? decodedAndroidSharingURL(
                            t('inviteFriendsMsg', {
                              url: `https://www.pub-up.de/people/${mainState.userID}`,
                            }),
                          )
                          : t('inviteFriendsMsgWithOutURL'),
                      url: `https://www.pub-up.de/people/${mainState.userID}`,
                    });
                  }, 500);
                },
              },
            },
            {
              title: t('firstBundleMsg'),
              icon: (
                <BarBundleFilled_Icon
                  styles={layout_styles.m_icon}
                  color={yellow}
                />
              ),
              click: {
                text: t('firstBundleBTN'),
                click: () => navigation.push('NewPubBundle'),
              },
            },
            {
              title: t('firstPubInMsg'),
              icon: (
                <PubIn_Icon styles={layout_styles.m_icon} setColor={yellow} />
              ),
              click: {
                text: t('firstPubInBTN'),
                click: () => navigation.push('NewPubIn'),
              },
            },
          ]}
        />
      }
    />
  );
};

export default MyProfile;
