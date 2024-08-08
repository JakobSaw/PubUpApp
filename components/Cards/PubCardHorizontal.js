import React, { useContext } from 'react';
import { Text, TouchableHighlight, View, StyleSheet } from 'react-native';
import { darkblue, lightblue, whiteColor, yellow } from '../../styles/Colors';
import { Category_Icon } from '../../content/Icons';
import Fonts from '../../content/Fonts';
import GetCategory from '../../utilities/GetCategory';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { normalizeFontSize } from '../../utilities/ResFontSize';
import FillUpComplete from '../../utilities/FillUpComplete';
import MainContext from '../../context/MainContext';
import CountInteraction from '../../utilities/CountInteraction';

const PubCardHorizontal = ({ current, click, selected }) => {
  const { mainState, setMainState } = useContext(MainContext);
  const { t } = useTranslation();
  const styles = StyleSheet.create({
    pub_text: {
      color: whiteColor,
      fontFamily: Fonts.Bold,
      fontSize: normalizeFontSize(12), // before 14
    },
    city_text: {
      color: whiteColor,
      fontFamily: Fonts.Light,
      fontSize: normalizeFontSize(12), // before 14
    },
  });
  const navigation = useNavigation();
  return (
    <TouchableHighlight
      key={current.pub_id}
      onPress={() => {
        if (!click) {
          setMainState({
            ...mainState,
            regionToAnimate: {
              latitude: current.latitude,
              longitude: current.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            },
            complete: {
              ...mainState.complete,
              interactions: [
                ...mainState.complete.interactions,
                {
                  lokal_name: current.name,
                  lokal_id: current.lokal_id || current._id,
                  action: 'clickOnIt',
                  ...FillUpComplete(),
                },
              ],
            },
            collectPubsToPushToDB: [
              ...mainState.collectPubsToPushToDB,
              current.lokal_id || current._id,
            ],
          });
          CountInteraction();
          return navigation.push('Pub', {
            ...current,
          });
        }
        click();
      }}
      style={{
        flexDirection: 'row',
        padding: 15,
        alignItems: 'center',
        width: 250,
        backgroundColor: selected ? yellow : lightblue,
        borderRadius: 5,
        overflow: 'hidden',
      }}>
      <>
        <Category_Icon category={current.category} dark={selected} img={current.img} />
        <View style={{ marginLeft: 15 }}>
          <Text
            style={[
              styles.pub_text,
              { color: selected ? darkblue : whiteColor, marginRight: 20 },
            ]}
            numberOfLines={1}>
            {current.name}
          </Text>
          <Text
            style={[
              styles.city_text,
              { color: selected ? darkblue : whiteColor },
            ]}>
            {current.distanceRouteDisplay || GetCategory(current.category, t)}
          </Text>
        </View>
      </>
    </TouchableHighlight>
  );
};

export default PubCardHorizontal;
