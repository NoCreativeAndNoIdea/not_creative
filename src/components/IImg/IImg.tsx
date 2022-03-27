import { ref, reactive, toRefs, computed, defineComponent } from 'vue'

import { iImgProps } from './type'
import { useIntersectionObserver } from '~/hooks'
import { isType } from '~/utils/checkType'

const defaultImg = new URL('./images/default.svg', import.meta.url).href

const IImg = defineComponent({
  name: 'IImg',
  props: iImgProps,
  setup(props) {
    const root = ref<Element>()
    const { width, height, lazy, alt } = toRefs(props)
    const imgSrc = ref(props.url ?? props.default ?? defaultImg)
    const state = reactive({
      loading: false,
      firstLoading: true,
      preLoading: false,
    })

    if (lazy.value) {
      const { cleanup } = useIntersectionObserver(
        root,
        ([{ isIntersecting }]) => {
          if (state.firstLoading && isIntersecting && !state.loading) {
            state.loading = isIntersecting
            state.firstLoading = false
            cleanup()
          }
        },
        {
          threshold: 0,
          rootMargin: '100px 0px',
        }
      )
    }

    const imgStyle = computed(() => {
      const __width = isType(width.value, 'Number')
        ? `${width.value}px`
        : width.value
      const __height = isType(height.value, 'Number')
        ? `${height.value}px`
        : height.value
      if (__width || __height) {
        return {
          width: __width,
          height: __height,
        }
      }
      return {}
    })

    const handleError = () => {
      if (state.loading) {
        imgSrc.value = defaultImg
      }
    }

    return () => {
      return (
        <img
          ref={root}
          class="i-img"
          style={imgStyle.value}
          src={state.loading ? imgSrc.value : ''}
          alt={alt.value}
          onError={handleError}
        />
      )
    }
  },
})

export default IImg
