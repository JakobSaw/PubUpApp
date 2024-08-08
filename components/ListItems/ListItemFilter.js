import React, { useContext } from 'react';
import {
  Text,
  View,
  TouchableHighlight,
  Image,
  TouchableOpacity,
} from 'react-native';
import layout_styles from '../../styles/Layout_Styles';
import {
  Unchecked,
  Checked,
  Circle_95_Icon,
  ElementLink_Icon,
} from '../../content/Icons';
import MainContext from '../../context/MainContext';
import MaskedView from '@react-native-masked-view/masked-view';
import { useNavigation } from '@react-navigation/native';
import CountInteraction from '../../utilities/CountInteraction';
import { whiteColor, yellow } from '../../styles/Colors';
import { normalizeFontSize } from '../../utilities/ResFontSize';
import Fonts from '../../content/Fonts';

const ListItemFilter = ({
  icon,
  title,
  checked,
  setFilter,
  smokingFilter,
  setCategoryFilter,
  imgURL,
  setBreweryFilter,
  partnerID,
  clickOnPartnerFromFilters,
  sternchen,
  cities,
  tight,
  link,
  _id,
}) => {
  const { mainState, setMainState } = useContext(MainContext);
  const navigation = useNavigation();
  const changeFilter = (filter) => {
    let newFilters = {
      ...mainState.filters
    }
    if (filter !== 'smoking' && filter !== 'payment') {
      if (mainState.locationGranted) {
        newFilters = {
          ...newFilters,
          [filter]: !mainState.filters[filter],
          city: mainState.activeCity,
        }
      } else {
        newFilters = {
          ...newFilters,
          [filter]: !mainState.filters[filter]
        }
        delete newFilters.city
      }
    } else if (
      (filter === 'smoking' &&
        mainState.filters.smoking !== smokingFilter) || (filter === 'payment' &&
          mainState.filters.payment !== smokingFilter)
    ) {
      if (mainState.locationGranted) {
        newFilters = {
          ...newFilters,
          [filter]: smokingFilter,
          city: mainState.activeCity,
        }
      } else {
        newFilters = {
          ...newFilters,
          [filter]: smokingFilter,
        }
        delete newFilters.city
      }
    } else {
      if (mainState.locationGranted) {
        newFilters = {
          ...newFilters,
          [filter]: '',
          city: mainState.activeCity,
        }
      } else {
        newFilters = {
          ...newFilters,
          [filter]: '',
        }
        delete newFilters.city
      }
    }

    setMainState({
      ...mainState,
      filters: newFilters,
      filtersOn: true
    })
  };
  const changeCategoryFilter = (categories) => {
    const searchIndex1 = mainState.filters.category.indexOf(categories[0]);
    let newcategory = [...mainState.filters.category];

    if (searchIndex1 > -1) {
      newcategory.splice(searchIndex1, 1);
    } else {
      newcategory.push(categories[0]);
    }

    const searchIndex2 = newcategory.indexOf(categories[1]);

    if (searchIndex2 > -1) {
      newcategory.splice(searchIndex2, 1);
    } else {
      newcategory.push(categories[1]);
    }

    const searchIndex3 = newcategory.indexOf(categories[2]);

    if (searchIndex3 > -1) {
      newcategory.splice(searchIndex3, 1);
    } else {
      newcategory.push(categories[2]);
    }

    const searchIndex4 = newcategory.indexOf(categories[3]);

    if (searchIndex4 > -1) {
      newcategory.splice(searchIndex4, 1);
    } else {
      newcategory.push(categories[3]);
    }

    let newFilters = {
      ...mainState.filters
    }
    if (mainState.locationGranted) {
      newFilters = {
        ...newFilters,
        category: newcategory,
        city: mainState.activeCity,
      }
    } else {
      newFilters = {
        ...newFilters,
        category: newcategory,
      }
      delete newFilters.city
    }

    setMainState({
      ...mainState,
      filters: newFilters,
      filtersOn: true
    });
  };
  const changeBreweryFilter = (id) => {
    const searchIndex1 = mainState.filters.breweries.indexOf(id);
    let newBreweryFilter = [...mainState.filters.breweries];

    if (searchIndex1 > -1) {
      newBreweryFilter.splice(searchIndex1, 1);
    } else {
      newBreweryFilter.push(id);
    }

    let newFilters = {
      ...mainState.filters
    }
    if (mainState.locationGranted) {
      newFilters = {
        ...newFilters,
        breweries: newBreweryFilter,
        city: mainState.activeCity,
      }
    } else {
      newFilters = {
        ...newFilters,
        breweries: newBreweryFilter,
      }
      delete newFilters.city
    }

    setMainState({
      ...mainState,
      filters: newFilters,
      filtersOn: true
    });
  };
  const openPartner = (find) => {
    const setFindID = find ? clickOnPartnerFromFilters : partnerID;
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
      ...mainState.partners.find((c) => c.partnerID === setFindID),
    });
  };
  const openLink = () => {
    setMainState({
      ...mainState,
      showLink: link,
      complete: {
        ...mainState.complete,
        partnerInteractions: [
          ...mainState.complete.partnerInteractions,
          {
            partner_id: partnerID,
            action: `linkClicked: ${_id}`,
            item: true,
          },
        ],
      },
    });
    CountInteraction();
  };
  return (
    <TouchableHighlight
      onPress={() => {
        if (!!link) return openLink();
        if (!!partnerID) return openPartner();
        if (setFilter) {
          changeFilter(setFilter);
        } else if (!!setBreweryFilter) {
          changeBreweryFilter(setBreweryFilter);
        } else {
          changeCategoryFilter(setCategoryFilter);
        }
      }}>
      <View style={layout_styles.checkboxcontainer}>
        {!!imgURL && (
          <>
            <MaskedView
              style={!!cities ? layout_styles.s_icon : layout_styles.m_icon}
              maskElement={
                <>
                  <Circle_95_Icon
                    style={
                      !!cities ? layout_styles.s_icon : layout_styles.m_icon
                    }
                  />
                </>
              }>
              <Image
                source={{
                  uri: imgURL,
                  cache: 'force-cache',
                }}
                style={[
                  !!cities ? layout_styles.s_icon : layout_styles.m_icon,
                  { backgroundColor: whiteColor },
                ]}
              />
            </MaskedView>
          </>
        )}
        {!imgURL && !!icon && <>{icon}</>}
        {clickOnPartnerFromFilters || !!link ? (
          <TouchableOpacity
            onPress={() => {
              if (!link) {
                openPartner(true);
              } else {
                openLink();
              }
            }}
            style={{
              paddingVertical: 10,
              paddingRight: !!tight ? 0 : 30,
            }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text
                style={[
                  layout_styles.font_styling_h3_Bold,
                  {
                    marginLeft: !!tight ? 10 : 30,
                    textDecorationLine: !!tight ? 'none' : 'underline',
                  },
                ]}>
                {title}
              </Text>
              <View style={{ width: 10 }} />
              <ElementLink_Icon
                styles={layout_styles.extra_extra_s_icon}
                color={yellow}
              />
            </View>
          </TouchableOpacity>
        ) : (
          <>
            {!sternchen && !cities && (
              <Text
                style={[
                  layout_styles.font_styling_h3_Bold,
                  { marginLeft: !!tight ? 10 : 30 },
                ]}>
                {title}
              </Text>
            )}
            {!!sternchen && !cities && (
              <View>
                <Text
                  style={[
                    layout_styles.font_styling_h3_Bold,
                    { marginLeft: !!tight ? 10 : 30 },
                  ]}>
                  {title}
                  {sternchen ? ' *' : ''}
                </Text>
                <Text
                  style={[
                    layout_styles.font_styling_h3_Bold,
                    {
                      marginLeft: !!tight ? 10 : 30,
                      fontSize: normalizeFontSize(10),
                    },
                  ]}>
                  {sternchen}
                </Text>
              </View>
            )}
            {!!cities && (
              <View>
                <Text
                  style={[
                    layout_styles.font_styling_h3_Bold,
                    { marginLeft: 20 },
                  ]}>
                  {title}
                </Text>
                <Text
                  style={[
                    // layout_styles.font_styling_h3_Bold,
                    { marginLeft: 20 },
                    {
                      color: whiteColor,
                      fontFamily: Fonts.Light,
                      fontSize: normalizeFontSize(12),
                    },
                  ]}>
                  {cities}
                </Text>
              </View>
            )}
          </>
        )}
        {!partnerID && !link && (
          <>
            {checked ? (
              <Checked styles={layout_styles.s_icon} />
            ) : (
              <Unchecked styles={layout_styles.s_icon} />
            )}
          </>
        )}
      </View>
    </TouchableHighlight>
  );
};

export default ListItemFilter;
