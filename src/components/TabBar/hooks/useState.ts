import { ref } from 'vue'
import type { ComputedRef, Ref } from 'vue'
import createComputed from '~/utils/createComputed'

export interface TabBarItem {
  icon?: string
  name?: string
  routeName?: string
}

export type TabBarList = Array<TabBarItem>

export type TabBarProps = {
  list: TabBarList
}

export interface State {
  list?: ComputedRef<TabBarList> | TabBarList
  currentItem?: Ref<TabBarItem> | TabBarItem
}

export const useState = () => {
  const currentItem = ref<TabBarItem>({})
  const tabBarList = ref<TabBarList>([])

  return {
    currentItem: createComputed<TabBarItem>(currentItem),
    tabBarList: createComputed<TabBarList>(tabBarList),
  }
}
