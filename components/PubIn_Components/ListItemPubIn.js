import MaskedView from '@react-native-masked-view/masked-view';
import { getDistance } from 'geolib';
import moment from 'moment';
import 'moment/locale/de';
import React, { useContext } from 'react';
import { StyleSheet, TouchableHighlight, View, Text, Image } from 'react-native';
import { Circle_95_Icon } from '../../content/Icons';
import MainContext from '../../context/MainContext';
import { red, whiteColor } from '../../styles/Colors';
import { screenWidth } from '../../utilities/WidthAndHeight';
import ListItemPub from '../ListItems/ListItemPub';
import PubInBubbles from './PubInBubbles';
import LinearGradient from 'react-native-linear-gradient';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';
import GetEntireProfile from '../../utilities/GetEntireProfile';
import { useNavigation } from '@react-navigation/native';
import Fonts from '../../content/Fonts';
import { normalizeFontSize } from '../../utilities/ResFontSize';
import layout_styles from '../../styles/Layout_Styles';

const ListItemPubIn = ({
  imgURL,
  itemClicked,
  imgURL_Bubble,
  pub_id,
  userID,
  createdAt,
}) => {
  const { mainState, setToast } = useContext(MainContext);
  const size = screenWidth - layout_styles.content_container.paddingRight * 2;
  const bubbleRatio = 0.275;
  const navigation = useNavigation();
  const { t } = useTranslation();
  const styles = StyleSheet.create({
    container: {
      position: 'relative',
      width: size,
      height: size,
    },
    bubble_container: {
      position: 'absolute',
      left: 'auto',
      right: 10,
      top: size - size * bubbleRatio * 0.8,
      zIndex: 2,
    },
    bubble_background: {
      position: 'absolute',
      left: 'auto',
      right: 10,
      top: size - size * bubbleRatio * 0.8,
      zIndex: 2,
    },
    info_container: {
      width: size,
      height: size - (size - size * bubbleRatio * 0.8) + 10,
      position: 'absolute',
      top: 'auto',
      bottom: 0,
    },
    text_container: {
      height: '100%',
      zIndex: 3,
      width: !!imgURL_Bubble ? '50%' : '75%',
      marginLeft: !!imgURL_Bubble ? size * 0.125 : size * 0.175,
      justifyContent: 'center',
    },
  });
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
  const openProfile = async () => {
    try {
      const getUser = await GetEntireProfile(userID, true);
      navigation.push('Profile', {
        userID,
        ...getUser,
      });
    } catch {
      setToast({
        color: red,
        text: t('errorBasic'),
      });
    }
  };
  return (
    <TouchableHighlight
      style={{
        marginBottom: 60,
      }}
      onPress={itemClicked}>
      <View style={styles.container}>
        {!!imgURL && (
          <MaskedView
            maskElement={
              <Circle_95_Icon
                style={{
                  width: size,
                  height: size,
                }}
              />
            }>
            <Image
              source={{
                uri: imgURL,
                cache: 'force-cache',
              }}
              style={{
                width: size,
                height: size,
              }}
            />
          </MaskedView>
        )}
        {!!imgURL_Bubble && (
          <View style={styles.bubble_container}>
            <PubInBubbles
              imgURL={imgURL_Bubble}
              primaryClick={openProfile}
              setSize={size * bubbleRatio}
              noMarginLeft
            />
          </View>
        )}
        <View style={styles.info_container}>
          <LinearGradient
            colors={[
              'rgba(23,30,52,1)',
              'rgba(23,30,52,0.7)',
              'rgba(23,30,52,0)',
            ]}
            style={{ width: '100%', height: '100%' }}
            useAngle={true}
            angle={0}>
            <View style={styles.text_container}>
              {!!pub_id ? (
                <>
                  {mainState.kneipen
                    .filter((c) => {
                      const findID = c.lokal_id || c._id;
                      if (findID === pub_id) return c;
                    })
                    .map((c) => {
                      let getFromNow = `${moment
                        .unix(createdAt)
                        .locale(i18next.language)
                        .fromNow()}`;
                      let getDistanceDisplay;
                      if (mainState.locationGranted) {
                        getDistanceDisplay = getDistanceDisplayForEach(c);
                        getDistanceDisplay = t('distance', {
                          distance: getDistanceDisplay,
                        });
                      }
                      return (
                        <View key={c._id}>
                          <ListItemPub
                            current={c}
                            setMarginLeft={10}
                            small
                            setSub={`${getFromNow}\n${getDistanceDisplay}`}
                            white
                          />
                        </View>
                      );
                    })}
                </>
              ) : (
                <Text
                  style={{
                    color: whiteColor,
                    fontFamily: Fonts.Bold,
                    marginRight: 25,
                    marginTop: 20,
                    fontSize: normalizeFontSize(12),
                  }}>
                  {moment.unix(createdAt).locale(i18next.language).fromNow()}
                </Text>
              )}
            </View>
          </LinearGradient>
        </View>
      </View>
    </TouchableHighlight>
  );
};

export default ListItemPubIn;
