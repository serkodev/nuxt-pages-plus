export default {
  theme: {
    extend: {
      colors: {
        nuxt: '#00DC82',
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    prefix: 'daisy-',
    themes: [
      {
        light: {
          ...require('daisyui/src/theming/themes').light,
          primary: '#00dc82',
          secondary: '#fbbf24',
        },
      },
      {
        dark: {
          ...require('daisyui/src/theming/themes').dark,
          primary: '#00dc82',
          secondary: '#fbbf24',
        },
      },
    ],
  },
}
