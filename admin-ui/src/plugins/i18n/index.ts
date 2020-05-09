/**
 * i18n
 */
import Vue from 'vue';
import VueI18n, { Path, Locale, TranslateResult } from 'vue-i18n';
import { Route } from 'vue-router';
import languages from '@/data/i18n/languages.json';

Vue.use(VueI18n);

/**
 * 扩展方法
 * tv(key, default, locale)
 */
Object.defineProperties(VueI18n.prototype, {
  tv: {
    value: function(key: Path, fallbackStr?: string, locale?: Locale): TranslateResult {
      return (
        (this.t && this.te
          ? this.te(key, locale)
            ? this.t(key, locale)
            : this.te(key, this.fallbackLocale)
            ? this.t(key, this.fallbackLocale)
            : fallbackStr
          : fallbackStr) || key
      );
    },
    writable: false,
  },
});

Object.defineProperties(Vue.prototype, {
  $tv: {
    value: function(key: Path, fallbackStr?: string, locale?: Locale): TranslateResult {
      const i18n = this.$i18n;
      return i18n.tv(key, fallbackStr, locale);
    },
    writable: false,
  },
});

export function createI18n(ssrContext: any, { router }: { router: any }) {
  const fallbackConfig = languages.find((l: LangConfig) => l.fallback) || languages[0];
  const fallbackLocale: string = fallbackConfig.alternate || fallbackConfig.locale;
  const globalLanguages: { [locale: string]: any } = {};
  const hasDocument: boolean = typeof document !== 'undefined';
  const loadedLanguages: string[] = [fallbackLocale]; // 预装默认语言

  let locale = fallbackLocale;

  if (ssrContext && ssrContext.lang) {
    locale = ssrContext.lang;
  } else if (hasDocument) {
    locale = document.documentElement.lang;
  }

  const i18n = new VueI18n({
    locale,
    fallbackLocale,
    messages: {
      [fallbackLocale]: require(`@/lang/${fallbackConfig.locale}`).default,
    },
    dateTimeFormats: {
      [fallbackLocale]: require(`@/lang/${fallbackConfig.locale}`).dateTimeFormat,
    },
    numberFormats: {
      [fallbackLocale]: require(`@/lang/${fallbackConfig.locale}`).numberFormat,
    },
    silentFallbackWarn: true,
  });

  function setI18nLanguage(lang: string) {
    i18n.locale = lang;
    if (hasDocument) {
      document.querySelector('html')!.setAttribute('lang', lang);
      localStorage.setItem('currentLanguage', lang || '');
    }
    return lang;
  }

  /**
   * 动态加载语言名，默认打包语言包含zh-CN, en-US
   * 其它扩展可将语言包json 文件放在 static/langs/ 目录下
   * @param {string} lang language code
   * @returns {Promise<string>} language code
   */
  function loadLanguageAsync(lang: string): Promise<string> {
    if (i18n.locale !== lang) {
      if (!loadedLanguages.includes(lang)) {
        const { locale } = languages.find((l: LangConfig) => lang === l.alternate || lang === l.locale) || {};

        if (!locale) {
          return Promise.reject(new Error(`Language ${lang} not found`));
        }

        return import(/* webpackChunkName: "lang-[request]" */ `@/lang/${locale}`).then(msgs => {
          const { default: translates, dateTimeFormat, numberFormat } = msgs;
          loadedLanguages.push(lang);
          globalLanguages[lang] = translates;
          i18n.setLocaleMessage(lang, globalLanguages[lang]);
          // setting datetime & number format
          dateTimeFormat && i18n.setDateTimeFormat(lang, dateTimeFormat);
          numberFormat && i18n.setNumberFormat(lang, numberFormat);

          return setI18nLanguage(lang);
        });
      }
      return Promise.resolve(setI18nLanguage(lang));
    }
    return Promise.resolve(lang);
  }

  // 路由变化后的语言变化
  router.beforeEach((to: Route, from: Route, next: () => void) => {
    to.params.lang &&
      loadLanguageAsync(to.params.lang)
        .then(() => next())
        .catch(() => {
          /** ate by dog */
        });
  });

  return i18n;
}
