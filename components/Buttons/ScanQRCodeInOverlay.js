import React from 'react';
import { StyleSheet, TouchableHighlight, View } from 'react-native';
import { yellow } from '../../styles/Colors';
import layout_styles from '../../styles/Layout_Styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Scan_QR_Icon_Circle } from '../../content/Icons';

const ScanQRCodeInOverlay = () => {
    const styles = StyleSheet.create({
        addlupe: {
            zIndex: 49,
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
                style={layout_styles.m_icon}>
                <Scan_QR_Icon_Circle styles={layout_styles.m_icon} color={yellow} />
            </TouchableHighlight>
        </View>
    );
};

export default ScanQRCodeInOverlay;
