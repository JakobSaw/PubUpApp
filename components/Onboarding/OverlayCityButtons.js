import React from 'react';
import {ScrollView, TouchableOpacity, View, Text} from 'react-native';
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
} from '../../content/Icons';
import layout_styles from '../../styles/Layout_Styles';

const OverlayCityButtons = ({buttonClicked}) => {
  return (
    <ScrollView scrollEnabled={true}>
      {/* BERLIN */}
      <TouchableOpacity
        style={{marginBottom: 30}}
        onPress={() => {
          buttonClicked('Berlin');
        }}>
        <View style={layout_styles.overlay_city_buttons}>
          <Berlin_Outline styles={[{marginRight: 30}, layout_styles.l_icon]} />
          <Text style={layout_styles.font_styling_h1}>Berlin</Text>
        </View>
      </TouchableOpacity>
      {/* HAMBURG */}
      <TouchableOpacity
        style={{marginBottom: 30}}
        onPress={() => {
          buttonClicked('Hamburg');
        }}>
        <View style={layout_styles.overlay_city_buttons}>
          <Hamburg_Outline styles={[{marginRight: 30}, layout_styles.l_icon]} />
          <Text style={layout_styles.font_styling_h1}>Hamburg</Text>
        </View>
      </TouchableOpacity>
      {/* MÜNCHEN */}
      <TouchableOpacity
        style={{marginBottom: 30}}
        onPress={() => {
          buttonClicked('München');
        }}>
        <View style={layout_styles.overlay_city_buttons}>
          <Muenchen_Outline
            styles={[{marginRight: 30}, layout_styles.l_icon]}
          />
          <Text style={layout_styles.font_styling_h1}>München</Text>
        </View>
      </TouchableOpacity>
      {/* KÖLN */}
      <TouchableOpacity
        style={{marginBottom: 30}}
        onPress={() => {
          buttonClicked('Köln');
        }}>
        <View style={layout_styles.overlay_city_buttons}>
          <Koeln_Outline styles={[{marginRight: 30}, layout_styles.l_icon]} />
          <Text style={layout_styles.font_styling_h1}>Köln</Text>
        </View>
      </TouchableOpacity>
      {/* FRANKFURT */}
      <TouchableOpacity
        style={{marginBottom: 30}}
        onPress={() => {
          buttonClicked('Frankfurt am Main');
        }}>
        <View style={layout_styles.overlay_city_buttons}>
          <Frankfurt_Outline
            styles={[{marginRight: 30}, layout_styles.l_icon]}
          />
          <Text style={layout_styles.font_styling_h1}>
            {'Frankfurt\nam Main'}
          </Text>
        </View>
      </TouchableOpacity>
      {/* LEIPZIG */}
      <TouchableOpacity
        style={{marginBottom: 30}}
        onPress={() => {
          buttonClicked('Leipzig');
        }}>
        <View style={layout_styles.overlay_city_buttons}>
          <Leipzig_Outline styles={[{marginRight: 30}, layout_styles.l_icon]} />
          <Text style={layout_styles.font_styling_h1}>Leipzig</Text>
        </View>
      </TouchableOpacity>
      {/* HEIDELBERG */}
      <TouchableOpacity
        style={{marginBottom: 30}}
        onPress={() => {
          buttonClicked('Heidelberg');
        }}>
        <View style={layout_styles.overlay_city_buttons}>
          <Heidelberg_Outline
            styles={[{marginRight: 30}, layout_styles.l_icon]}
          />
          <Text style={layout_styles.font_styling_h1}>Heidelberg</Text>
        </View>
      </TouchableOpacity>
      {/* MÜNSTER */}
      <TouchableOpacity
        style={{marginBottom: 30}}
        onPress={() => {
          buttonClicked('Münster');
        }}>
        <View style={layout_styles.overlay_city_buttons}>
          <Muenster_Outline
            styles={[{marginRight: 30}, layout_styles.l_icon]}
          />
          <Text style={layout_styles.font_styling_h1}>Münster</Text>
        </View>
      </TouchableOpacity>
      {/* DORTMUND */}
      <TouchableOpacity
        style={{marginBottom: 30}}
        onPress={() => {
          buttonClicked('Dortmund');
        }}>
        <View style={layout_styles.overlay_city_buttons}>
          <Dortmund_Outline
            styles={[{marginRight: 30}, layout_styles.l_icon]}
          />
          <Text style={layout_styles.font_styling_h1}>Dortmund</Text>
        </View>
      </TouchableOpacity>
      {/* BONN */}
      <TouchableOpacity
        style={{marginBottom: 30}}
        onPress={() => {
          buttonClicked('Bonn');
        }}>
        <View style={layout_styles.overlay_city_buttons}>
          <Bonn_Outline styles={[{marginRight: 30}, layout_styles.l_icon]} />
          <Text style={layout_styles.font_styling_h1}>Bonn</Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default OverlayCityButtons;
