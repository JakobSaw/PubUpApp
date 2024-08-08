import React, { useState, useContext, useEffect } from 'react';
import { View, Text, Platform } from 'react-native';
import MainContext from '../../context/MainContext';
import layout_styles from '../../styles/Layout_Styles';
import InputText from '../Inputs/InputText';
import InnerTitle from '../InnerTitle';
import ListItemOptions from '../ListItems/ListItemOptions';
import PrimaryButton from '../Buttons/PrimaryButton';
import {
  Berlin_Outline,
  Muenchen_Outline,
  Heidelberg_Outline,
  Hamburg_Outline,
  Koeln_Outline,
  Frankfurt_Outline,
  Leipzig_Outline,
  World_Icon,
  Category_Icon,
  Cocktail_Icon,
  Wine_Icon,
  CraftBeer_Icon,
  Outdoor_Icon,
  Darts_Icon,
  Billard_Icon,
  Kicker_Icon,
  Streaming_Icon,
  LiveMusic_Icon,
  Smoking,
  NonSmoking,
  SeparateSmoking,
  NoFood_Icon,
  SmallFood_Icon,
  WarmFood_Icon,
  Muenster_Outline,
  Dortmund_Outline,
  Bonn_Outline,
} from '../../content/Icons';
import { red, yellow } from '../../styles/Colors';
import ModalOverlay from '../Onboarding/ModalOverlay';
import Fonts from '../../content/Fonts';
import { useTranslation } from 'react-i18next';
import LayoutContainer from '../../utilities/LayoutContainer';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native';
import { showAlert } from 'react-native-customisable-alert';
import CustomAlert from '../CustomAlert';
import { Emoji } from '../../content/Emoji';

