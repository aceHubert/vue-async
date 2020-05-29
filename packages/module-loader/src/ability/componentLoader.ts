/**
 * componentLoader
 */

import { Component as VueComponent } from 'vue';

export default () => {
  return function loader(componentName: string, url: string): Promise<VueComponent> {
    return new Promise<VueComponent>((resolve, reject) => {
      let component = (window as any)[componentName];
      if (component) {
        resolve(component);
      } else {
        const script = document.createElement('script');
        script.src = url;
        script.async = true;
        script.onload = () => {
          component = (window as any)[componentName];
          resolve(component);
        };
        script.onerror = () => {
          reject(new Error(`component "${componentName}" had a problem to load. ${url}`));
        };
        document.body.appendChild(script);
      }
    });
  };
};
