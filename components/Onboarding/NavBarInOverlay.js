import React, {useEffect, useState} from 'react';
import {View, TouchableHighlight, StyleSheet} from 'react-native';
import {
  Beer_Icon,
  Overlay_Left_Icon,
  Overlay_Middle_Icon,
  Overlay_Right_Icon,
  PubIn_Icon,
  Special_Icon,
} from '../../content/Icons';
import {yellow} from '../../styles/Colors';
import layout_styles from '../../styles/Layout_Styles';
import {screenWidth} from '../../utilities/WidthAndHeight';

const NavBarInOverlay = ({overlay}) => {
  const [navBarButtonSize, setNavBarButtonSize] = useState(70);
  const [positionPfeile, setPositionPfeile] = useState({
    x_1: 53.66666793823242,
    x_2: 100,
    x_3: 150,
  });
  const [overlayState, setOverlayState] = useState(null);

  const inlineStyles = StyleSheet.create({
    pfeile: {
      width: navBarButtonSize + 20,
      height: (navBarButtonSize + 20) * 1.778911641588415,
    },
    container: {
      ...StyleSheet.absoluteFill,
      // backgroundColor: 'yellow',
    },
  });

  useEffect(() => {
    if (overlay) {
      setOverlayState(+overlay + 1);
    }
  }, [overlay]);

  return (
    <>
      {overlayState === 1 && (
        <View
          style={{
            position: 'absolute',
            zIndex: 100,
            margin: 'auto',
            bottom: 5,
            top: 'auto',
            left: positionPfeile.x_1,
          }}>
          <Overlay_Left_Icon styles={inlineStyles.pfeile} />
        </View>
      )}
      {overlayState === 2 && (
        <View
          style={{
            position: 'absolute',
            zIndex: 100,
            margin: 'auto',
            bottom: 5,
            top: 'auto',
            left: positionPfeile.x_2,
          }}>
          <Overlay_Middle_Icon styles={[inlineStyles.pfeile]} />
        </View>
      )}
      {/* {overlayState === 3 && (
        <View
          style={{
            position: 'absolute',
            zIndex: 100,
            margin: 'auto',
            bottom: 5,
            top: 'auto',
            left: positionPfeile.x_3,
          }}>
          <Overlay_Middle_Icon styles={inlineStyles.pfeile} />
        </View>
      )} */}
      {overlayState === 3 && (
        <View
          style={{
            position: 'absolute',
            zIndex: 100,
            margin: 'auto',
            bottom: 5,
            top: 'auto',
            left: positionPfeile.x_3,
          }}>
          <Overlay_Right_Icon styles={inlineStyles.pfeile} />
        </View>
      )}
      <View style={layout_styles.navbar}>
        {/* Categories */}
        <TouchableHighlight
          onLayout={(evt) => {
            const {width, x, y} = evt.nativeEvent.layout;
            if (!overlay) return;
            setNavBarButtonSize(width);
            setPositionPfeile({
              ...positionPfeile,
              x_1: x,
            });
          }}>
          <View style={layout_styles.navbarcontainer}>
            <Beer_Icon
              color={yellow}
              strokeWidth="0.5"
              styles={layout_styles.s_icon}
            />
          </View>
        </TouchableHighlight>
        {/* PubIn */}
        <TouchableHighlight
          onLayout={(evt) => {
            const {height, x, y} = evt.nativeEvent.layout;
            if (!overlay) return;
            setPositionPfeile({
              ...positionPfeile,
              x_2: x - screenWidth * 0.026666666666667,
            });
          }}>
          <View style={[layout_styles.navbarcontainer, {position: 'relative'}]}>
            <PubIn_Icon styles={layout_styles.s_icon} />
          </View>
        </TouchableHighlight>
        {/* Incentive Filter */}
        <TouchableHighlight
          onLayout={(evt) => {
            const {height, x, y} = evt.nativeEvent.layout;
            if (!overlay) return;
            setPositionPfeile({
              ...positionPfeile,
              x_3: x - screenWidth * 0.053333333333333,
            });
          }}>
          <View style={[layout_styles.navbarcontainer, {position: 'relative'}]}>
            <Special_Icon styles={layout_styles.s_icon} />
          </View>
        </TouchableHighlight>
        {/* <TouchableHighlight
          style={[disableIncentive && !overlay ? {opacity: 0.2} : {}]}
          onLayout={(evt) => {
            const {width, x, y} = evt.nativeEvent.layout;
            if (!overlay) return;
            setPositionPfeile({
              ...positionPfeile,
              x_4: x - screenWidth * 0.053333333333333,
            });
          }}>
          <View style={layout_styles.navbarcontainer}>
            <Special_Icon styles={layout_styles.s_icon} />
          </View>
        </TouchableHighlight> */}
      </View>
    </>
  );
};

export default NavBarInOverlay;
