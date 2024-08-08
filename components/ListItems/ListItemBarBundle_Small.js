import React, { useContext } from 'react';
import {
  ImageBackground,
  Text,
  TouchableHighlight,
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Fonts from '../../content/Fonts';
import MainContext from '../../context/MainContext';
import { lightblue, whiteColor } from '../../styles/Colors';
import { screenWidth } from '../../utilities/WidthAndHeight';
import { useNavigation } from '@react-navigation/native';
import { normalizeFontSize } from '../../utilities/ResFontSize';
import layout_styles from '../../styles/Layout_Styles';

const ListItemBarBundle_Small = ({ arr }) => {
  const { mainState, setMainState, noUserNavAfter } = useContext(MainContext);
  const navigation = useNavigation();
  const styles = StyleSheet.create({
    text: {
      fontFamily: Fonts.Regular,
      color: whiteColor,
      fontSize: normalizeFontSize(12), // before
      lineHeight: normalizeFontSize(12 * 1.15), // before 14
    },
  });
  const setWidth =
    screenWidth - layout_styles.content_container.paddingRight * 2;
  const allHeights = [];
  return (
    <>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate={0}
        snapToInterval={setWidth + 10}
        snapToAlignment={'left'}>
        {arr.map((current) => {
          const image = {
            uri:
              current.imgURL || 'https://i.ibb.co/6RqCCJJ/Banner-Default-1.jpg',
          };
          return (
            <TouchableHighlight
              key={current.bb_id || Math.random()}
              onPress={() => {
                if (!mainState.user) {
                  setMainState({
                    ...mainState,
                    navAfterProfileCreate: {
                      route: 'PubBundle',
                      params: {
                        selectedPubBundle: current,
                      },
                    },
                    filters: {
                      category: [],
                      breweries: [],
                    },
                    filtersOn: false,
                    complete: {
                      ...mainState.complete,
                      bbInteractions: [
                        ...mainState.complete.bbInteractions,
                        {
                          bb_id: current.bb_id,
                          action: `clickOnIt`,
                        },
                      ],
                    },
                  });
                  return noUserNavAfter('PubBundle', {
                    selectedPubBundle: current,
                  });
                } else {
                  setMainState({
                    ...mainState,
                    filters: {
                      category: [],
                      breweries: [],
                    },
                    filtersOn: false,
                    complete: {
                      ...mainState.complete,
                      bbInteractions: [
                        ...mainState.complete.bbInteractions,
                        {
                          bb_id: current.bb_id,
                          action: `clickOnIt`,
                        },
                      ],
                    },
                  });
                  navigation.push('PubBundle', {
                    selectedPubBundle: current,
                  });
                }
              }}
              style={[
                {
                  marginRight: !arr.length ? 0 : 10,
                  width: setWidth,
                  borderRadius: 5,
                  overflow: 'hidden',
                  backgroundColor: lightblue,
                  height: 130,
                },
              ]}>
              <>
                <View
                  style={{ flexDirection: 'row' }}
                  onLayout={(evt) => {
                    const { height: layoutHeight } = evt.nativeEvent.layout;
                    allHeights.push(layoutHeight);
                  }}>
                  <View
                    style={{
                      width: '35%',
                      // backgroundColor: 'green',
                    }}>
                    <ImageBackground
                      source={image}
                      resizeMode="cover"
                      style={{ width: '100%', height: '100%' }}
                    />
                  </View>
                  <View
                    style={{
                      width: '55%',
                      marginHorizontal: '5%',
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={[
                        styles.text,
                        {
                          fontFamily: Fonts.Bold,
                          marginBottom: 5,
                          fontSize: normalizeFontSize(14), // before 16
                          lineHeight: 21,
                        },
                      ]}
                      numberOfLines={1}>
                      {current.name.trim()}
                    </Text>
                    {!!current.info.trim() && (
                      <Text
                        style={[styles.text, { marginBottom: 5 }]}
                        numberOfLines={2}>
                        {current.info.trim()}
                      </Text>
                    )}
                    {!!current.pubCount && (
                      <Text
                        style={[styles.text, { fontFamily: Fonts.Bold }]}
                        numberOfLines={1}>
                        {current.pubCount}{' '}
                        {current.pubCount > 1 ? 'Pubs' : 'Pub'}
                      </Text>
                    )}
                  </View>
                </View>
              </>
            </TouchableHighlight>
          );
        })}
      </ScrollView>
    </>
  );
};

export default ListItemBarBundle_Small;
