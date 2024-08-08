import axios from 'axios';

export default async () => {
  return new Promise((resolve, reject) => {
    axios
      .get('https://www.uuidgenerator.net/api/version4')
      .then((responseUUID) => {
        resolve(responseUUID.data);
      })
      .catch((error) => {
        // Create on the Spot?
        reject(new Error('Failed to generate ID'));
      });
  });
};
