import {
  computed,
  CSSProperties,
  defineComponent,
  nextTick,
  onMounted,
  reactive,
} from 'vue'
import { useExpose, useParent } from '~/hooks'

import { SWIPE_KEY } from '../Swipe/Swipe'

const SwipeItem = defineComponent({
  name: 'SwipeItem',
  slots: ['default'],
  setup(_, { slots }) {
    let rendered = false

    const state = reactive({
      offset: 0,
      inited: false,
      mounted: false,
    })

    const { parent, index } = useParent(SWIPE_KEY)

    if (!parent) {
      if (import.meta.env) {
        console.error('<SwipeItem> must be a child component of <Swipe>.')
      }
      return
    }

    const style = computed(() => {
      const style: CSSProperties = {}
      const { vertical } = parent.props

      if (parent.size.value) {
        style[vertical ? 'height' : 'width'] = `${parent.size.value}px`
      }

      if (state.offset) {
        style.transform = `translate${vertical ? 'Y' : 'X'}(${state.offset}px)`
      }

      return style
    })

    const shouldRender = computed(() => {
      const { loop } = parent.props

      if (!state.mounted) {
        return false
      }

      const active = parent.activeIndicator.value
      const maxActive = parent.count.value - 1
      const prevActive = active === 0 && loop ? maxActive : active - 1
      const nextActive = active === 0 && loop ? 0 : active + 1
      rendered =
        index.value === active ||
        index.value === prevActive ||
        index.value === nextActive

      return rendered
    })

    const setOffset = (offset: number) => {
      state.offset = offset
    }

    onMounted(() => {
      nextTick(() => {
        state.mounted = true
      })
    })

    useExpose({ setOffset })

    return () => {
      return (
        <div class="swipe-item" style={style.value}>
          {shouldRender.value ? slots.default?.() : null}
        </div>
      )
    }
  },
})

export default SwipeItem
