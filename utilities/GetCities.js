export default (kneipen = []) => {
  let citiesCollection = [];
  let cityCenters = [];
  kneipen.forEach((current) => {
    let rightCity;
    if (
      !current.category.includes('citymarker') &&
      current.category !== 'districtmarker'
    ) {
      if (current.city !== 'World') {
        rightCity = current.city;
      } else {
        rightCity = current.city2;
      }
      if (rightCity) {
        citiesCollection.push(rightCity);
      }
      const cityIsAlreadyInCityCenters = cityCenters.some(
        (el) => el.city === rightCity,
      );
      if (cityIsAlreadyInCityCenters) {
        const foundCityCenter = cityCenters.filter((currentFilter) => {
          if (currentFilter.city === rightCity) {
            return currentFilter;
          }
        });
        const cityCentersWithoutCurrent = cityCenters.filter(
          (currentFilter) => {
            if (currentFilter.city !== rightCity) {
              return currentFilter;
            }
          },
        );
        const updatedCiyCenter = {
          city: rightCity,
          latitude: foundCityCenter[0].latitude + current.latitude,
          longitude: foundCityCenter[0].longitude + current.longitude,
        };
        cityCenters = [...cityCentersWithoutCurrent, updatedCiyCenter];
      } else {
        cityCenters = [
          ...cityCenters,
          {
            city: rightCity,
            latitude: current.latitude,
            longitude: current.longitude,
          },
        ];
      }
    }
  });
  let counts = {};
  for (var i = 0; i < citiesCollection.length; i++) {
    counts[citiesCollection[i]] = 1 + (counts[citiesCollection[i]] || 0);
  }
  let allCities = [];
  cityCenters.forEach((current) => {
    const numberOfPubsInThatCity = counts[current.city];
    const averageLatitude = current.latitude / numberOfPubsInThatCity;
    const averageLongitude = current.longitude / numberOfPubsInThatCity;
    if (current.city) {
      allCities = [
        ...allCities,
        {
          city: current.city,
          name: current.city,
          pubCount: numberOfPubsInThatCity,
          latitude: averageLatitude,
          longitude: averageLongitude,
        },
      ];
    }
  });
  return allCities;
};
