import { isVue2, defineComponent , DefineComponent} from 'vue-demi';
import { Fragment as FragmentV2 } from 'vue-frag';

export const Fragment = '#fragment';

let FragmentComponent: DefineComponent<{}>;

if (isVue2) {
  FragmentComponent = ({
    name: 'Fragment',
    ...FragmentV2,
  } as unknown) as DefineComponent<{}>;
} else {
  /* istanbul ignore next */
  FragmentComponent = defineComponent({
    name: 'Fragment',
    render() {
      // @ts-ignore
      return this.$slots.default?.();
    },
  });
}

export { FragmentComponent };
