import React, {useEffect, useRef} from 'react';
import {ScrollView, Text, View, TouchableOpacity} from 'react-native';
import {Back_Icon, ElementLink_Icon} from '../../content/Icons';
import {whiteColor} from '../../styles/Colors';
import layout_styles from '../../styles/Layout_Styles';
import {normalizeFontSize} from '../../utilities/ResFontSize';
import {screenWidth} from '../../utilities/WidthAndHeight';
import GetValueLocally from '../../utilities/GetValueLocally';
import StoreValueLocally from '../../utilities/StoreValueLocally';

const PubInHorizontalWrapper = ({
  title,
  arr = [],
  item,
  intervalSnap,
  click1,
  click2,
  triggerPreview,
  type,
}) => {
  const scrollViewRef = useRef();
  const time = 600;
  const previewOnRender = () => {
    scrollViewRef.current?.scrollTo({
      x: screenWidth * 0.3,
      y: 0,
      animated: true,
      duration: time,
    });
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({
        x: 0,
        y: 0,
        animated: true,
        duration: time,
      });
    }, time);
  };
  useEffect(() => {
    const check = async () => {
      const checkLocal = await GetValueLocally(`@check_${type}`);
      if (!checkLocal) {
        if (!__DEV__) {
          StoreValueLocally(`@check_${type}`, 'Done');
        }
        previewOnRender();
      }
    };
    if (!!triggerPreview && !!type && arr?.length > 1) {
      check();
    }
  }, [triggerPreview]);
  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 10,
          paddingVertical: !click1 && !click2 ? 7 : 0,
        }}>
        {!!title && (
          <Text
            numberOfLines={1}
            style={[
              layout_styles.normal_font,
              {
                fontSize: normalizeFontSize(14), // before 16
                lineHeight: normalizeFontSize(16), // // before 18
                marginRight: 10,
                color: whiteColor,
                maxWidth: '90%',
              },
            ]}>
            {title}
          </Text>
        )}
        {!!arr && arr.length > 1 && (
          <View style={{transform: [{rotate: '180deg'}]}}>
            <Back_Icon styles={layout_styles.extra_extra_s_icon} white />
          </View>
        )}
        {(!!click1 || !!click2) && (
          <View style={{marginLeft: 'auto', flexDirection: 'row'}}>
            {!!click1 && (
              <TouchableOpacity
                onPress={click1.click}
                style={{
                  padding: 5,
                }}>
                {click1.icon}
              </TouchableOpacity>
            )}
            {!!click2 && (
              <TouchableOpacity
                onPress={click2.click}
                style={{
                  padding: 5,
                }}>
                {click2.icon}
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
      {!!arr.length && item && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          decelerationRate={0}
          ref={scrollViewRef}
          snapToInterval={intervalSnap}
          snapToAlignment={'center'}
          style={{paddingBottom: 5, overflow: 'visible'}}>
          {arr.map(item)}
        </ScrollView>
      )}
    </>
  );
};

export default PubInHorizontalWrapper;
