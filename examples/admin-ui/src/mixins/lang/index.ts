import { Vue, Component } from 'vue-property-decorator';
import languages from '@/data/i18n/languages.json';

@Component
export default class Lang extends Vue {
  get locale() {
    return this.$i18n.locale;
  }

  get supportLanguages(): LangConfig[] {
    return languages;
  }

  setLanguage(lang: string | LangConfig) {
    if (typeof lang === 'string') {
      const localeLang = languages.find((l: LangConfig) => l.alternate === lang || l.locale === lang);
      if (localeLang) {
        this.$router.replace({ params: { lang: localeLang.alternate || localeLang.locale } });
      } else {
        throw new Error(`Language ${lang} not found`);
      }
    } else {
      this.$router.replace({ params: { lang: lang.alternate || lang.locale } });
    }
  }
}
