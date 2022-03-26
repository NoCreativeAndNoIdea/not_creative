
import { 
  defineComponent, 
  computed, 
  onMounted, 
  onUnmounted, 
  watch, 
  StyleValue,
  Teleport
} from 'vue';
import { Key } from '~/utils/types';
import  classNames from '~/utils/classNames';

export interface NoticeProps{
  prefixCls: string;
  noticeKey: Key;
  duration?: number;
  holder?: HTMLDivElement;
  visible?: boolean;
  closable?:boolean;
  closeIcon?:any;
  onClick?: (e:MouseEvent) => void;
  onClose?: (key:Key) => void;
}

const Notice = defineComponent<NoticeProps>({
  name: "Notice",
  inheritAttrs: false,
  props: [
    "prefixCls",
    "noticeKey",
    "duration",
    "holder",
    "visible",
    "onClick",
    "onClose",
    "closable",
    "closeIcon"
  ] as any,
  setup(props,{attrs,slots}){
    let closeTimer:NodeJS.Timeout | null;
    const duration = computed(() => props.duration ? props.duration : 1.5);
    const startCloseTimer = () => {
      if(duration.value){
        closeTimer = setTimeout(() => {
          close();
        }, duration.value * 1000);
      }
    }

    const clearCloseTimer = () => {
      if(closeTimer){
        clearTimeout(closeTimer)
        closeTimer = null
      }
    }

    const restartCloseTimer = () => {
      clearCloseTimer()
      startCloseTimer()
    }

    const close = (e?:MouseEvent) => {
      if(e) e.stopPropagation()
      clearCloseTimer()
      const {onClose,noticeKey} = props;
      if(onClose){onClose(noticeKey)}
    }


    onMounted(() => {
      startCloseTimer()
    })

    onUnmounted(() => {
      clearCloseTimer()
    })


    watch(
      [duration,() => props.visible],
      ([preDuration,preVisible],[newDuration,newVisible]) => {
        if(preDuration !== newDuration || preVisible !== newVisible){
          restartCloseTimer()
        }
      },
      {flush: 'post'}  
    )

    return () => {
      const {onClick,holder,closable,prefixCls,closeIcon} = props;
      const componentClass = `${prefixCls}-notice`
      const {class:className,style} = attrs;
      const dataOrAriaAttributeProps = Object.keys(attrs).reduce(
        (acc: Record<string,string>,key: string) => {
          if (key.substr(0, 5) === 'data-' || key.substr(0, 5) === 'aria-' || key === 'role') {
            acc[key] = (attrs as any)[key];
          }
          return acc;
        },
        {}
      )

      const node = (
        <div
          class={classNames(componentClass,className,{
            [`${componentClass}-closable`] : closable
          })}
          style={style as StyleValue}
          onMouseenter={clearCloseTimer}
          onMouseleave={startCloseTimer}
          onClick={onClick}
          {...dataOrAriaAttributeProps}
        >
          <div class={`${componentClass}-content`}>{slots.default?.()}</div>
          {
            closable ? (
              <a tabindex={0} onClick={close} class={`${componentClass}-close`}>
                {closeIcon || <span class={`${componentClass}-close-x`}></span>  }
              </a>
            ) : null
          }
        </div>
      )

      if(holder){
        return <Teleport to={holder} v-slots={{default: () => node}}></Teleport>
      }

      return node
    }

  }
})

export default Notice;