import { defineComponent, inject, Ref } from 'vue-demi';

export default defineComponent({
  name: 'Layout',
  setup(_, { slots }) {
    const loadingRef = inject<Ref<boolean>>('requestLoading');

    return () => (
      <div style="width:1000px;margin:auto;">
        <h1>axios helpers:</h1>
        {loadingRef?.value && <p>Globle Loading...</p>}
        {slots.default?.()}
      </div>
    );
  },
});
