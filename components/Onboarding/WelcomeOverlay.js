import React, { useContext, useState } from 'react';
import { View, Text } from 'react-native';
import layout_styles from '../../styles/Layout_Styles';
import MainContext from '../../context/MainContext';
import PrimaryButton_Outline from '../Buttons/PrimaryButton_Outline';
import { Logo, Scan_QR_Icon } from '../../content/Icons';
import Fonts from '../../content/Fonts';
import { whiteColor, yellow } from '../../styles/Colors';
import { Beer_Icon } from '../../content/Icons';
import Loading from '../../utilities/Loading';
import { useTranslation } from 'react-i18next';

const WelcomeOverlay = ({ yesClicked, noClicked, qrCodeClicked }) => {
  const { mainState, setMainState } = useContext(MainContext);
  const [showLoading, setShowLoading] = useState(false);
  const { t } = useTranslation();
  return (
    <View style={[layout_styles.eol_single]}>
      <Logo />
      <Beer_Icon
        color={yellow}
        styles={layout_styles.m_icon}
        strokeWidth="0.5"
      />
      <View style={{ marginBottom: 16 }} />
      <View style={[{ minHeight: 24 * 3 + 36, justifyContent: 'center' }]}>
        <Text style={[layout_styles.eoltext, { marginBottom: 30 }]}>
          {t('intro')}
        </Text>
        <Text
          style={[
            layout_styles.eoltext,
            {
              marginBottom: 30,
              color: whiteColor,
              fontFamily: Fonts.Regular,
            },
          ]}>
          {t('tourAround')}
        </Text>
      </View>
      {!showLoading && (
        <View>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ width: '48%', marginRight: '2%' }}>
              <PrimaryButton_Outline
                text={t('skip')}
                buttonClicked={noClicked}
                setPadding={15}
              />
            </View>
            <View style={{ width: '48%', marginLeft: '2%' }}>
              <PrimaryButton_Outline
                text={t('introTitle')}
                buttonClicked={yesClicked}
                setPadding={15}
              />
            </View>
          </View>
          <PrimaryButton_Outline
            text={t('directlyScanQRCode')}
            buttonClicked={qrCodeClicked}
            setPadding={15}
            setMarginTop={30}
            showIcon={<Scan_QR_Icon styles={layout_styles.s_icon} color={whiteColor} />}
          />
        </View>
      )}
      {showLoading && (
        <View
          style={{
            width: '100%',
            alignItems: 'center',
          }}>
          <Loading styles={layout_styles.extra_large_icon} downNum={1} />
        </View>
      )}
    </View>
  );
};

export default WelcomeOverlay;
