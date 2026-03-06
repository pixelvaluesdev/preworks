import { Dimensions } from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

// Responsive helpers
export const HEIGHT = responsiveHeight;
export const WIDTH = responsiveWidth;
export const FONTSIZE = responsiveFontSize;

// Device dimensions
export const windowWidth = Dimensions.get('window').width;
export const windowHeight = Dimensions.get('window').height;
