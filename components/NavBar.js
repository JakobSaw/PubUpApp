import React, { useContext } from 'react';
import { View, TouchableHighlight, Text } from 'react-native';
import layout_styles from '../styles/Layout_Styles';
import { Beer_Icon, PubIn_Icon, Special_Icon } from '../content/Icons';
import { red, whiteColor, yellow } from '../styles/Colors';
import MainContext from '../context/MainContext';
import { useNavigation } from '@react-navigation/native';
import Fonts from '../content/Fonts';
import { normalizeFontSize } from '../utilities/ResFontSize';

const NavBar = () => {
  const { mainState } = useContext(MainContext);
  const navigation = useNavigation();

  return (
    <>
      <View style={layout_styles.navbar}>
        {/* Filters */}
        <TouchableHighlight onPress={() => {
          const routes = navigation.getState()?.routes;
          const prevRoute = routes[routes.length - 2]?.name
          if (prevRoute === 'Filters') return navigation.goBack()
          navigation.push('Filters')
        }}>
          <View style={layout_styles.navbarcontainer}>
            <Beer_Icon
              color={yellow}
              strokeWidth="0.5"
              styles={layout_styles.s_icon}
            />
          </View>
        </TouchableHighlight>
        {/* Profile */}
        <TouchableHighlight
          onPress={() => {
            if (!mainState.user) return navigation.push('Login');
            navigation.push('MyProfile');
          }}>
          <View style={[layout_styles.navbarcontainer, { position: 'relative' }]}>
            <PubIn_Icon styles={layout_styles.s_icon} />
            {!!mainState.user?.openFriendsRequests?.length && (
              <View
                style={{
                  backgroundColor: red,
                  borderRadius: 100,
                  width: 22,
                  height: 22,
                  position: 'absolute',
                  justifyContent: 'center',
                  alignItems: 'center',
                  transform: [{ translateY: -10 }, { translateX: 10 }],
                }}>
                <Text
                  style={{
                    color: whiteColor,
                    fontSize: normalizeFontSize(10), // before 12
                    lineHeight: normalizeFontSize(12), // before 14
                    fontFamily: Fonts.Bold,
                    textAlign: 'center',
                  }}>
                  {mainState.user?.openFriendsRequests?.length}
                </Text>
              </View>
            )}
          </View>
        </TouchableHighlight>
        {/* Partners */}
        {!!mainState.partners?.length &&
          mainState.partners?.some((c) => !c.hide) && (
            <TouchableHighlight
              onPress={() => navigation.push('PartnerOverview')}>
              <View style={layout_styles.navbarcontainer}>
                <Special_Icon styles={layout_styles.s_icon} />
              </View>
            </TouchableHighlight>
          )}
        {/* Incentive Filter */}
        {/* <TouchableHighlight
          onPress={() => {
          }}>
          <View style={layout_styles.navbarcontainer}>
            <Color_Incentive_Icon styles={layout_styles.s_icon} />
          </View>
        </TouchableHighlight> */}
      </View>
    </>
  );
};

export default NavBar;
