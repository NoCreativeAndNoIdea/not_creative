<script setup lang="ts">
  import TabBar from '~/components/TabBar/index.vue'
  import { reactive } from 'vue'
  import { TabBarItem } from '~/components/TabBar/types'

  const tabBarList = reactive([
    { name: 'home', icon: '&#xe8eb;' },
    { name: 'find', icon: '&#xe8c1;' },
    { name: 'member', icon: '&#xe8dc;' },
    { name: 'mine', icon: '&#xe8f8;' },
  ])

  const handleChange = (item: TabBarItem) => {
    console.log(item)
  }
</script>

<template>
  <tab-bar :list="tabBarList" @on-change="handleChange" />
</template>
