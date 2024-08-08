import React, {useCallback, useContext, useState} from 'react';
import {Text, View, ScrollView} from 'react-native';
import layout_styles from '../../styles/Layout_Styles';
import {useTranslation} from 'react-i18next';
import {green, lightblue, whiteColor, yellow} from '../../styles/Colors';
import {screenHeight, screenWidth} from '../../utilities/WidthAndHeight';
import MainContext from '../../context/MainContext';
import PubInBubbles from '../PubIn_Components/PubInBubbles';
import PubInHorizontalWrapper from '../PubIn_Components/PubInHorizontalWrapper';
import {Plus_With_Circle} from '../../content/Icons';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {showAlert} from 'react-native-customisable-alert';
import CustomAlert from '../CustomAlert';
import {Badge} from '../../content/Badges';
import PubBundleCard from '../Cards/PubBundleCard';
import PubCardHorizontal from '../Cards/PubCardHorizontal';
import ListItemPubIn from '../PubIn_Components/ListItemPubIn';
import {Emoji} from '../../content/Emoji';
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';
import i18next from 'i18next';
import Fonts from '../../content/Fonts';
import {normalizeFontSize} from '../../utilities/ResFontSize';
import LayoutContainer from '../../utilities/LayoutContainer';
import PartnerCard from '../Cards/PartnerCard';
import SentPush from '../../utilities/SentPush';
import PushTexts from '../../content/PushTexts';

