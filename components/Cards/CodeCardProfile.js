import React, { useContext, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { darkblue, lightblue, whiteColor, yellow } from '../../styles/Colors';
import {
  Copied_Icon,
  Copy_Icon,
  Down_Back_Icon,
  ElementLink_Icon,
  Trash_Icon,
} from '../../content/Icons';
import Fonts from '../../content/Fonts';
import { useTranslation } from 'react-i18next';
import { normalizeFontSize } from '../../utilities/ResFontSize';
import MainContext from '../../context/MainContext';
import i18next from 'i18next';
import layout_styles from '../../styles/Layout_Styles';
import Clipboard from '@react-native-clipboard/clipboard';
import { showAlert } from 'react-native-customisable-alert';
import CustomAlert from '../CustomAlert';
import { Emoji } from '../../content/Emoji';
import { screenWidth } from '../../utilities/WidthAndHeight';
import firestore from '@react-native-firebase/firestore';

const CodeCardProfile = ({ code, name, link, checkInID }) => {
  const { mainState, setMainState, setToast } = useContext(MainContext);
  const [showSub, setShowSub] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedBeforeRedeming, setCopiedBeforeRedeming] = useState(false);
  const { t } = useTranslation();
  const styles = StyleSheet.create({
    pub_text: {
      color: whiteColor,
      fontFamily: Fonts.Bold,
      fontSize: normalizeFontSize(12), // before 14
    },
    city_text: {
      color: whiteColor,
      fontFamily: Fonts.Light,
      fontSize: normalizeFontSize(12), // before 14
    },
  });
  const deleteCode = async () => {
    const newCodes = mainState.user?.codes?.filter(
      (c) => c.checkInID !== checkInID,
    );
    const newCode = {
      code,
      link,
      name,
      checkInID,
      deactivated: true,
    };

    await firestore()
      .collection('users')
      .doc(mainState.userID)
      .update({
        codes: [...newCodes, newCode],
      });

    setMainState({
      ...mainState,
      user: {
        ...mainState.user,
        codes: [...newCodes, newCode],
      },
    });
    setToast({
      color: lightblue,
      text: t('deletedCode'),
    });
  };
  return (
    <>
      <TouchableOpacity
        onPress={() => setShowSub(!showSub)}
        style={{
          flexDirection: 'row',
          padding: 15,
          alignItems: 'center',
          width: 'auto',
          backgroundColor: showSub ? yellow : lightblue,
          borderRadius: 5,
          overflow: 'hidden',
          maxWidth: screenWidth * 0.8,
        }}>
        <>
          <View style={{ marginLeft: 0, maxWidth: '90%' }}>
            <Text
              style={[
                styles.pub_text,
                { color: showSub ? darkblue : whiteColor, marginRight: 20 },
              ]}
              numberOfLines={1}>
              {name[i18next.language]}
            </Text>
            <Text
              style={[
                styles.city_text,
                { color: showSub ? darkblue : whiteColor },
              ]}>
              {code}
            </Text>
          </View>
          <View style={{ width: 30 }} />
          <View style={showSub ? { transform: [{ rotate: '180deg' }] } : {}}>
            <Down_Back_Icon color={showSub ? darkblue : yellow} />
          </View>
        </>
      </TouchableOpacity>
      {showSub && (
        <View
          style={{
            backgroundColor: lightblue,
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
            paddingHorizontal: '20%',
          }}>
          <TouchableOpacity
            onPress={() => {
              Clipboard.setString(code);
              setToast({
                color: lightblue,
                text: t('copiedToClipboard'),
              });
              setCopied(true);
              setTimeout(() => {
                setCopied(false);
              }, 2000);
            }}>
            <View style={{ flexDirection: 'row', marginVertical: 20 }}>
              {copied ? (
                <Copied_Icon
                  styles={layout_styles.extra_extra_s_icon}
                  color={yellow}
                />
              ) : (
                <Copy_Icon
                  styles={layout_styles.extra_extra_s_icon}
                  color={yellow}
                />
              )}
              <View style={{ width: 10 }} />
              <Text style={layout_styles.font_styling_h4_Bold}>
                {t('copyCode')}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              const findPartnerID = mainState.partners?.find((c) => !!c.items?.length && c.items?.some((ci) => ci._id === checkInID))
              Clipboard.setString(code);
              setToast({
                color: lightblue,
                text: t('copiedToClipboard'),
              });
              setCopiedBeforeRedeming(true);
              setTimeout(() => {
                setCopiedBeforeRedeming(false)
                setMainState({
                  ...mainState,
                  showLink: link,
                  complete: {
                    ...mainState.complete,
                    partnerInteractions: [
                      ...mainState.complete.partnerInteractions,
                      {
                        partner_id: findPartnerID?.partnerID,
                        action: `linkClicked: ${checkInID}`,
                        item: true,
                      },
                    ],
                  },
                });
              }, 1000);
              /* setMainState({
                ...mainState,
                showLink: link,
              }) */
            }
            }>
            <View style={{ flexDirection: 'row', marginVertical: 20 }}>
              <ElementLink_Icon
                styles={layout_styles.extra_extra_s_icon}
                color={yellow}
              />
              <View style={{ width: 10 }} />
              <Text style={layout_styles.font_styling_h4_Bold}>
                {copiedBeforeRedeming ? t('copiedCode') : t('redeemCode')}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              showAlert({
                alertType: 'custom',
                customAlert: (
                  <CustomAlert
                    title={t('sure')}
                    sub={t('undone')}
                    icon={<Emoji emoji="fire" styles={layout_styles.l_icon} />}
                    click={deleteCode}
                    buttonWordingYes={t('delete')}
                  />
                ),
              })
            }>
            <View
              style={{
                flexDirection: 'row',
                marginVertical: 20,
              }}>
              <Trash_Icon
                styles={layout_styles.extra_extra_s_icon}
                color={yellow}
              />
              <View style={{ width: 10 }} />
              <Text style={layout_styles.font_styling_h4_Bold}>
                {t('delete')}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

export default CodeCardProfile;
