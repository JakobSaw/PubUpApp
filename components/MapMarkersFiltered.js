import { Marker } from 'react-native-maps';
import React, { Fragment, useContext } from 'react';
import MainContext from '../context/MainContext';
import { Platform, NativeModules } from 'react-native';
import CountInteraction from '../utilities/CountInteraction';
import { useNavigation } from '@react-navigation/native';
import FillUpComplete from '../utilities/FillUpComplete';

const MapMarkersFiltered = ({ currentRegion, params }) => {
  const getBoundByRegion = (region, scale = 1) => {
    const calcMinLatByOffset = (lng, offset) => {
      const factValue = lng - offset;
      if (factValue < -90) {
        return (90 + offset) * -1;
      }
      return factValue;
    };

    const calcMaxLatByOffset = (lng, offset) => {
      const factValue = lng + offset;
      if (90 < factValue) {
        return (90 - offset) * -1;
      }
      return factValue;
    };

    const calcMinLngByOffset = (lng, offset) => {
      const factValue = lng - offset;
      if (factValue < -180) {
        return (180 + offset) * -1;
      }
      return factValue;
    };

    const calcMaxLngByOffset = (lng, offset) => {
      const factValue = lng + offset;
      if (180 < factValue) {
        return (180 - offset) * -1;
      }
      return factValue;
    };

    const latOffset = (region.latitudeDelta / 2) * scale;
    const lngD =
      region.longitudeDelta < -180
        ? 360 + region.longitudeDelta
        : region.longitudeDelta;
    const lngOffset = (lngD / 2) * scale;

    return {
      minLng: calcMinLngByOffset(region.longitude, lngOffset), // westLng - min lng
      minLat: calcMinLatByOffset(region.latitude, latOffset), // southLat - min lat
      maxLng: calcMaxLngByOffset(region.longitude, lngOffset), // eastLng - max lng
      maxLat: calcMaxLatByOffset(region.latitude, latOffset), // northLat - max lat
    };
  };
  let mapBoundaries = getBoundByRegion(currentRegion);

  const { mainState, setMainState } = useContext(MainContext);
  const navigation = useNavigation();

  let filteredKneipen;
  if (params?.map === 'Results') {
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
  }

  if (mapBoundaries.maxLat && filteredKneipen && filteredKneipen.length) {
    return (
      <Fragment>
        {filteredKneipen.map((marker) => {
          if (
            !!marker.latitude && !!marker.longitude && marker.latitude >= mapBoundaries.minLat &&
            marker.latitude <= mapBoundaries.maxLat &&
            marker.longitude >= mapBoundaries.minLng &&
            marker.longitude <= mapBoundaries.maxLng
          ) {
            return (
              <Marker
                coordinate={{
                  latitude: marker.latitude,
                  longitude: marker.longitude,
                }}
                key={marker._id}
                icon={marker.pin}
                onPress={() => {
                  setMainState({
                    ...mainState,
                    regionToAnimate: {
                      latitude: marker.latitude,
                      longitude: marker.longitude,
                      latitudeDelta: 0.005,
                      longitudeDelta: 0.005,
                    },
                    complete: {
                      ...mainState.complete,
                      interactions: [
                        ...mainState.complete.interactions,
                        {
                          lokal_name: marker.name,
                          lokal_id: marker.lokal_id || marker._id,
                          action: 'clickOnIt',
                          ...FillUpComplete(),
                        },
                      ],
                    },
                    collectPubsToPushToDB: [
                      ...mainState.collectPubsToPushToDB,
                      marker.lokal_id || marker._id,
                    ],
                  });
                  CountInteraction();
                  navigation.push('Pub', {
                    ...marker,
                  });
                }}
                tracksInfoWindowChanges={false}
                tracksViewChanges={false}
              />
            );
          }
        })}
      </Fragment>
    );
  } else {
    return <Fragment />;
  }
};
export default MapMarkersFiltered;
