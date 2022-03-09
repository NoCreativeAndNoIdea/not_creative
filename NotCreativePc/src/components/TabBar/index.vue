<script setup lang="ts">
  import { ref, defineProps, defineEmits } from 'vue'
  import type { TabBarItem } from './types'

  const props = defineProps<{
    list: Array<TabBarItem>
  }>()
  const $emit = defineEmits<{
    (e: 'on-change', item: TabBarItem): void
  }>()

  const list = props?.list ?? []
  const current = ref<TabBarItem>(list?.[0])

  const onChange = (item: TabBarItem) => {
    current.value = item
    $emit('on-change', item)
  }

  const isActive = (item: TabBarItem): boolean => {
    return item.name === current.value.name
  }
</script>

<template>
  <div class="tab-bar">
    <template v-for="item in list" :key="item.name">
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
