<script setup lang="ts">
  import { defineProps, defineEmits } from 'vue'
  import { useState } from './hooks/useState'
  import { __useRouter } from '~/hooks/__useRouter'
  import type { TabBarItem, TabBarList } from './hooks/useState'
  // TODO: 官方错误 必须要写在组件内,后续修正后单独引入
  interface Props {
    list?: TabBarList
  }

  interface Emits {
    (e: 'on-change-tab', item: TabBarItem): void
  }

  const props = defineProps<Props>()
  const emits = defineEmits<Emits>()

  const { route, push } = __useRouter()

  const { currentItem, tabBarList } = useState()
  tabBarList.value = props?.list ?? []
  currentItem.value = tabBarList.value?.[0]

  const onChange = (item: TabBarItem) => {
    if (item.routeName) {
      push({
        name: item.routeName,
        params: {
          ...route.params,
        },
      })
    }
    currentItem.value = item
    emits('on-change-tab', item)
  }

  const isActive = (item: TabBarItem): boolean => {
    if (item.routeName && route.name === item.routeName) return true
    return item.name === currentItem.value.name
  }
</script>

<template>
  <div class="tab-bar">
    <template v-for="item in tabBarList" :key="item.name">
      <div
        class="tab-bar__item"
        :class="{ 'tab-bar__item--active': isActive(item) }"
        @click="onChange(item)"
      >
        <i class="tab-bar__icon iconfont" v-html="item.icon" />
        <span class="tab-bar__name">{{ $t(item?.name ?? '') }}</span>
      </div>
    </template>
  </div>
</template>

<style lang="scss">
  .tab-bar {
    z-index: 1024;
    border-top: 1px solid #eee;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100vw;
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: var(--bg-color);
    &__item {
      display: flex;
      flex-direction: column;
      align-items: center;
      color: var(--tab-color);
      flex: 1;

      &--active {
        color: var(--tab-active-color);
      }
    }
    &__icon {
      font-size: 22px;
    }
    &__name {
      font-size: 12px;
    }
  }
</style>
