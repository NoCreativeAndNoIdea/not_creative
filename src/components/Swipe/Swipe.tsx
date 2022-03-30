import {
  computed,
  CSSProperties,
  defineComponent,
  InjectionKey,
  nextTick,
  onActivated,
  onBeforeUnmount,
  onDeactivated,
  onMounted,
  reactive,
  ref,
  watch,
} from 'vue'
import { useChildren, useExpose, useTouch, usePageVisibility } from '~/hooks'
import {
  MoveOptions,
  SwipeExpose,
  swipeProps,
  SwipeProvide,
  SwipeState,
  SwipeToOptions,
} from './type'
import { clamp } from '~/utils/format'
import { doubleRaf } from '~/utils/doubleRaf'
import { isHidden } from '~/utils'
import { preventDefault, windowHeight, windowWidth } from '~/utils/dom'

const name = 'Swipe'

export const SWIPE_KEY: InjectionKey<SwipeProvide> = Symbol(name)

const Swipe = defineComponent({
  name,
  props: swipeProps,
  emits: ['on-change'],
  setup: (props, { slots, emit }) => {
    const root = ref<HTMLElement>()
    const state = reactive<SwipeState>({
      rect: null,
      width: 0,
      height: 0,
      offset: 0,
      active: 0,
      swiping: false,
    })

    const touch = useTouch()

    const { children, likeChildren } = useChildren(SWIPE_KEY)

    const count = computed(() => children.length)

    const size = computed(() => state[props.vertical ? 'height' : 'width'])

    const delta = computed(() =>
      props.vertical ? touch.deltaY.value : touch.deltaX.value
    )
    const minOffset = computed(() => {
      if (state.rect) {
        const base = props.vertical
          ? state.rect.height ?? 0
          : state.rect.width ?? 0
        return base - count.value * size.value
      }
      return 0
    })

    const maxCount = computed(
      () => Math.ceil(Math.abs(minOffset.value)) / size.value
    )

    const trackSize = computed(() => count.value * size.value)

    const activeIndicator = computed(() => {
      return (state.active + count.value) % count.value
    })

    const isCorrectDirection = computed(() => {
      const expect = props.vertical ? 'vertical' : 'horizontal'
      return touch.direction.value === expect
    })

    const trackStyle = computed(() => {
      const style: CSSProperties = {
        transitionDuration: `${state.swiping ? 0 : props.duration}ms`,
        transform: `translate${props.vertical ? 'Y' : 'X'}(${state.offset}px)`,
      }

      if (size.value) {
        const mainAxis = props.vertical ? 'height' : 'width'
        const crossAxis = props.vertical ? 'width' : 'height'
        style[mainAxis] = `${trackSize.value}px`
        style[crossAxis] = props[crossAxis] ? `${props[crossAxis]}px` : ''
      }

      return style
    })

    const getTargetActive = (pace: number) => {
      const { active } = state
      if (pace) {
        if (props.loop) {
          return clamp(active + pace, -1, count.value)
        }

        return clamp(active + pace, 0, maxCount.value)
      }
      return active
    }

    const getTargetOffset = (targetActive: number, offset = 0) => {
      let currentPosition = targetActive * size.value
      if (!props.loop) {
        currentPosition = Math.min(currentPosition, -minOffset.value)
      }
      let targetOffset = offset - currentPosition
      if (!props.loop) {
        targetOffset = clamp(targetOffset, minOffset.value, 0)
      }

      return targetOffset
    }

    const move = ({ pace = 0, offset = 0, emitChange }: MoveOptions) => {
      if (count.value <= 1) return
      const { active } = state
      const targetActive = getTargetActive(pace)
      const targetOffset = getTargetOffset(targetActive, offset)

      if (props.loop) {
        if (children[0] && targetOffset !== minOffset.value) {
          const outRightBound = targetOffset < minOffset.value
          children[0].setOffset(outRightBound ? trackSize.value : 0)
        }

        if (children[count.value - 1] && targetOffset !== 0) {
          const outLeftBound = targetOffset > 0
          children[count.value - 1].setOffset(
            outLeftBound ? -trackSize.value : 0
          )
        }
      }

      state.active = targetActive
      state.offset = targetOffset

      if (emitChange && targetActive !== active) {
        emit('on-change', activeIndicator.value)
      }
    }

    const correctPosition = () => {
      state.swiping = true

      if (state.active <= -1) {
        move({ pace: count.value })
      } else if (state.active >= count.value) {
        move({ pace: -count.value })
      }
    }

    const to = (type: 'next' | 'prev' = 'next') => {
      correctPosition()
      touch.reset()
      doubleRaf(() => {
        state.swiping = false
        move({
          pace: type === 'next' ? 1 : -1,
          emitChange: true,
        })
      })
    }

    const next = () => to('next')
    const prev = () => to('prev')

    let autoplayTimer: NodeJS.Timeout

    const stopAutoplay = () => clearTimeout(autoplayTimer)

    const autoplay = () => {
      stopAutoplay()
      if (props.autoplay > 0 && count.value > 1) {
        autoplayTimer = setTimeout(() => {
          next()
          autoplay()
        }, +props.autoplay)
      }
    }

    const inititalze = (active = +props.initialSwipe) => {
      if (!root.value) return

      const cb = () => {
        if (!isHidden(root)) {
          const rect = {
            width: root.value!.offsetWidth,
            height: root.value!.offsetHeight,
          }

          state.rect = rect
          state.width = +(props.width ?? rect.width)
          state.height = +(props.height ?? rect.height)

          if (count.value) {
            active = Math.min(count.value - 1, active)
          }

          state.active = active
          state.swiping = true
          state.offset = getTargetOffset(active)
          children.forEach((swipe) => {
            swipe.setOffset(0)
          })

          autoplay()
        }
      }

      if (isHidden(root)) {
        nextTick().then(cb)
      } else {
        cb()
      }
    }

    const resize = () => inititalze()

    let touchStartTime: number
    const onTouchStart = (event: TouchEvent) => {
      if (!props.touchable) return
      touch.start(event)
      touchStartTime = Date.now()
      stopAutoplay()
      correctPosition()
    }

    const onTouchMove = (event: TouchEvent) => {
      if (props.touchable && state.swiping) {
        touch.move(event)

        if (isCorrectDirection.value) {
          preventDefault(event, props.stopPropagation)
          move({ offset: delta.value })
        }
      }
    }

    const onTouchEnd = () => {
      if (!props.touchable || !state.swiping) return

      const duration = Date.now() - touchStartTime

      const speed = delta.value / duration
      const shouldSwipe =
        Math.abs(speed) > 0.25 || Math.abs(delta.value) > size.value / 2

      if (shouldSwipe && isCorrectDirection.value) {
        const offset = props.vertical
          ? touch.offsetY.value
          : touch.offsetX.value
        let pace = 0
        if (props.loop) {
          pace = offset > 0 ? (delta.value > 0 ? -1 : 1) : 0
        } else {
          pace = -Math[delta.value > 0 ? 'ceil' : 'floor'](
            delta.value / size.value
          )
        }

        move({ pace, emitChange: true })
      } else if (delta.value) {
        move({ pace: 0 })
      }

      state.swiping = false
      autoplay()
    }

    const swipeTo = (index: number, options: SwipeToOptions = {}) => {
      correctPosition()
      touch.reset()

      doubleRaf(() => {
        let targetIndex
        if (props.loop && index === count.value) {
          targetIndex = state.active === 0 ? 0 : index
        } else {
          targetIndex = index % count.value
        }

        if (options.immediate) {
          doubleRaf(() => (state.swiping = false))
        } else {
          state.swiping = false
        }

        move({
          pace: targetIndex - state.active,
          emitChange: true,
        })
      })
    }

    useExpose<SwipeExpose>({
      prev,
      next,
      state,
      resize,
      swipeTo,
    })

    likeChildren({
      size,
      props,
      count,
      activeIndicator,
    })

    watch(
      () => props.initialSwipe,
      (val) => inititalze(val as number)
    )

    watch(count, () => inititalze(state.active))
    watch(() => props.autoplay, autoplay)
    watch([windowWidth, windowHeight], resize)
    watch(usePageVisibility, (visible) => {
      if (visible.value === 'hidden') {
        stopAutoplay()
      } else {
        autoplay()
      }
    })

    onMounted(inititalze)
    onActivated(() => inititalze(state.active))
    onDeactivated(stopAutoplay)
    onBeforeUnmount(stopAutoplay)

    return () => {
      const swipeTrackClasses = () => {
        const vertical = props.vertical ? 'swipe__track--vertical' : ''
        return `swipe__track ${vertical}`
      }
      return (
        <div ref={root} class="swipe">
          <div
            style={trackStyle.value}
            class={swipeTrackClasses()}
            onTouchstart={onTouchStart}
            onTouchmove={onTouchMove}
            onTouchend={onTouchEnd}
            onTouchcancel={onTouchEnd}
          >
            {slots?.default?.()}
          </div>
        </div>
      )
    }
  },
})

export default Swipe
