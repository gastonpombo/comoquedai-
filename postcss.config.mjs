/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    '@tailwindcss/postcss': {}, // <--- ESTO ES LO QUE CAMBIA
    autoprefixer: {},
  },
};

export default config;