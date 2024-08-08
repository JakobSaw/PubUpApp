import axios from 'axios';
import BaseUrl from '../content/BaseUrl';

export default (type, link, access, body) => {
  return new Promise((resolve, reject) => {
    console.log('');
    console.log('');
    console.log('');
    console.log('makeRequest :>> ', type, link);
    console.log('');
    console.log('');
    console.log('');
    if (type === 'GET') {
      axios
        .get(link, {
          headers: {
            authorization: `Bearer ${access}`,
          },
        })
        .then((response) => {
          resolve(response.data);
        })
        .catch((err) => {
          reject(new Error(err));
        });
    } else {
      axios
        .post(link, body, {
          headers: {
            authorization: `Bearer ${access}`,
          },
        })
        .then((response) => {
          resolve(response.data);
        })
        .catch((err) => {
          reject(new Error(err));
        });
    }
  });
};
