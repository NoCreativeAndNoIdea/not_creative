import { computed, defineComponent } from 'vue'
import { loadingProps } from './type'
import { getStyleSize, addUnit } from '~/utils/format'

const SpinnerIcon = new Array(12)
  .fill(null)
  .map((_, index) => (
    <i class={`loading__line loading__line--${String(index + 1)}`} />
  ))

const CircleIcon = (
  <svg class="loading__circular" viewBox="25 25 50 50">
    <circle cx="50" cy="50" r="20" fill="none" />
  </svg>
)

const Loading = defineComponent({
  name: 'Loading',
  props: loadingProps,
  slots: ['default'],
  setup(props, { slots }) {
    const getSpinnerStyle = computed(() => ({
      color: props.color,
      ...getStyleSize(props.size),
    }))

    const renderText = () => {
      if (slots.default) {
        const style = {
          fontSize: addUnit(props.textSize),
          color: props.textColor || props.color,
        }
        return (
          <span class="loading__text" style={style}>
            {slots.default?.()}
          </span>
        )
      }
    }

    return () => {
      const { type, vertical } = props
      const verticalClass = vertical ? 'loading--vertical' : ''
      const loadingClass = `loading__spinner loading__spinner--${type} ${verticalClass}`
      return (
        <div class="loading">
          <span class={loadingClass} style={getSpinnerStyle.value}>
            {type === 'spinner' ? SpinnerIcon : CircleIcon}
          </span>
          {renderText()}
        </div>
      )
    }
  },
})

export default Loading
