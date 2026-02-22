export const ASPECT_RATIOS = {
  '16:9': 16/9,
  '4:3': 4/3,
  '3:2': 3/2,
  '1:1': 1,
  '9:16': 9/16, // For vertical images
  'free': undefined
} as const;

export type AspectRatioKey = keyof typeof ASPECT_RATIOS;
