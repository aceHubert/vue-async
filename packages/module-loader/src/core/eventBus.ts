/**
 * eventBus
 */
import warning from 'warning';
import { hasOwn, isFunction } from '@vue-async/utils';
import { debug } from '../env';

// Types
import { EventBus } from '../types';

export function createEventBus(): EventBus {
  let events: {
    [eventName: string]: any;
  } = {};

  return {
    /**
     * 发射事件
     * @param {string} eventName 事件名称
     * @param {any} payload 事件载荷
     */
    emit(eventName, payload) {
      if (!events[eventName]) {
        return warning(
          !debug,
          `[@vue-async/module-loader] event "${eventName}" is triggered, but no listeners，nothing will be happening.`,
        );
      }
      for (const func of events[eventName].values()) {
        func(payload);
      }
    },
    /**
     * 事件监听
     * @param eventName 事件名称
     * @param handler 处理事件的方法
     */
    on(eventName, handler) {
      if (isFunction(handler)) {
        if (!events[eventName]) events[eventName] = new Set();
        events[eventName].add(handler);
      } else {
        warning(!debug, `[@vue-async/module-loader] handler must be a function, but recived ${typeof handler}`);
      }
    },
    /**
     * 取消事件监听
     * @param eventName 事件名称
     * @param handler 处理事件的方法
     */
    off(eventName, handler) {
      if (!handler || !isFunction(handler))
        return warning(!debug, '[@vue-async/module-loader] handler must be a valid event function');
      if (!hasOwn(events, eventName))
        return warning(!debug, `[@vue-async/module-loader] no event name of "${eventName}" is on listening`);

      events[eventName].delete(handler);
    },
    /**
     * 清理事件总线
     */
    clear() {
      events = {};
    },
    /**
     * 获取当前事件总线详情
     */
    getEvents() {
      return events;
    },
  };
}
