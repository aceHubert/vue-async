import { Vue, Component } from 'vue-property-decorator';
import { DefaultThemes } from '@/plugins/vuetify';
import { VuetifyThemeItem } from 'vuetify/types/services/theme';
import { ThemePresetStorageKey, ThemesStorageKey } from '@/data/storage/keys';

// 预设
const presets = () => ({
  Orange: {
    light: {
      primary: '#ea9215',
      secondary: '#303841',
      content: '#eeeeee',
    },
    dark: {
      primary: '#ea9215',
      secondary: '#303841',
      content: '#3a4750',
    },
  },
  Yellow: {
    light: {
      primary: '#ffa372',
      secondary: '#333c4a',
      content: '#f8fceb',
    },
    dark: {
      primary: '#ffa372',
      secondary: '#333c4a',
      content: '#495664',
    },
  },
  Blue: {
    light: {
      primary: '#1c7293',
      secondary: '#272932',
      content: '#f1f2eb',
    },
    dark: {
      primary: '#1c7293',
      secondary: '#272932',
      content: '#b9e3c6',
    },
  },
  Green: {
    light: {
      primary: '#a9c52f',
      secondary: '#283739',
      content: '#f5f5f5',
    },
    dark: {
      primary: '#a9c52f',
      secondary: '#283739',
      content: '#2c5d63',
    },
  },
  LightBrown: {
    light: {
      primary: '#cabfab',
      secondary: '#41444b',
      content: '#dfd8c8',
    },
    dark: {
      primary: '#cabfab',
      secondary: '#41444b',
      content: '#52575d',
    },
  },
});

@Component({
  name: 'setting-theme',
})
export default class SettingTheme extends Vue {
  preset: keyof typeof presets | 'Default' | null =
    localStorage && (localStorage.getItem(ThemePresetStorageKey) as any);
  presetOptions = ['Default', ...Object.keys(presets())];
  primary = this.$vuetify.theme.currentTheme.primary;
  secondary = this.$vuetify.theme.currentTheme.secondary;
  content = this.$vuetify.theme.currentTheme.content;
  menus = {
    primary: false,
    secondary: false,
    content: false,
  };

  handleSetFromPreset(preset: keyof typeof presets | 'Default') {
    if (preset === 'Default') {
      Object.assign(this.$vuetify.theme.themes, DefaultThemes());
      localStorage && localStorage.removeItem(ThemesStorageKey);
    } else {
      const themes = presets()[preset];
      Object.assign(this.$vuetify.theme.themes, themes);
      localStorage && localStorage.setItem(ThemesStorageKey, JSON.stringify(this.$vuetify.theme.themes));
    }

    localStorage && localStorage.setItem(ThemePresetStorageKey, preset);
  }

  handleSetThemeColor(key: string, value: VuetifyThemeItem) {
    this.$vuetify.theme.currentTheme[key] = value;
    this.$set(this.menus, key, false);
    this.preset = null;
    localStorage && localStorage.removeItem(ThemePresetStorageKey);
    localStorage && localStorage.setItem(ThemesStorageKey, JSON.stringify(this.$vuetify.theme.themes));
  }

  render(h: any) {
    return (
      <v-card>
        <v-card-title>
          <span class="headline">Theme</span>
          <v-spacer></v-spacer>
          <v-btn icon onClick={() => this.$emit('close')}>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pt-5">
          <v-row no-gutters>
            <v-col cols={12} md={8} offset-md={2}>
              <v-switch vModel={this.$vuetify.theme.dark} label="Dark"></v-switch>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col cols={12} md={8} offset-md={2}>
              <v-combobox
                vModel={this.preset}
                label="Preset"
                items={this.presetOptions}
                onChange={this.handleSetFromPreset}
              ></v-combobox>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col cols={12} md={8} offset-md={2}>
              <v-menu
                v-model={this.menus.primary}
                close-on-content-click={false}
                transition="scale-transition"
                offset-y
                min-width="290px"
                {...{
                  scopedSlots: {
                    activator: ({ on }: any) => (
                      <v-text-field value={this.primary} label="Primary" readonly {...{ on }}></v-text-field>
                    ),
                  },
                }}
              >
                <v-card>
                  <v-card-text style="padding:0;">
                    <v-color-picker vModel={this.primary} mode="hexa" flat hide-mode-switch></v-color-picker>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      text
                      color="primary"
                      onClick={() => {
                        this.menus.primary = false;
                      }}
                    >
                      Cancel
                    </v-btn>
                    <v-btn text color="primary" onClick={this.handleSetThemeColor.bind(this, 'primary', this.primary)}>
                      Ok
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-menu>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col cols={12} md={8} offset-md={2}>
              <v-menu
                v-model={this.menus.secondary}
                close-on-content-click={false}
                transition="scale-transition"
                offset-y
                min-width="290px"
                {...{
                  scopedSlots: {
                    activator: ({ on }: any) => (
                      <v-text-field value={this.secondary} label="Secondary" readonly {...{ on }}></v-text-field>
                    ),
                  },
                }}
              >
                <v-card>
                  <v-card-text style="padding:0;">
                    <v-color-picker vModel={this.secondary} mode="hexa" flat hide-mode-switch></v-color-picker>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      text
                      color="primary"
                      onClick={() => {
                        this.menus.secondary = false;
                      }}
                    >
                      Cancel
                    </v-btn>
                    <v-btn
                      text
                      color="primary"
                      onClick={this.handleSetThemeColor.bind(this, 'secondary', this.secondary)}
                    >
                      Ok
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-menu>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col cols={12} md={8} offset-md={2}>
              <v-menu
                v-model={this.menus.content}
                close-on-content-click={false}
                transition="scale-transition"
                offset-y
                min-width="290px"
                {...{
                  scopedSlots: {
                    activator: ({ on }: any) => (
                      <v-text-field value={this.content} label="Content" readonly {...{ on }}></v-text-field>
                    ),
                  },
                }}
              >
                <v-card>
                  <v-card-text style="padding:0;">
                    <v-color-picker vModel={this.content} mode="hexa" flat hide-mode-switch></v-color-picker>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      text
                      color="primary"
                      onClick={() => {
                        this.menus.content = false;
                      }}
                    >
                      Cancel
                    </v-btn>
                    <v-btn text color="primary" onClick={this.handleSetThemeColor.bind(this, 'content', this.content)}>
                      Ok
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-menu>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    );
  }
}
