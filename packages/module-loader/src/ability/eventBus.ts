/**
 * eventBus
 */
import _Vue from 'vue';
import { warn, error } from '@vue-async/utils';

const isProduction = process.env.NODE_ENF === 'production';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function(Vue: typeof _Vue) {
  let events: {
    [eventName: string]: any;
  } = {};

  return {
    /**
     * 发射事件
     * @param {string} eventName 事件名称
     * @param {any} payload 事件载荷
     */
    emit(eventName: string, payload: any) {
      if (!events[eventName]) {
        return warn(isProduction, `event "${eventName}" is triggered, but no listeners，nothing will be happening.`);
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
    on(eventName: string, handler: (payload: any) => void) {
      if (typeof handler === 'function') {
        if (!events[eventName]) events[eventName] = new Set();
        events[eventName].add(handler);
      } else {
        error(isProduction, `handler must be a function, but recived ${typeof handler}`);
      }
    },
    /**
     * 取消事件监听
     * @param eventName 事件名称
     * @param handler 处理事件的方法
     */
    off(eventName: string, handler: (payload: any) => void) {
      if (!handler) {
        return warn(!isProduction, 'handler must be a valid event function');
      } else if (!events.hasOwnProperty(eventName)) {
        return error(isProduction, `no event name of "${eventName}" is on listening`);
      }
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
