/**
 * eventBus
 */
import { isFunction } from './types';
import { hasOwn } from './tools';

/**
 * Event bus
 */
export type EventBus = {
  /**
   * 发射事件
   * @param {string} eventName 事件名称
   * @param {any} payload 事件载荷
   */
  emit(eventName: string, ...playload: any[]): void;
  /**
   * 事件监听
   * @param eventName 事件名称
   * @param handler 处理事件的方法
   */
  on(eventName: string, handler: (...playload: any[]) => void): void;
  /**
   * 事件监听（只执行1次）
   * @param eventName 事件名称
   * @param handler 处理事件的方法
   */
  once(eventName: string, handler: (...playload: any[]) => void): void;
  /**
   * 取消事件监听
   * @param eventName 事件名称
   * @param handler 处理事件的方法
   */
  off(eventName: string, handler: (...playload: any[]) => void): void;
  /**
   * 清理事件总线
   */
  clear(): void;
  /**
   * 获取当前事件总线详情
   */
  getEvents(): Record<string, Set<Function>>;
};

export function createEventBus(): EventBus {
  let events: {
    [eventName: string]: Set<Function>;
  } = {};

  return {
    emit(eventName, ...payload) {
      if (!events[eventName]) {
        process.env.NODE_ENV !== 'production' &&
          console.warn(
            `[@vue-async/utils] event "${eventName}" is triggered, but no listeners，nothing will be happening.`,
          );
        return;
      }
      for (const handler of events[eventName].values()) {
        handler(...payload);
      }
    },
    on(eventName, handler) {
      if (isFunction(handler)) {
        if (!events[eventName]) events[eventName] = new Set();
        events[eventName].add(handler);
      } else {
        process.env.NODE_ENV !== 'production' &&
          console.warn(`[@vue-async/utils] handler must be a function, but recived ${typeof handler}`);
      }
    },
    once(eventName, handler) {
      if (isFunction(handler)) {
        if (!events[eventName]) events[eventName] = new Set();
        events[eventName].add((...payload: any[]) => {
          handler(...payload);
          this.off(eventName, handler);
        });
      } else {
        process.env.NODE_ENV !== 'production' &&
          console.warn(`[@vue-async/utils] handler must be a function, but recived ${typeof handler}`);
      }
    },
    off(eventName, handler) {
      if (!handler || !isFunction(handler)) {
        process.env.NODE_ENV !== 'production' &&
          console.warn('[@vue-async/utils] handler must be a valid event function');
        return;
      }
      if (!hasOwn(events, eventName)) {
        process.env.NODE_ENV !== 'production' &&
          console.warn(`[@vue-async/utils] no event name of "${eventName}" is on listening`);
        return;
      }

      events[eventName].delete(handler);
    },
    clear() {
      events = {};
    },
    getEvents() {
      return Object.freeze(events);
    },
  };
}
