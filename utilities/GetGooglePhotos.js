import axios from 'axios';
import { GOOGLE_PHOTOS, ACCESS_ALLPUBS } from '@env';
import BaseUrl from '../content/BaseUrl';
import MakeRequest from './MakeRequest';
import i18next from 'i18next';

export default (place_id, input, pub_id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let setPlaceID = place_id;
      if (!setPlaceID) {
        const resp = await axios.get(
          `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?fields=place_id&input=${input}&inputtype=textquery&key=${GOOGLE_PHOTOS}`,
        );
        const { data } = resp;
        if (
          !data ||
          !data.candidates ||
          !data.candidates[0] ||
          !data.candidates[0].place_id
        )
          return reject({ err: true, error: 'no candidates' });
        setPlaceID = data.candidates[0].place_id;
        await MakeRequest(
          'POST',
          `${BaseUrl}/complete/place_id`,
          ACCESS_ALLPUBS,
          {
            pub_id,
            place_id: data.candidates[0].place_id,
          },
        );
      }
      const respPhotos = await axios.get(
        `https://maps.googleapis.com/maps/api/place/details/json?fields=opening_hours%2Cphotos&place_id=${setPlaceID}&key=${GOOGLE_PHOTOS}&language=${i18next.language}`,
      );
      const { data: dataPhotos } = respPhotos;
      const collectIMGs = [];
      if (!!dataPhotos.result?.photos) {
        for (img of dataPhotos.result?.photos) {
          collectIMGs.push(
            `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1600&maxheight=1600&photo_reference=${img.photo_reference}&key=${GOOGLE_PHOTOS}`,
          );
        }
      }
      let opening_hours = '';
      if (!!dataPhotos.result?.opening_hours?.weekday_text) {
        dataPhotos.result.opening_hours.weekday_text?.forEach(
          (current, index) => {
            opening_hours += current;
            if (
              index + 1 <
              dataPhotos.result.opening_hours?.weekday_text?.length
            )
              opening_hours += '\n';
          },
        );
      }
      resolve({
        open:
          typeof dataPhotos.result.opening_hours?.open_now === 'boolean'
            ? dataPhotos.result.opening_hours?.open_now
            : undefined,
        opening_hours,
        photos: collectIMGs,
      });
    } catch (error) {
      reject({ err: true, error });
    }
  });
};
