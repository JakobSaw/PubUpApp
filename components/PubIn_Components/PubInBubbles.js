import MaskedView from '@react-native-masked-view/masked-view';
import React from 'react';
import {
  Image,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Emoji} from '../../content/Emoji';
import {
  Add_Friend_Icon,
  Circle_90_Icon,
  Cross_Icon,
  Light_Edit_Icon,
  Light_Plus_Icon,
  PhotoGallery_Icon,
  Tick_Icon,
} from '../../content/Icons';
import {darkblue, green, red, whiteColor, yellow} from '../../styles/Colors';
import Loading from '../../utilities/Loading';
import layout_styles from '../../styles/Layout_Styles';
import Fonts from '../../content/Fonts';

const PubInBubbles = ({
  primaryClick, // Make Big Circle Clickable
  secondaryClick, // Show Small Circle
  setSize, // change Size of Bubble
  setSizeOfSmall,
  imgURL, // Make Big Circle an Image
  emoji, // show Emoji in Big Circle => smile
  btnIcon, // Icon or Image for Small Circle => 'emoji_smile' makes it an Emoji
  setMarginBottom,
  noMarginLeft = false,
  withOutline = false,
  bgColorOfSmall = darkblue,
  secondBTNIcon,
  thirdClick,
  imgBack,
}) => {
  const size = setSize || 70;
  const small = setSizeOfSmall ? size * setSizeOfSmall : size * 0.35;
  const bigOutline = 15;
  const minusIcon = 0.5;
  const translateSmall = size * 0.05;
  const oneDownNumber = Math.floor(Math.random() * Math.floor(4));
  return (
    <>
      <View
        style={[
          {
            width: size,
            height: size,
            marginRight: noMarginLeft ? 0 : 20,
            position: 'relative',
            overflow: 'visible',
          },
          setMarginBottom ? {marginBottom: setMarginBottom} : {},
        ]}>
        {/*  */}
        {/*  */}
        {/* BIG CIRCLE */}
        {!!primaryClick && (
          <TouchableOpacity onPress={primaryClick}>
            <>
              {!!imgURL && !emoji && (
                <>
                  <MaskedView
                    maskElement={
                      <>
                        <Circle_90_Icon
                          style={{
                            width: size,
                            height: size,
                          }}
                        />
                      </>
                    }>
                    <Image
                      source={{
                        uri: imgURL,
                      }}
                      style={{
                        width: size,
                        height: size,
                        backgroundColor: whiteColor,
                      }}
                    />
                  </MaskedView>
                </>
              )}
              {!imgURL && !!emoji && (
                <>
                  <Emoji
                    styles={{
                      width: size,
                      height: size,
                    }}
                    emoji={emoji}
                  />
                </>
              )}
              {!imgURL && !emoji && !!imgBack && (
                <>
                  <Text
                    style={[
                      layout_styles.font_styling_h4,
                      {
                        color: whiteColor,
                        fontFamily: Fonts.Bold,
                        textAlign: 'center',
                      },
                    ]}>
                    {imgBack}
                  </Text>
                </>
              )}
            </>
          </TouchableOpacity>
        )}
        {!primaryClick && (
          <>
            {!!imgURL && !emoji && (
              <MaskedView
                maskElement={
                  <>
                    <Circle_90_Icon
                      style={{
                        width: size,
                        height: size,
                      }}
                    />
                  </>
                }>
                <Image
                  source={{
                    uri: imgURL,
                  }}
                  style={{
                    width: size,
                    height: size,
                    backgroundColor: whiteColor,
                  }}
                />
              </MaskedView>
            )}

            {!imgURL && !!emoji && (
              <>
                <Emoji
                  styles={{
                    width: size,
                    height: size,
                  }}
                  emoji={emoji}
                />
              </>
            )}
            {!imgURL && !emoji && !!imgBack && (
              <View
                style={{
                  justifyContent: 'center',
                  height: '80%',
                }}>
                <Text
                  style={[
                    layout_styles.font_styling_h4,
                    {
                      color: whiteColor,
                      fontFamily: Fonts.Bold,
                      textAlign: 'center',
                    },
                  ]}>
                  {imgBack}
                </Text>
              </View>
            )}
          </>
        )}
        {/*  */}
        {/*  */}
        {/* SMALL CIRCLES */}
        {!!btnIcon && (
          <>
            {!btnIcon.startsWith('emoji') && (
              <>
                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    zIndex: 3,
                    left: size - small + translateSmall,
                    top: size - small + translateSmall,
                  }}
                  onPress={secondaryClick}>
                  {btnIcon !== 'cross' &&
                    btnIcon !== 'add' &&
                    btnIcon !== 'edit' &&
                    btnIcon !== 'photo' &&
                    btnIcon !== 'loading' &&
                    btnIcon !== 'addFriend' &&
                    btnIcon !== 'tick' && (
                      <ImageBackground
                        source={{
                          uri: btnIcon,
                        }}
                        resizeMode="cover"
                        style={{
                          width: small,
                          height: small,
                        }}
                        imageStyle={{borderRadius: 300}}
                      />
                    )}
                  {btnIcon === 'cross' && (
                    <View
                      style={{
                        width: small,
                        height: small,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Cross_Icon
                        styles={{
                          width: small * minusIcon,
                          height: small * minusIcon,
                        }}
                        color={red}
                        sWidth={1}
                      />
                    </View>
                  )}
                  {btnIcon === 'add' && (
                    <View
                      style={{
                        width: small,
                        height: small,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Light_Plus_Icon
                        styles={{
                          width: small * minusIcon,
                          height: small * minusIcon,
                        }}
                        color={yellow}
                      />
                    </View>
                  )}
                  {btnIcon === 'addFriend' && (
                    <View
                      style={{
                        width: small,
                        height: small,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Add_Friend_Icon
                        styles={{
                          width: small * minusIcon,
                          height: small * minusIcon,
                        }}
                        color={yellow}
                      />
                    </View>
                  )}
                  {btnIcon === 'tick' && (
                    <View
                      style={{
                        width: small,
                        height: small,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Tick_Icon
                        styles={{
                          width: small * 0.75,
                          height: small * 0.75,
                        }}
                        color={green}
                      />
                    </View>
                  )}
                  {btnIcon === 'edit' && (
                    <View
                      style={{
                        width: small,
                        height: small,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Light_Edit_Icon
                        styles={{
                          width: small * minusIcon,
                          height: small * minusIcon,
                        }}
                      />
                    </View>
                  )}
                  {btnIcon === 'photo' && (
                    <View
                      style={{
                        width: small,
                        height: small,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <PhotoGallery_Icon
                        styles={{
                          width: small * minusIcon,
                          height: small * minusIcon,
                        }}
                        color={yellow}
                      />
                    </View>
                  )}
                  {btnIcon === 'loading' && (
                    <View
                      style={{
                        width: small,
                        height: small,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Loading
                        styles={{
                          width: small * 0.7,
                          height: small * 0.7,
                        }}
                        downNum={oneDownNumber}
                      />
                    </View>
                  )}
                </TouchableOpacity>
                <View
                  style={{
                    backgroundColor: bgColorOfSmall,
                    position: 'absolute',
                    zIndex: 2,
                    left: size - small + translateSmall,
                    top: size - small + translateSmall,
                    width: small,
                    height: small,
                    borderRadius: 300,
                  }}
                />
              </>
            )}
            {btnIcon.startsWith('emoji') && (
              <View
                style={{
                  position: 'absolute',
                  zIndex: 3,
                  left: size - small + translateSmall,
                  top: size - small + translateSmall,
                  // left: setSizeOfSmall ? size - small + translateSmall + 7.5 : size - small + translateSmall,
                  // top: setSizeOfSmall ? size - small + translateSmall + 5 : size - small + translateSmall,
                }}>
                <Emoji
                  styles={{
                    width: small,
                    height: small,
                  }}
                  emoji={btnIcon.replace('emoji_', '')}
                />
              </View>
            )}
          </>
        )}
        {!!secondBTNIcon && (
          <>
            <TouchableOpacity
              style={{
                position: 'absolute',
                zIndex: 3,
                left: 0,
                top: size - small + translateSmall,
              }}
              onPress={thirdClick}>
              {secondBTNIcon === 'cross' && (
                <View
                  style={{
                    width: small,
                    height: small,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Cross_Icon
                    styles={{
                      width: small * minusIcon,
                      height: small * minusIcon,
                    }}
                    color={red}
                    sWidth={1}
                  />
                </View>
              )}
              {secondBTNIcon === 'add' && (
                <View
                  style={{
                    width: small,
                    height: small,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Light_Plus_Icon
                    styles={{
                      width: small * minusIcon,
                      height: small * minusIcon,
                    }}
                    color={yellow}
                  />
                </View>
              )}
              {secondBTNIcon === 'tick' && (
                <View
                  style={{
                    width: small,
                    height: small,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Tick_Icon
                    styles={{
                      width: small * minusIcon,
                      height: small * minusIcon,
                    }}
                    color={yellow}
                  />
                </View>
              )}
              {secondBTNIcon === 'edit' && (
                <View
                  style={{
                    width: small,
                    height: small,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Light_Edit_Icon
                    styles={{
                      width: small * minusIcon,
                      height: small * minusIcon,
                    }}
                  />
                </View>
              )}
              {secondBTNIcon === 'photo' && (
                <View
                  style={{
                    width: small,
                    height: small,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <PhotoGallery_Icon
                    styles={{
                      width: small * minusIcon,
                      height: small * minusIcon,
                    }}
                    color={yellow}
                  />
                </View>
              )}
              {secondBTNIcon === 'loading' && (
                <View
                  style={{
                    width: small,
                    height: small,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Loading
                    styles={{
                      width: small * 0.7,
                      height: small * 0.7,
                    }}
                    downNum={oneDownNumber}
                  />
                </View>
              )}
            </TouchableOpacity>
            <View
              style={{
                backgroundColor: bgColorOfSmall,
                position: 'absolute',
                zIndex: 2,
                left: 0,
                top: size - small + translateSmall,
                width: small,
                height: small,
                borderRadius: 300,
              }}
            />
          </>
        )}
      </View>
      {!!withOutline && (
        <View
          style={{
            position: 'absolute',
            zIndex: -1,
            transform: [
              {translateX: -(bigOutline / 2)},
              {translateY: -(bigOutline / 2)},
            ],
          }}>
          <Circle_90_Icon
            color={darkblue}
            styles={{
              height: size + bigOutline,
              width: size + bigOutline,
            }}
          />
        </View>
      )}
    </>
  );
};

export default PubInBubbles;
