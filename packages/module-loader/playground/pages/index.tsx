import { defineComponent, useCssVars } from 'vue-demi';
import { NuxtLink } from '#components';

export default defineComponent({
  name: 'Playground',
  setup() {
    return () => (
      <div class="playground">
        <h3>通过子模块注入的页面：</h3>
        <NuxtLink style="margin: 0 10px 5px; display: block" to="/dymanic-router/page-a">
          Remote Page load
        </NuxtLink>
        {/* <h3>在vue-router配置加截远端组件：</h3>
        <NuxtLink style="margin: 0 10px 5px; display: block" to={{ name: 'remote-component' }} external>
          Remote Component load
        </NuxtLink>
        <h3>在页面中加截远端组件：</h3>
        <NuxtLink style="margin: 0 10px 5px; display: block" to={{ name: 'remote-component-page' }}>
          Remote Component load
        </NuxtLink>
        <h3>设置错误组件导出名字（首先通过最新添加到window的对象找到组件，所以能正常加载）：</h3>
        <NuxtLink style="margin: 0 10px 5px; display: block" to={{ name: 'wrong-name-remote-component' }}>
          setted wrong export component name
        </NuxtLink>
        <h3>设置错误entry（无法正常加载）：</h3>
        <NuxtLink style="margin: 0 10px 5px; display: block" to={{ name: 'wrong-entry-remote-component' }}>
          setted wrong component entry
        </NuxtLink>
        <h3>vue-router 异步组件加载过程：</h3>
        <NuxtLink style="margin: 0 10px 5px; display: block" to={{ name: 'lazy-loading-remote-component' }}>
          async component loading in 3s
        </NuxtLink> */}
      </div>
    );
  },
});
