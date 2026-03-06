export const FONT = {
  POPPINS_THIN: 'Poppins-Thin',
  POPPINS_LIGHT: 'Poppins-Light',
  POPPINS_REGULAR: 'Poppins-Regular',
  POPPINS_MEDIUM: 'Poppins-Medium',
  POPPINS_SEMIBOLD: 'Poppins-SemiBold',
  POPPINS_BOLD: 'Poppins-Bold',
} as const;

export type FontKeys = keyof typeof FONT;
