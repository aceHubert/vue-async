import { RawLocation } from 'vue-router';

declare global {
  interface Menu {
    title: string;
    icon: string;
    to: RawLocation;
    index: number;
    children?: Array<Menu>;
  }

  interface Tab {
    title: string;
    name: string;
    to: RawLocation;
    exact: boolean;
    closeable: boolean;
  }

  interface LangConfig {
    name: string;
    shortName: string;
    locale: string;
    alternate?: string;
    fallback?: boolean;
  }
}

export {};
