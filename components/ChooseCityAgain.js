import React, { useContext, useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableHighlight,
} from 'react-native';
import layout_styles from '../styles/Layout_Styles';
import { screenHeight } from '../utilities/WidthAndHeight';
import {
  Berlin_Outline,
  Bonn_Outline,
  Dortmund_Outline,
  Frankfurt_Outline,
  Hamburg_Outline,
  Heidelberg_Outline,
  Koeln_Outline,
  Leipzig_Outline,
  Muenchen_Outline,
  Muenster_Outline,
} from '../content/Icons';
import MainContext from '../context/MainContext';
import { darkblue, whiteColor } from '../styles/Colors';
import { useTranslation } from 'react-i18next';
import { normalizeFontSize } from '../utilities/ResFontSize';

const ChooseCityAgain = () => {
  const styles = StyleSheet.create({
    container: {
      backgroundColor: darkblue,
      height: 'auto',
      paddingBottom: 10,
      paddingTop: 10,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      paddingLeft: 30,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: whiteColor,
    },
    text: {
      fontFamily: 'GastroPub-Regular',
      fontSize: normalizeFontSize(18), // 20
      lineHeight: normalizeFontSize(28),
      color: whiteColor,
    },
  });
  const { t } = useTranslation();
  const { newAppStart } = useContext(MainContext);
  const [hide, setHide] = useState(false);
  /* useEffect(() => {
    setHide(false)
    return () => setHide(false)
  }, []) */
  if (hide) return null;
  return (
    <>
      <View
        style={[
          layout_styles.modal_container,
          { backgroundColor: 'rgba(0,0,0,0)', zIndex: 51 },
        ]}>
        <View
          style={[
            { marginTop: 'auto', marginBottom: 'auto' },
            layout_styles.just_modal_container_paddings_left_right,
          ]}>
          <Text style={[layout_styles.eoltext, { marginBottom: 30 }]}>
            {t('chooseCity')}
          </Text>
          <View style={{ height: screenHeight * 0.7 }}>
            <ScrollView
              scrollEnabled={true}
              showsVerticalScrollIndicator={false}>
              {/* BERLIN */}
              <TouchableHighlight
                style={{ marginBottom: 30 }}
                onPress={() => {
                  setHide(true)
                  newAppStart('Berlin')
                }}>
                <View style={styles.container}>
                  <Berlin_Outline
                    styles={[{ marginRight: 30 }, layout_styles.l_icon]}
                  />
                  <Text style={styles.text}>Berlin</Text>
                </View>
              </TouchableHighlight>
              {/* HAMBURG */}
              <TouchableHighlight
                style={{ marginBottom: 30 }}
                onPress={() => {
                  setHide(true)
                  newAppStart('Hamburg')
                }}>
                <View style={styles.container}>
                  <Hamburg_Outline
                    styles={[{ marginRight: 30 }, layout_styles.l_icon]}
                  />
                  <Text style={styles.text}>Hamburg</Text>
                </View>
              </TouchableHighlight>
              {/* MÜNCHEN */}
              <TouchableHighlight
                style={{ marginBottom: 30 }}
                onPress={() => {
                  setHide(true)
                  newAppStart('München')
                }}>
                <View style={styles.container}>
                  <Muenchen_Outline
                    styles={[{ marginRight: 30 }, layout_styles.l_icon]}
                  />
                  <Text style={styles.text}>München</Text>
                </View>
              </TouchableHighlight>
              {/* KÖLN */}
              <TouchableHighlight
                style={{ marginBottom: 30 }}
                onPress={() => {
                  setHide(true)
                  newAppStart('Köln')
                }}>
                <View style={styles.container}>
                  <Koeln_Outline
                    styles={[{ marginRight: 30 }, layout_styles.l_icon]}
                  />
                  <Text style={styles.text}>Köln</Text>
                </View>
              </TouchableHighlight>
              {/* FRANKFURT */}
              <TouchableHighlight
                style={{ marginBottom: 30 }}
                onPress={() => {
                  setHide(true)
                  newAppStart('Frankfurt am Main')
                }}>
                <View style={styles.container}>
                  <Frankfurt_Outline
                    styles={[{ marginRight: 30 }, layout_styles.l_icon]}
                  />
                  <Text style={styles.text}>{'Frankfurt\nam Main'}</Text>
                </View>
              </TouchableHighlight>
              {/* Leipzig */}
              <TouchableHighlight
                style={{ marginBottom: 30 }}
                onPress={() => {
                  setHide(true)
                  newAppStart('Leipzig')
                }}>
                <View style={styles.container}>
                  <Leipzig_Outline
                    styles={[{ marginRight: 30 }, layout_styles.l_icon]}
                  />
                  <Text style={styles.text}>Leipzig</Text>
                </View>
              </TouchableHighlight>
              {/* HEIDELBERG */}
              <TouchableHighlight style={{ marginBottom: 30 }} onPress={() => {
                setHide(true)
                newAppStart('Heidelberg')
              }}>
                <View style={styles.container}>
                  <Heidelberg_Outline
                    styles={[{ marginRight: 30 }, layout_styles.l_icon]}
                  />
                  <Text style={styles.text}>Heidelberg</Text>
                </View>
              </TouchableHighlight>
              {/* MÜNSTER */}
              <TouchableHighlight style={{ marginBottom: 30 }} onPress={() => {
                setHide(true)
                newAppStart('Münster')
              }}>
                <View style={styles.container}>
                  <Muenster_Outline
                    styles={[{ marginRight: 30 }, layout_styles.l_icon]}
                  />
                  <Text style={styles.text}>Münster</Text>
                </View>
              </TouchableHighlight>
              {/* DORTMUND */}
              <TouchableHighlight style={{ marginBottom: 30 }} onPress={() => {
                setHide(true)
                newAppStart('Dortmund')
              }}>
                <View style={styles.container}>
                  <Dortmund_Outline
                    styles={[{ marginRight: 30 }, layout_styles.l_icon]}
                  />
                  <Text style={styles.text}>Dortmund</Text>
                </View>
              </TouchableHighlight>
              {/* BONN */}
              <TouchableHighlight onPress={() => {
                setHide(true)
                newAppStart('Bonn')
              }}>
                <View style={styles.container}>
                  <Bonn_Outline
                    styles={[{ marginRight: 30 }, layout_styles.l_icon]}
                  />
                  <Text style={styles.text}>Bonn</Text>
                </View>
              </TouchableHighlight>
            </ScrollView>
          </View>
        </View>
      </View>
      <View
        style={{
          backgroundColor: 'rgba(23,30,52,0.9)',
          ...StyleSheet.absoluteFill,
          zIndex: 50,
        }}
      />
    </>
  );
};
export default ChooseCityAgain;
