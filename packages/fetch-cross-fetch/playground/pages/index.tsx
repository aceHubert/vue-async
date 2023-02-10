import { defineComponent, ref, unref } from 'vue-demi';
import { useRegistApi } from '@vue-async/fetch';
import type { ApiConfig } from '../apis';

export default defineComponent({
  name: 'Playground',
  setup() {
    const registApiRef = useRegistApi<ApiConfig>();
    const registApi = unref(registApiRef);
    const timeoutRef = ref(0);
    const cancelTimeoutRef = ref(0);
    const cancelTokenRef = ref<AbortController | null>(null);

    const sendRequest = () => {
      cancelTimeoutRef.value = 10;
      cancelTokenRef.value = new AbortController();
      const timer = window.setInterval(() => {
        cancelTimeoutRef.value > 0 && (cancelTimeoutRef.value -= 1);
      }, 1000);
      registApi
        .timeout({
          signal: cancelTokenRef.value.signal,
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

    const cancelRequest = () => {
      cancelTokenRef.value && cancelTokenRef.value.abort('Operation canceled by the user.');
      cancelTimeoutRef.value = 0;
    };

    const sendTimeoutRequest = (timeout = 5000) => {
      timeoutRef.value = timeout / 1000;
      const timer = window.setInterval(() => {
        timeoutRef.value > 0 && (timeoutRef.value -= 1);
      }, 1000);
      registApi
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

    const sendErrorRequest = (catchError = true) => {
      registApi
        .error400({
          catchError,
        })
        .catch((err: Error) => {
          alert(`local error handler: ${err.message}`);
        });
    };

    const sendLoadingRequret = (loading = true) => {
      registApi
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

    const localLoadingRef = ref(false);
    const sendLocalLoadingRequret = () => {
      registApi
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

    const sendRetryRequest = (retry = true) => {
      registApi
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

    const sendLocalRetryRequest = () => {
      registApi
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

    const sendNoDelayRetryRequest = () => {
      registApi
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
            <p>timeout: {cancelTimeoutRef.value}</p>
            <input type="button" value="Submit" onClick={() => sendRequest()}></input> &nbsp;
            {cancelTimeoutRef.value > 0 && <input type="button" value="Cancel" onClick={() => cancelRequest()}></input>}
          </div>
          <div>
            <p>timeout: {timeoutRef.value}</p>
            <input type="button" value="Timeout 5s" onClick={() => sendTimeoutRequest()}></input> &nbsp;
          </div>
          <div>
            <input type="button" value="Local Catch Error" onClick={() => sendErrorRequest(false)}></input> &nbsp;
            <input type="button" value="Global Catch Error" onClick={() => sendErrorRequest(true)}></input> &nbsp;
          </div>
          <div>
            {localLoadingRef.value && <p>Local Loading...</p>}
            <input type="button" value="Local Loading" onClick={() => sendLocalLoadingRequret()}></input> &nbsp;
            <input type="button" value="Global Loading" onClick={() => sendLoadingRequret(true)}></input> &nbsp;
            <input type="button" value="No Loading（5s）" onClick={() => sendLoadingRequret(false)}></input> &nbsp;
          </div>
          <div>
            <p>trun off network in the devtools</p>
            <input type="button" value="Local Retry(1 times)" onClick={() => sendLocalRetryRequest()}></input> &nbsp;
            <input type="button" value="Global Retry(5 times)" onClick={() => sendRetryRequest(true)}></input> &nbsp;
            <input type="button" value="No Retry" onClick={() => sendRetryRequest(false)}></input> &nbsp;
            <input type="button" value="No Delay Retry(3 times)" onClick={() => sendNoDelayRetryRequest()}></input>{' '}
            &nbsp;
          </div>
        </div>
      );
    };
  },
});
