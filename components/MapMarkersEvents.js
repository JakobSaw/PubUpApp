import {Marker} from 'react-native-maps';
import React, {Fragment, useContext} from 'react';
import MainContext from '../context/MainContext';

const MapMarkersEvents = ({currentRegion, veranstaltungen}) => {
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

  const {mainState, setMainState} = useContext(MainContext);

  if (mapBoundaries.maxLat && veranstaltungen && veranstaltungen?.length) {
    return (
      <Fragment>
        {veranstaltungen.map((marker) => {
          if (
            marker.latitude >= mapBoundaries.minLat &&
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
                key={marker.veranstaltung_id}
                icon={marker.pin}
                onPress={() => {
                  // Navgiate to Veranstaltung
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
export default MapMarkersEvents;
