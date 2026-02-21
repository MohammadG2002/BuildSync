const sizeMap = {
  md: 1,
  lg: 1.25,
  xl: 1.5,
  "2xl": 2,
  "3xl": 2.5,
  "4xl": 3,
  "5xl": 3.5,
  "6xl": 4,
};

export const getFontSize = (size) => `${sizeMap[size] ?? 1}rem`;
