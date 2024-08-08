import { Marker, Image } from 'react-native-maps';
import React, { useContext } from 'react';
import MainContext from '../context/MainContext';
import { View, Text, StyleSheet, Platform, NativeModules } from 'react-native';
import Fonts from '../content/Fonts';
import CountInteraction from '../utilities/CountInteraction';
import { darkblue, yellow } from '../styles/Colors';
import { useNavigation } from '@react-navigation/native';
import FillUpComplete from '../utilities/FillUpComplete';
import { normalizeFontSize } from '../utilities/ResFontSize';

const MapMarkers = ({ currentRegion, params }) => {
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
  const navigation = useNavigation();

  const MapCluster11 = 0.074;
  const MapCluster21 = 0.19;
  const MapCluster31 = 0.35;
  const MapCluster4 = 0.067;

  const { mainState, setMainState } = useContext(MainContext);

  const mapStyling = StyleSheet.create({
    districtmarkercontainer: {
      backgroundColor: yellow,
      display: 'flex',
      flexDirection: 'row',
      padding: 6,
      alignItems: 'center',
      borderRadius: 6,
    },
    districtmarkertext1: {
      color: darkblue,
      fontFamily: Fonts.Bold,
      fontSize: normalizeFontSize(12), // before 14
    },
  });
  let clusterFilteredKneipen = [];
  if (params?.map === 'Map') {
    clusterFilteredKneipen = mainState.kneipen.filter((currentBar) => {
      for (const [filter, value] of Object.entries(mainState.clusterFilters)) {
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

  const checkIfDistrictHasPlus = (marker) => {
    let districtHasPlus = false;
    mainState.kneipen.map((k) => {
      if (
        (k.district === marker.district || k.district2 === marker.district2) &&
        k.plus
      ) {
        districtHasPlus = true;
      }
    });
    return districtHasPlus;
  };

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


  if (!mapBoundaries.maxLat) return null;

  return (
    <>
      {clusterFilteredKneipen.map((marker) => {
        if (
          !!marker.latitude && !!marker.longitude && marker.latitude >= mapBoundaries.minLat &&
          marker.latitude <= mapBoundaries.maxLat &&
          marker.longitude >= mapBoundaries.minLng &&
          marker.longitude <= mapBoundaries.maxLng
        ) {
          if (
            !marker.category.includes('citymarker') &&
            !marker.category.includes('districtmarker')
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
          } else if (marker.category === 'districtmarker') {
            return (
              <Marker
                coordinate={{
                  latitude: marker.latitude,
                  longitude: marker.longitude,
                }}
                key={marker._id}
                onPress={() => {
                  let DNC = checkIfDistrictHasPlus(marker);
                  if (DNC) {
                    setMainState({
                      ...mainState,
                      regionToAnimate: {
                        latitude: marker.latitude,
                        longitude: marker.longitude,
                        latitudeDelta: MapCluster21,
                        longitudeDelta: MapCluster21 / 1.204,
                      },
                    });
                  } else {
                    setMainState({
                      ...mainState,
                      regionToAnimate: {
                        latitude: marker.latitude,
                        longitude: marker.longitude,
                        latitudeDelta: MapCluster11,
                        longitudeDelta: MapCluster11 / 1.204,
                      },
                    });
                  }
                }}
                tracksInfoWindowChanges={false}
                tracksViewChanges={false}>
                <View style={mapStyling.districtmarkercontainer}>
                  <Text style={mapStyling.districtmarkertext1}>
                    {marker.district}
                  </Text>
                </View>
              </Marker>
            );
          } else {
            return (
              <Marker
                coordinate={{
                  latitude: marker.latitude,
                  longitude: marker.longitude,
                }}
                key={marker._id}
                icon={marker.pin}
                style={{ zIndex: 50 }}
                onPress={() => {
                  const getAllDistrictMarkersForCity = mainState.kneipen.filter(
                    (current) =>
                      current.category === 'districtmarker' &&
                      marker.name.includes(current.city.split(' ')[0]),
                  );
                  if (!getAllDistrictMarkersForCity.length) {
                    // City Has No Districts saved
                    const findAllPubsOfCity = mainState.kneipen.filter(
                      (current) => marker.World === current.city,
                    );
                    if (findAllPubsOfCity.length > 0) {
                      const sortedAfterLatitude =
                        findAllPubsOfCity.sort(sortAfterLatitude);
                      const sortedAfterLongitude =
                        findAllPubsOfCity.sort(sortAfterLongitude);
                      console.log('zoom on City', [
                        {
                          latitude: sortedAfterLatitude[0].latitude,
                          longitude:
                            sortedAfterLongitude[
                              sortedAfterLongitude.length - 1
                            ].longitude,
                        },
                        {
                          latitude:
                            sortedAfterLongitude[sortedAfterLatitude.length - 1]
                              .latitude,
                          longitude: sortedAfterLongitude[0].longitude,
                        },
                      ]);
                      return setMainState({
                        ...mainState,
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
                    }
                  } else {
                    // City Has Districts saved
                    const findAllDistrictMarkersOfCity =
                      mainState.kneipen.filter(
                        (current) =>
                          current.category === 'districtmarker' &&
                          current.city === marker.World,
                      );
                    if (findAllDistrictMarkersOfCity.length > 0) {
                      const sortedAfterLatitude =
                        findAllDistrictMarkersOfCity.sort(sortAfterLatitude);
                      const sortedAfterLongitude =
                        findAllDistrictMarkersOfCity.sort(sortAfterLongitude);
                      console.log('zoom on City', marker.World);
                      return setMainState({
                        ...mainState,
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
                    }
                  }
                  if (
                    marker.category === 'muenchencitymarker' ||
                    marker.category === 'frankfurtmaincitymarker' ||
                    marker.category === 'heidelbergcitymarker' ||
                    marker.category === 'koelncitymarker'
                  ) {
                    setMainState({
                      ...mainState,
                      regionToAnimate: {
                        latitude: marker.latitude,
                        longitude: marker.longitude,
                        latitudeDelta: MapCluster4,
                        longitudeDelta: MapCluster4 / 1.204,
                      },
                    });
                  } else {
                    setMainState({
                      ...mainState,
                      regionToAnimate: {
                        latitude: marker.latitude,
                        longitude: marker.longitude,
                        latitudeDelta: MapCluster31,
                        longitudeDelta: MapCluster31 / 1.204,
                      },
                    });
                  }
                }}
                tracksInfoWindowChanges={false}
                tracksViewChanges={false}
              />
            );
          }
        }
      })}
    </>
  );
};

export default MapMarkers;
