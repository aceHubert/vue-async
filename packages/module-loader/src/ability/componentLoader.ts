/**
 * componentLoader
 */
import { Component as VueComponent } from 'vue';
import { print } from '@vue-async/utils';

const isProduction = process.env.NODE_ENV === 'production';

export default () => {
  return function loader(componentName: string, url: string): Promise<VueComponent> {
    return new Promise<VueComponent>((resolve, reject) => {
      let component = window[componentName];
      // exists
      if (component) {
        resolve(component);
      } else {
        const script = document.createElement('script');
        script.src = url;
        script.async = true;
        script.onload = () => {
          component = window[componentName];
          // check again after js loaded
          if (component) {
            if (!isProduction) {
              print(`component:${componentName}`, 'loaded');
            }
            resolve(component);
          } else {
            reject(new Error(`component "${componentName}" loaded failed. `));
          }
        };
        script.onerror = () => {
          reject(new Error(`component "${componentName}" had a problem to load. ${url}`));
        };
        document.body.appendChild(script);
      }
    });
  };
};