const Form = () => {
  const { t } = useTranslation();
  const navigation = useNavigation()
  const { mainState, setMainState } = useContext(MainContext);
  const [nav, setNav] = useState('Form_1');
  const reset = () => {
    setNewPub({
      name: '',
      city: '',
      extracity: '',
      category: '',
      extracategory: '',
      extrafilter: '',
      smoking: '',
      outdoor: false,
      darts: false,
      billards: false,
      kicker: false,
      streaming: false,
      kitchen: false,
      cocktails: false,
      wine: false,
      craft: false,
      music: false,
    });
  };
  const submit = () => {
    const finalNewPub = {
      ...newPub,
      name: newPub.name.trim(),
      extracategory: newPub.extracategory.trim(),
      extracity: newPub.extracity.trim(),
      extrafilter: newPub.extrafilter.trim(),
      fromWhere: 'fromApp'
    };
    // Custom Alert => youreBest
    setMainState({
      ...mainState,
      complete: {
        ...mainState.complete,
        newentries: [...mainState.complete.newentries, finalNewPub],
      },
    });
    // Navigate
    navigation.replace('Map')
    showAlert({
      alertType: 'custom',
      customAlert: (
        <CustomAlert
          title={t('youreGreat')}
          sub={t('betterApp')}
          icon={<Emoji emoji="love" styles={layout_styles.l_icon} />}
        />
      ),
    });
  };

  const [newPub, setNewPub] = useState({
    name: '',
    city: '',
    extracity: '',
    category: '',
    extracategory: '',
    extrafilter: '',
    cocktails: false,
    wine: false,
    craft: false,
    smoking: '',
    outdoor: false,
    darts: false,
    billards: false,
    kicker: false,
    streaming: false,
    music: false,
    kitchen: '',
    fromWhere: 'fromApp',
  });

  const buttonClicked = () => {
    if (nav === 'Form_1') {
      setNav('Form_2');
    } else if (nav === 'Form_2') {
      setNav('Form_3');
    } else {
      submit();
    }
  };

  const primaryButtonText = () => {
    if (nav === 'Form_3') {
      return t('submitBTNtext');
    }
    return t('nextBTNtext');
  };

  const categories = [
    {
      category: 'urkneipe',
      title: t('category_pub'),
    },
    {
      category: 'alternativ',
      title: t('category_yuc'),
    },
    {
      category: 'cozy',
      title: t('category_cozy'),
    },
    {
      category: 'classy',
      title: t('category_classy'),
    },
    {
      category: 'dancing',
      title: t('category_dancing'),
    },
    {
      category: 'irish',
      title: t('category_irish_pub'),
    },
    {
      category: 'garten',
      title: t('category_garden'),
    },
    {
      category: 'beach',
      title: t('category_beach_roof'),
    },
  ];

  const filters = (filter) => {
    if (filter === 'yes') {
      return t('filters_smoking');
    } else if (filter === 'separate') {
      return t('filters_separatesmoking');
    } else if (filter === 'not') {
      return t('filters_notsmoking');
    } else if (filter === 'cocktails') {
      return {
        icon: <Cocktail_Icon styles={layout_styles.s_icon} />,
        title: t('filters_cocktails'),
      };
    } else if (filter === 'wine') {
      return {
        icon: <Wine_Icon styles={layout_styles.s_icon} />,
        title: t('filters_wine'),
      };
    } else if (filter === 'craft') {
      return {
        icon: <CraftBeer_Icon styles={layout_styles.s_icon} />,
        title: t('filters_craft', { break: '' }),
      };
    } else if (filter === 'outdoor') {
      return {
        icon: <Outdoor_Icon styles={layout_styles.s_icon} />,
        title: t('filters_outdoor'),
      };
    } else if (filter === 'darts') {
      return {
        icon: <Darts_Icon styles={layout_styles.s_icon} color={yellow} />,
        title: t('filters_darts'),
      };
    } else if (filter === 'billards') {
      return {
        icon: <Billard_Icon styles={layout_styles.s_icon} />,
        title: t('filters_billard'),
      };
    } else if (filter === 'kicker') {
      return {
        icon: <Kicker_Icon styles={layout_styles.s_icon} />,
        title: t('filters_kicker'),
      };
    } else if (filter === 'streaming') {
      return {
        icon: <Streaming_Icon styles={layout_styles.s_icon} />,
        title: t('filters_live_sports'),
      };
    } else if (filter === 'music') {
      return {
        icon: <LiveMusic_Icon styles={layout_styles.s_icon} />,
        title: t('filters_music'),
      };
    }
    return 'Titel fehlt!!!';
  };

  const disabled = () => {
    if (nav === 'Form_1') {
      if (!newPub.name) {
        return true;
      } else if (newPub.city === 'ExtraCity' && !newPub.extracity) {
        return true;
      } else if (newPub.city || newPub.extracity) {
        return false;
      } else {
        return true;
      }
    } else if (nav === 'Form_2') {
      if (newPub.category === 'ExtraCategory' && !newPub.extracategory) {
        return true;
      } else if (!newPub.category) {
        return true;
      } else {
        return false;
      }
    } else {
      if (!newPub.smoking || !newPub.kitchen) {
        return true;
      } else {
        return false;
      }
    }
  };

  const cityIcons = (city) => {
    if (city === 'Berlin') {
      return <Berlin_Outline styles={layout_styles.s_icon} />;
    } else if (city === 'Hamburg') {
      return <Hamburg_Outline styles={layout_styles.s_icon} />;
    } else if (city === 'München') {
      return <Muenchen_Outline styles={layout_styles.s_icon} />;
    } else if (city === 'Köln') {
      return <Koeln_Outline styles={layout_styles.s_icon} />;
    } else if (city === 'Frankfurt am Main') {
      return <Frankfurt_Outline styles={layout_styles.s_icon} />;
    } else if (city === 'Leipzig') {
      return <Leipzig_Outline styles={layout_styles.s_icon} />;
    } else if (city === 'Heidelberg') {
      return <Heidelberg_Outline styles={layout_styles.s_icon} />;
    } else if (city === 'Münster') {
      return <Muenster_Outline styles={layout_styles.s_icon} />;
    } else if (city === 'Dortmund') {
      return <Dortmund_Outline styles={layout_styles.s_icon} />;
    } else if (city === 'Bonn') {
      return <Bonn_Outline styles={layout_styles.s_icon} />;
    } else {
      return <World_Icon styles={layout_styles.s_icon} />;
    }
  };

  useEffect(() => {
    reset();
    setNav('Form_1');
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
            {nav === 'Form_1' && (
              <>
                <InputText
                  title={{
                    eng: 'Name of the Location',
                    deu: 'Name der Location',
                  }}
                  value={newPub.name}
                  onChange={(text) =>
                    setNewPub({
                      ...newPub,
                      name: text,
                    })
                  }
                  placeholder="Name"
                />
                <InnerTitle title={t('city')} />
                <>
                  {mainState.mainCities.map((current) => {
                    return (
                      <ListItemOptions
                        icon={cityIcons(current)}
                        key={current}
                        title={current}
                        checked={newPub.city === current}
                        optionClicked={() => {
                          if (newPub.city === current) {
                            setNewPub({
                              ...newPub,
                              city: '',
                            });
                          } else {
                            setNewPub({
                              ...newPub,
                              city: current,
                            });
                          }
                        }}
                        styles={{ marginLeft: 15 }}
                      />
                    );
                  })}
                  <ListItemOptions
                    icon={cityIcons(null)}
                    key="WORLD"
                    title={t('others')}
                    checked={newPub.city === 'ExtraCity'}
                    optionClicked={() => {
                      if (newPub.city === 'ExtraCity') {
                        setNewPub({
                          ...newPub,
                          city: '',
                        });
                      } else {
                        setNewPub({
                          ...newPub,
                          city: 'ExtraCity',
                        });
                      }
                    }}
                    styles={{ marginLeft: 15 }}
                  />
                </>
                <InputText
                  title={t('formExtraCity')}
                  value={newPub.extracity}
                  onChange={(text) =>
                    setNewPub({
                      ...newPub,
                      extracity: text,
                    })
                  }
                  placeholder={t('extraCity')}
                  marginTop={30}
                />
              </>
            )}
            {nav === 'Form_2' && (
              <>
                <InnerTitle title={t('category')} marginTop={1} />
                <>
                  {categories.map((current) => {
                    return (
                      <ListItemOptions
                        icon={<Category_Icon category={current.category} />}
                        key={current.category}
                        title={current.title}
                        checked={newPub.category === current.category}
                        optionClicked={() => {
                          if (newPub.category === current.category) {
                            setNewPub({
                              ...newPub,
                              category: '',
                            });
                          } else {
                            setNewPub({
                              ...newPub,
                              category: current.category,
                            });
                          }
                        }}
                        styles={{ marginLeft: 15 }}
                      />
                    );
                  })}
                  <ListItemOptions
                    icon={<Category_Icon category="Question" />}
                    key="QUESTION"
                    title={t('others')}
                    checked={newPub.category === 'ExtraCategory'}
                    optionClicked={() => {
                      if (newPub.category === 'ExtraCategory') {
                        setNewPub({
                          ...newPub,
                          category: '',
                        });
                      } else {
                        setNewPub({
                          ...newPub,
                          category: 'ExtraCategory',
                        });
                      }
                    }}
                    styles={{ marginLeft: 15 }}
                  />
                </>
                <InputText
                  title={t('formExtraCategory')}
                  value={newPub.extracategory}
                  onChange={(text) =>
                    setNewPub({
                      ...newPub,
                      extracategory: text,
                    })
                  }
                  placeholder={t('extraCategory')}
                  marginTop={30}
                />
              </>
            )}
            {nav === 'Form_3' && (
              <>
                {Object.keys(newPub).map((current) => {
                  if (
                    !current.startsWith('extra') &&
                    current !== 'name' &&
                    current !== 'city' &&
                    current !== 'category' &&
                    current !== 'fromWhere'
                  ) {
                    if (current === 'smoking') {
                      return (
                        <View key={Math.random()}>
                          <ListItemOptions
                            icon={<Smoking styles={layout_styles.s_icon} />}
                            key="Smoking"
                            title={t('filters_smoking')}
                            checked={newPub.smoking === 'yes'}
                            optionClicked={() => {
                              if (newPub.smoking === 'yes') {
                                setNewPub({
                                  ...newPub,
                                  smoking: '',
                                });
                              } else {
                                setNewPub({
                                  ...newPub,
                                  smoking: 'yes',
                                });
                              }
                            }}
                            styles={{ marginLeft: 15 }}
                          />
                          <ListItemOptions
                            icon={<NonSmoking styles={layout_styles.s_icon} />}
                            key="NonSmoking"
                            title={t('filters_notsmoking')}
                            checked={newPub.smoking === 'not'}
                            optionClicked={() => {
                              if (newPub.smoking === 'not') {
                                setNewPub({
                                  ...newPub,
                                  smoking: '',
                                });
                              } else {
                                setNewPub({
                                  ...newPub,
                                  smoking: 'not',
                                });
                              }
                            }}
                            styles={{ marginLeft: 15 }}
                          />
                          <ListItemOptions
                            icon={
                              <SeparateSmoking styles={layout_styles.s_icon} />
                            }
                            key="SeparateSmoking"
                            title={t('filters_separatesmoking')}
                            checked={newPub.smoking === 'separate'}
                            optionClicked={() => {
                              if (newPub.smoking === 'separate') {
                                setNewPub({
                                  ...newPub,
                                  smoking: '',
                                });
                              } else {
                                setNewPub({
                                  ...newPub,
                                  smoking: 'separate',
                                });
                              }
                            }}
                            styles={{ marginLeft: 15 }}
                          />
                          {!newPub.smoking && <Text
                            style={[
                              layout_styles.font_styling_h4,
                              {
                                color: red,
                                marginLeft: 15,
                                fontFamily: Fonts.Bold,
                              },
                            ]}>
                            {t('smokingDesc')}
                          </Text>}
                        </View>
                      );
                    } else if (current === 'kitchen') {
                      return (
                        <View key={Math.random()}>
                          <ListItemOptions
                            icon={<NoFood_Icon styles={layout_styles.s_icon} />}
                            key="NoFood"
                            title={t('filters_nofood', { break: '' })}
                            checked={newPub.kitchen === 'nofood'}
                            optionClicked={() => {
                              if (newPub.kitchen === 'nofood') {
                                setNewPub({
                                  ...newPub,
                                  kitchen: '',
                                });
                              } else {
                                setNewPub({
                                  ...newPub,
                                  kitchen: 'nofood',
                                });
                              }
                            }}
                            styles={{ marginLeft: 15 }}
                          />
                          <ListItemOptions
                            icon={
                              <SmallFood_Icon styles={layout_styles.s_icon} />
                            }
                            key="SmallFood"
                            title={t('filters_smallfood', { break: ' ' })}
                            checked={newPub.kitchen === 'smallfood'}
                            optionClicked={() => {
                              if (newPub.kitchen === 'smallfood') {
                                setNewPub({
                                  ...newPub,
                                  kitchen: '',
                                });
                              } else {
                                setNewPub({
                                  ...newPub,
                                  kitchen: 'smallfood',
                                });
                              }
                            }}
                            styles={{ marginLeft: 15 }}
                          />
                          <ListItemOptions
                            icon={
                              <WarmFood_Icon styles={layout_styles.s_icon} />
                            }
                            key="WarmFood"
                            title={t('filters_warmfood')}
                            checked={newPub.kitchen === 'warmfood'}
                            optionClicked={() => {
                              if (newPub.kitchen === 'warmfood') {
                                setNewPub({
                                  ...newPub,
                                  kitchen: '',
                                });
                              } else {
                                setNewPub({
                                  ...newPub,
                                  kitchen: 'warmfood',
                                });
                              }
                            }}
                            styles={{ marginLeft: 15 }}
                          />
                          {!newPub.kitchen && <Text
                            style={[
                              layout_styles.font_styling_h4,
                              {
                                color: red,
                                marginLeft: 15,
                                fontFamily: Fonts.Bold,
                              },
                            ]}>
                            {t('kitchenDesc')}
                          </Text>}
                        </View>
                      );
                    } else {
                      return (
                        <ListItemOptions
                          icon={filters(current).icon}
                          key={current}
                          title={filters(current).title}
                          checked={newPub[current]}
                          optionClicked={() => {
                            setNewPub({
                              ...newPub,
                              [current]: !newPub[current],
                            });
                          }}
                          styles={{ marginLeft: 15 }}
                        />
                      );
                    }
                  }
                })}
                <View style={{ marginTop: 30 }} />
                <InputText
                  title={{
                    eng: 'Add a filter.',
                    deu: 'Filter ergänzen.',
                  }}
                  value={newPub.extrafilter}
                  onChange={(text) =>
                    setNewPub({
                      ...newPub,
                      extrafilter: text,
                    })
                  }
                  placeholder="Extra Filter"
                />
              </>
            )}
          </KeyboardAwareScrollView>
          <PrimaryButton
            disabled={disabled()}
            text={primaryButtonText()}
            buttonClicked={buttonClicked}
          />
        </>
      }
      title={t('addlocationtitle')}
      overlay={
        <ModalOverlay
          str="@FirstOpen_Form"
          downSteps={[
            {
              eng: 'Suggest a location for our database.',
              deu: 'Location für unsere Datenbank vorschlagen.',
            },
          ]}
        />
      }
    />
  );
};

export default Form;