const Profile = ({route}) => {
  const {t} = useTranslation();
  const [badges, setBadges] = useState([]);
  const {mainState, setToast, setMainState} = useContext(MainContext);
  const navigation = useNavigation();
  const setMarginBottom = screenHeight * 0.05;
  const {params} = route;
  const [scrollSnaps, setScrollSnaps] = useState({});
  const [favoritePubs, setFavoritePubs] = useState([]);

  // Utilities
  const sentFriendRequest = (ID, username, IMG) => {
    showAlert({
      alertType: 'custom',
      customAlert: (
        <CustomAlert
          title={t('sendFriendsRequest', {
            name: username,
          })}
          sub={t('sendFriendsRequestMsg', {
            name: username,
          })}
          icon={<Emoji emoji="love" styles={layout_styles.l_icon} />}
          click={async () => {
            await firestore()
              .collection('friends')
              .add({
                accepted: false,
                pubs_ins: [],
                friend1: mainState.userID,
                friend1IMG: mainState.user?.profileIMG,
                friend1username: mainState.user?.username,
                friend2: ID,
                friend2IMG: IMG || t('defaultBanner'),
                friend2username: username,
              });
            setToast({
              color: green,
              text: t('sentFriendsRequest'),
            });
            SentPush({
              allIDs: [ID],
              de: PushTexts('newFriendRequest', 'de', mainState.user?.username),
              en: PushTexts('newFriendRequest', 'en', mainState.user?.username),
              url: `people/${mainState.userID}`,
            });
          }}
          buttonWordingYes={t('send')}
        />
      ),
    });
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

  // setBadges
  useFocusEffect(
    useCallback(() => {
      const collectBadges = [];
      const getBundlesNum = [
        ...params?.bundles,
        ...mainState.allPublicPubBundles.filter(
          (c) => c.admin === params?.userID,
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
      const getPubInsNum = params?.pub_ins?.length;
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
      if (!!params?.pubs?.length) {
        collectFavoritePubIDs = [...params?.pubs];
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
              marginBottom: setMarginBottom,
              marginTop: setMarginBottom / 2,
            }}>
            <PubInBubbles
              imgURL={params?.profileIMG || t('defaultBanner')}
              // setSize={150}
              setSize={screenWidth * 0.4}
              noMarginLeft
            />
          </View>
          {!!params?.username && (
            <Text
              style={[layout_styles.font_styling_h2, {textAlign: 'center'}]}>
              {params?.username}
            </Text>
          )}
          <Text
            style={[
              layout_styles.font_styling_h4,
              {textAlign: 'center', marginTop: 10, fontFamily: Fonts.Bold},
            ]}>
            {t('joined', {
              date: moment
                .unix(params?.joined / 1000 - 890000)
                .locale(i18next.language)
                .fromNow(),
            })}
          </Text>
          <View style={{marginBottom: setMarginBottom / 1.5}} />
          {/*  */}
          {/*  */}
          {/* FRIENDS */}
          {!!params?.friends?.length && (
            <>
              <View style={{marginBottom: setMarginBottom / 1.5}} />
              <PubInHorizontalWrapper
                title={t('friends', {
                  num: params?.friends?.length,
                })}
                arr={params?.friends.sort(compareNames) || []}
                item={(current) => (
                  <View key={Math.random()}>
                    <PubInBubbles
                      imgURL={
                        current.friend1 === params?.userID
                          ? current.friend2IMG
                          : current.friend1IMG
                      }
                      imgBack={
                        current.friend1 === params?.userID
                          ? current.friend2username
                          : current.friend1username
                      }
                      secondaryClick={() =>
                        current.friend1 === mainState.userID ||
                        current.friend2 === mainState.userID
                          ? null
                          : sentFriendRequest(
                              current.friend1 === params?.userID
                                ? current.friend2
                                : current.friend1,
                              current.friend1 === params?.userID
                                ? current.friend2username
                                : current.friend1username,
                              current.friend1 === params?.userID
                                ? current.friend2IMG
                                : current.friend1IMG,
                            )
                      }
                      btnIcon={
                        current.friend1 === mainState.userID ||
                        current.friend2 === mainState.userID
                          ? null
                          : 'addFriend'
                      }
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
          {/* BUDDIES */}
          {mainState.partners.some(
            (c) => params?.buddies?.indexOf(c.partnerID) > -1,
          ) && (
            <>
              <View style={{marginBottom: setMarginBottom / 1.5}} />
              <PubInHorizontalWrapper
                title={t('buddyCount', {
                  num: mainState.partners.filter(
                    (c) => params?.buddies?.indexOf(c.partnerID) > -1,
                  ).length,
                })}
                arr={
                  mainState.partners
                    .filter((c) => params?.buddies?.indexOf(c.partnerID) > -1)
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
          {!![
            ...mainState.allPublicPubBundles.filter(
              (c) => c.admin === params?.userID,
            ),
          ].length && (
            <>
              <View style={{marginBottom: setMarginBottom / 1.5}} />
              <PubInHorizontalWrapper
                title={t('myBundles')}
                arr={
                  [
                    ...mainState.allPublicPubBundles.filter(
                      (c) => c.admin === params?.userID,
                    ),
                  ] || []
                }
                item={(current) => {
                  return (
                    <View
                      key={current.bb_id || Math.random()}
                      style={{marginRight: 20}}
                      onLayout={(evt) => {
                        const {width: cardWidth} = evt.nativeEvent.layout;
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
            </>
          )}
          {/*  */}
          {/*  */}
          {/* PUBS */}
          {!!favoritePubs.length && (
            <>
              <View style={{marginBottom: setMarginBottom / 1.5}} />
              <PubInHorizontalWrapper
                title={t('favoritePubs')}
                arr={favoritePubs || []}
                item={(current) => {
                  return (
                    <View
                      key={current._id}
                      style={{marginRight: 20}}
                      onLayout={(evt) => {
                        const {width: cardWidth} = evt.nativeEvent.layout;
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
              <View style={{marginBottom: setMarginBottom / 1.5}} />
              <PubInHorizontalWrapper
                title={t('badges')}
                arr={badges}
                item={(current) => {
                  return (
                    <View key={Math.random()} style={{marginRight: 20}}>
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
          {/* PUBINS */}
          {!!params?.pub_ins?.length && (
            <>
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
                      lineHeight: normalizeFontSize(16), // before 18
                      marginRight: 10,
                      color: whiteColor,
                    },
                  ]}>
                  {params?.pub_ins?.length} PubIns
                </Text>
              </View>
              {params?.pub_ins?.sort(sortAfterTime).map((current) => {
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
          )}
          <View style={{marginBottom: 60}} />
        </ScrollView>
      }
    />
  );
};

export default Profile;
