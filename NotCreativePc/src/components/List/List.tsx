import {
  ref,
  nextTick,
  watch,
  toRefs,
  onUpdated,
  onMounted,
  defineComponent
} from "vue"
import {isHidden} from "~/utils"
import {
  useExpose,
  useRect,
  useEventListener,
  useScrollParent
} from "~/hooks"
import {ListExpose} from "./type"
import "./list.scss"


export interface ListProps {
  error?: boolean,
  offset?: Number | String,
  loading?:boolean,
  finished?:boolean,
  errorText?:string,
  loadingText?:string,
  finishedText?:string,
  immediateCheck?: boolean,
}

const List = defineComponent<ListProps>({
  name:'List',
  props:['error','offset','loading','finished','errorText','loadingText','finishedText','immediateCheck'] as any,
  emits: ['on-load','update:error','update:loading'],
  setup(props,{emit,slots}){
    const loading = ref<boolean>(false);
    const root = ref<HTMLElement>()
    const placeholder = ref<HTMLElement>()
    const scrollParent = useScrollParent(root)
    const {immediateCheck = true as const} = toRefs(props)

    const check = () => {
      nextTick(() => {
        if(loading.value || props.finished || props.error) return

        let {offset = 300} = props;
        if(typeof offset === 'string'){
          offset  = Number(offset) 
        }
        const scrollParentRect = useRect(scrollParent)

        if(!scrollParentRect.height || isHidden(root)) return

        let isReachEdge = false;
        const placeholderRect = useRect(placeholder)

        isReachEdge = placeholderRect.bottom - scrollParentRect.bottom <= offset
        if(isReachEdge) {
          loading.value = true
          emit('update:loading',true)
          emit('on-load')
        }
      })
    }

    // render finished style or text
    const renderFinishedText = () => {
      if(props.finished){
        const text = slots.finished ? slots.finished() : props.finishedText;
        if(text){
          return <div class='list__finished-text'>{text}</div>
        }
      }
    }

    // Loading error Click to load again
    // 加载错误再次点击加载
    const handleClickErrorText = () => {
      emit('update:error',false)
      check()
    }

    // Loading error element or text
    const renderErrorText = () => {
      if(props.error){
        const text = slots.error ? slots.error() : props.errorText;
        if(text){
          return (
            <div 
              role='button'
              class='list__error-text' 
              tabindex={0} 
              onClick={handleClickErrorText}
            >
              {text}
            </div>
          )
        }
      }
    }


    // TODO: 后续引入loading组件 
    // render loading element or text
    const renderLoading = () => {
      if(loading.value && !props.finished){
        return (
          <div
            class='list__loading'
          >
            {
              slots.loading ? slots.loading() : 'loading'
            }
          </div>
        )
      }
    }


    watch(() => [props.loading,props.finished,props.error],check)

    onUpdated(() => {
      loading.value = props.loading!
    })

    onMounted(() => {
      if(immediateCheck){
        check()
      }
    })

    useExpose<ListExpose>({check})

    useEventListener('scroll', check,{target:scrollParent})

    return () => {
      const Content = slots.default?.()
      const Placeholder = <div ref={placeholder} class="list__placeholder" />

      return (
        <div ref={root} role="feed" class="list" aria-busy={loading.value}>
          {Content}
          {renderLoading()}
          {renderFinishedText()}
          {renderErrorText()}
          {Placeholder}
        </div>
      )
    }
  }
})

export default List;