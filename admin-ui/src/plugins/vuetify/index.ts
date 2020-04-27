import Vue from 'vue';
import Vuetify from 'vuetify';
import {DarkThemeStorageKey, ThemesStorageKey} from '@/data/storage/keys'
import 'vuetify/dist/vuetify.min.css';

Vue.use(Vuetify);

export const DefaultThemes = () => ({
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
});

export function createVuetify(ssrContext: any, i18n: any) {
  const isDark = localStorage && localStorage.getItem(DarkThemeStorageKey) === 'true';
  const themes =
    localStorage && localStorage.getItem(ThemesStorageKey) && JSON.parse(localStorage.getItem(ThemesStorageKey)!);

  const vuetify = new Vuetify({
    lang: {
      t: (key, ...params) => i18n.t(key, ...params),
    },
    theme: {
      dark: isDark,
      themes: themes || DefaultThemes(),
    },
  });

  return vuetify;
}
