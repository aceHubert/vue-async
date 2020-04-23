import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';

Vue.use(Vuetify);

export const DarkThemeStorageKey = 'currentDarkTheme';

export function createVuetify(ssrContext: any, i18n: any) {
  const vuetify = new Vuetify({
    lang: {
      t: (key, ...params) => i18n.t(key, ...params),
    },
    theme: {
      dark: localStorage ? localStorage.getItem(DarkThemeStorageKey) === 'true' : false,
      themes: {
        light: {
          primary: '#d65a31',
          secondary: '#222831',
          anchor: '#393e46',
          content: '#eeeeee',
        },
        dark: {
          primary: '#d65a31',
          secondary: '#222831',
          anchor: '#eeeeee',
          content: '#393e46',
        },
      },
    },
  });

  return vuetify;
}
