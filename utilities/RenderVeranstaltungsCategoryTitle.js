export default (category, english) => {
  if (category === 'dj') {
    return 'DJ Set';
  } else if (category === 'tasting') {
    return english ? 'Tasting' : 'Verkostung';
  } else if (category === 'film') {
    return english ? 'Screening' : 'Filmvorführung';
  } else if (category === 'art') {
    return english ? 'Art / Exibiton' : 'Kunst / Ausstellung';
  }
};
