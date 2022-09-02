import { defineComponent, ref } from 'vue-demi';
import axios, { CancelTokenSource } from 'axios';
import { fetch, loadingRef } from '../apis';
import { useUserApi } from '../apis/useUserApi';
import { useLocalPluginApi } from '../apis/useLocalPluginApi';
import { pluginFetch } from '../apis/pluginFetch';

export default defineComponent({
  name: 'Playground',
  setup() {
    const userApi = useUserApi();
    const userPluginApi = useUserApi(pluginFetch);
    const localPluginApi = useLocalPluginApi();
    const timeoutRef = ref(0);
    const cancelTimeoutRef = ref(0);
    const cancelTokenRef = ref<CancelTokenSource | null>(null);
    const CancelToken = axios.CancelToken;

    // 发送请求10秒内可取消
    const sendRequest = () => {
      cancelTimeoutRef.value = 10;
      cancelTokenRef.value = CancelToken.source();
      const timer = window.setInterval(() => {
        cancelTimeoutRef.value > 0 && (cancelTimeoutRef.value -= 1);
      }, 1000);
      userApi
        .timeout({
          cancelToken: cancelTokenRef.value.token,
        })
        .then(({ data }) => {
          alert(data);
        })
        .catch((err: Error) => {
          alert(err.message);
        })
        .finally(() => {
          clearInterval(timer);
        });
    };

    // 取消请求
    const cancelRequest = () => {
      cancelTokenRef.value && cancelTokenRef.value.cancel('Operation canceled by the user.');
      cancelTimeoutRef.value = 0;
    };

    // 本地config设置超时（原axios逻辑）
    const sendTimeoutRequest = (timeout = 3000) => {
      timeoutRef.value = timeout / 1000;
      const timer = window.setInterval(() => {
        timeoutRef.value > 0 && (timeoutRef.value -= 1);
      }, 1000);
      userApi
        .timeout({
          timeout,
        })
        .catch((err: Error) => {
          alert(err.message);
        })
        .finally(() => {
          clearInterval(timer);
        });
    };

    // 全局注册catchError, 本地config设置 可以控制 global catch error 方法
    const sendErrorRequest = (catchError = true) => {
      userApi
        .error400({
          catchError,
        })
        .catch((err: Error) => {
          alert(`local error handler: ${err.message}`);
        });
    };

    // 全局注册catchError, 非regist apis 也可以被global catch error 捕获
    const sendErrorRequestWithClient = () => {
      // should catch error
      fetch.client
        .get('http://localhost:7009/error', {
          catchError: true,
        })
        .catch((err) => {
          alert(`local error handler: ${err.message}`);
        });
    };

    // 插件注册到了regist apis上，catchError 可以控制 global catch error 方法
    const sendPluginFetchErrorRequest = (catchError = true) => {
      // should catch error
      userPluginApi
        .error400({
          catchError,
        })
        .catch((err) => {
          alert(`local error handler: ${err.message}`);
        });
    };

    // 插件只注册到了regist apis上，非regist apis 无法被global catch error 捕获
    const sendPluginFetchErrorRequestWithClient = () => {
      // can not catch error in global
      pluginFetch.client
        .get('http://localhost:7009/error', {
          catchError: true,
        })
        .catch((err) => {
          alert(`local error handler: ${err.message}`);
        });
    };

    // 全局注册loading
    const sendLoadingRequret = (loading = true) => {
      userApi
        .timeout({
          params: {
            countdown: 5,
          },
          loading,
        })
        .then(({ data }) => {
          alert(data);
        })
        .catch((err: Error) => {
          alert(err.message);
        });
    };

    // 使用本地loading handler
    const localLoadingRef = ref(false);
    const sendLocalLoadingRequret = () => {
      userApi
        .timeout({
          params: {
            countdown: 5,
          },
          loading: () => {
            localLoadingRef.value = true;
            return () => {
              localLoadingRef.value = false;
            };
          },
        })
        .then(({ data }) => {
          alert(data);
        })
        .catch((err: Error) => {
          alert(err.message);
        });
    };

    // 全局注册retry
    const sendRetryRequest = (retry = true) => {
      userApi
        .getUsers({
          retry,
        })
        .then(({ data }) => {
          alert(`get ${data.length} count row(s)`);
        })
        .catch((err) => {
          alert(err.message);
        });
    };

    // 使用本地retry配置
    const sendLocalRetryRequest = () => {
      userApi
        .getUsers({
          retry: {
            maxCount: 1,
          },
        })
        .then(({ data }) => {
          alert(`get ${data.length} count row(s)`);
        })
        .catch((err) => {
          alert(err.message);
        });
    };

    // 不延时retry
    const sendNoDelayRetryRequest = () => {
      userApi
        .getUsers({
          retry: {
            maxCount: 3,
            delay: false,
          },
        })
        .then(({ data }) => {
          alert(`get ${data.length} count row(s)`);
        })
        .catch((err) => {
          alert(err.message);
        });
    };

    return () => {
      return (
        <div>
          <div>
            <p>click cancel button within time: {cancelTimeoutRef.value}s</p>
            <input type="button" value="Submit" onClick={() => sendRequest()}></input> &nbsp;
            {cancelTimeoutRef.value > 0 && <input type="button" value="Cancel" onClick={() => cancelRequest()}></input>}
          </div>
          <div>
            <p>request will be timeout in: {timeoutRef.value}s</p>
            <input type="button" value="Timeout 3s" onClick={() => sendTimeoutRequest()}></input> &nbsp;
          </div>
          <div>
            <h3>catchError（registCatchError 注册到全局）</h3>
            <input type="button" value="Catch Error false" onClick={() => sendErrorRequest(false)}></input> &nbsp;
            <input type="button" value="Catch Error true" onClick={() => sendErrorRequest(true)}></input> &nbsp;
            <p>
              <small>非 registApi 也会 catchError</small>
            </p>
            <input
              type="button"
              value="Catch Error true(not regist api request)"
              onClick={() => sendErrorRequestWithClient()}
            ></input>
            <h3>plugin catchError（通过 plugin 注入 registCatchError）</h3>
            <input
              type="button"
              value="Catch Error false"
              onClick={() => sendPluginFetchErrorRequest(false)}
            ></input>{' '}
            &nbsp;
            <input
              type="button"
              value="Catch Error true"
              onClick={() => sendPluginFetchErrorRequest(true)}
            ></input>{' '}
            <p>
              <small>非 registApi catchError无效</small>
            </p>
            <input
              type="button"
              value="Catch Error true(not regist api request)"
              onClick={() => sendPluginFetchErrorRequestWithClient()}
            ></input>
          </div>
          <div>
            <h3>loading</h3>
            {localLoadingRef.value && <p>Local Loading...</p>}
            {loadingRef.value && <p>Global Loading...</p>}
            <input type="button" value="Local Loading" onClick={() => sendLocalLoadingRequret()}></input> &nbsp;
            <input type="button" value="Global Loading" onClick={() => sendLoadingRequret(true)}></input> &nbsp;
            <input type="button" value="No Loading（5s）" onClick={() => sendLoadingRequret(false)}></input> &nbsp;
          </div>
          <div>
            <h3>retry</h3>
            <p>trun off network in the devtools</p>
            <input type="button" value="Local Retry(1 times)" onClick={() => sendLocalRetryRequest()}></input> &nbsp;
            <input type="button" value="Global Retry(5 times)" onClick={() => sendRetryRequest(true)}></input> &nbsp;
            <input type="button" value="No Retry" onClick={() => sendRetryRequest(false)}></input> &nbsp;
            <input type="button" value="No Delay Retry(3 times)" onClick={() => sendNoDelayRetryRequest()}></input>{' '}
            &nbsp;
          </div>
          <div>
            <h3>plugins</h3>
            <input
              type="button"
              value="Global plugin applied to all registApis"
              onClick={() => userApi.error400({ catchError: true })}
            ></input>{' '}
            &nbsp;
            <input
              type="button"
              value="Plugin applied to current registApis"
              onClick={() => localPluginApi.error400({ catchError: true })}
            ></input>
          </div>
        </div>
      );
    };
  },
});
