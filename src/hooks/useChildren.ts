import { isVNode, provide, reactive, getCurrentInstance } from 'vue'
import type {
  VNode,
  ComponentPublicInstance,
  ComponentInternalInstance,
  InjectionKey,
  VNodeNormalizedChildren,
} from 'vue'

export type PublicChildren = ComponentPublicInstance[]
export type InternalChildren = ComponentInternalInstance[]

export const flattenVNodes = (children: VNodeNormalizedChildren) => {
  const result: VNode[] = []
  const traverse = (children: VNodeNormalizedChildren) => {
    if (Array.isArray(children)) {
      children.forEach((child) => {
        if (isVNode(child)) {
          result.push(child)
          if (child.component?.subTree) {
            result.push(child.component.subTree)
            traverse(child.component.subTree.children)
          }

          if (child.children) {
            traverse(child.children)
          }
        }
      })
    }
  }

  traverse(children)
  return result
}

export const sortChildren = (
  parent: ComponentInternalInstance,
  publicChildren: PublicChildren,
  internalChildren: InternalChildren
) => {
  const vNodes = flattenVNodes(parent.subTree.children)

  internalChildren.sort(
    (a, b) => vNodes.indexOf(a.vnode) - vNodes.indexOf(b.vnode)
  )

  const orderedPublicChildren = internalChildren.map((item) => item.proxy!)

  publicChildren.sort((a, b) => {
    const indexA = orderedPublicChildren.indexOf(a)
    const indexB = orderedPublicChildren.indexOf(b)
    return indexA - indexB
  })
}

export function useChildren<
  Child extends ComponentPublicInstance = ComponentPublicInstance<object, any>,
  ProvideValue = never
>(key: InjectionKey<ProvideValue>) {
  const publicChildren: Child[] = reactive([])
  const internalChildren: ComponentInternalInstance[] = reactive([])
  const parent = getCurrentInstance()!

  const likeChildren = (value?: ProvideValue) => {
    const link = (child: ComponentInternalInstance) => {
      if (child?.proxy) {
        internalChildren.push(child)
        publicChildren.push(child.proxy as Child)
        sortChildren(parent, publicChildren, internalChildren)
      }
    }

    const unlink = (child: ComponentInternalInstance) => {
      const index = internalChildren.indexOf(child)
      publicChildren.splice(index, 1)
      internalChildren.splice(index, 1)
    }

    provide(
      key,
      Object.assign(
        {
          link,
          unlink,
          children: publicChildren,
          internalChildren,
        },
        value
      )
    )
  }

  return {
    children: publicChildren,
    likeChildren,
  }
}
