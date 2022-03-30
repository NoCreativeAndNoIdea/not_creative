import {
  InjectionKey,
  type ComponentInternalInstance,
  type ComponentPublicInstance,
  getCurrentInstance,
  onMounted,
  computed,
  ref,
  inject,
} from 'vue'

type ParentProvide<T> = T & {
  link(child: ComponentInternalInstance): void
  unlink(child: ComponentInternalInstance): void
  children: ComponentPublicInstance[]
  internalChildren: ComponentInternalInstance[]
}

export function useParent<T>(key: InjectionKey<ParentProvide<T>>) {
  const parent = inject(key, null)

  if (parent) {
    const instance = getCurrentInstance()!
    const { link, unlink, internalChildren } = parent
    link(instance)
    onMounted(() => unlink(instance))
    const index = computed(() => internalChildren.indexOf(instance))

    return {
      parent,
      index,
    }
  }

  return {
    parent: null,
    index: ref(-1),
  }
}
