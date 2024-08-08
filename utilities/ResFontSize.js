import {Platform, PixelRatio} from 'react-native';
import {screenWidth} from './WidthAndHeight';

const scale = screenWidth / 320;

export function normalizeFontSize(size) {
  const newSize = size * scale;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 1;
  }
}
