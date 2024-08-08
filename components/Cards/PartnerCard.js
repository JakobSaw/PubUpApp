import React, {useContext} from 'react';
import {
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import {darkblue, whiteColor} from '../../styles/Colors';
import layout_styles from '../../styles/Layout_Styles';
import {Circle_95_Icon} from '../../content/Icons';
import {screenHeight, screenWidth} from '../../utilities/WidthAndHeight';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import MaskedView from '@react-native-masked-view/masked-view';
import MainContext from '../../context/MainContext';
import CountInteraction from '../../utilities/CountInteraction';

const PartnerCard = ({current, horizontal = false}) => {
  const {name, bannerIMG, profileIMG, partnerID} = current;
  const navigation = useNavigation();
  const imgHeight = !!horizontal
    ? screenHeight * 0.175
    : layout_styles.content_card_width.width * 0.5625;
  const cardWidth = !!horizontal
    ? layout_styles.content_card_width.width - 19
    : layout_styles.content_card_width.width;
  const borderR = 5;
  const size = !!horizontal ? screenWidth * 0.175 : screenWidth * 0.175;
  const setPaddingLeft = 15;
  const {mainState, setMainState} = useContext(MainContext);
  return (
    <>
      <TouchableOpacity
        style={[
          {
            borderColor: whiteColor,
            borderRadius: borderR,
            borderWidth: 1,
            maxWidth: cardWidth,
            width: cardWidth,
            marginBottom: !!horizontal ? size / 2 : size / 2 + 20,
            overflow: 'hidden',
          },
          !!horizontal ? {marginRight: 20} : {},
        ]}
        onPress={() => {
          setMainState({
            ...mainState,
            complete: {
              ...mainState.complete,
              partnerInteractions: [
                ...mainState.complete.partnerInteractions,
                {
                  partner_id: partnerID,
                  action: 'clickOnIt',
                  item: false,
                },
              ],
            },
          });
          CountInteraction();
          navigation.push('Partner', {
            ...current,
          });
        }}>
        <>
          <View
            style={{
              paddingVertical: 10,
              paddingHorizontal: setPaddingLeft,
              backgroundColor: darkblue,
              position: 'relative',
              borderRadius: borderR,
              overflow: 'hidden',
              height: imgHeight,
            }}>
            <Text
              numberOfLines={1}
              style={[
                layout_styles.font_styling_h2,
                {
                  zIndex: 3,
                  marginTop: 'auto',
                  marginLeft: size + setPaddingLeft,
                },
              ]}>
              {name}
            </Text>
            <LinearGradient
              colors={
                !!horizontal
                  ? [
                      'rgba(23,30,52,1)',
                      'rgba(23,30,52,0.3)',
                      'rgba(23,30,52,0)',
                    ]
                  : [
                      'rgba(23,30,52,1)',
                      'rgba(23,30,52,0.1)',
                      'rgba(23,30,52,0)',
                    ]
              }
              style={[
                {
                  width: cardWidth,
                  position: 'absolute',
                  zIndex: 2,
                  height: imgHeight,
                },
              ]}
              useAngle={true}
              angle={0}
            />
            <View
              style={{
                overflow: 'hidden',
                borderRadius: borderR,
                position: 'absolute',
                width: cardWidth,
                height: imgHeight,
              }}>
              <ImageBackground
                source={{
                  uri:
                    bannerIMG ||
                    'https://i.ibb.co/6RqCCJJ/Banner-Default-1.jpg',
                  cache: 'force-cache',
                }}
                resizeMode="cover"
                style={[
                  {
                    width: '100%',
                    height: '100%',
                  },
                ]}
              />
            </View>
          </View>
        </>
      </TouchableOpacity>
      <MaskedView
        style={{
          width: size,
          height: size,
          position: 'absolute',
          top: imgHeight - size / 2,
          left: setPaddingLeft,
        }}
        maskElement={
          <>
            <Circle_95_Icon
              style={{
                width: size,
                height: size,
              }}
            />
          </>
        }>
        <Image
          source={{
            uri: profileIMG,
          }}
          style={{
            width: size,
            height: size,
            backgroundColor: whiteColor,
          }}
        />
      </MaskedView>
    </>
  );
};

export default PartnerCard;
