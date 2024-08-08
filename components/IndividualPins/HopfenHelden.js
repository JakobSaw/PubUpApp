import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { screenWidth } from '../../utilities/WidthAndHeight';
import { whiteColor, yellow } from '../../styles/Colors';

const HopfenHelden = ({ }) => {
    const styles = StyleSheet.create({
        strich: {
            width: '100%',
            height: 2,
            backgroundColor: yellow,
            borderRadius: 1,
            marginTop: 20,
            marginBottom: 20,
        },
    });
    return (
        <><View style={{ marginBottom: 20 }} />
            <View style={[{ alignItems: 'center' }]}><Image
                source={require('../../assets/Hopfenhelden-Logo.png')}
                style={{
                    width: screenWidth * 0.4,
                    height: screenWidth * 0.4 * 0.472
                }}
            /></View>
            <View style={[styles.strich, { backgroundColor: whiteColor, width: '75%', marginLeft: '12.5%' }]} />
        </>
    );
};

export default HopfenHelden;
