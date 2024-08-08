import BaseUrl from '../content/BaseUrl';
import MakeRequest from './MakeRequest';
import {ACCESS_ALLPUBS} from '@env';
export default (prop) => {
  MakeRequest('POST', `${BaseUrl}/complete/push`, ACCESS_ALLPUBS, {
    allIDs: prop.allIDs,
    deu: prop.de,
    eng: prop.en,
    url: `push://${prop.url}`,
  });
};
