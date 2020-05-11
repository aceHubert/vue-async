import Vue from 'vue';
import { assert } from '../../tools';

export function sanitizeComponent(Component: any) {
  // If Component already sanitized
  if (Component.options && Component._Ctor === Component) {
    return Component;
  }
  if (!Component.options) {
    Component = Vue.extend(Component);
    Component._Ctor = Component;
  } else {
    Component._Ctor = Component;
    Component.extendOptions = Component.options;
  }
  // For debugging purpose
  if (!Component.options.name && Component.options.__file) {
    Component.options.name = Component.options.__file;
  }
  return Component;
}

export function getComponentName(Component: any) {
  if (process.env.NODE_ENV === 'production') {
    assert(
      Component,
      [
        'You are calling getComponentName(Component) with an undefined component.',
        'You may have forgotten to import it.',
      ].join('\n'),
    );
  }

  const component = sanitizeComponent(Component);
  return component.options.name;
}
