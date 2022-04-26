export type MobileDeviceType = {
  type: 'mobile' | 'ios' | 'android';
  env?: 'wechat' | 'wxwork' | 'dingtalk' | 'feishu' | 'weibo' | 'qq';
  masklayer?: boolean;
};

export type PcDeviceType = {
  type: 'pc';
  env?: 'wechat' | 'wxwork' | 'dingtalk' | 'feishu';
};

export type DeviceType = MobileDeviceType | PcDeviceType;

export function isWechat(ua: string = navigator.userAgent) {
  return /MicroMessenger/i.test(ua) && !/wxwork/i.test(ua);
}

export function isWechatWork(ua: string = navigator.userAgent) {
  return /wxwork/i.test(ua) && !/MicroMessenger/i.test(ua);
}

export function isWeibo(ua: string = navigator.userAgent) {
  return /Weibo/i.test(ua);
}

export function isQQ(ua: string = navigator.userAgent) {
  return /QQ/i.test(ua);
}

export function isDingTalk(ua: string = navigator.userAgent) {
  return /DingTalk/i.test(ua);
}

export function isFeiShu(ua: string = navigator.userAgent) {
  return /Lark/i.test(ua);
}

export function isMoible(ua: string = navigator.userAgent) {
  return /(Android|webOS|iPhone|iPod|tablet|BlackBerry|Mobile)/i.test(ua);
}

export function isIOS(ua: string = navigator.userAgent) {
  return /iPhone|iPad|iPod/i.test(ua);
}

export function isAndroid(ua: string = navigator.userAgent) {
  return /Android/i.test(ua);
}

/**
 *
 * @param {*} ua ,就是userAgent
 * @returns  type: 设备类型
 *           env: 访问环境(微信/微博/qq)
 *           masklayer: 就是给外部拿到判断是否显示遮罩层的,一些特殊环境要引导用户到外部去打开访问
 */
export function deviceType(ua: string = navigator.userAgent): DeviceType {
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
      } else if (isFeiShu(ua)) {
        return {
          type: 'ios',
          env: 'feishu',
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
      } else if (isDingTalk(ua)) {
        return {
          type: 'android',
          env: 'dingtalk',
          masklayer: true,
        };
      } else if (isFeiShu(ua)) {
        return {
          type: 'android',
          env: 'feishu',
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
      };
    } else if (isFeiShu(ua)) {
      return {
        type: 'pc',
        env: 'feishu',
      };
    } else if (isWechat(ua)) {
      return {
        type: 'pc',
        env: 'wechat',
      };
    } else if (isWechatWork(ua)) {
      return {
        type: 'pc',
        env: 'wxwork',
      };
    } else {
      return {
        type: 'pc',
      };
    }
  }
}
