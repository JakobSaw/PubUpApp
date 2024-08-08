import React, { useCallback, useContext } from 'react';
import MainContext from '../../context/MainContext';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';

import Fonts from '../../content/Fonts';
import { darkblue, yellow } from '../../styles/Colors';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import layout_styles from '../../styles/Layout_Styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { screenWidth } from '../../utilities/WidthAndHeight';

const FilterResetButtons = ({ params }) => {
  const { mainState, setMainState } = useContext(MainContext);
  const { t } = useTranslation();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  let filteredKneipen;
  const filterKneipen = () => {
    filteredKneipen = mainState.kneipen.filter((currentBar) => {
      for (const [filter, value] of Object.entries(mainState.filters)) {
        if (!value) {
          continue;
        }
        if (value instanceof Array) {
          if (filter !== 'breweries') {
            if (value.length > 0 && value.indexOf(currentBar[filter]) === -1) {
              return false;
            }
          } else {
            if (
              !!value.length &&
              !value.some((r) => currentBar[filter]?.includes(r))
            ) {
              return false;
            }
          }
        } else if (currentBar[filter] !== value) {
          return false;
        }
      }
      return true;
    });
  };
  const back = () => {
    setMainState({
      ...mainState,
      filters: {
        category: [],
        breweries: [],
      },
      filtersOn: false,
    });
    // if (navigation.canGoBack()) return navigation.goBack()
    navigation.push('Map', {
      map: 'Map'
    })
  };
  if (params?.map === 'Results') {
    filterKneipen();
  }
  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      margin: 'auto',
      top: 'auto',
      left: 'auto',
      right: 15,
      bottom: insets.bottom ||
        layout_styles.just_modal_container_paddings_bottom.paddingBottom
    },
    text: {
      color: darkblue,
      fontFamily: Fonts.Bold,
      textAlign: 'center',
    },
    button: {
      paddingTop: 10,
      paddingBottom: 10,
      borderRadius: 5,
      backgroundColor: yellow,
      borderRadius: 5,
      minWidth: screenWidth * 0.35,
    },
  });
  useFocusEffect(
    useCallback(() => {
      if (
        params?.map === 'Results' &&
        !!mainState.filtersOn &&
        filteredKneipen.length === mainState.kneipen.length
      ) {
        filterKneipen();
      } else if (
        params?.map === 'Results' &&
        !mainState.filtersOn
      ) {
        back();
      }
    }, []),
  );

  return (
    <View style={styles.container}>
      <Text style={[layout_styles.font_styling_h4_Bold, { marginBottom: 5 }]}>
        {filteredKneipen.length} {t('hits')}
      </Text>
      <TouchableOpacity
        style={[
          styles.button,
          {
            marginBottom: 10,
            zIndex: 4,
          },
        ]}
        onPress={() => navigation.push('ResultsList')}>
        <Text style={styles.text}>{t('showList')}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.button,
          {
            marginBottom: 10,
            zIndex: 5,
          },
        ]}
        onPress={back}>
        <Text style={styles.text}>{t('resetFilters')}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.button,
          {
            zIndex: 6,
          },
        ]}
        onPress={() => {
          navigation.goBack()
        }}>
        <Text style={styles.text}>{t('back')}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default FilterResetButtons;
