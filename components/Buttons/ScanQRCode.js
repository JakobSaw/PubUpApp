import React from 'react';
import { StyleSheet, TouchableHighlight, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { yellow } from '../../styles/Colors';
import layout_styles from '../../styles/Layout_Styles';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Scan_QR_Icon_Circle } from '../../content/Icons';

const ScanQRCode = () => {
    const navigation = useNavigation();
    const styles = StyleSheet.create({
        addlupe: {
            zIndex: 3,
            position: 'absolute',
            margin: 'auto',
            left: 'auto',
            backgroundColor: 'rgba(0,0,0,0)',
        },
    });
    const insets = useSafeAreaInsets();
    return (
        <View
            style={[
                styles.addlupe,
                layout_styles.absolute_padding_right,
                {
                    top: layout_styles.absolute_padding_top_lupe.top + insets.top,
                },
            ]}>
            <TouchableHighlight
                style={layout_styles.m_icon}
                onPress={() => {
                    navigation.push('QRCode');
                }}>
                <Scan_QR_Icon_Circle styles={layout_styles.m_icon} color={yellow} />
            </TouchableHighlight>
        </View>
    );
};

export default ScanQRCode;
