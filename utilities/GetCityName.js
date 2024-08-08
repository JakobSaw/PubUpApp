import {Text} from 'react-native';
import React from 'react';

export default ({city, extracity, styles}) => {
  if (city !== 'World') {
    return <Text style={styles}>{city}</Text>;
  } else {
    return <Text style={styles}>{extracity}</Text>;
  }
};
