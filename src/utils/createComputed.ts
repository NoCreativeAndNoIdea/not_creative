import { computed } from 'vue'
import type { Ref } from 'vue'
export default <T>(state: Ref<T>): Ref<T> =>
  computed<T>({
    get() {
      return state.value
    },
    set(val: T) {
      state.value = val
    },
  })
