import { StyleSheet, Platform } from 'react-native';
import Fonts from '../content/Fonts';
import { darkblue, whiteColor, yellow } from './Colors';
import { normalizeFontSize } from '../utilities/ResFontSize';
import padding_vertical from '../styles/SetPaddingVertical';
import { screenHeight, screenWidth } from '../utilities/WidthAndHeight';

const padding_horizontal = 0.05;

const padding_elements = 17.5;

const extra_large_icon = 54;
const large_icon = 42;
const medium_icon = 36;
const small_icon = 30;
const extra_small_icon = 22.5;

const margin_small = 12.5;
const margin_middle = 17.5;
const margin_large = 20;
const margin_extra_large = 30;
const border_radius = 5;

const layout_styles = StyleSheet.create({
  modal: {
    ...StyleSheet.absoluteFill,
    backgroundColor: darkblue,
  },
  modal_container: {
    ...StyleSheet.absoluteFill,
    backgroundColor: darkblue,
  },
  container: {
    flex: 1,
    backgroundColor: darkblue,
  },
  navbar: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 70,
    backgroundColor: darkblue,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingLeft: margin_large,
    paddingRight: margin_large,
    zIndex: 2,
  },
  navbarcontainer: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '20%',
  },
  container_1: {
    borderRadius: border_radius,
    padding: margin_middle,
    marginBottom: margin_middle,
    backgroundColor: yellow,
  },
  social_media_container: {
    marginBottom: margin_middle * 2,
    marginTop: margin_middle,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  overlay_city_buttons: {
    backgroundColor: darkblue,
    height: 'auto',
    paddingBottom: margin_small,
    paddingTop: margin_small,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: margin_extra_large,
    borderRadius: border_radius,
    borderWidth: 1,
    borderColor: whiteColor,
  },
  pub_info: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    width: '43.5%',
    marginBottom: 10,
    marginLeft: '1.5%',
    marginRight: '1.5%',
  },
  pub_info_text: {
    fontFamily: Fonts.Bold,
    color: whiteColor,
    fontSize: 14,
    lineHeight: 14 * 1.15,
  },
  STNavbar: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  STNavbar_Button: {
    width: '25%',
    paddingTop: 10,
    paddingBottom: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  checkboxcontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: margin_small,
    marginTop: margin_small,
  },
  just_modal_container_paddings: {
    paddingTop: screenHeight * (padding_vertical / 2),
    paddingBottom: screenHeight * (padding_vertical / 2),
    paddingLeft: screenWidth * padding_horizontal,
    paddingRight: screenWidth * padding_horizontal,
  },
  just_modal_container_paddings_left_right: {
    paddingHorizontal: screenWidth * padding_horizontal,
  },
  just_modal_container_paddings_top: {
    paddingTop: screenHeight * (padding_vertical / 2),
  },
  just_modal_container_paddings_bottom: {
    paddingBottom: screenHeight * (padding_vertical / 2),
  },
  just_modal_container_paddings_vertical: {
    paddingTop: screenHeight * (padding_vertical / 2),
    paddingBottom: screenHeight * (padding_vertical / 2),
  },
  title_container: {
    flexDirection: 'row',
    // alignItems: 'flex-start',
    paddingTop: screenHeight * padding_vertical * 0.75,
    paddingLeft: screenWidth * padding_horizontal,
    paddingRight: screenWidth * padding_horizontal,
    alignItems: 'center',
    paddingBottom: padding_elements,
    minHeight: small_icon,
  },
  title_container_withoutPadding: {
    flexDirection: 'row',
    // alignItems: 'flex-start',
    paddingTop: screenHeight * padding_vertical * 0.75,
    // paddingLeft: screenWidth * padding_horizontal,
    paddingRight: screenWidth * padding_horizontal,
    alignItems: 'center',
    paddingBottom: padding_elements,
    minHeight: small_icon,
  },
  title_container_paddingBottom: {
    paddingBottom: 0,
  },
  back_container: {
    paddingTop: screenHeight * padding_vertical * 0.75,
    paddingLeft: screenWidth * padding_horizontal,
  },
  main_cross: {
    height: small_icon,
    width: small_icon,
  },
  normal_font: {
    color: whiteColor,
    fontFamily: Fonts.Bold,
    fontSize: normalizeFontSize(14), // before 16
    lineHeight: normalizeFontSize(16), // before 18
  },
  searchinputstyling: {
    borderColor: whiteColor,
    color: whiteColor,
    borderWidth: 1,
    fontFamily: Fonts.Bold,
    borderRadius: 5,
    paddingLeft: 15,
    paddingRight: 15,
  },
  content_container: {
    justifyContent: 'space-between',
    paddingLeft: screenWidth * padding_horizontal,
    paddingRight: screenWidth * padding_horizontal,
  },
  content_card_width: {
    width: screenWidth - screenWidth * padding_horizontal * 2,
  },
  content_container_bundle: {
    height:
      screenHeight -
      (screenHeight * (padding_vertical * 1) + 20 + (25 + padding_elements)) -
      screenHeight * 0.35,
  },
  content_container_bundle_full: {
    height:
      screenHeight -
      (screenHeight * (padding_vertical * 1) + 20 + (25 + padding_elements)) -
      30,
  },
  innercontent_title_container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  innercontent_title_innercontainer: {
    width: screenWidth - screenWidth * padding_horizontal * 2 - 30,
    // backgroundColor: 'purple',
  },
  innercontent_title: {
    fontFamily: 'GastroPub-Regular',
    fontSize: normalizeFontSize(22), // before 25
    lineHeight: normalizeFontSize(29), // before 35
    color: whiteColor,
    flexGrow: 1,
    textAlign: 'center',
    paddingLeft: 25,
  },
  innercontent_events_height_small: {
    height:
      screenHeight -
      (screenHeight * (padding_vertical * 2) + (25 + padding_elements)) -
      76,
  },
  innercontent_events_height_large: {
    height:
      screenHeight -
      (screenHeight * (padding_vertical * 2) + (25 + padding_elements)) -
      47,
  },
  innermodalmenu: {
    marginBottom: padding_elements * 2,
    marginTop: padding_elements * 1,
  },
  leer_container: {
    paddingLeft: padding_elements * 0.5,
    paddingRight: padding_elements * 0.5,
  },
  counterText: {
    color: whiteColor,
    fontFamily: Fonts.Bold,
    fontSize: normalizeFontSize(12), // before 14
    marginTop: padding_elements,
  },
  primaryButton_touchable: {
    marginTop: padding_elements,
    borderRadius: 5,
  },
  primaryButton_touchable_outline: {
    marginTop: padding_elements,
    borderRadius: 5,
    borderColor: whiteColor,
  },
  primaryButton_gradient: {
    paddingTop: padding_elements,
    paddingBottom: padding_elements,
    borderRadius: 5,
  },
  primaryButton_text: {
    fontFamily: Fonts.Bold,
    textAlign: 'center',
    fontSize: normalizeFontSize(18), // before 20
    color: darkblue,
  },
  primaryButton_text_outline: {
    fontFamily: Fonts.Light,
    textAlign: 'center',
    fontSize: normalizeFontSize(18), // before 20
    color: whiteColor,
  },
  extra_large_icon: {
    width: extra_large_icon,
    height: extra_large_icon,
  },
  l_icon: {
    width: large_icon,
    height: large_icon,
  },
  m_icon: {
    width: medium_icon,
    height: medium_icon,
  },
  s_icon: {
    width: small_icon,
    height: small_icon,
  },
  extra_s_icon: {
    width: extra_small_icon,
    height: extra_small_icon,
  },
  extra_extra_s_icon: {
    width: extra_small_icon / 1.5,
    height: extra_small_icon / 1.5,
  },
  meeting_pins: {
    width: medium_icon,
    height: medium_icon * 1.467112234085908,
  },
  padding_elements_top: {
    paddingTop: padding_elements,
  },
  padding_elements_bottom: {
    paddingBottom: padding_elements,
  },
  padding_elements_left: {
    paddingLeft: padding_elements,
  },
  padding_elements_right: {
    paddingRight: padding_elements,
  },
  margin_elements_top: {
    marginTop: padding_elements,
  },
  margin_elements_bottom: {
    marginBottom: padding_elements,
  },
  margin_elements_left: {
    marginLeft: padding_elements,
  },
  margin_elements_right: {
    marginRight: padding_elements,
  },
  absolute_padding_left: {
    left: screenWidth * (padding_horizontal / 1.2),
  },
  absolute_padding_left_radiusOverlay: {
    left: screenWidth * (padding_horizontal / 1.2) + 50,
  },
  absolute_padding_right: {
    right: screenWidth * (padding_horizontal / 1.2),
  },
  absolute_padding_top: {
    top: screenHeight * (padding_vertical / 1.2),
  },
  absolute_padding_bottom: {
    bottom: screenHeight * (padding_vertical / 1.2),
  },
  absolute_padding_top_lupe: {
    top: screenHeight * (padding_vertical / 1.2) + 54,
  },
  absolute_padding_top_lupe_2: {
    top: screenHeight * (padding_vertical / 1.2) + 108,
  },
  absolute_padding_top_lupe_3: {
    top: screenHeight * (padding_vertical / 1.2) + 162,
  },
  absolute_padding_top_lupe_overlaypfeil: {
    top: screenHeight * (padding_vertical / 1.2) + 41,
  },
  absolute_padding_top_lupe_2_overlaypfeil: {
    top: screenHeight * (padding_vertical / 1.2) + 95,
  },
  absolute_padding_top_lupe_3_overlaypfeil: {
    top: screenHeight * (padding_vertical / 1.2) + 149,
  },
  absolute_padding_top_eng: {
    top: screenHeight * (padding_vertical / 1.2) + 80,
  },
  absolute_padding_bottom_locationicon: {
    bottom: screenHeight * (padding_vertical / 1.2) + 72,
  },
  absolute_padding_bottom_cityicon: {
    bottom: screenHeight * (padding_vertical / 1.2) + 126,
  },
  absolute_padding_bottom_radiusicon: {
    bottom: screenHeight * (padding_vertical / 1.2) + 180,
  },
  eol: {
    backgroundColor: 'rgba(23,30,52,0.95)',
    ...StyleSheet.absoluteFill,
    position: 'absolute',
    zIndex: 51,
    justifyContent: 'center',
  },
  eol_single: {
    backgroundColor: 'rgba(23,30,52,0.95)',
    ...StyleSheet.absoluteFill,
    position: 'absolute',
    zIndex: 51,
    justifyContent: 'center',
    paddingTop: screenHeight * padding_vertical,
    paddingBottom: screenHeight * padding_vertical,
    paddingLeft: screenWidth * padding_horizontal,
    paddingRight: screenWidth * padding_horizontal,
  },
  eol_intro: {
    fontFamily: Fonts.Bold,
    fontSize: normalizeFontSize(14), // before 16
    color: whiteColor,
    marginBottom: 16,
  },
  eoltext: {
    color: whiteColor,
    fontFamily: Fonts.Bold,
    fontSize: normalizeFontSize(16), // before 20
    lineHeight: normalizeFontSize(20), // before 24
  },
  eol_button: {
    padding: padding_elements,
    borderRadius: 5,
    borderColor: darkblue,
    borderWidth: 1,
    alignItems: 'center',
  },
  eol_button_text: {
    color: whiteColor,
    fontFamily: Fonts.Bold,
    fontSize: normalizeFontSize(14), // before 16
  },
  paddingTopBottomTextInputsiOS: {
    paddingTop: Platform.OS === 'ios' ? 15 : 7.5,
    paddingBottom: Platform.OS === 'ios' ? 15 : 7.5,
  },
  setMinHeight_Small_Icon: {
    minHeight: small_icon + 7.5,
  },
  paddingTopBottomTextInputsiOS: {
    paddingTop: Platform.OS === 'ios' ? 15 : 7.5,
    paddingBottom: Platform.OS === 'ios' ? 15 : 7.5,
  },
  font_styling_h1: {
    fontSize: normalizeFontSize(20), // before 22
    color: whiteColor,
    fontFamily: Fonts.Bold,
  },
  font_styling_h2: {
    fontSize: normalizeFontSize(16), // before 18
    color: whiteColor,
    fontFamily: Fonts.Bold,
  },
  font_styling_h3: {
    fontSize: normalizeFontSize(14), // before 16
    color: whiteColor,
    fontFamily: Fonts.Regular,
  },
  font_styling_h3_Bold: {
    fontSize: normalizeFontSize(14), // before 16
    color: whiteColor,
    fontFamily: Fonts.Bold,
  },
  font_styling_h4: {
    fontSize: normalizeFontSize(12), // before 14
    color: whiteColor,
    fontFamily: Fonts.Light,
  },
  font_styling_h4_dark: {
    fontSize: normalizeFontSize(12), // before 14
    color: darkblue,
    fontFamily: Fonts.Light,
  },
  font_styling_h4_Bold: {
    fontSize: normalizeFontSize(12), // before 14
    color: whiteColor,
    fontFamily: Fonts.Bold,
  },
});

export default layout_styles;
