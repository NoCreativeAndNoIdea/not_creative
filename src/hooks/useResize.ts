import { toRefs, reactive } from 'vue'
import useListener from '~/hooks/useListener'

export default () => {
  const state = reactive({
    width: window.document.body.offsetWidth,
    height: window.document.body.offsetHeight,
  })

  const resize = () => {
    const body = window.document.body || document.body
    const { offsetWidth, offsetHeight } = body
    Object.assign(state, {
      width: offsetWidth,
      height: offsetHeight,
    })
  }

  useListener('resize', resize)

  return {
    resize,
    ...toRefs(state),
  }
}
