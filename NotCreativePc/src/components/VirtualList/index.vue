<script setup lang="ts">
  import { defineProps, defineEmits, withDefaults } from 'vue'
  import { useState, VirtualList } from './index'
  interface Props {
    list: VirtualList
    bufferSize?: number
  }

  interface Emits {
    (e: 'on-load'): void
  }

  const props = withDefaults(defineProps<Props>(), {
    bufferSize: 20,
  })
  const emits = defineEmits<Emits>()

  const {
    virtualListEl,
    visibleList,
    handleScroll,
    vResizeObserver,
    scrollRunwayEnd,
    itemScrollY,
    cachedScrollY,
  } = useState(props.list, props.bufferSize)
</script>

<template>
  <ul ref="virtualListEl" class="virtual-list" @scroll="handleScroll">
    <li
      class="virtual-list__runway"
      :style="`transform: translate(0, ${scrollRunwayEnd}px)`"
    />
    <li
      v-for="(item, inx) in visibleList"
      :key="inx"
      v-resize-observer="item"
      :data-index="item.index"
      :style="`transform: translate(0,${cachedScrollY[item.index]}px)`"
      class="virtual-list__item"
    >
      item {{ item.currentIndex }} {{ item.name }} {{ item.index }} {{ inx }}
    </li>
  </ul>
</template>

<style lang="scss">
  .virtual-list {
    width: 100vw;
    height: calc(100% + 1px);
    overflow-x: hidden;
    overflow-y: scroll;
    position: absolute;

    &::-webkit-scrollbar {
      width: 0;
      height: 0;
    }

    &__runway {
      position: absolute;
      width: 1px;
      height: 1px;
      transition: transform 0.2s;
    }

    &__item {
      position: absolute;
      contain: layout;
      will-change: transform;
    }
  }
</style>
