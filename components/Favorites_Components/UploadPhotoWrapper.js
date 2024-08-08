import layout_styles from '../../styles/Layout_Styles';
import {
  View,
  TouchableHighlight,
  Text,
  ImageBackground,
  Linking,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  Circle_95_Icon,
  ElementLink_Icon,
  PhotoGallery_Icon,
  Photo_Icon,
  Tick_Icon,
} from '../../content/Icons';
import {
  darkblue,
  green,
  lightblue,
  whiteColor,
  yellow,
} from '../../styles/Colors';
import Loading from '../../utilities/Loading';
import MaskedView from '@react-native-masked-view/masked-view';
import {useTranslation} from 'react-i18next';
import {showAlert} from 'react-native-customisable-alert';
import CustomAlert from '../CustomAlert';
import GetValueLocally from '../../utilities/GetValueLocally';
import UploadPhotoAWS from '../../utilities/UploadPhotoAWS';
import StoreValueLocally from '../../utilities/StoreValueLocally';
import {normalizeFontSize} from '../../utilities/ResFontSize';

const UploadPhotoWrapper = ({
  showLoading,
  displayURL,
  showImage,
  setShowLoading,
  setDisplayURL,
  changePhoto = false,
  roundImage = false,
  setTitle,
  noText = false,
  noPreview = false,
}) => {
  const [firstImageUploaded, setFirstImageUploaded] = useState(false);
  const {t} = useTranslation();
  const size = 150;
  const selectPhoto = async (type) => {
    try {
      setShowLoading(true);
      const imgURL = await UploadPhotoAWS(type, t);
      setShowLoading(false);
      if (imgURL === 'Cancel') return;
      console.log(imgURL);
      setFirstImageUploaded(true);
      setDisplayURL(imgURL);
    } catch (err) {
      console.log('Error', err);
      setShowLoading(false);
      showAlert({
        alertType: 'custom',
        customAlert: <CustomAlert title={t('errorBasic')} />,
      });
    }
  };

  useEffect(() => {
    setShowLoading(false);
    setFirstImageUploaded(false);
  }, []);

  const uploadPhoto = async (type) => {
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

  const oneDownNumber = Math.floor(Math.random() * Math.floor(4));

  return (
    <>
      {!showLoading && (
        <>
          {showImage && !roundImage && !noPreview && (
            <ImageBackground
              source={{
                uri:
                  displayURL || 'https://i.ibb.co/6RqCCJJ/Banner-Default-1.jpg',
              }}
              resizeMode="cover"
              style={{
                width: '100%',
                height: 150,
                marginBottom: 10,
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            />
          )}
          {showImage && roundImage && !noPreview && (
            <MaskedView
              style={{
                width: size,
                height: size,
                marginLeft: 'auto',
                marginRight: 'auto',
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
                  uri: displayURL,
                }}
                style={{
                  width: size,
                  height: size,
                }}
              />
            </MaskedView>
          )}
          {firstImageUploaded && (
            <>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  // justifyContent: roundImage ? 'center' : 'flex-start',
                  justifyContent: 'center',
                  marginBottom: 30,
                  marginTop: roundImage ? 10 : 0,
                }}>
                <Tick_Icon styles={layout_styles.extra_s_icon} color={green} />
                <Text
                  style={[
                    layout_styles.font_styling_h3_Bold,
                    {
                      fontSize: normalizeFontSize(12) /* before 14 */,
                      color: green,
                      marginLeft: 5,
                    },
                  ]}>
                  {t('photoAdded')}
                </Text>
              </View>
              <Text
                style={[
                  layout_styles.font_styling_h3_Bold,
                  {textAlign: 'center'},
                ]}>
                {t('changePhotoAgain')}
              </Text>
            </>
          )}
          {!firstImageUploaded && !noText && (
            <>
              <View style={{marginBottom: 30}} />
              {changePhoto && !setTitle && (
                <Text
                  style={[
                    layout_styles.font_styling_h3_Bold,
                    {textAlign: 'center', color: whiteColor},
                  ]}>
                  {t('newPubBundleChangePhoto')}
                </Text>
              )}
              {!changePhoto && !setTitle && (
                <Text
                  style={[
                    layout_styles.font_styling_h3_Bold,
                    {textAlign: 'center', color: whiteColor},
                  ]}>
                  {t('newPubBundleAddPhoto')}
                </Text>
              )}
              {!!setTitle && (
                <Text
                  style={[
                    layout_styles.font_styling_h3_Bold,
                    {textAlign: 'center', color: whiteColor},
                  ]}>
                  {setTitle}
                </Text>
              )}
            </>
          )}
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              backgroundColor: noPreview ? lightblue : darkblue,
              borderBottomLeftRadius: noPreview ? 5 : 0,
              borderBottomRightRadius: noPreview ? 5 : 0,
            }}>
            <TouchableHighlight
              onPress={async () => uploadPhoto('gallery')}
              style={{width: '50%'}}>
              <View
                style={{
                  alignItems: 'center',
                  paddingVertical: 20,
                }}>
                <PhotoGallery_Icon styles={layout_styles.m_icon} />
                <Text
                  style={[
                    layout_styles.font_styling_h3_Bold,
                    {
                      fontSize: normalizeFontSize(12) /* before 14 */,
                      marginTop: 5,
                    },
                  ]}>
                  {t('library')}
                </Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight
              onPress={async () => uploadPhoto('camera')}
              style={{width: '50%'}}>
              <View
                style={{
                  alignItems: 'center',
                  paddingVertical: 20,
                }}>
                <Photo_Icon styles={layout_styles.m_icon} />
                <Text
                  style={[
                    layout_styles.font_styling_h3_Bold,
                    {
                      fontSize: normalizeFontSize(12) /* before 14 */,
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
            marginVertical: 40,
          }}>
          <Loading styles={{height: 80, width: 80}} downNum={oneDownNumber} />
        </View>
      )}
    </>
  );
};

export default UploadPhotoWrapper;
