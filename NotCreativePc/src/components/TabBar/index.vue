<script lang="ts" setup>
  import { ref, defineProps, defineEmits } from 'vue'
  interface TabBarProps {
    icon: string
    name: string
  }

  const $emit = defineEmits(['change'])
  const props = defineProps<{
    list: Array<TabBarProps>
  }>()

  const list = props?.list ?? []

  const current = ref<string>(list?.[0].name)

  const onChange = (item: TabBarProps) => {
    current.value = item.name
    $emit('change', item)
  }

  const isActive = (item: TabBarProps): boolean => {
    return item.name === current.value
  }
</script>

<template>
  <div class="tab-bar">
    <template v-for="item in list" :key="item.name">
      <div
        class="item"
        :class="{ 'item-active': isActive(item) }"
        @click="onChange(item)"
      >
        <i class="icon iconfont" v-html="item.icon"></i>
        <span class="name">{{ $t(item.name) }}</span>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
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
    .item {
      display: flex;
      flex-direction: column;
      align-items: center;
      color: var(--tab-color);
      flex: 1;
      .icon {
        font-size: 22px;
      }
      .name {
        font-size: 12px;
      }
    }
    .item-active {
      color: var(--tab-active-color);
    }
  }
</style>
