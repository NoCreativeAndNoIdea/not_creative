<template>
  <tab-bar :list="tabBarList"></tab-bar>
</template>
<script setup lang="ts">
  import TabBar from '~/components/TabBar/index.vue'
  import { reactive } from 'vue'

  const tabBarList = reactive([
    { name: 'home', icon: '&#xe8eb;' },
    { name: 'find', icon: '&#xe8c1;' },
    { name: 'member', icon: '&#xe8dc;' },
    { name: 'mine', icon: '&#xe8f8;' },
  ])
</script>
