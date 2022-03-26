import { ref, watch, computed, effect } from 'vue'
import useResize from '~/hooks/useResize'

export default () => {
  const baseSize = ref(100)
  const baseWidth = ref(750)
  const { width, resize } = useResize()
  const fontSize = computed(
    () => (width.value / baseWidth.value) * baseSize.value
  )

  watch(
    [width],
    ([preWidth], [newWidth]) => {
      if (preWidth !== newWidth) {
        baseWidth.value = newWidth
      }
    },
    {
      flush: 'post',
    }
  )

  const updateHtmlFontSize = () => {
    document.documentElement.style.fontSize = `${fontSize.value}px`
  }

  effect(() => {
    resize()
    updateHtmlFontSize()
  })

  return {
    baseSize,
    baseWidth,
    updateHtmlFontSize,
  }
}
