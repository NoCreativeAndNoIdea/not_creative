import { ref, reactive, toRef, effect } from 'vue'
import type { Ref } from 'vue'

export type VirtualList = Array<{ [key: string]: any }>

export const useState = (list: VirtualList, bufferSize: number) => {
  const virtualListEl = ref<HTMLElement | null>(null)
  const listData: Ref<VirtualList> = ref([])
  const visibleList: Ref<VirtualList> = ref([])
  const firstAttacheItem: Ref<number> = ref(0)
  const lastAttacheItem: Ref<number> = ref(0)
  const scrollRunwayEnd: Ref<number> = ref(0)
  const visibleCount: Ref<number> = ref(0)
  const lastScrollTop = ref(0)
  let anchorItem = reactive({
    index: 0,
    offset: 0,
  })

  const callItemScrollY = (list: VirtualList) => {
    const latestIndex = list.length
    const newList = JSON.parse(JSON.stringify(list))
    for (let i = 0; i < newList.length; i++) {
      const item = newList[i]
      item.index = latestIndex
      item.currentIndex = i
      item.scrollY = scrollRunwayEnd.value + i * 50
      Object.freeze(item)
    }
    return newList
  }

  const init = () => {
    listData.value = callItemScrollY(list)
    visibleList.value = changeVisibleList()
  }

  const changeVisibleList = (): VirtualList =>
    listData.value.slice(
      firstAttacheItem.value,
      lastAttacheItem.value + bufferSize
    )

  const updateAnchorItem = () => {
    if (virtualListEl.value) {
      const index = Math.floor(virtualListEl.value.scrollTop / 50)
      const offset = virtualListEl.value.scrollTop - index * 50
      anchorItem = { index, offset }
    }
  }

  const handleScroll = () => {
    const el = virtualListEl.value
    if (el) {
      // 滑动差值
      const delta = el.scrollTop - lastScrollTop.value
      lastScrollTop.value = el.scrollTop

      // 更新 锚点元素
      anchorItem.offset += delta
      const isPositive = delta >= 0
      if (isPositive) {
        if (anchorItem.offset >= 50) {
          updateAnchorItem()
        }
        if (anchorItem.index - firstAttacheItem.value >= bufferSize) {
          firstAttacheItem.value = Math.min(
            listData.value.length - visibleCount.value,
            anchorItem.index - bufferSize
          )
        }
      } else {
        if (el.scrollTop <= 0) {
          anchorItem = { index: 0, offset: 0 }
        } else if (anchorItem.offset < 0) {
          updateAnchorItem()
        }

        if (anchorItem.index - firstAttacheItem.value < bufferSize) {
          firstAttacheItem.value = Math.max(0, anchorItem.index - bufferSize)
        }
      }

      lastAttacheItem.value = Math.min(
        firstAttacheItem.value + visibleCount.value + bufferSize * 2,
        listData.value.length
      )

      visibleList.value = changeVisibleList()
    }
  }

  effect(() => {
    init()
  })

  return {
    virtualListEl,
    visibleList,
    handleScroll,
  }
}
