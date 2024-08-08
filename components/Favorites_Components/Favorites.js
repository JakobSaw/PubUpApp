import React, { useContext } from 'react';
import { ScrollView, View } from 'react-native';
import MainContext from '../../context/MainContext';
import EmptyList from '../EmptyList';
import ListItemPub from '../ListItems/ListItemPub';
import { lightblue } from '../../styles/Colors';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import CountInteraction from '../../utilities/CountInteraction';
import FillUpComplete from '../../utilities/FillUpComplete';
import LayoutContainer from '../../utilities/LayoutContainer';

const Favorites = () => {
  const { mainState, setMainState, setToast } = useContext(MainContext);
  const { t } = useTranslation();
  const navigation = useNavigation();
  const removeFavorite = async (current) => {
    const getID = current.lokal_id || current._id;
    const newFavorites = mainState.user?.favorites.filter((c) => c !== getID);
    const newUser = {
      ...mainState.user,
      favorites: newFavorites,
    };
    await firestore().collection('users').doc(mainState.userID).update({
      favorites: newFavorites,
    });
    setMainState({
      ...mainState,
      user: newUser,
    });
    setToast({
      color: lightblue,
      text: t('favoritesPubRemoved'),
    });
  };
  return (
    <LayoutContainer
      title={t('myfavorites')}
      content={
        <ScrollView scrollEnabled={true} showsVerticalScrollIndicator={false}>
          <>
            {!mainState.user?.favorites.length && (
              <EmptyList
                title={t('emptyFavorites')}
                sub={t('emptyFavoritesMsg')}
                marginTop={60}
              />
            )}
            <View style={{ marginTop: 60 }} />
            {mainState.kneipen
              .filter(
                (c) =>
                  mainState.user?.favorites.indexOf(c.lokal_id) > -1 ||
                  mainState.user?.favorites.indexOf(c._id) > -1,
              )
              .map((current) => (
                <ListItemPub
                  key={current._id}
                  current={current}
                  buttonClicked={() => {
                    setMainState({
                      ...mainState,
                      regionToAnimate: {
                        latitude: current.latitude,
                        longitude: current.longitude,
                        latitudeDelta: 0.005,
                        longitudeDelta: 0.005,
                      },
                      complete: {
                        ...mainState.complete,
                        interactions: [
                          ...mainState.complete.interactions,
                          {
                            lokal_name: current.name,
                            lokal_id: current.lokal_id
                              || current._id,
                            action: 'clickOnIt',
                            ...FillUpComplete(),
                          },
                        ],
                      },
                      collectPubsToPushToDB: [
                        ...mainState.collectPubsToPushToDB,
                        current.lokal_id || current._id,
                      ],
                    });
                    CountInteraction();
                    navigation.push('Pub', {
                      ...current,
                    });
                  }}
                  withCross={true}
                  crossClicked={() => removeFavorite(current)}
                />
              ))}
          </>
        </ScrollView>
      }
    />
  );
};

export default Favorites;
