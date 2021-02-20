module.exports = {
  purge: ['./src/**/*.html', './src/**/*.js', './src/**/*.vue'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      cursor: ['disabled', 'hover'],
      backgroundColor: ['disabled'],
      backgroundOpacity: ['disabled'],
      textColor: ['disabled'],
    },
  },
  plugins: [],
}
