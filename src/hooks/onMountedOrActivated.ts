import { Fn } from './../utils/types'
import { onMounted, nextTick, onActivated } from 'vue'

export function onMountedOrActivated(hook: Fn): void {
  let mounted: boolean

  onMounted(() => {
    hook()
    nextTick(() => {
      mounted = true
    })
  })

  onActivated(() => {
    if (mounted) {
      hook()
    }
  })
}
