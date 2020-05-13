import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators';
import store from '@/store';

export type Device = 'Desktop' | 'Mobile';

@Module({ dynamic: true, store, name: 'app', namespaced: true })
class AppStore extends VuexModule {
  device: Device = 'Desktop';
  language = '';
  menus: Array<Menu> = [];

  @Mutation
  TOGGLE_DEVICE(device: Device) {
    this.device = device;
  }

  @Mutation
  TOGGLE_LANGUAGE(lang: string) {
    this.language = lang;
  }

  @Mutation
  ADD_MENUS(menus: Menu | Array<Menu>) {
    if (Array.isArray(menus)) {
      this.menus = this.menus.concat(menus);
    } else {
      this.menus.push(menus);
    }
  }

  @Action
  ToggleDevice(device: Device) {
    this.TOGGLE_DEVICE(device);
  }

  @Action
  ToggleLanguage(lang: string) {
    this.TOGGLE_LANGUAGE(lang);
  }

  @Action
  AddMenus(menus: Menu | Array<Menu>) {
    this.ADD_MENUS(menus);
  }
}

export default getModule(AppStore);
