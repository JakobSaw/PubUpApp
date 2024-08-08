import React, {useContext} from 'react';
import {
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import {darkblue, lightblue, whiteColor, yellow} from '../../styles/Colors';
import layout_styles from '../../styles/Layout_Styles';
import {FullHeart_Icon} from '../../content/Icons';
import {screenHeight, screenWidth} from '../../utilities/WidthAndHeight';
import LinearGradient from 'react-native-linear-gradient';
import MainContext from '../../context/MainContext';

const PubBundleCard = ({click, name, pubCount, imgURL, bb_id}) => {
  const imgHeight = screenHeight * 0.15;
  const cardWidth = screenWidth * 0.6;
  const borderC = whiteColor;
  const borderR = 5;
  const {mainState} = useContext(MainContext);
  return (
    <TouchableOpacity
      style={[
        {
          borderColor: borderC,
          borderRadius: 5,
          borderWidth: 1,
          maxWidth: cardWidth,
          width: cardWidth,
          overflow: 'hidden',
        },
        bb_id === 'Favs' ? {flex: 1} : {},
        !mainState.user?.bundles.length &&
        !mainState.allPublicPubBundles.filter(
          (c) => c.admin === mainState.userID,
        ).length
          ? {
              minHeight: imgHeight * 1.25,
            }
          : {},
      ]}
      onPress={click}>
      <View
        style={{
          paddingVertical: 10,
          paddingHorizontal: 15,
          backgroundColor: darkblue,
          position: 'relative',
          height: bb_id === 'Favs' ? '100%' : imgHeight,
          overflow: 'hidden',
          borderRadius: borderR,
        }}>
        <Text
          numberOfLines={1}
          style={[
            layout_styles.font_styling_h2,
            {zIndex: 3, marginTop: 'auto'},
          ]}>
          {name}
        </Text>
        {!!imgURL && (
          <>
            <LinearGradient
              colors={['rgba(23,30,52,1)', 'rgba(23,30,52,0)']}
              style={[
                {
                  width: cardWidth,
                  position: 'absolute',
                  zIndex: 2,
                },
                bb_id === 'Favs'
                  ? {...StyleSheet.absoluteFill}
                  : {height: imgHeight},
              ]}
              useAngle={true}
              angle={0}
            />
            <ImageBackground
              source={{
                uri: imgURL || 'https://i.ibb.co/6RqCCJJ/Banner-Default-1.jpg',
                cache: 'force-cache',
              }}
              resizeMode="cover"
              style={[
                {
                  width: cardWidth,
                  position: 'absolute',
                },
                bb_id === 'Favs'
                  ? {...StyleSheet.absoluteFill}
                  : {height: imgHeight},
              ]}
            />
          </>
        )}
      </View>
      {bb_id !== 'Favs' && !!pubCount && (
        <View
          style={{
            borderTopColor: borderC,
            borderTopWidth: 1,
            paddingVertical: 5,
            paddingHorizontal: 15,
            flexDirection: 'row',
            zIndex: 3,
            backgroundColor: darkblue,
            overflow: 'hidden',
            borderBottomLeftRadius: borderR,
            borderBottomRightRadius: borderR,
          }}>
          <View style={{maxWidth: '80%' /* , justifyContent: 'center' */}}>
            {!!pubCount && (
              <Text numberOfLines={1} style={[layout_styles.font_styling_h4]}>
                {pubCount} Pubs
              </Text>
            )}
          </View>
          {/* <View style={{marginLeft: 'auto', padding: 5, opacity: 0}}>
            <FullHeart_Icon
              styles={layout_styles.extra_s_icon}
              color={yellow}
            />
          </View> */}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default PubBundleCard;
