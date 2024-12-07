import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

const theme = defineConfig({
  theme: {
    tokens: {
      fonts: {
        body: { value: 'Plus Jakarta Sans, sans-serif' },
        heading: { value: 'Plus Jakarta Sans, sans-serif' },
      },
      colors: {
        brand: {
          darkgrey: { value: '#1a202c' },
          grey: { value: '#828fa3' },
          purple: { value: '#635fc7' },
          lightpurple: { value: '#a8a4ff' },
          red: { value: '#ea5555' },
          lightestgrey: { value: '#f4f7fd' },
          white: { value: '#ffffff' },
          almostblack: { value: '#000112' },
          darkestblue: { value: '#20212c' },
          layerdark: { value: '#2b2c37' },
          layerlight: { value: '#e4ebfa' },
          lightred: { value: '#ff9898' },
          darkborderline: { value: '#3e3f4e' },
        },
      },
    },
    semanticTokens: {
      colors: {
        primary: {
          value: '{colors.brand.purple}',
        },
        danger: {
          value: '{colors.brand.red}',
        },
        success: {
          value: { base: '{colors.green}', _dark: '{colors.darkgreen}' },
        },
      },
    },
  },
});

export default createSystem(defaultConfig, theme);

// rgba(195,219,216,0.255)
