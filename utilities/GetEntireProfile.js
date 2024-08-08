import firestore from '@react-native-firebase/firestore';
export default async (ID, ignoreFriendsRequest) => {
  try {
    let getUser = await firestore().collection('users').doc(ID).get();
    getUser = getUser._data;
    if (!ignoreFriendsRequest) {
      let getFriendsRequests = await firestore()
        .collection('friends')
        .where('friend2', '==', ID)
        .where('accepted', '==', false)
        .get();
      if (!!getFriendsRequests.docs?.length) {
        const collectData = [];
        getFriendsRequests.docs.forEach((c) => collectData.push(c._data));
        getUser.openFriendsRequests = collectData;
      }
    }
    if (!!ignoreFriendsRequest) {
      delete getUser.favorites;
    }
    const collectFriends = [];
    let getFriendsOne = await firestore()
      .collection('friends')
      .where('friend1', '==', ID)
      .where('accepted', '==', true)
      .get();
    if (!!getFriendsOne.docs?.length) {
      getFriendsOne.docs.forEach((c) =>
        collectFriends.push({
          ...c._data,
          uid: c._ref._documentPath._parts[1],
        }),
      );
    }
    let getFriendsTwo = await firestore()
      .collection('friends')
      .where('friend2', '==', ID)
      .where('accepted', '==', true)
      .get();
    if (!!getFriendsTwo.docs?.length) {
      getFriendsTwo.docs.forEach((c) =>
        collectFriends.push({
          ...c._data,
          uid: c._ref._documentPath._parts[1],
        }),
      );
    }
    getUser.friends = collectFriends;
    return getUser;
  } catch (err) {
    console.log('err :>> ', err);
    // throw 'Error';
    return null;
  }
};
