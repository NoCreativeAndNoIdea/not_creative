import {
  defineComponent,
  StyleValue,
  ref,
  computed,
  TransitionGroup,
  onMounted,
  render as vueRender,
  createVNode,
} from 'vue'
import { Key } from '~/utils/types'
import { NoticeProps } from '~/components/Notification/Notice'
import { getTransitionGroupProps } from '~/utils/transition'
import Notice from './Notice'
import getUuid from '~/utils/getUuid'

export interface NoticeContent
  extends Omit<NoticeProps, 'prefixCls' | 'noticeKey' | 'onClose'> {
  prefixCls?: string
  key?: Key
  content?: any
  onClose?: () => void
  style?: StyleValue
  class?: string
}

export type NoticeFunc = (noticeProps: NoticeContent) => void
export type HolderReadyCallback = (
  div: HTMLDivElement,
  noticeProps: NoticeProps & { key: Key }
) => void

export interface NotificationInstance {
  notice: NoticeFunc
  removeNotice: (key: Key) => void
  destroy: () => void
  component: Notification
}

export interface NotificationProps {
  prefixCls?: string
  transitionName?: string
  animation?: string | object
  maxCount?: number
  closeIcon?: any
}

interface NotificationState {
  notice: NoticeContent & {
    userPassKey?: Key
  }
  holderCallback?: HolderReadyCallback
}

const Notification = defineComponent<NotificationProps>({
  name: 'Notification',
  inheritAttrs: false,
  props: [
    'prefixCls',
    'transitionName',
    'animation',
    'maxCount',
    'closeIcon',
  ] as any,
  setup(props, { attrs, expose, slots }) {
    const hookRefs = new Map<Key, HTMLDivElement>()

    const notices = ref<NotificationState[]>([])

    const transitionProps = computed(() => {
      const { prefixCls, animation = 'fade' } = props
      let name = props.transitionName
      if (!name && animation) {
        name = `${prefixCls}-${animation}`
      }
      return getTransitionGroupProps(name as string)
    })

    const add = (
      originNotice: NoticeContent,
      holderCallback?: HolderReadyCallback
    ) => {
      const key = originNotice.key ?? getUuid()
      const notice: NoticeContent & { key: Key; userPassKey?: Key } = {
        ...originNotice,
        key,
      }

      const { maxCount } = props
      const noticeIndex = notices.value.map((v) => v.notice.key).indexOf(key)

      const updatedNotices = notices.value.concat()

      if (noticeIndex !== -1) {
        updatedNotices.splice(noticeIndex, 1, { notice, holderCallback } as any)
      } else {
        if (maxCount && notices.value.length >= maxCount) {
          notice.key = updatedNotices[0].notice.key as Key
          notice.userPassKey = key
          notice.userPassKey = key
          updatedNotices.shift()
        }
        updatedNotices.push({ notice, holderCallback } as any)
      }
      notices.value = updatedNotices
    }

    const remove = (removeKey: Key) => {
      notices.value = notices.value.filter(
        ({ notice: { key, userPassKey } }) => {
          const mergedKey = userPassKey || key
          return mergedKey !== removeKey
        }
      )
    }

    expose({
      add,
      remove,
      notices,
    })

    return () => {
      const { prefixCls, closeIcon = slots.closeIcon?.({ prefixCls }) } = props
      const noticeNodes = notices.value.map(
        ({ notice, holderCallback }, index) => {
          const { key, userPassKey, content } = notice
          // @ts-ignore
          const noticeProps = {
            prefixCls,
            closeIcon:
              typeof closeIcon === 'function'
                ? closeIcon({ prefixCls })
                : closeIcon,
            ...(notice as any),
            key,
            noticeKey: userPassKey || key,
            onClose: (noticeKey: Key) => {
              remove(noticeKey)
              notice.onClose?.()
            },
            onClick: notice.onClick,
          }

          if (holderCallback) {
            return (
              <div
                key={key}
                class={`${prefixCls}-hook-holder`}
                ref={(div) => {
                  if (typeof key === 'undefined') return

                  if (div) {
                    hookRefs.set(key, div as HTMLDivElement)
                    holderCallback(div as HTMLDivElement, noticeProps)
                  } else {
                    hookRefs.delete(key)
                  }
                }}
              />
            )
          }

          return (
            <Notice {...noticeProps}>
              {typeof content === 'function' ? content({ prefixCls }) : content}
            </Notice>
          )
        }
      )

      const className = {
        [prefixCls as string]: 1,
        [attrs.class as string]: !!attrs.class,
      }

      const style = (attrs.style as StyleValue) || {
        top: '65px',
        left: '50%',
      }

      return (
        <div class={className} style={style}>
          <TransitionGroup tag="div" {...transitionProps.value}>
            {noticeNodes}
          </TransitionGroup>
        </div>
      )
    }
  },
})

Notification.newInstance = function newNotificationInstance(
  properties: any,
  callback: (...args: any[]) => void
) {
  const {
    name = 'notification',
    getContainer,
    appContext,
    prefixCls: customizePrefixCls,
    rootPrefixCls: customRootPrefixCls,
    transitionName: customTransitionName,
    hasTransitionName,
    ...props
  } = properties || {}

  const div = document.createElement('div')
  if (getContainer) {
    const root = getContainer()
    root.appendChild(div)
  } else {
    document.body.appendChild(div)
  }

  const Wrapper = defineComponent({
    name: 'NotificationWrapper',
    setup(__props, { attrs }) {
      const noticeRef = ref()
      onMounted(() => {
        callback({
          notice(noticeProps: NoticeContent) {
            noticeRef.value?.add(noticeProps)
          },
          removeNotice(key: Key) {
            noticeRef.value?.remove(key)
          },
          destroy() {
            vueRender(null, div)
            if (div.parentNode) {
              div.parentNode.removeChild(div)
            }
          },
          component: noticeRef,
        })
      })

      return () => {
        return (
          <Notification
            ref={noticeRef}
            {...attrs}
            prefixCls={name}
            transitionName={customTransitionName}
          />
        )
      }
    },
  })

  const vm = createVNode(Wrapper, props)
  vm.appContext = appContext || vm.appContext
  vueRender(vm, div)
}

export default Notification
