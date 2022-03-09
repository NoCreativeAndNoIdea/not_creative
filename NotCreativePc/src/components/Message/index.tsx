import type {NotificationInstance} from "~/components/Notification/Notification"
import Notification from '~/components/Notification';
import type { StyleValue } from 'vue';
import type {VueNode,Key} from "~/utils/types"
import classNames from '~/utils/classNames';
import "./index.scss"

let key = 1;
let defaultDuration = 3;
let defaultTop: string;
let localPrefixCls = '';
let transitionName = 'move-up';
let hasTransitionName = false;
let getContainer = () => document.body;
let maxCount: number;
let rtl = false;
let messageInstance: NotificationInstance | null;

type NoticeType = 'info' | 'success' | 'error' | 'warning' | 'loading';

export function getKeyThenIncreaseKey() {
  return key++;
}

export interface ConfigOptions {
  top?: string;
  duration?: number;
  prefixCls?: string;
  getContainer?: () => HTMLElement;
  transitionName?: string;
  maxCount?: number;
  rtl?: boolean;
}

export interface ThenableArgument {
  (val: any): void;
}

export interface MessageType extends PromiseLike<any> {
  (): void;
}

export interface MessageArgsProps {
  content: string | (() => VueNode) | VueNode;
  duration?: number;
  type?: NoticeType;
  prefixCls?: string;
  rootPrefixCls?: string;
  onClose?: () => void;
  icon?: (() => VueNode) | VueNode;
  key?: string | number;
  style?: StyleValue;
  class?: string;
  appContext?: any;
  onClick?: (e: MouseEvent) => void;
}

function setMessageConfig(options: ConfigOptions) {
  if (options.top !== undefined) {
    defaultTop = options.top;
    messageInstance = null; // delete messageInstance for new defaultTop
  }
  if (options.duration !== undefined) {
    defaultDuration = options.duration;
  }

  if (options.prefixCls !== undefined) {
    localPrefixCls = options.prefixCls;
  }
  if (options.getContainer !== undefined) {
    getContainer = options.getContainer;
  }
  if (options.transitionName !== undefined) {
    transitionName = options.transitionName;
    messageInstance = null; // delete messageInstance for new transitionName
    hasTransitionName = true;
  }
  if (options.maxCount !== undefined) {
    maxCount = options.maxCount;
    messageInstance = null;
  }
  if (options.rtl !== undefined) {
    rtl = options.rtl;
  }
}


function getMessageInstance(args:any,callback: (i: NotificationInstance) => void){
  if (messageInstance) {
    callback(messageInstance);
    return;
  }
  Notification.newInstance(
    {
      appContext: args.appContext,
      prefixCls: args.prefixCls || localPrefixCls,
      rootPrefixCls: args.rootPrefixCls,
      transitionName,
      hasTransitionName,
      style: { top: defaultTop }, // 覆盖原来的样式
      getContainer,
      maxCount,
      name: 'message',
    },
    (instance: any) => {
      if (messageInstance) {
        callback(messageInstance);
        return;
      }
      messageInstance = instance;
      callback(instance);
    },
  );
}

function notice(args: MessageArgsProps): MessageType{
  const duration = args.duration ? args.duration : defaultDuration;

  const target = args.key || getKeyThenIncreaseKey();
  const closePromise = new Promise( resolve => {
    const callback = () => {
      if(typeof args.onClose === 'function'){
        args.onClose?.()
      }
      return resolve(true)
    }

    getMessageInstance(args,instance => {
      instance.notice({
        key:target,
        duration,
        style: args.style || {},
        class: args.class,
        content: ({prefixCls}:{prefixCls:string}) => {
          const messageClass = classNames(`${prefixCls}-custom-content`,{
            [`${prefixCls}-${args.type}`]: args.type,
            [`${prefixCls}-rtl`]: rtl === true,
          })
          return (
            <div class={messageClass}>
              <span>{typeof args.content === 'function' ? args.content() : args.content}</span>  
            </div>
          )
        },
        onClose: callback,
        onClick: args.onClick
      })
    })
  })

  const result: any = () => {
    if(messageInstance){
      messageInstance.removeNotice(target)
    }
  }

  result.then = (filled: ThenableArgument, rejected: ThenableArgument) => closePromise.then(filled,rejected)
  result.promise = closePromise
  return result;
}


type ConfigDuration = number;
type JointContent = VueNode | MessageArgsProps;
export type ConfigOnClose = () => void;

function isArgsProps(content: JointContent): content is MessageArgsProps {
  return (
    Object.prototype.toString.call(content) === '[object Object]' &&
    !!(content as MessageArgsProps).content
  );
}

const api: any = {
  open: notice,
  config: setMessageConfig,
  destroy(messageKey?: Key) {
    if (messageInstance) {
      if (messageKey) {
        const { removeNotice } = messageInstance;
        removeNotice(messageKey);
      } else {
        const { destroy } = messageInstance;
        destroy();
        messageInstance = null;
      }
    }
  },
};

export function attachTypeApi(originalApi: MessageApi, type: NoticeType) {
  originalApi[type] = (
    content: JointContent,
    duration?: ConfigDuration,
    onClose?: ConfigOnClose,
  ) => {
    if (isArgsProps(content)) {
      return originalApi.open({ ...content, type });
    }

    if (typeof duration === 'function') {
      onClose = duration;
      duration = undefined;
    }

    return originalApi.open({ content, duration, type, onClose });
  };
}

(['success', 'info', 'warning', 'error', 'loading'] as NoticeType[]).forEach(type =>
  attachTypeApi(api, type),
);

api.warn = api.warning;

export interface MessageInstance {
  info(content: JointContent, duration?: ConfigDuration, onClose?: ConfigOnClose): MessageType;
  success(content: JointContent, duration?: ConfigDuration, onClose?: ConfigOnClose): MessageType;
  error(content: JointContent, duration?: ConfigDuration, onClose?: ConfigOnClose): MessageType;
  warning(content: JointContent, duration?: ConfigDuration, onClose?: ConfigOnClose): MessageType;
  loading(content: JointContent, duration?: ConfigDuration, onClose?: ConfigOnClose): MessageType;
  open(args: MessageArgsProps): MessageType;
}

export interface MessageApi extends MessageInstance {
  warn(content: JointContent, duration?: ConfigDuration, onClose?: ConfigOnClose): MessageType;
  config(options: ConfigOptions): void;
  destroy(messageKey?: Key): void;
}

/** @private test Only function. Not work on production */
export const getInstance = () => (process.env.NODE_ENV === 'dev' ? messageInstance : null);

export default api as MessageApi;
