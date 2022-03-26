<script lang="ts" setup>
  import { ref } from 'vue'
  import PullRefresh from '~/components/PullRefresh'
  import List from '~/components/List'
  import TheCard from './components/TheCard.vue'
  import type { ListItem } from './type'
  import { generateKey } from '~/utils/index'

  const generateList = (): ListItem[] =>
    new Array(10).fill(0).map((v, i) => ({
      id: generateKey(),
      url: `https://source.unsplash.com/random?random=${Math.random() * 10000}`,
      title: `顶呱呱${i}`,
      avatar: 'https://source.unsplash.com/random',
      name: '机器猫',
      like: Math.floor(Math.random() * 10000),
    }))

  // pull refresh
  const refresh = ref(false)
  const handleRefresh = () => {
    setTimeout(() => {
      list.value = generateList()
      refresh.value = false
    }, 1000)
  }

  // list
  const loading = ref(false)
  const finished = ref(false)

  const list = ref<Array<ListItem>>([])

  const getListData = () => {
    loading.value = true

    setTimeout(() => {
      list.value = [...list.value, ...generateList()]
      loading.value = false

      if (list.value.length >= 100) {
        finished.value = true
      }
    }, 1000)
  }

  const handleLoad = () => {
    getListData()
  }
</script>

<template>
  <pull-refresh v-model="refresh" @on-refresh="handleRefresh">
    <List
      v-model:loading="loading"
      :finished="finished"
      :offset="10"
      class="scroll"
      finished-text="加载完成!"
      loading-text="正在加载中!"
      @on-load="handleLoad"
    >
      <TheCard v-for="item in list" :key="item.id" :item="item" />
    </List>
  </pull-refresh>
</template>

<style lang="scss">
  .scroll {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    // overflow-y: scroll;
    padding: pxToRem(4);
    background-color: var(--home-bg-color);
  }
</style>
