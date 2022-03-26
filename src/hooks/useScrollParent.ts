import { Ref, ref, onMounted } from 'vue'
type ScrollElement = HTMLElement | Window

const overflowScrollReg = /scroll|auto/i

function isElement(node: Element) {
  const ELEMENT_NODE_TYPE = 1
  const { tagName, nodeType } = node
  const exclude = ['HTML', 'BODY']
  return !exclude.includes(tagName) && nodeType === ELEMENT_NODE_TYPE
}

export function getScrollParent(el: Element, root: ScrollElement = window) {
  let node = el
  while (node && node !== root && isElement(node)) {
    const { overflowY } = window.getComputedStyle(node)
    if (overflowScrollReg.test(overflowY)) {
      return node
    }
    node = node.parentNode as Element
  }
  return root
}

export function useScrollParent(
  el: Ref<Element | undefined>,
  root: ScrollElement = window
) {
  const scrollParent = ref<Element | Window>()

  onMounted(() => {
    if (el.value) {
      scrollParent.value = getScrollParent(el.value, root)
    }
  })

  return scrollParent
}
