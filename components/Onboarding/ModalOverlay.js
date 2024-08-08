import React, {useContext, useState, useEffect} from 'react';
import {View, Text} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PrimaryButton_Outline from '../Buttons/PrimaryButton_Outline';
import {
  Navigation_Icon,
  Plus_Icon,
  Special_Icon,
  Tick_Icon,
  Time_Icon,
} from '../../content/Icons';
import layout_styles from '../../styles/Layout_Styles';
import {green, yellow} from '../../styles/Colors';
import {useTranslation} from 'react-i18next';
import i18next from 'i18next';
import {normalizeFontSize} from '../../utilities/ResFontSize';

const ModalOverlay = ({
  str,
  downSteps,
  stepUp,
  ignoreSkip,
  shareLink,
  offerSkip,
  test,
  goOnAfterClick,
}) => {
  const [show_overlay, setShow_Overlay] = useState(false);
  const [counter, setCounter] = useState(0);
  const {t} = useTranslation();

  const storeBoolean = async (token, value) => {
    try {
      const stringValue = JSON.stringify(value);
      await AsyncStorage.setItem(token, stringValue);
    } catch (e) {
      // saving error
    }
  };
  const goOn = () => {
    if (counter === downSteps.length - 1) {
      setShow_Overlay(false);
      storeBoolean(str, 'done');
      if (stepUp) {
        stepUp('done');
      }
    } else {
      setCounter(counter + 1);
      if (stepUp) {
        stepUp(counter + 1);
      }
    }
  };

  useEffect(() => {
    if (!!test) {
      setShow_Overlay(true);
    } else {
      AsyncStorage.getItem(str).then((response) => {
        AsyncStorage.getItem('@skipOverlay').then((responseskipOverlay) => {
          if (
            response === null &&
            (responseskipOverlay === null || ignoreSkip)
          ) {
            setShow_Overlay(true);
          }
        });
      });
    }
  }, []);

  if (!show_overlay || !downSteps || !downSteps.length) return null;

  return (
    <View style={[layout_styles.eol_single]}>
      {!!downSteps[counter]?.icon && (
        <View
          style={{
            marginBottom: 16,
            width: '100%',
            alignItems: 'flex-start',
          }}>
          {downSteps[counter]?.icon === 'time' && (
            <Time_Icon styles={layout_styles.s_icon} color={yellow} />
          )}
          {downSteps[counter]?.icon === 'location' && (
            <Navigation_Icon styles={layout_styles.s_icon} color={yellow} />
          )}
          {downSteps[counter]?.icon === 'tick' && (
            <Tick_Icon styles={layout_styles.s_icon} color={green} />
          )}
          {downSteps[counter]?.icon === 'special' && (
            <Special_Icon styles={layout_styles.s_icon} color={yellow} />
          )}
          {downSteps[counter]?.icon === 'pluslocation' && (
            <Plus_Icon styles={layout_styles.s_icon} color={yellow} />
          )}
          {typeof downSteps[counter]?.icon !== 'string' && (
            <>{downSteps[counter]?.icon}</>
          )}
        </View>
      )}
      <Text
        style={[
          layout_styles.eol_intro,
          {
            fontSize: normalizeFontSize(14) /* before 16 */,
            marginTop: 20,
            marginBottom: 30,
          },
        ]}>
        {t('pubUpWorks')}
      </Text>
      <View style={[{minHeight: 24 * 3 + 36, justifyContent: 'center'}]}>
        <Text style={[layout_styles.eoltext, {marginBottom: 30}]}>
          {!!downSteps[counter]?.title
            ? downSteps[counter]?.title
            : i18next.language === 'en'
            ? downSteps[counter].eng
            : downSteps[counter].deu}
        </Text>
      </View>
      {!!offerSkip && !counter && (
        <View style={{flexDirection: 'row'}}>
          <View style={{width: '48%', marginRight: '2%'}}>
            <PrimaryButton_Outline
              text={t('No')}
              buttonClicked={() => {
                setShow_Overlay(false);
                storeBoolean(str, 'done');
                if (stepUp) {
                  stepUp('done');
                }
              }}
              marginTopAuto={false}
            />
          </View>
          <View style={{width: '48%', marginLeft: '2%'}}>
            <PrimaryButton_Outline
              text={t('yes')}
              buttonClicked={() => {
                setCounter(counter + 1);
                if (stepUp) {
                  stepUp(counter + 1);
                }
              }}
              marginTopAuto={false}
            />
          </View>
        </View>
      )}
      {((!!offerSkip && !!counter) || !offerSkip) && (
        <>
          {!!downSteps[counter].click && (
            <PrimaryButton_Outline
              text={downSteps[counter].click?.text}
              buttonClicked={() => {
                downSteps[counter].click.click();
                if (goOnAfterClick) {
                  goOn();
                }
              }}
              marginTopAuto={false}
            />
          )}
          <PrimaryButton_Outline
            text={!downSteps[counter].click ? 'OK!' : t('justGoOn')}
            buttonClicked={goOn}
            marginTopAuto={false}
          />
        </>
      )}
      {!!shareLink && (
        <PrimaryButton_Outline
          text={t('shareItWithFriends')}
          buttonClicked={shareLink}
          marginTopAuto={false}
        />
      )}
    </View>
  );
};

export default ModalOverlay;
