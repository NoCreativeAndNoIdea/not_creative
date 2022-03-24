import { ref, reactive, computed, effect, nextTick } from 'vue'
import type { Ref } from 'vue'

export type VirtualList = Array<{ [key: string]: any }>
const itemEls = new Map()
const roMap = new Map<string, ResizeObserver>()
const generateKey = () => Math.random().toString(36).slice(2, 36)

export const useState = (list: VirtualList, bufferSize: number) => {
  const PLACEHOLDER_COUNT = 6
  const ESTIMATED_HEIGHT = 10
  const VISIBLE_COUNT = ref(bufferSize * 2)

  const virtualListEl = ref<HTMLElement | null>(null)
  const listData: Ref<VirtualList> = ref([])
  const visibleList: Ref<VirtualList> = ref([])
  const firstAttacheItem: Ref<number> = ref(0)
  const lastAttacheItem: Ref<number> = ref(0)
  const lastScrollTop = ref(0)
  const cachedHeight = ref<number[]>([])
  const cachedScrollY = ref<number[]>([])
  const revising = ref<boolean>(false)

  // 底部距离
  const topPlaceholders = ref<number>(0)
  const bottomPlaceholders = ref<number>(0)

  // items el
  let anchorItem = reactive({
    index: 0,
    offset: 0,
  })

  const updateVisibleList = () => {
    const start = (firstAttacheItem.value = Math.max(
      0,
      anchorItem.index - bufferSize
    ))
    lastAttacheItem.value =
      firstAttacheItem.value + VISIBLE_COUNT.value + bufferSize * 2
    const end = Math.min(lastAttacheItem.value, listData.value.length)
    visibleList.value = listData.value.slice(start, end)
  }
  const updateAnchorItem = (delta: number) => {
    const { index: lastIndex, offset: lastOffset } = anchorItem
    delta += lastOffset
    let index = lastIndex

    if (delta >= 0) {
      while (
        index < listData.value.length &&
        delta > (cachedHeight.value[index] || ESTIMATED_HEIGHT)
      ) {
        if (!cachedHeight.value[index]) {
          cachedHeight.value[index] = ESTIMATED_HEIGHT
        }
        delta -= cachedHeight.value[index]
        index++
      }

      if (index >= listData.value.length) {
        anchorItem = { index: listData.value.length - 1, offset: 0 }
      } else {
        anchorItem = { index, offset: delta }
      }
    } else {
      while (delta < 0) {
        if (!cachedHeight.value[index - 1]) {
          cachedHeight.value[index - 1] = ESTIMATED_HEIGHT
        }
        delta += cachedHeight.value[index - 1]
        index--
      }

      if (index < 0) {
        anchorItem = { index: 0, offset: 0 }
      } else {
        anchorItem = { index, offset: delta }
      }
      const el = virtualListEl.value

      // 修正拖动过快导致的滚动到顶端滚动条不足的偏差
      if (el && cachedScrollY.value[firstAttacheItem.value] <= -1) {
        revising.value = true
        const actualScrollY = cachedHeight.value
          .slice(0, Math.max(0, anchorItem.index))
          .reduce((sum, h) => (sum += h), 0)
        el.scrollTop = actualScrollY + anchorItem.offset
        lastScrollTop.value = el.scrollTop
        if (el.scrollTop === 0) {
          anchorItem = { index: 0, offset: 0 }
        }
        calItemScrollY()
        revising.value = false
      }
    }
  }

  const updatePlaceholder = (isPositive: boolean) => {
    if (isPositive) {
      topPlaceholders.value = 0
      bottomPlaceholders.value = Math.min(
        PLACEHOLDER_COUNT,
        Math.abs(listData.value.length - lastAttacheItem.value)
      )
    } else {
      topPlaceholders.value = Math.min(
        PLACEHOLDER_COUNT,
        firstAttacheItem.value
      )
      bottomPlaceholders.value = 0
    }
  }

  const handleLoadMore = () => {
    const el = virtualListEl.value
    if (el) {
      const scrollEnd = el.scrollTop + el.offsetHeight + ESTIMATED_HEIGHT
      console.log(scrollEnd, 'scrollEnd')
      console.log(anchorItem.index, 'index')
      if (
        scrollEnd >= scrollRunwayEnd.value ||
        anchorItem.index === listData.value.length - 1
      ) {
        // TODO: load emit
        console.log(123)
      }
    }
  }

  const calItemScrollY = async () => {
    const el = virtualListEl.value
    if (!el) return
    await nextTick()
    // const anchorDomIndex = $refs.items.findIndex(
    //   (item) => item.index === anchorItem.index
    // )
    // const anchorDom = $refs.items[anchorDomIndex]
    // const anchorDomHeight = anchorDom.$el.getBoundingClientRect().height

    const itemElsArr = Array.from(itemEls)

    const [, dom] =
      itemElsArr.find((item) => {
        const [, node] = item
        const index = Number(node.getAttribute('data-index'))
        return index === anchorItem.index
      }) || []
    const anchorDomHeight = dom.getBoundingClientRect().height
    cachedScrollY.value[anchorItem.index] = el.scrollTop - anchorItem.offset
    cachedHeight.value[anchorItem.index] = anchorDomHeight
    for (let i = anchorItem.index + 1; i < itemElsArr.length; i++) {
      const [, dom] = itemElsArr[i]
      setItemScrollYAndHeight(dom)
    }

    for (let i = anchorItem.index - 1; i >= 0; i--) {
      const [, dom] = itemElsArr[i]
      setItemScrollYAndHeight(dom, 'negative')
    }

    if (cachedHeight.value[0] > 0) {
      revising.value = true
      const delta = cachedScrollY.value[0]
      const last = Math.min(lastAttacheItem.value, listData.value.length)
      for (let i = 0; i < last; i++) {
        cachedScrollY.value[i] = cachedScrollY.value[i] - delta
      }

      const scrollTop = cachedScrollY.value[anchorItem.index - 1]
        ? cachedScrollY.value[anchorItem.index - 1] + anchorItem.offset
        : anchorItem.offset
      el.scrollTop = scrollTop
      lastScrollTop.value = el.scrollTop
      revising.value = false
    }
  }
  // positive and negative
  const setItemScrollYAndHeight = (
    dom: HTMLElement,
    status: 'positive' | 'negative' = 'positive'
  ) => {
    const index = Number(dom.getAttribute('data-index'))
    const scrollYIndex = status === 'positive' ? index - 1 : index + 1
    cachedHeight.value[index] = dom.getBoundingClientRect().height
    let scrollY
    if (status === 'positive') {
      scrollY =
        cachedScrollY.value[scrollYIndex] + cachedHeight.value[scrollYIndex]
    } else {
      scrollY = cachedScrollY.value[scrollYIndex] - cachedHeight.value[index]
    }

    cachedScrollY.value[index] = scrollY
  }

  const handleScroll = () => {
    const el = virtualListEl.value
    if (el) {
      const delta = el.scrollTop - lastScrollTop.value
      lastScrollTop.value = el.scrollTop

      updateAnchorItem(delta)
      updateVisibleList()
      updatePlaceholder(delta > 0)
      handleLoadMore()
    }
  }

  const scrollRunwayEnd = computed(() => {
    const maxScrollY = cachedHeight.value.reduce(
      (sum, h) => (sum += h || ESTIMATED_HEIGHT),
      0
    )
    const currentAverageH = maxScrollY / cachedHeight.value.length
    if (isNaN(currentAverageH)) {
      return listData.value.length * ESTIMATED_HEIGHT
    } else {
      return (
        maxScrollY +
        (listData.value.length - cachedHeight.value.length) * currentAverageH
      )
    }
  })

  const vResizeObserver = {
    mounted(el?: HTMLElement) {
      if (el) {
        const key = generateKey()
        !itemEls.has(key) && itemEls.set(key, el)
        el.setAttribute('data-key', key)
        const ro = new ResizeObserver(() => {
          calItemScrollY()
        })
        ro.observe(el)
        !roMap.has(key) && roMap.set(key, ro)
      }
    },
    beforeDestroy(el: HTMLElement) {
      const key = el.getAttribute('data-key')
      if (key) {
        itemEls.has(key) && itemEls.delete(key)
        roMap.has(key) && roMap.get(key)?.disconnect()
      }
    },
  }

  const initListData = () => {
    for (let i = 0; i < list.length; i++) {
      const item = list[i]
      item.index = listData.value.length
      listData.value.push(item)
    }
    updateVisibleList()
  }

  const init = () => {
    const el = virtualListEl.value
    if (el) {
      VISIBLE_COUNT.value = Math.ceil(el.offsetHeight / ESTIMATED_HEIGHT)
      lastAttacheItem.value = VISIBLE_COUNT.value + bufferSize
      initListData()
    }
  }

  const itemScrollY = (index: number) => {
    console.log(
      cachedScrollY.value[firstAttacheItem.value] -
        ESTIMATED_HEIGHT * (index + 1)
    )
    return (
      cachedScrollY.value[firstAttacheItem.value] -
      ESTIMATED_HEIGHT * (index + 1)
    )
  }

  effect(() => {
    init()
  })

  return {
    virtualListEl,
    visibleList,
    handleScroll,
    scrollRunwayEnd,
    vResizeObserver,
    cachedScrollY,
    itemScrollY,
  }
}
