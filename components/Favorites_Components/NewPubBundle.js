import React, {useContext, useEffect, useState} from 'react';
import {View, Text, Platform} from 'react-native';
import {Category_Icon} from '../../content/Icons';
import MainContext from '../../context/MainContext';
import InputText from '../Inputs/InputText';
import InputTextArea from '../Inputs/InputTextArea';
import ListItemOptions from '../ListItems/ListItemOptions';
import PrimaryButton from '../Buttons/PrimaryButton';
import UploadPhotoWrapper from './UploadPhotoWrapper';
import GetID from '../../utilities/GetID';
import {useTranslation} from 'react-i18next';
import layout_styles from '../../styles/Layout_Styles';
import {lightblue} from '../../styles/Colors';
import {showAlert} from 'react-native-customisable-alert';
import CustomAlert from '../CustomAlert';
import {Emoji} from '../../content/Emoji';
import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import LayoutContainer from '../../utilities/LayoutContainer';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import SentPush from '../../utilities/SentPush';
import PushTexts from '../../content/PushTexts';
import MakeRequest from '../../utilities/MakeRequest';
import BaseUrl from '../../content/BaseUrl';
import {ACCESS_ALLPUBS} from '@env';

const NewPubBundle = ({route}) => {
  const {mainState, setMainState, setToast} = useContext(MainContext);
  const [showLoading, setShowLoading] = useState(false);
  const [displayURL, setDisplayURL] = useState(null);
  const {params} = route;
  const navigation = useNavigation();
  const [barBundleIsBeingCreated, setBarBundleIsBeingCreated] = useState(false);
  const {t} = useTranslation();
  const defaultBundle = {
    name: '',
    info: '',
    bb_id: null,
    public: false,
    pubs: [],
    pubCount: 0,
  };
  const [newBarBundle, setNewBarBundle] = useState(defaultBundle);
  const createNewBarBundle = async () => {
    try {
      setBarBundleIsBeingCreated(true);
      const createNewBarBundle = {...newBarBundle};
      if (!!params?.selectedPub) {
        createNewBarBundle.pubs.push(
          params?.selectedPub.lokal_id || params?.selectedPub._id,
        );
        createNewBarBundle.pubCount = 1;
      }
      createNewBarBundle.bb_id = await GetID();
      createNewBarBundle.imgURL = displayURL;
      createNewBarBundle.admin = mainState.userID;
      createNewBarBundle.name = createNewBarBundle.name.trim();
      createNewBarBundle.info = createNewBarBundle.info.trim();
      createNewBarBundle.city = mainState.activeCity;

      if (createNewBarBundle.public) {
        await firestore()
          .collection('publicPubBundles')
          .doc(createNewBarBundle.bb_id)
          .set(createNewBarBundle);
        const newPublicPubBundles = await firestore()
          .collection('publicPubBundles')
          .get();
        const collectData = [];
        newPublicPubBundles.docs.forEach((c) => {
          if (c._data.city === mainState.activeCity) {
            collectData.push(c._data);
          }
        });
        setMainState({
          ...mainState,
          publicPubBundles: collectData,
        });

        await MakeRequest('POST', `${BaseUrl}/complete/pbb`, ACCESS_ALLPUBS, {
          ...createNewBarBundle,
        });
      } else {
        const newUser = {
          ...mainState.user,
          bundles: [...mainState.user?.bundles, createNewBarBundle],
        };
        await firestore()
          .collection('users')
          .doc(mainState.userID)
          .update({
            bundles: [...mainState.user?.bundles, createNewBarBundle],
          });
        setMainState({
          ...mainState,
          user: newUser,
        });
      }
      setToast({
        color: lightblue,
        text: t('newPubBundleCreated'),
      });
      setDisplayURL(null);
      setNewBarBundle(defaultBundle);
      navigation.replace('PubBundle', {
        selectedPubBundle: createNewBarBundle,
      });
      if (!!mainState.user?.friends?.length) {
        const collectFriendsIDs = [];
        mainState.user?.friends?.forEach((c) =>
          collectFriendsIDs.push(
            c.friend1 === mainState.userID ? c.friend2 : c.friend1,
          ),
        );
        SentPush({
          allIDs: collectFriendsIDs,
          de: PushTexts('newBundle', 'de', mainState.user?.username),
          en: PushTexts('newBundle', 'en', mainState.user?.username),
          url: `barbundle/${createNewBarBundle.bb_id}`,
        });
      }
    } catch (err) {
      console.log('err :>> ', err);
      showAlert({
        alertType: 'custom',
        customAlert: (
          <CustomAlert
            title={t('errorBasic')}
            icon={<Emoji emoji="drunk" styles={layout_styles.l_icon} />}
          />
        ),
      });
    }
  };
  const resetBundle = () => {
    setDisplayURL(null);
    setNewBarBundle(defaultBundle);
    setBarBundleIsBeingCreated(false);
  };
  useEffect(() => {
    resetBundle();
  }, []);

  return (
    <LayoutContainer
      content={
        <>
          <KeyboardAwareScrollView
            enableOnAndroid={true}
            enableAutomaticScroll={Platform.OS === 'ios'}
            scrollEnabled={true}
            showsVerticalScrollIndicator={false}>
            <>
              <InputText
                title={t('newPubBundleName')}
                value={newBarBundle.name}
                onChange={(text) =>
                  setNewBarBundle({
                    ...newBarBundle,
                    name: text,
                  })
                }
                placeholder="Name"
              />
              <InputTextArea
                title={t('newPubBundleDesc')}
                value={newBarBundle.info}
                marginTop={30}
                onChange={(text) =>
                  setNewBarBundle({
                    ...newBarBundle,
                    info: text,
                  })
                }
                placeholder="Info (optional)"
              />
              <View style={{marginBottom: 30}} />
              <UploadPhotoWrapper
                showLoading={showLoading}
                displayURL={displayURL}
                showImage={!!displayURL}
                setShowLoading={setShowLoading}
                setDisplayURL={(link) => setDisplayURL(link)}
              />
              <ListItemOptions
                icon={<Category_Icon category="City" />}
                title={t('newPubBundlePublicTitle')}
                sub={t('newPubBundlePublicSub')}
                checked={newBarBundle.public}
                optionClicked={() =>
                  setNewBarBundle({
                    ...newBarBundle,
                    public: !newBarBundle.public,
                  })
                }
                styles={{marginTop: 20}}
              />
              {!!params?.selectedPub && (
                <>
                  <View style={{marginVertical: 20}} />
                  <Text style={layout_styles.font_styling_h3_Bold}>
                    {t('newPubBundlePub', {
                      name: params?.selectedPub.name,
                    })}
                  </Text>
                  <View style={{marginVertical: 20}} />
                </>
              )}
            </>
          </KeyboardAwareScrollView>
          <PrimaryButton
            disabled={
              newBarBundle.name === '' || showLoading || barBundleIsBeingCreated
            }
            text="Pub it Up!"
            buttonClicked={createNewBarBundle}
          />
        </>
      }
    />
  );
};

export default NewPubBundle;
