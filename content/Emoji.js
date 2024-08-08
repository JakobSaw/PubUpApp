import React, {Fragment, memo} from 'react';
import {View, Image} from 'react-native';
import {darkblue, lightblue, red, yellow} from '../styles/Colors';
import layout_styles from '../styles/Layout_Styles';

// ['beer', 'drunk', 'thirsty', 'love', 'unicorn', 'champagne', 'fire', 'dancing_men', 'dancing_woman'];

/* https://i.ibb.co/SX5qLvR/clinking-beer-mugs.png
https://i.ibb.co/vJVSTdS/drooling-face-emoji.png
https://i.ibb.co/dkdCfBp/smiling-face-with-hearts.png
https://i.ibb.co/DtHw5ym/unicorn-face-emoji.png
https://i.ibb.co/FV0VVqG/bottle-with-popping-cork.png
https://i.ibb.co/Cvzx2G2/dancing-girl.png
https://i.ibb.co/tQHcxpM/fire.png
https://i.ibb.co/bBTsYQB/man-dancing.png */

export const Emoji = ({emoji, styles}) => {
  if (emoji === 'beer') {
    return (
      <Image
        style={styles}
        source={{uri: 'https://i.ibb.co/SX5qLvR/clinking-beer-mugs.png'}}
      />
    );
  } else if (emoji === 'thirsty') {
    return (
      <Image
        style={styles}
        source={{uri: 'https://i.ibb.co/vJVSTdS/drooling-face-emoji.png'}}
      />
    );
  } else if (emoji === 'drunk') {
    return (
      <Image
        style={styles}
        source={{uri: 'https://i.ibb.co/jRFsYDB/woozy-face.png'}}
      />
    );
  } else if (emoji === 'love') {
    return (
      <Image
        style={styles}
        source={{uri: 'https://i.ibb.co/dkdCfBp/smiling-face-with-hearts.png'}}
      />
    );
  } else if (emoji === 'unicorn') {
    return (
      <Image
        style={styles}
        source={{uri: 'https://i.ibb.co/DtHw5ym/unicorn-face-emoji.png'}}
      />
    );
  } else if (emoji === 'champagne') {
    return (
      <Image
        style={styles}
        source={{uri: 'https://i.ibb.co/FV0VVqG/bottle-with-popping-cork.png'}}
      />
    );
  } else if (emoji === 'fire') {
    return (
      <Image
        style={styles}
        source={{uri: 'https://i.ibb.co/tQHcxpM/fire.png'}}
      />
    );
  } else if (emoji === 'dancing_men') {
    return (
      <Image
        style={styles}
        source={{uri: 'https://i.ibb.co/bBTsYQB/man-dancing.png '}}
      />
    );
  } else if (emoji === 'dancing_woman') {
    return (
      <Image
        style={styles}
        source={{uri: 'https://i.ibb.co/Cvzx2G2/dancing-girl.png'}}
      />
    );
  }
  return <></>;
};
