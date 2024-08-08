import firestore from '@react-native-firebase/firestore';

export const removePubFromPubBundle = async (
  current,
  { mainState, params },
  callback,
) => {
  const getID = current.lokal_id || current._id;
  const newPubBundle = {
    ...params?.selectedPubBundle,
    pubs: [...params?.selectedPubBundle.pubs.filter((c) => c !== getID)],
    pubCount: params?.selectedPubBundle.pubCount - 1,
  };
  delete newPubBundle.pubsWithFullInfo;
  if (newPubBundle.public) {
    await firestore()
      .collection('publicPubBundles')
      .doc(newPubBundle.bb_id)
      .set(newPubBundle);
    const newPublicPubBundles = await firestore()
      .collection('publicPubBundles')
      .get();
    const collectData = [];
    const collectAllData = [];
    newPublicPubBundles.docs.forEach((c) => {
      if (c._data.city === mainState.activeCity) {
        collectData.push(c._data);
      }
      collectAllData.push(c._data);
    });
    callback(
      {
        ...mainState,
        publicPubBundles: collectData,
        allPublicPubBundles: collectAllData,
      },
      newPubBundle,
    );
  } else {
    const newUser = {
      ...mainState.user,
      bundles: [
        ...mainState.user?.bundles.filter(
          (c) => c.bb_id !== params?.selectedPubBundle.bb_id,
        ),
        newPubBundle,
      ],
    };
    await firestore()
      .collection('users')
      .doc(mainState.userID)
      .update({
        bundles: [
          ...mainState.user?.bundles.filter(
            (c) => c.bb_id !== params?.selectedPubBundle.bb_id,
          ),
          newPubBundle,
        ],
      });
    callback(
      {
        ...mainState,
        user: newUser,
      },
      newPubBundle,
    );
  }
};
export const addPubToPubBundle = async (
  current,
  { mainState, params },
  callback,
) => {
  const getID = current.lokal_id || current._id;
  const newPubBundle = {
    ...params?.selectedPubBundle,
    pubs: !!params?.selectedPubBundle.pubs.length
      ? [...params?.selectedPubBundle.pubs, getID]
      : [getID],
    pubCount: params?.selectedPubBundle.pubCount + 1,
  };
  delete newPubBundle.pubsWithFullInfo;
  if (newPubBundle.public) {
    await firestore()
      .collection('publicPubBundles')
      .doc(newPubBundle.bb_id)
      .set(newPubBundle);
    const newPublicPubBundles = await firestore()
      .collection('publicPubBundles')
      .get();
    const collectData = [];
    const collectAllData = [];
    newPublicPubBundles.docs.forEach((c) => {
      if (c._data.city === mainState.activeCity) {
        collectData.push(c._data);
      }
      collectAllData.push(c._data);
    });
    callback(
      {
        ...mainState,
        publicPubBundles: collectData,
        allPublicPubBundles: collectAllData,
        complete: {
          ...mainState.complete,
          bbInteractions: [
            ...mainState.complete.bbInteractions,
            {
              bb_id: current,
              action: `addToBundle`,
            },
          ],
        },
      },
      newPubBundle,
    );
  } else {
    const newUser = {
      ...mainState.user,
      bundles: [
        ...mainState.user?.bundles.filter(
          (c) => c.bb_id !== params?.selectedPubBundle.bb_id,
        ),
        newPubBundle,
      ],
    };
    await firestore()
      .collection('users')
      .doc(mainState.userID)
      .update({
        bundles: [
          ...mainState.user?.bundles.filter(
            (c) => c.bb_id !== params?.selectedPubBundle.bb_id,
          ),
          newPubBundle,
        ],
      });
    callback(
      {
        ...mainState,
        user: newUser,
        complete: {
          ...mainState.complete,
          bbInteractions: [
            ...mainState.complete.bbInteractions,
            {
              bb_id: current,
              action: `addToBundle`,
            },
          ],
        },
      },
      newPubBundle,
    );
  }
};
