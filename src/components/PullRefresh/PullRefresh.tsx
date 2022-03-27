import { ref, watch, toRefs, nextTick, reactive, defineComponent } from 'vue'
import {
  TEXT_STATUS,
  DEFAULT_HEAD_HEIGHT,
  PullRefreshState,
  pullRefreshProps,
} from './type'
import { getScrollTop, preventDefault } from '~/utils/dom'
import { useTouch, useScrollParent } from '~/hooks'

import Loading from '../Loading'

const PullRefresh = defineComponent({
  name: 'PullRefresh',
  props: pullRefreshProps,
  emits: ['on-refresh', 'update:modelValue'],
  slots: ['default'],
  setup(props, { emit, slots }) {
    let reachTop: boolean
    const root = ref<HTMLElement>()
    const scrollParent = useScrollParent(root)

    const touch = useTouch()

    const state = reactive<PullRefreshState>({
      status: 'normal',
      distance: 0,
      duration: 0,
    })

    const getHeadStyle = () => {
      if (props.headHeight !== DEFAULT_HEAD_HEIGHT) {
        return {
          height: `${props.headHeight}px`,
        }
      }
    }

    const isTouchable = () =>
      state.status !== 'loading' &&
      state.status !== 'success' &&
      !props.disabled

    const calculatePullDistance = () => {
      const { pullDistance, headHeight } = toRefs(props)
      return Number(Number(pullDistance.value) || Number(headHeight.value))
    }

    const ease = (distance: number) => {
      const _pullDistance = calculatePullDistance()

      if (distance > _pullDistance) {
        if (distance < _pullDistance * 2) {
          distance = _pullDistance + (distance - _pullDistance) / 2
        } else {
          distance = _pullDistance * 1.5 + (distance - _pullDistance * 2) / 4
        }
      }
      return Math.round(distance)
    }

    const setStatus = (distance: number, isLoading?: boolean) => {
      const _pullDistance = calculatePullDistance()
      state.distance = distance

      if (isLoading) {
        state.status = 'loading'
      } else if (distance === 0) {
        state.status = 'normal'
      } else if (distance < _pullDistance) {
        state.status = 'pulling'
      } else {
        state.status = 'loosing'
      }
    }

    const getStatusText = () => {
      const { status } = state
      if (status === 'normal') return ''
      return props[`${status}Text`] || status
    }

    const renderStatus = () => {
      const { status, distance } = state

      if (slots[status]) {
        return slots[status]!({ distance })
      }

      // eslint-disable-next-line no-undef
      const nodes: JSX.Element[] = []

      if (TEXT_STATUS.includes(status)) {
        nodes.push(<div class="pull-refresh__text">{getStatusText()}</div>)
      }

      if (status === 'loading') {
        nodes.push(
          <Loading
            v-slots={{ default: getStatusText }}
            class="pull-refresh__loading"
          />
        )
      }

      return nodes
    }

    const showSuccessTip = () => {
      const { successDuration } = toRefs(props)
      state.status = 'success'
      setTimeout(() => {
        setStatus(0)
      }, +Number(successDuration.value))
    }

    const checkPosition = (event: TouchEvent) => {
      reachTop = getScrollTop(scrollParent.value!) === 0
      if (reachTop) {
        state.duration = 0
        touch.start(event)
      }
    }

    const onTouchStart = (event: TouchEvent) => {
      if (isTouchable()) {
        checkPosition(event)
      }
    }

    const onTouchMove = (event: TouchEvent) => {
      if (isTouchable()) {
        if (!reachTop) {
          checkPosition(event)
        }

        const { deltaY } = touch
        touch.move(event)

        if (reachTop && deltaY.value >= 0 && touch.isVertical()) {
          preventDefault(event)
          setStatus(ease(deltaY.value))
        }
      }
    }

    const onTouchEnd = () => {
      if (reachTop && touch.deltaY.value && isTouchable()) {
        const { animationDuration, headHeight } = toRefs(props)
        state.duration = +Number(animationDuration.value)

        if (state.status === 'loosing') {
          setStatus(+Number(headHeight.value), true)
          emit('update:modelValue', true)
          nextTick(() => emit('on-refresh'))
        } else {
          setStatus(0)
        }
      }
    }

    watch(
      () => props.modelValue,
      (val) => {
        const { animationDuration, headHeight } = toRefs(props)
        state.duration = Number(animationDuration.value)
        if (val) {
          setStatus(Number(headHeight.value), true)
        } else if (slots.success || props.successText) {
          showSuccessTip()
        } else {
          setStatus(0, false)
        }
      }
    )

    return () => {
      const trackStyle = {
        transitionDuration: `${state.duration ?? 300}ms`,
        transform: state.distance ? `translate3d(0,${state.distance}px,0)` : '',
      }

      return (
        <div ref={root} class="pull-refresh">
          <div
            class="pull-refresh__track"
            style={trackStyle}
            onTouchstart={onTouchStart}
            onTouchmove={onTouchMove}
            onTouchend={onTouchEnd}
            onTouchcancel={onTouchEnd}
          >
            <div class="pull-refresh__head" style={getHeadStyle()}>
              {renderStatus()}
            </div>
            {slots.default?.()}
          </div>
        </div>
      )
    }
  },
})

export default PullRefresh
