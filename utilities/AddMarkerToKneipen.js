export default async (data) => {
  let kneipenWithMarker = [];

  if (!data) return [];
  console.log('');
  console.log('');
  console.log('');
  console.log('');
  console.log('');
  console.log('');
  console.log('');
  console.log('');
  console.log('');
  console.log('');
  data.map((kneipe) => {
    let kneipeWithMarker;
    if (
      (kneipe.category === 'urkneipeplus' ||
        kneipe.category === 'worldurkneipeplus') &&
      kneipe.incentive
    ) {
      kneipeWithMarker = {
        ...kneipe,
        pin: require('../assets/urkneipeincentive.png'),
      };
      kneipenWithMarker = [...kneipenWithMarker, kneipeWithMarker];
      return;
    } else if (
      kneipe.category === 'urkneipeplus' ||
      kneipe.category === 'worldurkneipeplus'
    ) {
      kneipeWithMarker = {
        ...kneipe,
        pin: require('../assets/urkneipe.png'),
      };
      kneipenWithMarker = [...kneipenWithMarker, kneipeWithMarker];
      return;
    } else if (
      kneipe.category === 'worldurkneipe' ||
      kneipe.category === 'urkneipe'
    ) {
      kneipeWithMarker = {
        ...kneipe,
        pin: require('../assets/urkneipeplus.png'),
      };
      kneipenWithMarker = [...kneipenWithMarker, kneipeWithMarker];
      return;
    } else if (
      (kneipe.category === 'alternativplus' ||
        kneipe.category === 'worldalternativplus') &&
      kneipe.incentive
    ) {
      kneipeWithMarker = {
        ...kneipe,
        pin: require('../assets/alternativincentive.png'),
      };
      kneipenWithMarker = [...kneipenWithMarker, kneipeWithMarker];
      return;
    } else if (
      kneipe.category === 'alternativplus' ||
      kneipe.category === 'worldalternativplus'
    ) {
      kneipeWithMarker = {
        ...kneipe,
        pin: require('../assets/alternativ.png'),
      };
      kneipenWithMarker = [...kneipenWithMarker, kneipeWithMarker];
      return;
    } else if (
      kneipe.category === 'alternativ' ||
      kneipe.category === 'worldalternativ'
    ) {
      kneipeWithMarker = {
        ...kneipe,
        pin: require('../assets/alternativGelb.png'),
      };
      kneipenWithMarker = [...kneipenWithMarker, kneipeWithMarker];
      return;
    } else if (
      (kneipe.category === 'classyplus' ||
        kneipe.category === 'worldclassyplus') &&
      kneipe.incentive
    ) {
      kneipeWithMarker = {
        ...kneipe,
        pin: require('../assets/classyincentive.png'),
      };
      kneipenWithMarker = [...kneipenWithMarker, kneipeWithMarker];
      return;
    } else if (
      kneipe.category === 'classyplus' ||
      kneipe.category === 'worldclassyplus'
    ) {
      kneipeWithMarker = {
        ...kneipe,
        pin: require('../assets/classy_1.png'),
      };
      kneipenWithMarker = [...kneipenWithMarker, kneipeWithMarker];
      return;
    } else if (
      kneipe.category === 'classy' ||
      kneipe.category === 'worldclassy'
    ) {
      kneipeWithMarker = {
        ...kneipe,
        pin: require('../assets/classyGelb.png'),
      };
      kneipenWithMarker = [...kneipenWithMarker, kneipeWithMarker];
      return;
    } else if (
      (kneipe.category === 'dancingplus' ||
        kneipe.category === 'worlddancingplus') &&
      kneipe.incentive
    ) {
      kneipeWithMarker = {
        ...kneipe,
        pin: require('../assets/dancingincentive.png'),
      };
      kneipenWithMarker = [...kneipenWithMarker, kneipeWithMarker];
      return;
    } else if (
      kneipe.category === 'dancingplus' ||
      kneipe.category === 'worlddancingplus'
    ) {
      kneipeWithMarker = {
        ...kneipe,
        pin: require('../assets/dancing_1.png'),
      };
      kneipenWithMarker = [...kneipenWithMarker, kneipeWithMarker];
      return;
    } else if (
      kneipe.category === 'dancing' ||
      kneipe.category === 'worlddancing'
    ) {
      kneipeWithMarker = {
        ...kneipe,
        pin: require('../assets/dancingGelb.png'),
      };
      kneipenWithMarker = [...kneipenWithMarker, kneipeWithMarker];
      return;
    } else if (
      (kneipe.category === 'cozyplus' || kneipe.category === 'worldcozyplus') &&
      kneipe.incentive
    ) {
      kneipeWithMarker = {
        ...kneipe,
        pin: require('../assets/cozyincentive.png'),
      };
      kneipenWithMarker = [...kneipenWithMarker, kneipeWithMarker];
      return;
    } else if (
      kneipe.category === 'cozyplus' ||
      kneipe.category === 'worldcozyplus'
    ) {
      kneipeWithMarker = {
        ...kneipe,
        pin: require('../assets/cozy_1.png'),
      };
      kneipenWithMarker = [...kneipenWithMarker, kneipeWithMarker];
      return;
    } else if (kneipe.category === 'cozy' || kneipe.category === 'worldcozy') {
      kneipeWithMarker = {
        ...kneipe,
        pin: require('../assets/cozyGelb.png'),
      };
      kneipenWithMarker = [...kneipenWithMarker, kneipeWithMarker];
      return;
    } else if (
      (kneipe.category === 'irishplus' ||
        kneipe.category === 'worldirishplus') &&
      kneipe.incentive
    ) {
      kneipeWithMarker = {
        ...kneipe,
        pin: require('../assets/irishincentive.png'),
      };
      kneipenWithMarker = [...kneipenWithMarker, kneipeWithMarker];
      return;
    } else if (
      kneipe.category === 'irishplus' ||
      kneipe.category === 'worldirishplus'
    ) {
      kneipeWithMarker = {
        ...kneipe,
        pin: require('../assets/irish_1.png'),
      };
      kneipenWithMarker = [...kneipenWithMarker, kneipeWithMarker];
      return;
    } else if (
      kneipe.category === 'irish' ||
      kneipe.category === 'worldirish'
    ) {
      kneipeWithMarker = {
        ...kneipe,
        pin: require('../assets/irishGelb_1.png'),
      };
      kneipenWithMarker = [...kneipenWithMarker, kneipeWithMarker];
      return;
    } else if (
      (kneipe.category === 'gartenplus' ||
        kneipe.category === 'worldgartenplus') &&
      kneipe.incentive
    ) {
      kneipeWithMarker = {
        ...kneipe,
        pin: require('../assets/gartenincentive.png'),
      };
      kneipenWithMarker = [...kneipenWithMarker, kneipeWithMarker];
      return;
    } else if (
      kneipe.category === 'gartenplus' ||
      kneipe.category === 'worldgartenplus'
    ) {
      kneipeWithMarker = {
        ...kneipe,
        pin: require('../assets/garten_1.png'),
      };
      kneipenWithMarker = [...kneipenWithMarker, kneipeWithMarker];
      return;
    } else if (
      kneipe.category === 'garten' ||
      kneipe.category === 'worldgarten'
    ) {
      kneipeWithMarker = {
        ...kneipe,
        pin: require('../assets/gartenGelb_1.png'),
      };
      kneipenWithMarker = [...kneipenWithMarker, kneipeWithMarker];
      return;
    } else if (
      (kneipe.category === 'beachplus' ||
        kneipe.category === 'worldbeachplus') &&
      kneipe.incentive
    ) {
      kneipeWithMarker = {
        ...kneipe,
        pin: require('../assets/beachincentive.png'),
      };
      kneipenWithMarker = [...kneipenWithMarker, kneipeWithMarker];
      return;
    } else if (
      kneipe.category === 'beachplus' ||
      kneipe.category === 'worldbeachplus'
    ) {
      kneipeWithMarker = {
        ...kneipe,
        pin: require('../assets/beach_1.png'),
      };
      kneipenWithMarker = [...kneipenWithMarker, kneipeWithMarker];
      return;
    } else if (
      kneipe.category === 'beach' ||
      kneipe.category === 'worldbeach'
    ) {
      kneipeWithMarker = {
        ...kneipe,
        pin: require('../assets/beachGelb.png'),
      };
      kneipenWithMarker = [...kneipenWithMarker, kneipeWithMarker];
      return;
    } else if (kneipe.category === 'berlincitymarker') {
      kneipeWithMarker = {
        ...kneipe,
        pin: require('../assets/BerlinMarker.png'),
      };
      kneipenWithMarker = [...kneipenWithMarker, kneipeWithMarker];
      return;
    } else if (kneipe.category === "hh-bar") {
      kneipeWithMarker = {
        ...kneipe,
        pin: require('../assets/HHBrewery.png'),
      };
      kneipenWithMarker = [...kneipenWithMarker, kneipeWithMarker];
      return;
    } else if (kneipe.category === "hh-brewery") {
      kneipeWithMarker = {
        ...kneipe,
        pin: require('../assets/HHBar.png'),
      };
      kneipenWithMarker = [...kneipenWithMarker, kneipeWithMarker];
      return;
    } else if (kneipe.category === "hh-shop") {
      kneipeWithMarker = {
        ...kneipe,
        pin: require('../assets/HHShop.png'),
      };
      kneipenWithMarker = [...kneipenWithMarker, kneipeWithMarker];
      return;
    } else if (kneipe.category === "bierothek") {
      kneipeWithMarker = {
        ...kneipe,
        pin: require('../assets/Bierothek.png'),
      };
      kneipenWithMarker = [...kneipenWithMarker, kneipeWithMarker];
      return;
    } else if (kneipe.category === 'hamburgcitymarker') {
      kneipeWithMarker = {
        ...kneipe,
        pin: require('../assets/HamburgMarker.png'),
      };
      kneipenWithMarker = [...kneipenWithMarker, kneipeWithMarker];
      return;
    } else if (kneipe.category === 'muenchencitymarker') {
      kneipeWithMarker = {
        ...kneipe,
        pin: require('../assets/MuenchenMarker.png'),
      };
      kneipenWithMarker = [...kneipenWithMarker, kneipeWithMarker];
      return;
    } else if (kneipe.category === 'koelncitymarker') {
      kneipeWithMarker = {
        ...kneipe,
        pin: require('../assets/KoelnMarker.png'),
      };
      kneipenWithMarker = [...kneipenWithMarker, kneipeWithMarker];
      return;
    } else if (kneipe.category === 'frankfurtmaincitymarker') {
      kneipeWithMarker = {
        ...kneipe,
        pin: require('../assets/FrankfurtMainMarker.png'),
      };
      kneipenWithMarker = [...kneipenWithMarker, kneipeWithMarker];
      return;
    } else if (kneipe.category === 'leipzigcitymarker') {
      kneipeWithMarker = {
        ...kneipe,
        pin: require('../assets/LeipzigMarker.png'),
      };
      kneipenWithMarker = [...kneipenWithMarker, kneipeWithMarker];
      return;
    } else if (kneipe.category === 'heidelbergcitymarker') {
      kneipeWithMarker = {
        ...kneipe,
        pin: require('../assets/HeidelbergMarker.png'),
      };
      kneipenWithMarker = [...kneipenWithMarker, kneipeWithMarker];
      return;
    } else if (kneipe.category === 'muenstercitymarker') {
      kneipeWithMarker = {
        ...kneipe,
        pin: require('../assets/MuensterMarker.png'),
      };
      kneipenWithMarker = [...kneipenWithMarker, kneipeWithMarker];
      return;
    } else if (kneipe.category === 'dortmundcitymarker') {
      kneipeWithMarker = {
        ...kneipe,
        pin: require('../assets/DortmundMarker.png'),
      };
      kneipenWithMarker = [...kneipenWithMarker, kneipeWithMarker];
      return;
    } else if (kneipe.category === 'bonncitymarker') {
      kneipeWithMarker = {
        ...kneipe,
        pin: require('../assets/BonnMarker.png'),
      };
      kneipenWithMarker = [...kneipenWithMarker, kneipeWithMarker];
      return;
    } else if (kneipe.category === 'districtmarker') {
      kneipeWithMarker = {
        ...kneipe,
        pin: require('../assets/BerlinMarker.png'),
      };
      kneipenWithMarker = [...kneipenWithMarker, kneipeWithMarker];
      return;
    }
  });

  return kneipenWithMarker;
};
