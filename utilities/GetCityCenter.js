export default (city) => {
  if (city === 'Berlin') {
    return {
      latitude: 52.519609,
      longitude: 13.406851,
    };
  } else if (city === 'Hamburg') {
    return {
      latitude: 53.54249090739157,
      longitude: 9.983255085560865,
    };
  } else if (city === 'München') {
    return {
      latitude: 48.138666062122184,
      longitude: 11.573655426068436,
    };
  } else if (city === 'Köln') {
    return {
      latitude: 50.938361,
      longitude: 6.959974,
    };
  } else if (city === 'Frankfurt am Main') {
    return {
      latitude: 50.1106444,
      longitude: 8.6820917,
    };
  } else if (city === 'Leipzig') {
    return {
      latitude: 51.3406321,
      longitude: 12.3747329,
    };
  } else if (city === 'Heidelberg') {
    return {
      latitude: 49.4093582,
      longitude: 8.694724,
    };
  } else if (city === 'Münster') {
    return {
      latitude: 51.961156159081106,
      longitude: 7.62749829555092,
    };
  } else if (city === 'Dortmund') {
    return {
      latitude: 51.51461297587608,
      longitude: 7.464951359834139,
    };
  } else if (city === 'Bonn') {
    return {
      latitude: 50.737324109539784,
      longitude: 7.099648893134833,
    };
  }
};
