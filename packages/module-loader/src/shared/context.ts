import { InjectionKey } from 'vue-demi';
import { createComponentLoader } from '../core/componentLoader';
import { createEventBus } from '../core/eventBus';
import { debug } from '../env';

// Types
import { InjectFunction } from '../types';

export const InjectSymbol: InjectionKey<InjectFunction> = debug ? Symbol.for('__Inject_FUNCTION__') : Symbol();

export const ComponentLoaderSymbole: InjectionKey<ReturnType<typeof createComponentLoader>> = debug
  ? Symbol.for('__COMPONENT_LOADER__')
  : Symbol();

export const EventBusSymbole: InjectionKey<ReturnType<typeof createEventBus>> = debug
  ? Symbol.for('__EVENT_BUS__')
  : Symbol();
