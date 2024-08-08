import React, { useContext, useState, useEffect, useCallback } from 'react';
import layout_styles from '../styles/Layout_Styles';
import { Text } from 'react-native';
import MainContext from '../context/MainContext';
import PrimaryButton from './Buttons/PrimaryButton';
import { getDistance } from 'geolib';
import { useTranslation } from 'react-i18next';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import FillUpComplete from '../utilities/FillUpComplete';
import i18next from 'i18next';

const FilterCounterText = ({ filterNav, clicked, filterRetrigger }) => {
  const { mainState, setMainState } = useContext(MainContext);
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [counterState, setCounterState] = useState({
    disablebutton: true,
    showHits: true,
    eng: 'There are no results for your search',
    deu: 'Es gibt leider keine Treffer für deine Suche',
  });

  function getDistanceForEach(el) {
    let distance = getDistance(
      {
        latitude: mainState.userLocation.latitude,
        longitude: mainState.userLocation.longitude,
      },
      { latitude: el.latitude, longitude: el.longitude },
    );
    return distance;
  }
  function getDistanceDisplayForEach(el) {
    let distance = getDistance(
      {
        latitude: mainState.userLocation.latitude,
        longitude: mainState.userLocation.longitude,
      },
      { latitude: el.latitude, longitude: el.longitude },
    );
    let distanceKM1 = Math.ceil(distance / 100);
    let distanceKM2 = distanceKM1 / 10;
    if (distance > 1000) {
      return `${distanceKM2} km`;
    } else {
      return `${distance} m`;
    }
  }
  function compare(a, b) {
    if (a.distance < b.distance) {
      return -1;
    }
    if (a.distance > b.distance) {
      return 1;
    }
    return 0;
  }

  const buttonClicked = () => {
    if (!!clicked) {
      clicked();
    }
    if (mainState.locationGranted && filteredPubs.length > 0) {
      let resultsWithDistance = [];
      filteredPubs.map((current) => {
        let singlePub;
        singlePub = {
          ...current,
          distance: getDistanceForEach(current),
          distanceDisplay: getDistanceDisplayForEach(current),
        };
        resultsWithDistance = [...resultsWithDistance, singlePub];
      });
      let sortedPubs = resultsWithDistance.sort(compare);
      setMainState({
        ...mainState,
        coordsToFitToMap: {
          latitude: sortedPubs[0].latitude,
          longitude: sortedPubs[0].longitude,
        },
        complete: {
          ...mainState.complete,
          filterSearches: [
            ...mainState.complete.filterSearches,
            {
              filters: mainState.filters,
              activeCity: mainState.activeCity,
              ...FillUpComplete(),
            },
          ],
        },
        dontAnimateToRegion: true,
      });
    } else {
      setMainState({
        ...mainState,
        complete: {
          ...mainState.complete,
          filterSearches: [
            ...mainState.complete.filterSearches,
            {
              filters: mainState.filters,
              activeCity: mainState.activeCity,
              ...FillUpComplete(),
            },
          ],
        },
      });
    }
    navigation.push('Map', { map: 'Results' });
  };

  let filteredPubs = mainState.kneipen.filter((currentBar) => {
    if (
      (!currentBar.category?.includes('citymarker') &&
        currentBar.category !== 'districtmarker' &&
        currentBar.city === mainState.activeCity && !!mainState.locationGranted) || (!currentBar.category?.includes('citymarker') &&
          currentBar.category !== 'districtmarker' && !mainState.locationGranted)
    ) {
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
    }
  });

  let allPubs = mainState.kneipen.filter((currentBar) => {
    if (
      (!currentBar.category?.includes('citymarker') &&
        currentBar.category !== 'districtmarker' &&
        currentBar.city === mainState.activeCity && !!mainState.locationGranted) || (!currentBar.category?.includes('citymarker') &&
          currentBar.category !== 'districtmarker' && !mainState.locationGranted)
    ) {
      return currentBar;
    }
  });

  const checkRadius = () => {
    let radiusCheck = false;

    const rightRadius = mainState.radiusWorld * 1000;


    filteredPubs.map((current) => {
      let distance = getDistance(
        {
          latitude: mainState.userLocation.latitude,
          longitude: mainState.userLocation.longitude,
        },
        {
          latitude: current.latitude,
          longitude: current.longitude,
        },
      );
      if (distance <= rightRadius) {
        radiusCheck = true;
      }
    });

    return radiusCheck;
  };

  useEffect(() => {
    if (filterNav === 'Filters') {
      if (mainState.activeCity !== 'World') {
        if (mainState.filters.category.length > 0) {
          if (filteredPubs.length > 0) {
            setCounterState({
              ...counterState,
              disablebutton: false,
              showHits: true,
            });
          } else {
            setCounterState({
              ...counterState,
              eng: 'No Filter Results found in your City',
              deu: 'Kein Ergebnis liegt in deiner Stadt',
              showHits: false,
              disablebutton: true,
            });
          }
        } else {
          if (!!mainState.filtersOn) {
            if (
              filteredPubs.length > 0 &&
              filteredPubs.length != allPubs.length
            ) {
              setCounterState({
                ...counterState,
                disablebutton: false,
                showHits: true,
              });
            } else if (filteredPubs.length === 0) {
              setCounterState({
                ...counterState,
                eng: 'No Filter Results found in your City',
                deu: 'Kein Ergebnis liegt in deiner Stadt',
                showHits: false,
                disablebutton: true,
              });
            } else {
              setCounterState({
                disablebutton: true,
                showHits: true,
              });
            }
          } else {
            setCounterState({
              disablebutton: true,
              showHits: true,
            });
          }
        }
      } else {
        if (mainState.filters.category.length > 0) {
          if (filteredPubs.length > 0) {
            if (checkRadius()) {
              setCounterState({
                ...counterState,
                disablebutton: false,
                showHits: true,
              });
            } else {
              setCounterState({
                ...counterState,
                eng: 'No Filter Results found in your Radius',
                deu: 'Kein Ergebnis liegt in deinem Radius',
                showHits: false,
                disablebutton: true,
              });
            }
          } else {
            setCounterState({
              ...counterState,
              eng: 'There are no results for your search',
              deu: 'Es gibt leider keine Treffer für deine Suche',
              showHits: false,
              disablebutton: true,
            });
          }
        } else {
          if (!!mainState.filtersOn) {
            if (
              filteredPubs.length > 0 &&
              filteredPubs.length != allPubs.length
            ) {
              if (checkRadius()) {
                setCounterState({
                  ...counterState,
                  disablebutton: false,
                  showHits: true,
                });
              } else {
                setCounterState({
                  ...counterState,
                  eng: 'No Filter Results found in your Radius',
                  deu: 'Kein Ergebnis liegt in deinem Radius',
                  showHits: false,
                  disablebutton: true,
                });
              }
            } else if (filteredPubs.length === 0) {
              setCounterState({
                ...counterState,
                eng: 'There are no results for your search',
                deu: 'Es gibt leider keine Treffer für deine Suche',
                showHits: false,
                disablebutton: true,
              });
            } else {
              setCounterState({
                disablebutton: true,
                showHits: true,
              });
            }
          } else {
            setCounterState({
              disablebutton: true,
              showHits: true,
            });
          }
        }
      }
    } else if (filterNav === 'Categories') {
      if (mainState.activeCity !== 'World') {
        if (
          mainState.filters.plus ||
          mainState.filters.cocktails ||
          mainState.filters.wine ||
          mainState.filters.craft ||
          mainState.filters.billards ||
          mainState.filters.darts ||
          mainState.filters.kicker ||
          mainState.filters.smoking ||
          mainState.filters.outdoor ||
          mainState.filters.streaming ||
          mainState.filters.wlan ||
          mainState.filters.payment
        ) {
          if (filteredPubs.length > 0) {
            setCounterState({
              ...counterState,
              disablebutton: false,
              showHits: true,
            });
          } else {
            setCounterState({
              ...counterState,
              eng: 'No Filter Results found in your City',
              deu: 'Kein Ergebnis liegt in deiner Stadt',
              showHits: false,
              disablebutton: true,
            });
          }
        } else {
          if (mainState.filters.category.length > 0) {
            if (
              filteredPubs.length > 0 &&
              filteredPubs.length != allPubs.length
            ) {
              setCounterState({
                ...counterState,
                disablebutton: false,
                showHits: true,
              });
            } else if (filteredPubs.length === 0) {
              setCounterState({
                ...counterState,
                eng: 'No Filter Results found in your City',
                deu: 'Kein Ergebnis liegt in deiner Stadt',
                showHits: false,
                disablebutton: true,
              });
            } else {
              setCounterState({
                disablebutton: true,
                showHits: true,
              });
            }
          } else {
            setCounterState({
              disablebutton: true,
              showHits: true,
            });
          }
        }
      } else {
        if (
          mainState.filters.plus ||
          mainState.filters.cocktails ||
          mainState.filters.wine ||
          mainState.filters.craft ||
          mainState.filters.billards ||
          mainState.filters.darts ||
          mainState.filters.kicker ||
          mainState.filters.smoking ||
          mainState.filters.outdoor ||
          mainState.filters.streaming ||
          mainState.filters.wlan ||
          mainState.filters.payment
        ) {
          if (filteredPubs.length > 0) {
            if (checkRadius()) {
              setCounterState({
                ...counterState,
                disablebutton: false,
                showHits: true,
              });
            } else {
              setCounterState({
                ...counterState,
                eng: 'No Filter Results found in your Radius',
                deu: 'Kein Ergebnis liegt in deinem Radius',
                showHits: false,
                disablebutton: true,
              });
            }
          } else {
            setCounterState({
              ...counterState,
              eng: 'There are no results for your search',
              deu: 'Es gibt leider keine Treffer für deine Suche',
              showHits: false,
              disablebutton: true,
            });
          }
        } else {
          if (mainState.filters.category.length > 0) {
            if (
              filteredPubs.length > 0 &&
              filteredPubs.length != allPubs.length
            ) {
              if (checkRadius()) {
                setCounterState({
                  ...counterState,
                  disablebutton: false,
                  showHits: true,
                });
              } else {
                setCounterState({
                  ...counterState,
                  eng: 'No Filter Results found in your Radius',
                  deu: 'Kein Ergebnis liegt in deinem Radius',
                  showHits: false,
                  disablebutton: true,
                });
              }
            } else if (filteredPubs.length === 0) {
              setCounterState({
                ...counterState,
                eng: 'There are no results for your search',
                deu: 'Es gibt leider keine Treffer für deine Suche',
                showHits: false,
                disablebutton: true,
              });
            } else {
              setCounterState({
                disablebutton: true,
                showHits: true,
              });
            }
          } else {
            setCounterState({
              disablebutton: true,
              showHits: true,
            });
          }
        }
      }
    } else if (filterNav === 'Breweries') {
      if (mainState.activeCity !== 'World') {
        if (
          mainState.filters.plus ||
          mainState.filters.cocktails ||
          mainState.filters.wine ||
          mainState.filters.craft ||
          mainState.filters.billards ||
          mainState.filters.darts ||
          mainState.filters.kicker ||
          mainState.filters.smoking ||
          mainState.filters.outdoor ||
          mainState.filters.streaming ||
          mainState.filters.wlan ||
          mainState.filters.payment
        ) {
          if (filteredPubs.length > 0) {
            setCounterState({
              ...counterState,
              disablebutton: false,
              showHits: true,
            });
          } else {
            setCounterState({
              ...counterState,
              eng: 'No Filter Results found in your City',
              deu: 'Kein Ergebnis liegt in deiner Stadt',
              showHits: false,
              disablebutton: true,
            });
          }
        } else {
          if (mainState.filters.breweries.length > 0) {
            if (
              filteredPubs.length > 0 &&
              filteredPubs.length != allPubs.length
            ) {
              setCounterState({
                ...counterState,
                disablebutton: false,
                showHits: true,
              });
            } else if (filteredPubs.length === 0) {
              setCounterState({
                ...counterState,
                eng: 'No Filter Results found in your City',
                deu: 'Kein Ergebnis liegt in deiner Stadt',
                showHits: false,
                disablebutton: true,
              });
            } else {
              setCounterState({
                disablebutton: true,
                showHits: true,
              });
            }
          } else {
            setCounterState({
              disablebutton: true,
              showHits: true,
            });
          }
        }
      } else {
        if (
          mainState.filters.plus ||
          mainState.filters.cocktails ||
          mainState.filters.wine ||
          mainState.filters.craft ||
          mainState.filters.billards ||
          mainState.filters.darts ||
          mainState.filters.kicker ||
          mainState.filters.smoking ||
          mainState.filters.outdoor ||
          mainState.filters.streaming ||
          mainState.filters.wlan ||
          mainState.filters.payment
        ) {
          if (filteredPubs.length > 0) {
            if (checkRadius()) {
              setCounterState({
                ...counterState,
                disablebutton: false,
                showHits: true,
              });
            } else {
              setCounterState({
                ...counterState,
                eng: 'No Filter Results found in your Radius',
                deu: 'Kein Ergebnis liegt in deinem Radius',
                showHits: false,
                disablebutton: true,
              });
            }
          } else {
            setCounterState({
              ...counterState,
              eng: 'There are no results for your search',
              deu: 'Es gibt leider keine Treffer für deine Suche',
              showHits: false,
              disablebutton: true,
            });
          }
        } else {
          if (mainState.filters.breweries.length > 0) {
            if (
              filteredPubs.length > 0 &&
              filteredPubs.length != allPubs.length
            ) {
              if (checkRadius()) {
                setCounterState({
                  ...counterState,
                  disablebutton: false,
                  showHits: true,
                });
              } else {
                setCounterState({
                  ...counterState,
                  eng: 'No Filter Results found in your Radius',
                  deu: 'Kein Ergebnis liegt in deinem Radius',
                  showHits: false,
                  disablebutton: true,
                });
              }
            } else if (filteredPubs.length === 0) {
              setCounterState({
                ...counterState,
                eng: 'There are no results for your search',
                deu: 'Es gibt leider keine Treffer für deine Suche',
                showHits: false,
                disablebutton: true,
              });
            } else {
              setCounterState({
                disablebutton: true,
                showHits: true,
              });
            }
          } else {
            setCounterState({
              disablebutton: true,
              showHits: true,
            });
          }
        }
      }
    }
  }, [filterNav, mainState.filters, mainState.radiusWorld, filterRetrigger]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        if (!mainState.filtersOn) {
          setCounterState({
            disablebutton: true,
            showHits: true,
          });
        }
      };
    }, []),
  );

  return (
    <>
      {counterState.showHits && (
        <Text style={layout_styles.counterText}>
          {filteredPubs.length} {t('hits')}
        </Text>
      )}
      {!counterState.showHits && (
        <Text style={layout_styles.counterText}>
          {i18next.language === 'en' ? counterState.eng : counterState.deu}
        </Text>
      )}
      <PrimaryButton
        disabled={counterState.disablebutton}
        text={t('go')}
        buttonClicked={buttonClicked}
      />
    </>
  );
};

export default FilterCounterText;
