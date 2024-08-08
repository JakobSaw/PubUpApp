export default (position) => {
  let PCLA = position.coords.latitude;
  let PCLO = position.coords.longitude;
  if (
    PCLA >= 52.3382448 &&
    PCLA <= 52.6755087 &&
    PCLO >= 13.088345 &&
    PCLO <= 13.7611609
  ) {
    return 'Berlin';
  } else if (
    PCLA >= 53.3951118 &&
    PCLA <= 54.02765 &&
    PCLO >= 8.1044993 &&
    PCLO <= 10.3252805
  ) {
    return 'Hamburg';
  } else if (
    PCLA >= 48.0616244 &&
    PCLA <= 48.2481162 &&
    PCLO >= 11.360777 &&
    PCLO <= 11.7229083
  ) {
    return 'München';
  } else if (
    PCLA >= 50.8304399 &&
    PCLA <= 51.0849743 &&
    PCLO >= 6.7725303 &&
    PCLO <= 7.162028
  ) {
    return 'Köln';
  } else if (
    PCLA >= 50.0155435 &&
    PCLA <= 50.2271408 &&
    PCLO >= 8.4727933 &&
    PCLO <= 8.8004716
  ) {
    return 'Frankfurt am Main';
  } else if (
    PCLA >= 51.2381704 &&
    PCLA <= 51.4481145 &&
    PCLO >= 12.2366519 &&
    PCLO <= 12.5424407
  ) {
    return 'Leipzig';
  } else if (
    PCLA >= 49.3520029 &&
    PCLA <= 49.4596927 &&
    PCLO >= 8.5731788 &&
    PCLO <= 8.7940496
  ) {
    return 'Heidelberg';
  } else if (
    PCLA >= 51.84049202998268 &&
    PCLA <= 52.05926266664419 &&
    PCLO >= 7.473154766269499 &&
    PCLO <= 7.7729830587993405
  ) {
    return 'Münster';
  } else if (
    PCLA >= 51.415663606736075 &&
    PCLA <= 51.59986149724134 &&
    PCLO >= 7.301345701597529 &&
    PCLO <= 7.63883196417968
  ) {
    return 'Dortmund';
  } else if (
    PCLA >= 50.63222527238865 &&
    PCLA <= 50.7737687078263 &&
    PCLO >= 7.022305847088149 &&
    PCLO <= 7.209602441963144
  ) {
    return 'Bonn';
  } else {
    return 'World';
  }
};
