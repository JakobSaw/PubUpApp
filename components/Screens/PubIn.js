import { getDistance } from 'geolib';
import React, { useContext, useEffect, useState } from 'react';
import {
  Image,
  ImageBackground,
  Platform,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import Fonts from '../../content/Fonts';
import MainContext from '../../context/MainContext';
import { screenHeight, screenWidth } from '../../utilities/WidthAndHeight';
import ListItemPub from '../ListItems/ListItemPub';
import PubInBubbles from '../PubIn_Components/PubInBubbles';
import moment from 'moment';
import 'moment/locale/de';
import PubInHorizontalWrapper from '../PubIn_Components/PubInHorizontalWrapper';
import firestore from '@react-native-firebase/firestore';
import {
  Back_Icon,
  Cross_Icon,
  Rahmen_Icon,
  Report_Icon,
  Share_Icon,
  Trash_Icon,
} from '../../content/Icons';
import layout_styles from '../../styles/Layout_Styles';
import { Emoji } from '../../content/Emoji';
import InputTextArea from '../Inputs/InputTextArea';
import PrimaryButton from '../Buttons/PrimaryButton';
import {
  darkblue,
  lightblue,
  red,
  whiteColor,
  yellow,
} from '../../styles/Colors';
import Emojis from '../../content/Emojis';
import ImageZoom from 'react-native-image-pan-zoom';
import { useNavigation } from '@react-navigation/native';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';
import { showAlert } from 'react-native-customisable-alert';
import CustomAlert from '../CustomAlert';
import GetEntireProfile from '../../utilities/GetEntireProfile';
import { normalizeFontSize } from '../../utilities/ResFontSize';
import LayoutContainer from '../../utilities/LayoutContainer';
import FillUpComplete from '../../utilities/FillUpComplete';
import CountInteraction from '../../utilities/CountInteraction';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import SentPush from '../../utilities/SentPush';
import PushTexts from '../../content/PushTexts';
import StoreValueLocally from '../../utilities/StoreValueLocally';
import decodedAndroidSharingURL from '../../utilities/decodedAndroidSharingURL';

const PubIn = ({ route }) => {
  const { mainState, setMainState, setToast } = useContext(MainContext);
  const [showZoomImage, setShowZoomImage] = useState(null);
  const imgSize = screenHeight * 0.6;
  const size = imgSize * 0.22;
  const large = screenHeight * 0.1;
  const [imageRealSize, setImageRealSize] = useState({
    takeSize: 'width',
    ratio: 1,
  });
  const [showReport, setShowReport] = useState(false);
  const [reportText, setReportText] = useState('');
  const { params } = route;
  const { t } = useTranslation();
  const navigation = useNavigation();
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
      return `${distanceKM2} km`;
    } else {
      return `${distance} m`;
    }
  }
  const sortAfterReactedAt = (a, b) => {
    if (a.reactedAt > b.reactedAt) {
      return -1;
    } else if (a.reactedAt < b.reactedAt) {
      return 1;
    } else {
      return 0;
    }
  };
  const scaleScreenHeight = screenHeight * 0.7;
  const styles = StyleSheet.create({
    image_container: {
      position: 'relative',
    },
    image: {
      height: imgSize,
      width: '100%',
    },
    rahmen: {
      position: 'absolute',
      top: 'auto',
      bottom: 0,
    },
    bubble_container: {
      position: 'absolute',
      left: 'auto',
      right: screenWidth * 0.075,
      top: imgSize - size * 0.8,
    },
    main: {
      flexDirection: 'row',
      // backgroundColor: 'purple',
      flexWrap: 'wrap',
    },
  });
  function compareNames(a, b) {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  }

  const onSubmit = () => {
    setMainState({
      ...mainState,
      complete: {
        ...mainState.complete,
        mails: [
          ...mainState.complete.mails,
          {
            name: `PubIn Report: ${params?.selectedPubIn?.pubin_id}`,
            adress: `PubIn Report: ${params?.selectedPubIn?.comment} PubInIMG: ${params?.selectedPubIn?.imgURL}`,
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
  const openProfile = async (downID) => {
    if (
      (!downID && params?.selectedPubIn?.userID === mainState.userID) ||
      params?.selectedPubIn?.userID === mainState.userID
    )
      return;
    try {
      const getUser = await GetEntireProfile(
        downID || params?.selectedPubIn?.userID,
        true,
      );
      navigation.push('Profile', {
        userID: downID || params?.selectedPubIn?.userID,
        ...getUser,
      });
    } catch {
      setToast({
        color: red,
        text: t('errorBasic'),
      });
    }
  };

  useEffect(() => {
    setShowReport(false);
    setReportText('');
  }, []);

  return (
    <LayoutContainer
      pubin
      content={
        <KeyboardAwareScrollView
          enableOnAndroid={true}
          enableAutomaticScroll={Platform.OS === 'ios'}
          showsVerticalScrollIndicator={false}>
          {!!showZoomImage && (
            <View
              style={{
                position: 'absolute',
                zIndex: 100,
                backgroundColor: darkblue,
                paddingTop:
                  imageRealSize.takeSize === 'height' ? screenHeight * 0.15 : 0,
                ...StyleSheet.absoluteFill,
              }}>
              <ImageZoom
                cropWidth={screenWidth}
                cropHeight={scaleScreenHeight}
                imageWidth={
                  imageRealSize.takeSize === 'width'
                    ? screenWidth
                    : scaleScreenHeight * imageRealSize.ratio
                }
                imageHeight={
                  imageRealSize.takeSize === 'height'
                    ? scaleScreenHeight
                    : screenWidth * imageRealSize.ratio
                }>
                <Image
                  style={{
                    width:
                      imageRealSize.takeSize === 'width'
                        ? screenWidth
                        : scaleScreenHeight * imageRealSize.ratio,
                    height:
                      imageRealSize.takeSize === 'height'
                        ? scaleScreenHeight
                        : screenWidth * imageRealSize.ratio,
                  }}
                  source={{ uri: showZoomImage, cache: 'only-if-cached' }}
                  onLoad={({
                    nativeEvent: {
                      source: { width, height },
                    },
                  }) => {
                    if (width >= height) {
                      setImageRealSize({
                        ratio: height / width,
                        takeSize: 'width',
                      });
                    } else {
                      setImageRealSize({
                        ratio: width / height,
                        takeSize: 'height',
                      });
                    }
                  }}
                />
              </ImageZoom>
              <TouchableHighlight
                onPress={() => {
                  setShowZoomImage(null);
                }}
                style={{
                  position: 'absolute',
                  zIndex: 101,
                  top: screenHeight * 0.05,
                  left: 'auto',
                  right: screenWidth * 0.05,
                  padding: 10,
                }}>
                <>
                  <Cross_Icon
                    styles={layout_styles.s_icon}
                    color={whiteColor}
                  />
                </>
              </TouchableHighlight>
            </View>
          )}
          {!!params?.selectedPubIn?.imgURL && (
            <TouchableOpacity
              style={styles.image_container}
            /* onPress={() => setShowZoomImage(params?.selectedPubIn?.imgURL)} */
            >
              <>
                <ImageBackground
                  source={{
                    uri: params?.selectedPubIn?.imgURL,
                    cache: 'force-cache',
                  }}
                  resizeMode="cover"
                  style={styles.image}
                />
                <View style={[styles.rahmen]}>
                  <Rahmen_Icon />
                </View>
              </>
            </TouchableOpacity>
          )}
          <View style={styles.bubble_container}>
            <PubInBubbles
              imgURL={params?.selectedPubIn?.imgURL_Bubble}
              btnIcon={`emoji_${params?.selectedPubIn?.mood}`}
              primaryClick={openProfile}
              setSize={size}
              noMarginLeft
              setSizeOfSmall={!params?.selectedPubIn?.imgURL_Bubble ? 0.8 : 0.4}
            />
          </View>
          {!showReport && (
            <>
              <View
                style={[
                  { paddingTop: 50 },
                  layout_styles.just_modal_container_paddings_left_right,
                ]}>
                <View style={styles.main}>
                  {!!params?.selectedPubIn?.pub_id &&
                    mainState.kneipen
                      .filter((c) => {
                        const findID = c.lokal_id || c._id;
                        if (findID === params?.selectedPubIn?.pub_id) return c;
                      })
                      .map((c) => {
                        let distance;
                        if (mainState.locationGranted) {
                          const getDistanceDisplay =
                            getDistanceDisplayForEach(c);
                          distance = t('distance', {
                            distance: getDistanceDisplay,
                          });
                        }
                        return (
                          <View
                            key={c._id}
                            style={{ width: '47.5%', maxWidth: '47.5%' }}>
                            <ListItemPub
                              current={c}
                              setMarginLeft={10}
                              setSub={distance}
                              buttonClicked={() => {
                                const getID = c.lokal_id || c._id;
                                const getPub = mainState.kneipen.find(
                                  (cf) =>
                                    cf._id === getID || cf.lokal_id === getID,
                                );
                                setMainState({
                                  ...mainState,
                                  regionToAnimate: {
                                    latitude: getPub.latitude,
                                    longitude: getPub.longitude,
                                    latitudeDelta: 0.005,
                                    longitudeDelta: 0.005,
                                  },
                                  complete: {
                                    ...mainState.complete,
                                    interactions: [
                                      ...mainState.complete.interactions,
                                      {
                                        lokal_name: getPub.name,
                                        lokal_id: getPub.lokal_id || getPub._id,
                                        action: 'clickOnIt',
                                        ...FillUpComplete(),
                                      },
                                    ],
                                  },
                                  collectPubsToPushToDB: [
                                    ...mainState.collectPubsToPushToDB,
                                    getPub.lokal_id || getPub._id,
                                  ],
                                });
                                CountInteraction();
                                navigation.push('Pub', {
                                  ...getPub,
                                });
                              }}
                              white
                            />
                          </View>
                        );
                      })}
                  <View style={{ width: '5%' }} />
                  <View
                    style={{
                      paddingTop: 10,
                      width: '47.5%',
                      maxWidth: '47.5%',
                    }}>
                    {!!params?.selectedPubIn?.comment && (
                      <Text
                        style={[
                          {
                            fontFamily: Fonts.Bold,
                            color: whiteColor,
                            fontSize: normalizeFontSize(14), // before 16
                          },
                        ]}>
                        "{params?.selectedPubIn?.comment}"
                      </Text>
                    )}
                    <Text
                      style={[
                        {
                          fontFamily: !!params?.selectedPubIn?.comment
                            ? Fonts.Light
                            : Fonts.Bold,
                          color: whiteColor,
                          fontSize: !!params?.selectedPubIn?.comment
                            ? normalizeFontSize(12)
                            : normalizeFontSize(14), // before 14 : 16
                        },
                      ]}>
                      {moment
                        .unix(params?.selectedPubIn?.time)
                        .locale(i18next.language)
                        .fromNow()}
                    </Text>
                  </View>
                </View>
                {!!params?.selectedPubIn?.friends.length && (
                  <>
                    <View style={{ marginBottom: large / 2.5 }} />
                    <PubInHorizontalWrapper
                      title={t('friends', {
                        num: params?.selectedPubIn?.friends?.length,
                      })}
                      arr={
                        params?.selectedPubIn?.friends.sort(compareNames) || []
                      }
                      item={(current) => {
                        return (
                          <View key={current.userID}>
                            <PubInBubbles
                              imgURL={
                                current.profileIMG ||
                                'https://i.ibb.co/bzQ4cK7/Default-IMG.jpg'
                              }
                              primaryClick={() => {
                                if (current.userID === mainState.userID) return;
                                console.log('CLICK Open Profile', current);
                                openProfile(current.userID);
                              }}
                              setSize={screenWidth * 0.225}
                            />
                          </View>
                        );
                      }}
                      white
                      withArrow
                    />
                  </>
                )}
                {!!params?.selectedPubIn?.reactions.length && (
                  <>
                    <View style={{ marginBottom: large / 2.5 }} />
                    <PubInHorizontalWrapper
                      title={t('reactions')}
                      arr={params?.selectedPubIn?.reactions.sort(
                        sortAfterReactedAt,
                      )}
                      item={(current) => {
                        return (
                          <View key={`${current.sender}_${Math.random()}`}>
                            <PubInBubbles
                              imgURL={
                                current.imgURL ||
                                'https://i.ibb.co/bzQ4cK7/Default-IMG.jpg'
                              }
                              btnIcon={`emoji_${current.emoji}`}
                              setSize={screenWidth * 0.225}
                              setSizeOfSmall={0.65}
                            />
                          </View>
                        );
                      }}
                      white
                      withArrow
                    />
                  </>
                )}
                {params?.selectedPubIn?.userID !== mainState.userID && (
                  <>
                    <View style={{ marginBottom: large / 2.5 }} />
                    <PubInHorizontalWrapper
                      withArrow
                      title={t('myReaction')}
                      arr={Emojis}
                      item={(current) => {
                        return (
                          <TouchableHighlight
                            key={current}
                            onPress={async () => {
                              try {
                                const newReaction = {
                                  sender: mainState.userID,
                                  emoji: current,
                                  imgURL: mainState.user?.profileIMG,
                                  reactedAt: Date.now(),
                                };
                                const getUser = await firestore()
                                  .collection('users')
                                  .doc(params?.selectedPubIn?.userID)
                                  .get();
                                const { _data } = getUser;
                                // sent Push
                                await firestore()
                                  .collection('users')
                                  .doc(params?.selectedPubIn?.userID)
                                  .update({
                                    pub_ins: [
                                      ..._data.pub_ins.filter(
                                        (c) =>
                                          c.pubin_id !==
                                          params?.selectedPubIn?.pubin_id,
                                      ),
                                      {
                                        ...params?.selectedPubIn,
                                        reactions: [
                                          ...params?.selectedPubIn?.reactions,
                                          newReaction,
                                        ],
                                      },
                                    ],
                                  });
                                navigation.setParams({
                                  ...params,
                                  selectedPubIn: {
                                    ...params?.selectedPubIn,
                                    reactions: [
                                      ...params?.selectedPubIn?.reactions,
                                      newReaction,
                                    ],
                                  },
                                });
                                setToast({
                                  color: lightblue,
                                  text: t('reactionSent'),
                                });
                                SentPush({
                                  allIDs: [params?.selectedPubIn?.userID],
                                  de: PushTexts(
                                    'pubInReaction',
                                    'de',
                                    mainState.user?.username,
                                  ),
                                  en: PushTexts(
                                    'pubInReaction',
                                    'en',
                                    mainState.user?.username,
                                  ),
                                  url: `people/pubin${params?.selectedPubIn?.userID}_${params?.selectedPubIn?.pubin_id}`,
                                });
                              } catch (err) {
                                console.log('err :>> ', err);
                              }
                            }}>
                            <Emoji
                              emoji={current}
                              styles={{ height: 65, width: 65 }}
                            />
                          </TouchableHighlight>
                        );
                      }}
                      white
                    />
                  </>
                )}
                <View style={{ marginBottom: large }} />
                <View
                  style={{
                    justifyContent: 'flex-end',
                    width: '100%',
                    flexDirection: 'row',
                  }}>
                  <TouchableHighlight
                    style={{
                      alignSelf: 'flex-end',
                      padding: 10,
                      marginRight: 20,
                    }}
                    onPress={() => {
                      if (Platform.OS === 'android') {
                        StoreValueLocally('@DontTrackAppChange', 'True');
                      }
                      setTimeout(() => {
                        Share.share({
                          title: t('sharePubIn'),
                          message:
                            Platform.OS === 'android'
                              ? decodedAndroidSharingURL(
                                t('sharePubInMsg', {
                                  url: `https://www.pub-up.de/people/pubin${params?.selectedPubIn?.userID}_${params?.selectedPubIn?.pubin_id}`,
                                }),
                              )
                              : t('sharePubInMsgWithOutURL'),
                          url: `https://www.pub-up.de/people/pubin${params?.selectedPubIn?.userID}_${params?.selectedPubIn?.pubin_id}`,
                        });
                      }, 500);
                    }}>
                    <Share_Icon styles={layout_styles.s_icon} color={yellow} />
                  </TouchableHighlight>
                  {params?.selectedPubIn?.userID === mainState.userID && (
                    <TouchableHighlight
                      onPress={async () => {
                        showAlert({
                          alertType: 'custom',
                          customAlert: (
                            <CustomAlert
                              title={t('pubInDelete')}
                              sub={t('undone')}
                              icon={
                                <Emoji
                                  emoji="fire"
                                  styles={layout_styles.l_icon}
                                />
                              }
                              click={async () => {
                                try {
                                  const getUser = await firestore()
                                    .collection('users')
                                    .doc(mainState.userID)
                                    .get();
                                  const { _data } = getUser;
                                  await firestore()
                                    .collection('users')
                                    .doc(mainState.userID)
                                    .update({
                                      pub_ins: [
                                        ..._data.pub_ins.filter(
                                          (c) =>
                                            c.pubin_id !==
                                            params?.selectedPubIn?.pubin_id,
                                        ),
                                      ],
                                    });
                                  setMainState({
                                    ...mainState,
                                    user: {
                                      ...mainState.user,
                                      pub_ins: [
                                        ...mainState.user.pub_ins.filter(
                                          (c) =>
                                            c.pubin_id !==
                                            params?.selectedPubIn?.pubin_id,
                                        ),
                                      ],
                                    },
                                  });
                                  navigation.goBack();
                                  setToast({
                                    color: lightblue,
                                    text: t('pubInDeleted'),
                                  });
                                } catch (err) {
                                  console.log('err :>> ', err);
                                }
                              }}
                              buttonWordingYes={t('delete')}
                            />
                          ),
                        });
                      }}
                      style={{
                        alignSelf: 'flex-end',
                        padding: 10,
                      }}>
                      <Trash_Icon styles={layout_styles.s_icon} />
                    </TouchableHighlight>
                  )}
                  {params?.selectedPubIn?.userID !== mainState.userID && (
                    <TouchableHighlight
                      onPress={() => {
                        setShowReport(true);
                      }}
                      style={{
                        alignSelf: 'flex-end',
                        padding: 10,
                      }}>
                      <Report_Icon
                        styles={layout_styles.s_icon}
                        color={yellow}
                      />
                    </TouchableHighlight>
                  )}
                </View>
                <View style={{ marginBottom: large / 2 }} />
              </View>
            </>
          )}
          {showReport && (
            <View
              style={[
                layout_styles.just_modal_container_paddings_left_right,
                { marginTop: 60, paddingBottom: screenHeight * 0.4 },
              ]}>
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
                text="Send"
                buttonClicked={onSubmit}
              />
              <View
                style={[
                  // styles.inner_container_3,
                  layout_styles.padding_elements_top,
                  // layout_styles.padding_elements_bottom,
                ]}>
                <TouchableHighlight
                  onPress={() => {
                    setShowReport(false);
                  }}>
                  <Back_Icon />
                </TouchableHighlight>
              </View>
            </View>
          )}
        </KeyboardAwareScrollView>
      }
    />
  );
};

export default PubIn;
