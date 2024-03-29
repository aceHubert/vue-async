import Vue from 'vue';
import warning from 'warning';
import { pushSuspenseInstance, popSuspenseInstance, currentSuspenseInstance } from './currentInstance';

// Types
import { CreateElement, VNode, VNodeChildren } from 'vue';
import { AsyncFactory } from 'types/resource-mananger';

export const RESOLVED = 'resolved';
export const REJECTED = 'rejected';
export const COMPONENT_NAME = 'VueSuspense';

export const del = (asyncFactory: AsyncFactory, error?: any) => {
  const suspIns = asyncFactory.suspenseInstance;
  if (!suspIns) {
    return error(process.env.NODE_ENV === 'production', 'No Suspense instance');
  }
  const asyncFactorys = suspIns.asyncFactorys;

  if (error) {
    suspIns.$emit(REJECTED, error);
    return;
  }

  asyncFactorys.delete(asyncFactory);
  if (asyncFactorys.size === 0) {
    suspIns.$emit(RESOLVED);
  }
};

export const add = (asyncFactory: AsyncFactory) => {
  const suspIns = currentSuspenseInstance || asyncFactory.suspenseInstance;
  if (!suspIns) {
    return warning(process.env.NODE_ENV === 'production', 'No Suspense instance');
  }
  const asyncFactorys = suspIns.asyncFactorys || (suspIns.asyncFactorys = new Set());

  if (suspIns.resolved) {
    suspIns.resolved = false;
    suspIns.setupLoading();
  }
  asyncFactorys.add(asyncFactory);
};

export const has = (asyncFactory: AsyncFactory) => {
  const suspIns = currentSuspenseInstance || asyncFactory.suspenseInstance;
  if (!suspIns) {
    return warning(process.env.NODE_ENV === 'production', 'No Suspense instance');
  }
  return suspIns.asyncFactorys && suspIns.asyncFactorys.has(asyncFactory);
};

export default Vue.extend({
  name: COMPONENT_NAME,
  props: {
    delay: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      resolved: false,
      rejected: false,
      displayLoading: false,
    };
  },
  methods: {
    setupLoading() {
      if (this.delay > 0) {
        this._time = setTimeout(() => {
          this.displayLoading = true;
        }, this.delay);
      } else {
        this.displayLoading = true;
      }
    },
    destoryLoading() {
      if (this._time) {
        clearTimeout(this._time);
        this._time = null;
      }
      this.displayLoading = false;
    },
  },
  created() {
    pushSuspenseInstance(this);

    this.promiser = new Promise((reslove, reject) => {
      this.$on(RESOLVED, () => {
        this.destoryLoading();
        this.resolved = true;
        reslove(null);
      });

      this.$on(REJECTED, (err: Error) => {
        this.destoryLoading();
        this.rejected = true;
        reject(err);
      });
    });
    // start loading
    this.setupLoading();
  },
  mounted() {
    if (!this.asyncFactorys) {
      this.$emit(RESOLVED);
    }
  },
  updated() {
    if (!this.resolved) return;
    popSuspenseInstance();
  },
  render(h: CreateElement) {
    const isVisible = this.$options.suspense?.mode === 'visible';
    const emptyVNode = this._e();
    const fallback = this.displayLoading ? this.$slots.fallback || [emptyVNode] : [emptyVNode];
    // The `children` is the real content to be rendered
    const children = this.$slots.default || [emptyVNode];

    let rendered;
    if (this.rejected && this.$slots.error) {
      rendered = createWrapper(h, this.$slots.error);
    } else {
      rendered = isVisible
        ? createWrapper(h, this.resolved ? children : children.concat(fallback))
        : createWrapper(h, [
            // We need to render the children, but we should not show the rendered content.
            createHiddenWrapper(h, children, this.resolved),
            fallback,
          ]);
    }

    return rendered;
  },
});

function createWrapper(h: CreateElement, children: VNodeChildren): VNode {
  return h(
    'div',
    {
      class: { 'vue-suspense-wrapper': true },
    },
    children,
  );
}

function createHiddenWrapper(h: CreateElement, tree: VNodeChildren, display: boolean): VNode {
  return h(
    'div',
    {
      style: { display: display ? 'block' : 'none' },
      class: { 'vue-suspense-hidden-wrapper': true },
    },
    tree,
  );
}
