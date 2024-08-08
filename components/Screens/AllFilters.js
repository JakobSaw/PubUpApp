import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { View, ScrollView, TouchableHighlight, Text } from 'react-native';
import {
  Beer_Icon,
  HipYuc_Icon,
  Cozy_Icon,
  Classy_Icon,
  Dancing_Icon,
  IrishPub_Icon,
  BeerGarden_Icon,
  Roof_Icon,
  Cocktail_Icon,
  NonSmoking,
  SeparateSmoking,
  Smoking,
  Wine_Icon,
  CraftBeer_Icon,
  Billard_Icon,
  Darts_Icon,
  Kicker_Icon,
  Outdoor_Icon,
  Streaming_Icon,
  Plus_Icon,
  LiveMusic_Icon,
  Wifi_Icon,
  Payment_Icon,
  Incentive_Icon_Full,
  Rent_Icon,
  Special_Icon,
} from '../../content/Icons';
import layout_styles from '../../styles/Layout_Styles';
import MainContext from '../../context/MainContext';
import ListItemFilter from '../ListItems/ListItemFilter';
import FilterCounterText from '../FilterCounterText';
import { lightblue, yellow } from '../../styles/Colors';
import ChangeRadius from '../Buttons/ChangeRadius';
import ModalOverlay from '../Onboarding/ModalOverlay';
import GetValueLocally from '../../utilities/GetValueLocally';
import StoreValueLocally from '../../utilities/StoreValueLocally';
import { useTranslation } from 'react-i18next';
import LayoutContainer from '../../utilities/LayoutContainer';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AllFilters = () => {
  const { mainState, setMainState } = useContext(MainContext);
  const [filterNav, setFilterNav] = useState('Categories');
  const [filterRetrigger, setFilterRetrigger] = useState(0);
  const btnWasClicked = useRef(false);

  const { t } = useTranslation();

  const checkLastNav = async () => {
    const lastNav = await GetValueLocally('@lastNav');
    if (!!lastNav) {
      if (lastNav === 'Breweries' && !mainState.partners?.length)
        return setFilterNav('Filters');
      setFilterNav(lastNav);
    }
  };
  useEffect(() => {
    checkLastNav();
  }, []);
  useEffect(() => {
    StoreValueLocally('@lastNav', filterNav);
  }, [filterNav]);

  const filtersOpen = async () => {
    await AsyncStorage.removeItem('@filtersOnModalOpen');
    StoreValueLocally('@filtersOnModalOpen', mainState.filters);
    setFilterRetrigger(Math.random())
  };
  const checkFilters = async () => {
    if (!btnWasClicked.current) {
      const filtersOnModalOpen = await GetValueLocally('@filtersOnModalOpen');
      setMainState({
        ...mainState,
        filters: filtersOnModalOpen,
        filtersOn: true
      });
    } else {
      btnWasClicked.current = false;
    }
    AsyncStorage.removeItem('@filtersOnModalOpen');
  };

  useFocusEffect(
    useCallback(() => {
      console.log('filtersOpen');
      filtersOpen();
      return () => {
        console.log('checkFilters');
        checkFilters();
      }
    }, []),
  );

  const RenderCategories = () => {
    return (
      <>
        <ListItemFilter
          title={t('category_pub')}
          icon={
            <Beer_Icon
              color={yellow}
              styles={layout_styles.m_icon}
              strokeWidth="0.5"
            />
          }
          checked={mainState.filters.category.indexOf('urkneipe') > -1}
          setCategoryFilter={[
            'urkneipe',
            'urkneipeplus',
            'worldurkneipe',
            'worldurkneipeplus',
          ]}
        />
        <ListItemFilter
          title={t('category_yuc')}
          icon={<HipYuc_Icon styles={layout_styles.m_icon} />}
          checked={mainState.filters.category.indexOf('alternativ') > -1}
          setCategoryFilter={[
            'alternativ',
            'alternativplus',
            'worldalternativ',
            'worldalternativplus',
          ]}
          sternchen="Youth Urban Culture"
        />
        <ListItemFilter
          title={t('category_cozy')}
          icon={<Cozy_Icon styles={layout_styles.m_icon} />}
          checked={mainState.filters.category.indexOf('cozy') > -1}
          setCategoryFilter={['cozy', 'cozyplus', 'worldcozy', 'worldcozyplus']}
        />
        <ListItemFilter
          title={t('category_classy')}
          icon={<Classy_Icon styles={layout_styles.m_icon} />}
          checked={mainState.filters.category.indexOf('classy') > -1}
          setCategoryFilter={[
            'classy',
            'classyplus',
            'worldclassy',
            'worldclassyplus',
          ]}
        />
        <ListItemFilter
          title={t('category_dancing')}
          icon={<Dancing_Icon styles={layout_styles.m_icon} />}
          checked={mainState.filters.category.indexOf('dancing') > -1}
          setCategoryFilter={[
            'dancing',
            'dancingplus',
            'worlddancing',
            'worlddancingplus',
          ]}
        />
        <ListItemFilter
          title={t('category_irish_pub')}
          icon={<IrishPub_Icon styles={layout_styles.m_icon} />}
          checked={mainState.filters.category.indexOf('irish') > -1}
          setCategoryFilter={[
            'irish',
            'irishplus',
            'worldirish',
            'worldirishplus',
          ]}
        />
        <ListItemFilter
          title={t('category_garden')}
          icon={<BeerGarden_Icon styles={layout_styles.m_icon} />}
          checked={mainState.filters.category.indexOf('garten') > -1}
          setCategoryFilter={[
            'garten',
            'gartenplus',
            'worldgarten',
            'worldgartenplus',
          ]}
        />
        <ListItemFilter
          title={t('category_beach_roof')}
          icon={<Roof_Icon styles={layout_styles.m_icon} />}
          checked={mainState.filters.category.indexOf('beach') > -1}
          setCategoryFilter={[
            'beach',
            'beachplus',
            'worldbeach',
            'worldbeachplus',
          ]}
        />
      </>
    );
  };
  const RenderFilters = () => {
    return (
      <>
        {/* Incentive */}
        {mainState.kneipen.some((c) => c.incentive) && (
          <ListItemFilter
            title={t('incentive')}
            icon={<Incentive_Icon_Full styles={layout_styles.m_icon} />}
            checked={mainState.filters.incentive}
            setFilter="incentive"
          />
        )}
        {/* PubUp Plus */}
        {mainState.activeCity !== 'World' &&
          mainState.kneipen.some(
            (c) => c.plus && c.city === mainState.activeCity,
          ) && (
            <ListItemFilter
              title={'PubUp Plus'}
              icon={<Plus_Icon styles={layout_styles.m_icon} color={yellow} />}
              checked={mainState.filters.plus}
              setFilter="plus"
            />
          )}
        {/* Cocktails */}
        <ListItemFilter
          title={t('filters_cocktails')}
          icon={<Cocktail_Icon styles={layout_styles.m_icon} />}
          checked={mainState.filters.cocktails}
          setFilter="cocktails"
        />
        {/* Wine */}
        <ListItemFilter
          title={t('filters_wine')}
          icon={<Wine_Icon styles={layout_styles.m_icon} />}
          checked={mainState.filters.wine}
          setFilter="wine"
        />
        {/* Craft Beer */}
        <ListItemFilter
          title={t('filters_craft', { break: '\n' })}
          icon={<CraftBeer_Icon styles={layout_styles.m_icon} />}
          checked={mainState.filters.craft}
          setFilter="craft"
        />
        {/* Billard */}
        <ListItemFilter
          title={t('filters_billard')}
          icon={<Billard_Icon styles={layout_styles.m_icon} />}
          checked={mainState.filters.billards}
          setFilter="billards"
        />
        {/* Darts */}
        <ListItemFilter
          title={t('filters_darts')}
          icon={<Darts_Icon styles={layout_styles.m_icon} color={yellow} />}
          checked={mainState.filters.darts}
          setFilter="darts"
        />
        {/* Kicker */}
        <ListItemFilter
          title={t('filters_kicker')}
          icon={<Kicker_Icon styles={layout_styles.m_icon} />}
          checked={mainState.filters.kicker}
          setFilter="kicker"
        />
        {/* Not Smoking */}
        <ListItemFilter
          title={t('filters_notsmoking')}
          icon={<NonSmoking styles={layout_styles.m_icon} />}
          checked={mainState.filters.smoking === 'not'}
          setFilter="smoking"
          smokingFilter="not"
        />
        {/* Separate Smoking */}
        <ListItemFilter
          title={t('filters_separatesmoking')}
          icon={<SeparateSmoking styles={layout_styles.m_icon} />}
          checked={mainState.filters.smoking === 'separate'}
          setFilter="smoking"
          smokingFilter="separate"
        />
        {/* Smoking */}
        <ListItemFilter
          title={t('filters_smoking')}
          icon={<Smoking styles={layout_styles.m_icon} />}
          checked={mainState.filters.smoking === 'yes'}
          setFilter="smoking"
          smokingFilter="yes"
        />
        {/* Cash */}
        <ListItemFilter
          title={t('card_payment')}
          icon={<Payment_Icon styles={layout_styles.m_icon} />}
          checked={mainState.filters.payment === 'card'}
          setFilter="payment"
          smokingFilter="card"
        />
        {/* Outdoor */}
        <ListItemFilter
          title={t('filters_outdoor')}
          icon={<Outdoor_Icon styles={layout_styles.m_icon} />}
          checked={mainState.filters.outdoor}
          setFilter="outdoor"
        />
        {/* Streaming */}
        <ListItemFilter
          title={t('filters_live_sports')}
          icon={<Streaming_Icon styles={layout_styles.m_icon} />}
          checked={mainState.filters.streaming}
          setFilter="streaming"
        />
        {/* Live Music */}
        <ListItemFilter
          title={t('filters_music')}
          icon={<LiveMusic_Icon styles={layout_styles.m_icon} />}
          checked={mainState.filters.music}
          setFilter="music"
        />
        {/* Wifi */}
        <ListItemFilter
          title={t('filters_wifi')}
          icon={<Wifi_Icon styles={layout_styles.m_icon} />}
          checked={mainState.filters.wlan}
          setFilter="wlan"
        />
        {/* Rent */}
        <ListItemFilter
          title={t('filters_rent')}
          icon={<Rent_Icon styles={layout_styles.m_icon} />}
          checked={mainState.filters.rent}
          setFilter="rent"
        />
      </>
    );
  };
  const RenderPartners = () => {
    return (
      <>
        {mainState.partners
          .filter((c) =>
            mainState.kneipen.some(
              (cs) => cs.breweries?.indexOf(c.partnerID) > -1,
            ),
          )
          .map((current) => {
            return (
              <View key={current.partnerID}>
                <ListItemFilter
                  title={current.name}
                  imgURL={current.profileIMG}
                  checked={
                    mainState.filters.breweries.indexOf(current.partnerID) > -1
                  }
                  setBreweryFilter={current.partnerID}
                  clickOnPartnerFromFilters={current.partnerID}
                />
              </View>
            );
          })}
      </>
    );
  };

  return (
    <LayoutContainer
      content={
        <>
          <ScrollView scrollEnabled={true} showsVerticalScrollIndicator={false}>
            {filterNav === 'Categories' && <RenderCategories />}
            {filterNav === 'Filters' && <RenderFilters />}
            {filterNav === 'Breweries' && <RenderPartners />}
          </ScrollView>
          {mainState.activeCity === 'World' && <ChangeRadius />}
          <View style={{ flexDirection: 'row', paddingTop: 17.5 }}>
            <TouchableHighlight
              onPress={() => {
                setFilterNav('Categories');
              }}
              style={
                !!mainState.partners?.length
                  ? {
                    width: '33.33333333333%',
                  }
                  : { width: '50%' }
              }>
              <View
                style={[
                  {
                    // flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingVertical: 10,
                    borderRadius: 5,
                  },
                  filterNav === 'Categories'
                    ? { backgroundColor: lightblue }
                    : {},
                ]}>
                <Beer_Icon
                  color={yellow}
                  styles={layout_styles.s_icon}
                  strokeWidth="0.5"
                />
                <Text
                  style={[
                    layout_styles.counterText,
                    { marginTop: 5, marginLeft: 0 },
                  ]}>
                  {t('categories')}
                </Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight
              onPress={() => {
                setFilterNav('Filters');
              }}
              style={
                !!mainState.partners?.length
                  ? {
                    width: '33.33333333333%',
                  }
                  : { width: '50%' }
              }>
              <View
                style={[
                  {
                    // flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingVertical: 10,
                    borderRadius: 5,
                  },
                  filterNav === 'Filters' ? { backgroundColor: lightblue } : {},
                ]}>
                <Darts_Icon styles={layout_styles.s_icon} color={yellow} />
                <Text
                  style={[
                    layout_styles.counterText,
                    { marginTop: 5, marginLeft: 0 },
                  ]}>
                  {t('filters')}
                </Text>
              </View>
            </TouchableHighlight>
            {!!mainState.partners?.length && (
              <TouchableHighlight
                onPress={() => {
                  setFilterNav('Breweries');
                }}
                style={{ width: '33.33333333333%' }}>
                <View
                  style={[
                    {
                      // flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      paddingVertical: 10,
                      borderRadius: 5,
                    },
                    filterNav === 'Breweries'
                      ? { backgroundColor: lightblue }
                      : {},
                  ]}>
                  {/* <Brewery_Icon styles={layout_styles.s_icon} /> */}
                  <Special_Icon styles={layout_styles.s_icon} />
                  <Text
                    style={[
                      layout_styles.counterText,
                      { marginTop: 5, marginLeft: 0 },
                    ]}>
                    {t('buddies')}
                  </Text>
                </View>
              </TouchableHighlight>
            )}
          </View>
          <FilterCounterText
            filterNav={filterNav}
            filterRetrigger={filterRetrigger}
            clicked={() => {
              btnWasClicked.current = true;
            }}
          />
        </>
      }
      overlay={
        <ModalOverlay
          str="@FirstOpen_Categories"
          downSteps={[
            {
              eng: 'Find exactly the location you are looking for with our three filters.',
              deu: 'Finde mit unseren drei Filtern genau die Location, die du gerade suchst.',
            },
          ]}
        />
      }
    />
  );
};

export default AllFilters;
