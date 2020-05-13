import Vue from 'vue';
import { Path, Locale, TranslateResult } from 'vue-i18n';

// Vue
declare module 'vue/types/vue' {
  interface Vue {
    $tv: (key: Path, fallbackStr?: string, locale?: Locale) => TranslateResult;
  }
}
