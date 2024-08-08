import React, { useState, useEffect, useContext, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { DIRECTIONS_KEY } from '@env';
import { mapStyle } from '../styles/MapStyle';
import MainContext from '../context/MainContext';
import MapMarkers from '../components/MapMarkers';
import MapMarkersFiltered from '../components/MapMarkersFiltered';
import FilterResetButtons from './Buttons/FilterResetButtons';
import { screenHeight, screenWidth } from '../utilities/WidthAndHeight';
import MapMarkersBarBundles from '../components/MapMarkersBarBundles';
import Fonts from '../content/Fonts';
import CountInteraction from '../utilities/CountInteraction';
import { darkblue, yellow } from '../styles/Colors';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import FillUpComplete from '../utilities/FillUpComplete';
import i18next from 'i18next';
import layout_styles from '../styles/Layout_Styles';

const MapViewWrapper = ({ route }) => {
  const mapRef = useRef();
  const MapCluster2 = 0.1;
  const MapCluster3 = 0.4;
  const MapCluster4 = 0.067;
  const { t } = useTranslation();
  const { mainState, setMainState } = useContext(MainContext);
  const [mapState, setMapState] = useState({
    currentRegion: {
      maxLat: null,
      maxLng: null,
      minLat: null,
      minLng: null,
    },
  });
  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      margin: 'auto',
      top: 'auto',
      left: 'auto',
      right: 15,
      bottom: 85,
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
      minWidth: 120,
    },
  });
  const navigation = useNavigation();

  const { params } = route;
  const timeOutForMapMovement = 500;
  const logMapMovement = false;

  // Route Params
  const mapHeight = () => {
    if (params?.map === 'Map') return screenHeight - 70 + 29.33333396911621;
    return screenHeight;
  };
  // Animate to Region
  const triggerAnimateToRegion = () => {
    if (params?.map === 'Navigate' && !mainState.jumpToRegionOnNavigate) return;
    if (
      !!mapRef.current &&
      !!mapRef.current.animateToRegion &&
      mainState.regionToAnimate.latitude !== 51.30587154654041 &&
      mainState.regionToAnimate.longitude !== 10.36651481083793 &&
      mainState.regionToAnimate.latitude !== 52.519609 &&
      mainState.regionToAnimate.longitude !== 13.406851 &&
      mainState.regionToAnimate.latitudeDelta !== 10 &&
      mainState.regionToAnimate.longitudeDelta !== 10 &&
      !mainState.dontAnimateToRegion
    ) {
      if (logMapMovement) {
        console.log(
          'mainState.regionToAnimate :>> ',
          mainState.regionToAnimate,
        );
      }
      mapRef.current?.animateToRegion(mainState.regionToAnimate, 300);
      if (!!mainState.jumpToRegionOnNavigate) {
        setTimeout(() => {
          setMainState({
            ...mainState,
            jumpToRegionOnNavigate: false,
          });
        }, 2000);
      }
    }
  };
  const triggerFitToCoordinates = () => {
    if (
      mapRef.current &&
      mapRef.current.fitToCoordinates &&
      mainState.locationGranted &&
      params?.map === 'Results'
    ) {
      if (logMapMovement) {
        console.log(
          'mainState.coordsToFitToMap :>> ',
          mainState.coordsToFitToMap,
        );
      }
      mapRef.current.fitToCoordinates(
        [
          {
            latitude: mainState.userLocation.latitude,
            longitude: mainState.userLocation.longitude,
          },
          mainState.coordsToFitToMap,
        ],
        {
          edgePadding: {
            right: screenWidth / 5,
            bottom: screenHeight / 5,
            left: screenWidth / 5,
            top: screenHeight / 5,
          },
        },
      );
    }
  };
  const triggerFitToCoordinatesFull = () => {
    if (
      mapRef.current &&
      mapRef.current.fitToCoordinates &&
      mainState.coordsToFitToMap_Full.length === 2
    ) {
      if (logMapMovement) {
        console.log(
          'mainState.coordsToFitToMap_Full :>> ',
          mainState.coordsToFitToMap_Full,
        );
      }
      mapRef.current.fitToCoordinates(mainState.coordsToFitToMap_Full, {
        edgePadding: {
          right: screenWidth / 5,
          bottom: screenHeight / 5,
          left: screenWidth / 5,
          top: screenHeight / 5,
        },
      });
    }
  };
  useEffect(() => {
    setTimeout(triggerAnimateToRegion, timeOutForMapMovement);
  }, [mainState.regionToAnimate]);
  // CoordsToFitMap
  useEffect(() => {
    if (mainState.dontAnimateToRegion) {
      setTimeout(
        () =>
          setMainState({
            ...mainState,
            dontAnimateToRegion: null,
          }),
        timeOutForMapMovement,
      );
    }
  }, [mainState.dontAnimateToRegion]);
  // CoordsToFitMap
  useEffect(() => {
    setTimeout(triggerFitToCoordinates, timeOutForMapMovement);
  }, [mainState.coordsToFitToMap]);
  useEffect(() => {
    setTimeout(triggerFitToCoordinatesFull, timeOutForMapMovement);
  }, [mainState.coordsToFitToMap_Full]);
  const checkClusterChanges = (region) => {
    if (region.latitudeDelta <= MapCluster2) {
      setMainState({
        ...mainState,
        clusterFilters: {
          category: [
            'urkneipeplus',
            'alternativplus',
            'billardplus',
            'dancingplus',
            'cozyplus',
            'irishplus',
            'gartenplus',
            'beachplus',
            'musicplus',
            'classyplus',
            'urkneipe',
            'alternativ',
            'billard',
            'dancing',
            'cozy',
            'irish',
            'garten',
            'beach',
            'music',
            'classy',
            'worldurkneipe',
            'worldalternativ',
            'worldbillard',
            'worlddancing',
            'worldcozy',
            'worldirish',
            'worldgarten',
            'worldbeach',
            'worldmusic',
            'worldclassy',
            'worldurkneipeplus',
            'worldalternativplus',
            'worldbillardplus',
            'worlddancingplus',
            'worldcozyplus',
            'worldirishplus',
            'worldgartenplus',
            'worldbeachplus',
            'worldmusicplus',
            'worldclassyplus',
            'hh-bar',
            'hh-brewery',
            'hh-shop',
            'bierothek'
          ],
        },
      });
    } else if (region.latitudeDelta <= MapCluster3) {
      // Districs
      setMainState({
        ...mainState,
        clusterFilters: {
          category: [
            'districtmarker',
            'worldurkneipe',
            'worldalternativ',
            'worldbillard',
            'worlddancing',
            'worldcozy',
            'worldirish',
            'worldgarten',
            'worldbeach',
            'worldmusic',
            'worldclassy',
            'worldurkneipeplus',
            'worldalternativplus',
            'worldbillardplus',
            'worlddancingplus',
            'worldcozyplus',
            'worldirishplus',
            'worldgartenplus',
            'worldbeachplus',
            'worldmusicplus',
            'worldclassyplus',
          ],
        },
      });
    } else {
      // Cities
      setMainState({
        ...mainState,
        clusterFilters: {
          category: [
            'berlincitymarker',
            'hamburgcitymarker',
            'muenchencitymarker',
            'koelncitymarker',
            'frankfurtmaincitymarker',
            'leipzigcitymarker',
            'heidelbergcitymarker',
            'muenstercitymarker',
            'dortmundcitymarker',
            'bonncitymarker',
            'worldurkneipe',
            'worldalternativ',
            'worldbillard',
            'worlddancing',
            'worldcozy',
            'worldirish',
            'worldgarten',
            'worldbeach',
            'worldmusic',
            'worldclassy',
            'worldurkneipeplus',
            'worldalternativplus',
            'worldbillardplus',
            'worlddancingplus',
            'worldcozyplus',
            'worldirishplus',
            'worldgartenplus',
            'worldbeachplus',
            'worldmusicplus',
            'worldclassyplus',
            'hh-bar',
            'hh-brewery',
            'hh-shop',
            'bierothek'
          ],
        },
      });
    }
  };
  useEffect(() => {
    if (
      params?.map === 'Map' &&
      mapRef.current &&
      mapRef.current.__lastRegion
    ) {
      checkClusterChanges(mapRef.current.__lastRegion);
    }
  }, [params?.map]);

  return (
    <>
      <MapView
        provider={PROVIDER_GOOGLE}
        customMapStyle={mapStyle}
        style={{ height: mapHeight() }}
        showsUserLocation={mainState.locationGranted}
        toolbarEnabled={false}
        showsMyLocationButton={false}
        showsCompass={false}
        showsIndoors={false}
        initialRegion={{
          latitude: params?.map === 'Results' && !!mainState.regionToAnimate?.latitude ? mainState.regionToAnimate?.latitude : 52.519609,
          longitude: params?.map === 'Results' && !!mainState.regionToAnimate?.longitude ? mainState.regionToAnimate?.longitude : 13.406851,
          latitudeDelta: MapCluster4,
          longitudeDelta: MapCluster4,
        }}
        ref={mapRef}
        onRegionChangeComplete={(region) => {
          if (!mainState.filtersOn) {
            checkClusterChanges(region);
          }
          setMapState({
            ...mapState,
            currentRegion: region,
          });
        }}>
        {(params?.map === 'Map' || params?.map === 'EventsAndLocations') && (
          <MapMarkers currentRegion={mapState.currentRegion} params={params} />
        )}
        {params?.map === 'Results' && (
          <MapMarkersFiltered
            currentRegion={mapState.currentRegion}
            params={params}
          />
        )}
        {params?.map === 'Navigate' && !!mainState.navigation.destination && (
          <MapViewDirections
            onReady={(result) => {
              if (mapRef.current && mapRef.current.fitToCoordinates != null) {
                mapRef.current.fitToCoordinates(result.coordinates, {
                  edgePadding: {
                    right: screenWidth / 5,
                    bottom: screenHeight / 5,
                    left: screenWidth / 5,
                    top: screenHeight / 5,
                  },
                });
              }
            }}
            origin={{
              latitude: mainState.userLocation.latitude,
              longitude: mainState.userLocation.longitude,
            }}
            destination={{
              latitude: mainState.navigation.destination?.latitude,
              longitude: mainState.navigation.destination?.longitude,
            }}
            apikey={DIRECTIONS_KEY}
            strokeWidth={3}
            strokeColor={yellow}
            mode="WALKING"
          />
        )}
        {params?.map === 'PubBundles_Map' &&
          mainState.pubBundlePins.length > 0 && (
            <MapMarkersBarBundles
              currentRegion={mapState.currentRegion}
              pubBundlePins={mainState.pubBundlePins}
            />
          )}
        {params?.map === 'Navigate' && !!mainState.navigation.destination && (
          <Marker
            coordinate={{
              latitude: mainState.navigation.destination.latitude,
              longitude: mainState.navigation.destination.longitude,
            }}
            key={mainState.navigation.destination._id || Math.random()}
            icon={mainState.navigation.destination.pin}
            onPress={() => {
              if (!mainState.navigation.destination._id) return;
              navigation.push('Pub', {
                ...mainState.navigation.destination,
              });
              setMainState({
                ...mainState,
                filters: {
                  category: [],
                  breweries: [],
                },
                filtersOn: false,
                complete: {
                  ...mainState.complete,
                  interactions: [
                    ...mainState.complete.interactions,
                    {
                      lokal_name: mainState.navigation.destination.name,
                      lokal_id: mainState.navigation.destination.lokal_id
                        || mainState.navigation.destination._id,
                      action: 'clickOnIt',
                      ...FillUpComplete(),
                    },
                  ],
                },
                collectPubsToPushToDB: [
                  ...mainState.collectPubsToPushToDB,
                  mainState.navigation.destination.lokal_id ||
                  mainState.navigation.destination._id,
                ],
              });
              CountInteraction();
            }}
            tracksInfoWindowChanges={false}
            tracksViewChanges={false}
          />
        )}
      </MapView>
      {/* BUTTONS ON MAP */}
      {params?.map === 'Results' && <FilterResetButtons params={params} />}
      {params?.map === 'Navigate' && (
        <View style={styles.container}>
          <Text style={[layout_styles.font_styling_h4_Bold, { marginBottom: 5 }]}>
            {mainState.navigation.distance}
            {i18next.language === 'en' ? ' Distance' : ' Distanz'}
          </Text>
          <TouchableOpacity
            style={[
              styles.button,
              {
                zIndex: 5,
              },
            ]}
            onPress={() => navigation.goBack()}>
            <Text style={styles.text}>{t('back')}</Text>
          </TouchableOpacity>
        </View>
      )}
      {params?.map === 'PubBundles_Map' &&
        mainState.pubBundlePins.length > 0 && (
          <>
            <View style={styles.container}>
              <Text
                style={[layout_styles.font_styling_h4_Bold, { marginBottom: 5 }]}>
                {mainState.pubBundlePins.length}
                {i18next.language === 'en' ? ' Pubs' : ' Pubs'}
              </Text>
              <TouchableOpacity
                style={[
                  styles.button,
                  {
                    zIndex: 5,
                  },
                ]}
                onPress={async () => {
                  setMainState({
                    ...mainState,
                    coordsToFitToMap: {
                      ...mainState.coordsToFitToMap,
                    },
                    coordsToFitToMap_Full: [],
                  });
                  if (navigation.canGoBack()) return navigation.goBack();
                }}>
                <Text style={styles.text}>{t('back')}</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
    </>
  );
};

export default MapViewWrapper;
