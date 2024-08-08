import React, { Fragment, useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import layout_styles from '../../styles/Layout_Styles';
import GetCityName from '../../utilities/GetCityName';
import {
  Category_Icon,
  Cross_Icon,
  Navigation_Icon,
  Special_Icon,
  Tick_Icon,
} from '../../content/Icons';
import { yellow, whiteColor } from '../../styles/Colors';
import Fonts from '../../content/Fonts';
import { normalizeFontSize } from '../../utilities/ResFontSize';

const ListItemPub = ({
  current,
  buttonClicked,
  withCross,
  withTick,
  tickClicked,
  withNavigate,
  crossClicked,
  setSub = false,
  layoutUp,
  setMarginLeft = 20,
  small = false,
  white = true,
  tickColor,
  onNavigate,
  onSpecialClick,
  withSpecialTick,
}) => {
  const styles = StyleSheet.create({
    container_1: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    pub_text: {
      color: white ? whiteColor : yellow,
      fontFamily: Fonts.Bold,
      marginLeft: setMarginLeft,
      marginRight: 25,
      marginTop: 10,
      fontSize: small ? normalizeFontSize(12) : normalizeFontSize(14), // before 14 : 16
    },
    city_text: {
      color: white ? whiteColor : yellow,
      fontFamily: Fonts.Light,
      marginLeft: setMarginLeft,
      marginRight: 25,
      marginBottom: 10,
      fontSize: small ? normalizeFontSize(10) : normalizeFontSize(12), // before 12 : 14
    },
  });
  const [contentWidth, setContentWidth] = useState([]);
  const [textWidth, setTextWidth] = useState(0);
  const [entireWidth, setEntireWidth] = useState(0);
  useEffect(() => {
    if (!!contentWidth.length) {
      let calcWidth = 0;
      contentWidth.forEach((c) => {
        if (!!c) {
          calcWidth += c;
        }
      });
      setTextWidth(calcWidth);
    }
  }, [contentWidth]);
  return (
    <>
      <View
        style={styles.container_1}
        key={current._id}
        onLayout={(evt) => {
          const { height, width } = evt.nativeEvent.layout;
          setEntireWidth(width);
          if (!layoutUp) return;
          layoutUp(height);
        }}>
        <View
          onLayout={(evt) => {
            const { width } = evt.nativeEvent.layout;
            const newContentWidth = contentWidth;
            newContentWidth[0] = width;
            setContentWidth([...newContentWidth]);
          }}>
          <Category_Icon category={current.category} small={small} img={current.img} />
        </View>
        <TouchableHighlight
          style={[
            {
              width: entireWidth - textWidth,
            },
          ]}
          key={current._id}
          disabled={!buttonClicked}
          onPress={buttonClicked}>
          <>
            <Text style={styles.pub_text}>{current.name}</Text>
            {!setSub && (
              <GetCityName
                city={current.city}
                extracity={current.city2 || current.extracity}
                styles={styles.city_text}
              />
            )}
            {setSub && <Text style={styles.city_text}>{setSub}</Text>}
          </>
        </TouchableHighlight>
        {withCross && (
          <TouchableHighlight
            onPress={crossClicked}
            style={{ padding: 10 }}
            onLayout={(evt) => {
              const { width } = evt.nativeEvent.layout;
              const newContentWidth = contentWidth;
              newContentWidth[1] = width;
              setContentWidth([...newContentWidth]);
            }}>
            <Cross_Icon styles={layout_styles.extra_s_icon} />
          </TouchableHighlight>
        )}
        {withSpecialTick && (
          <TouchableHighlight
            onPress={onSpecialClick}
            style={{ padding: 10 }}
            onLayout={(evt) => {
              const { width } = evt.nativeEvent.layout;
              const newContentWidth = contentWidth;
              newContentWidth[2] = width;
              setContentWidth([...newContentWidth]);
            }}>
            <Special_Icon styles={layout_styles.extra_s_icon} />
          </TouchableHighlight>
        )}
        {withNavigate && (
          <TouchableHighlight
            onPress={onNavigate}
            style={{ padding: 10 }}
            onLayout={(evt) => {
              const { width } = evt.nativeEvent.layout;
              const newContentWidth = contentWidth;
              newContentWidth[3] = width;
              setContentWidth([...newContentWidth]);
            }}>
            <Navigation_Icon
              styles={layout_styles.extra_s_icon}
              color={yellow}
            />
          </TouchableHighlight>
        )}
        {withTick && (
          <TouchableHighlight
            onPress={tickClicked}
            style={{ padding: 10 }}
            onLayout={(evt) => {
              const { width } = evt.nativeEvent.layout;
              const newContentWidth = contentWidth;
              newContentWidth[4] = width;
              setContentWidth([...newContentWidth]);
            }}>
            <Tick_Icon
              styles={layout_styles.extra_s_icon}
              color={tickColor || yellow}
            />
          </TouchableHighlight>
        )}
      </View>
    </>
  );
};

export default ListItemPub;
