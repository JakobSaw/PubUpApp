export default (url) => {
  const setURL = url.split('&#x2F;').join('/');
  return setURL;
};
