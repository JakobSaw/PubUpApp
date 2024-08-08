import React, { useContext, useState, useEffect, useRef } from 'react';
import { StyleSheet, ScrollView, TextInput } from 'react-native';
import layout_styles from '../../styles/Layout_Styles';
import MainContext from '../../context/MainContext';
import ListItemCity from '../ListItems/ListItemCity';
import ListItemPub from '../ListItems/ListItemPub';
import EmptyList from '../EmptyList';
import ModalOverlay from '../Onboarding/ModalOverlay';
import Fonts from '../../content/Fonts';
import CountInteraction from '../../utilities/CountInteraction';
import { whiteColor } from '../../styles/Colors';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import FillUpComplete from '../../utilities/FillUpComplete';
import { normalizeFontSize } from '../../utilities/ResFontSize';
import LayoutContainer from '../../utilities/LayoutContainer';
import ListItemFilter from '../ListItems/ListItemFilter';

const Search = () => {
  const { mainState, setMainState } = useContext(MainContext);
  const setCount = 30;
  const [scrollTop, setScrollTop] = useState({
    originalHeight: null,
    height: null,
    count: setCount,
  });
  const { t } = useTranslation();
  const navigation = useNavigation();
  const scrollRef = useRef();
  const styles = StyleSheet.create({
    searchinputstyling: {
      borderColor: whiteColor,
      color: whiteColor,
      borderWidth: 1,
      fontFamily: Fonts.Bold,
      borderRadius: 5,
      paddingLeft: 15,
      paddingRight: 15,
    },
  });
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  function compareNames(a, b) {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  }
  const openPub = (current) => {
    setMainState({
      ...mainState,
      filters: {
        category: [],
        breweries: [],
      },
      filtersOn: false,
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
    navigation.push('Pub', {
      ...current,
    });
  };
  const handleScroll = (event) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    if (scrollY > scrollTop.height) {
      setScrollTop({
        ...scrollTop,
        count: scrollTop.count + setCount,
        height: scrollTop.height + scrollTop.originalHeight,
      });
    }
  };
  useEffect(() => {
    const filteredKneipen = mainState.kneipen.filter((current) => {
      if (
        !current.category.includes('citymarker') &&
        current.category !== 'districtmarker'
      ) {
        return current;
      }
    });
    const partners = [];
    if (!!mainState.partners?.length) {
      mainState.partners?.forEach((c) =>
        partners.push({
          name: c.name,
          partnerID: c.partnerID,
          profileIMG: c.profileIMG,
          cities: c.cities.join(', '),
        }),
      );
    }
    setSearchResults(
      [...filteredKneipen, ...mainState.cities, ...partners].sort(compareNames),
    );
    [...filteredKneipen, ...mainState.cities, ...partners].forEach(
      (current) => {
        if (!current.name) {
          console.log('Search Item without a name', current);
        }
      },
    );
    return () =>
      setScrollTop({
        originalHeight: null,
        height: null,
        count: setCount,
      });
  }, []);
  useEffect(() => {
    setScrollTop({
      ...scrollTop,
      count: setCount,
      height: scrollTop.originalHeight,
    });
    scrollRef.current?.scrollTo({
      y: 0,
      animated: false,
    });
  }, [searchInput]);

  // Sort
  const sortAfterLatitude = (a, b) => {
    if (a.latitude > b.latitude) {
      return -1;
    } else if (a.latitude < b.latitude) {
      return 1;
    } else {
      return 0;
    }
  };
  const sortAfterLongitude = (a, b) => {
    if (a.longitude > b.longitude) {
      return -1;
    } else if (a.longitude < b.longitude) {
      return 1;
    } else {
      return 0;
    }
  };

  const writeNumberWithDot = (num) =>
    `${num.toString().substring(0, num.toString().length - 3)}.${num
      .toString()
      .substring(num.toString().length - 3, num.toString().length)}`;

  return (
    <LayoutContainer
      content={
        <>
          <TextInput
            style={[
              styles.searchinputstyling,
              layout_styles.margin_elements_top,
              layout_styles.margin_elements_bottom,
              layout_styles.paddingTopBottomTextInputsiOS,
              { fontSize: normalizeFontSize(10) },
            ]}
            onChangeText={(text) => setSearchInput(text)}
            value={searchInput}
            placeholder={t('searchNumber', {
              num:
                mainState.kneipen.length > 999
                  ? writeNumberWithDot(mainState.kneipen.length)
                  : mainState.kneipen.length,
            })}
            placeholderTextColor="rgba(255,255,255,0.7)"
          />
          <ScrollView
            scrollEnabled={true}
            showsVerticalScrollIndicator={false}
            style={[
              layout_styles.padding_elements_left,
              layout_styles.padding_elements_right,
            ]}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            onLayout={(evt) => {
              const { height } = evt.nativeEvent.layout;
              setScrollTop({
                ...scrollTop,
                height: height,
                originalHeight: height,
              });
            }}
            ref={scrollRef}>
            {searchResults
              .filter((currentFilter) => {
                if (searchInput === '') return currentFilter;
                return currentFilter.name
                  .toLowerCase()
                  .includes(searchInput.toLowerCase());
              })
              .slice(0, scrollTop.count)
              .map((current) => {
                if (!!current.name && !!current.partnerID) {
                  return (
                    <ListItemFilter
                      key={current.partnerID}
                      title={current.name}
                      imgURL={current.profileIMG}
                      partnerID={current.partnerID}
                      cities={current.cities}
                    />
                  );
                } else if (!!current.name && current.pubCount) {
                  return (
                    <ListItemCity
                      key={current.name}
                      current={current}
                      buttonClicked={() => {
                        const findAllPubsOfCity = mainState.kneipen.filter(
                          (currentPub) => {
                            if (
                              currentPub.city === current.city ||
                              currentPub.city2 === current.city ||
                              currentPub.extracity === current.city
                            ) {
                              return currentPub;
                            }
                          },
                        );
                        console.log(current.city, findAllPubsOfCity.length);
                        if (findAllPubsOfCity.length < 2) {
                          const laDF = 0.005;
                          const loDF = laDF / 1.204;
                          setMainState({
                            ...mainState,
                            filters: {
                              category: [],
                              breweries: [],
                            },
                            filtersOn: false,
                            regionToAnimate: {
                              latitude:
                                findAllPubsOfCity[0].latitude ||
                                current.latitude,
                              longitude:
                                findAllPubsOfCity[0].longitude ||
                                current.longitude,
                              latitudeDelta: laDF,
                              longitudeDelta: loDF,
                            },
                          });
                          return navigation.push('Map');
                        }

                        // Sort
                        const sortedAfterLatitude =
                          findAllPubsOfCity.sort(sortAfterLatitude);
                        const sortedAfterLongitude =
                          findAllPubsOfCity.sort(sortAfterLongitude);
                        console.log([
                          {
                            latitude: sortedAfterLatitude[0].latitude,
                            longitude: sortedAfterLongitude[0].longitude,
                          },
                          {
                            latitude:
                              sortedAfterLongitude[
                                sortedAfterLatitude.length - 1
                              ].latitude,
                            longitude:
                              sortedAfterLongitude[
                                sortedAfterLongitude.length - 1
                              ].longitude,
                          },
                        ]);
                        setMainState({
                          ...mainState,
                          filters: {
                            category: [],
                            breweries: [],
                          },
                          filtersOn: false,
                          coordsToFitToMap_Full: [
                            {
                              latitude: sortedAfterLatitude[0].latitude,
                              longitude:
                                sortedAfterLongitude[
                                  sortedAfterLongitude.length - 1
                                ].longitude,
                            },
                            {
                              latitude:
                                sortedAfterLongitude[
                                  sortedAfterLatitude.length - 1
                                ].latitude,
                              longitude: sortedAfterLongitude[0].longitude,
                            },
                          ],
                          dontAnimateToRegion: true,
                        });
                        navigation.push('Map');
                      }}
                    />
                  );
                } else if (!!current.name) {
                  return (
                    <ListItemPub
                      key={current._id}
                      current={current}
                      buttonClicked={() => openPub(current)}
                      withCross={false}
                    />
                  );
                }
              })}
            {searchResults.filter((currentFilter) =>
              currentFilter.name
                .toLowerCase()
                .includes(searchInput.toLowerCase()),
            ).length < 1 && (
                <EmptyList
                  title={t('locationMissing')}
                  sub={t('locationMissingMsg')}
                  marginTop={30}
                  btnText1={t('addLocation')}
                  btnClick1={() => navigation.push('Form')}
                />
              )}
          </ScrollView>
        </>
      }
      title={t('searchtitle')}
      overlay={
        <ModalOverlay
          str="@FirstOpen_Search"
          downSteps={[
            {
              eng: 'Find locations by their names!',
              deu: 'Finde neue und alte Schätze!',
            },
          ]}
        />
      }
    />
  );
};

export default Search;
