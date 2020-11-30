/**
 *
 * @param {*} ua ,就是userAgent
 * @returns  type: 设备类型
 *           env: 访问环境(微信/微博/qq)
 *           masklayer: 就是给外部拿到判断是否显示遮罩层的,一些特殊环境要引导用户到外部去打开访问
 */

export type MobileDeviceType = {
  type: 'mobild' | 'ios' | 'android';
  env?: 'wechat' | 'wxwork' | 'dingtalk' | 'webo' | 'qq';
  masklayer?: boolean;
};

export type PcDeviceType = {
  type: 'pc';
  env?: 'wechat' | 'wxwork' | 'dingtalk';
};

export type DeviceType = MobileDeviceType | PcDeviceType;

function isWechat(ua: string) {
  return /MicroMessenger/i.test(ua);
}

function isWechatWork(ua: string) {
  return /wxwork/i.test(ua);
}

function isWeibo(ua: string) {
  return /Weibo/i.test(ua);
}

function isQQ(ua: string) {
  return /QQ/i.test(ua);
}

function isDingTalk(ua: string) {
  return /DingTalk/i.test(ua);
}

function isMoible(ua: string) {
  return /(Android|webOS|iPhone|iPod|tablet|BlackBerry|Mobile)/i.test(ua);
}

function isIOS(ua: string) {
  return /iPhone|iPad|iPod/i.test(ua);
}

function isAndroid(ua: string) {
  return /Android/i.test(ua);
}
export function deviceType(ua: string) {
  if (isMoible(ua)) {
    if (isIOS(ua)) {
      if (isWechat(ua)) {
        return {
          type: 'ios',
          env: 'wechat',
          masklayer: true,
        };
      } else if (isWechatWork(ua)) {
        return {
          type: 'ios',
          env: 'wxwork',
          masklayer: true,
        };
      } else if (isWeibo(ua)) {
        return {
          type: 'ios',
          env: 'weibo',
          masklayer: true,
        };
      } else if (isQQ(ua)) {
        return {
          type: 'ios',
          env: 'qq',
          masklayer: true,
        };
      } else if (isDingTalk(ua)) {
        return {
          type: 'ios',
          env: 'dingtalk',
          masklayer: true,
        };
      } else {
        return {
          type: 'ios',
        };
      }
    } else if (isAndroid(ua)) {
      if (isWechat(ua)) {
        return {
          type: 'android',
          env: 'wechat',
          masklayer: true,
        };
      } else if (isWechatWork(ua)) {
        return {
          type: 'ios',
          env: 'wxwork',
          masklayer: true,
        };
      } else if (isWeibo(ua)) {
        return {
          type: 'android',
          env: 'weibo',
          masklayer: true,
        };
      } else if (isQQ(ua)) {
        return {
          type: 'android',
          env: 'qq',
          masklayer: true,
        };
      } else {
        return {
          type: 'android',
        };
      }
    } else {
      return {
        type: 'mobile',
      };
    }
  } else {
    if (isDingTalk(ua)) {
      return {
        type: 'pc',
        env: 'dingtalk',
        masklayer: true,
      };
    } else if (isWechat(ua)) {
      return {
        type: 'pc',
        env: 'wechat',
        masklayer: true,
      };
    } else if (isWechatWork(ua)) {
      return {
        type: 'pc',
        env: 'wxwork',
        masklayer: true,
      };
    } else {
      return {
        type: 'pc',
      };
    }
  }
}
