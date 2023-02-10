import { ComponentPublicInstance } from 'vue-demi';
import { COMPONENT_NAME } from './context';

export default function findSuspenseInstance(ins: ComponentPublicInstance) {
  let current = ins.$parent;
  while (current) {
    if (current.$options.name === COMPONENT_NAME) {
      return current;
    } else {
      current = current.$parent;
    }
  }
  return;
}
