import React, {useContext} from 'react';
import {View, ScrollView} from 'react-native';
import {useTranslation} from 'react-i18next';
import {screenHeight} from '../../utilities/WidthAndHeight';
import MainContext from '../../context/MainContext';
import PartnerCard from '../Cards/PartnerCard';
import LayoutContainer from '../../utilities/LayoutContainer';

const PartnerOverview = () => {
  const {t} = useTranslation();
  const {mainState} = useContext(MainContext);

  const sortAfterName = (a, b) => {
    if (a.name > b.name) {
      return 1;
    } else if (a.name < b.name) {
      return -1;
    } else {
      return 0;
    }
  };

  return (
    <LayoutContainer
      content={
        <ScrollView showsVerticalScrollIndicator={false}>
          {mainState.partners
            .sort(sortAfterName)
            .filter((c) => !c.hide)
            .map((current) => (
              <View key={current.partnerID}>
                <PartnerCard current={current} />
              </View>
            ))}
        </ScrollView>
      }
      title={t('partners')}
    />
  );
};

export default PartnerOverview;
