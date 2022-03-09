<template>
  <tab-bar :list="tabbar"></tab-bar>
</template>
<script setup lang="ts">
  import TabBar from '~/components/TabBar/index.vue'

  import { ref } from 'vue'
  const tabbar = ref([
    { name: 'home', icon: '&#xe8eb;' },
    { name: 'find', icon: '&#xe8c1;' },
    { name: 'vip', icon: '&#xe8dc;' },
    { name: 'my', icon: '&#xe8f8;' },
  ])
</script>
