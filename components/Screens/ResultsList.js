import React, { useContext, useState } from 'react';
import MainContext from '../../context/MainContext';
import { ScrollView } from 'react-native';
import ListItemPub from '../ListItems/ListItemPub';
import { getDistance } from 'geolib';
import CountInteraction from '../../utilities/CountInteraction';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import FillUpComplete from '../../utilities/FillUpComplete';
import LayoutContainer from '../../utilities/LayoutContainer';
import ModalOverlay from '../Onboarding/ModalOverlay';
import { screenHeight } from '../../utilities/WidthAndHeight';

const ResultsList = () => {
  const { mainState, setMainState } = useContext(MainContext);
  const { t } = useTranslation();
  const navigation = useNavigation();
  const setCount = 30;
  const [scrollTop, setScrollTop] = useState({
    originalHeight: screenHeight,
    height: null,
    count: setCount,
  });
  const handleScroll = (event) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    if (scrollY > scrollTop.height) {
      console.log('Load More');
      setScrollTop({
        ...scrollTop,
        count: scrollTop.count + setCount,
        height: scrollTop.height + scrollTop.originalHeight,
      });
    }
  };
  function compare(a, b) {
    if (a.distance < b.distance) {
      return -1;
    }
    if (a.distance > b.distance) {
      return 1;
    }
    return 0;
  }
  function compareNames(a, b) {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  }
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
  let filteredKneipen = mainState.kneipen.filter((currentBar) => {
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
  if (mainState.locationGranted && filteredKneipen.length > 0) {
    let kneipenWithDistance = [];
    filteredKneipen.map((kneipe) => {
      let zwischenKneipe;
      zwischenKneipe = {
        ...kneipe,
        distance: getDistanceForEach(kneipe),
        distanceDisplay: getDistanceDisplayForEach(kneipe),
      };
      kneipenWithDistance = [...kneipenWithDistance, zwischenKneipe];
    });
    filteredKneipen = kneipenWithDistance.sort(compare);
  } else {
    filteredKneipen = filteredKneipen.sort(compareNames);
  }
  if (!filteredKneipen) return null;
  return (
    <LayoutContainer
      title={t('results', {
        num: filteredKneipen.length
      })}
      content={
        <ScrollView onScroll={handleScroll} scrollEventThrottle={16} scrollEnabled={true} showsVerticalScrollIndicator={false}>
          {filteredKneipen.slice(0, scrollTop.count).map((current) => {
            return (
              <ListItemPub
                current={current}
                key={current._id}
                buttonClicked={() => {
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
                          lokal_id: current.lokal_id
                            || current._id,
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
                }}
                setSub={
                  current.distanceDisplay
                    ? t('distance', { distance: current.distanceDisplay })
                    : false
                }
              />
            );
          })}
        </ScrollView>
      }
      overlay={
        <ModalOverlay
          str="@FirstOpen_ResultsList"
          downSteps={[
            {
              eng: 'Here you find the results for your filter searches.',
              deu: 'Hier findest du die Ergebnisse für deine Filtersuche.',
            },
          ]}
        />
      }
    />
  );
};

export default ResultsList;
