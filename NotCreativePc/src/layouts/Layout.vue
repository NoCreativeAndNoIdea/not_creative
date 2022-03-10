<script setup lang="ts">
  import { reactive } from 'vue'
  import { useRoute } from 'vue-router'
  import TabBar from '~/components/TabBar/index.vue'

  const route = useRoute()

  // TODO: 后期改造成可以配置菜单
  const tabBarList = reactive([
    { name: 'home', icon: '&#xe8eb;', routeName: 'home' },
    { name: 'find', icon: '&#xe8c1;', routeName: 'find' },
    { name: 'member', icon: '&#xe8dc;', routeName: 'member' },
    { name: 'mine', icon: '&#xe8f8;', routeName: 'mine' },
  ])
</script>

<template>
  <div class="layout">
    <div class="layout-main">
      <router-view :key="route.fullPath" />
    </div>
    <tab-bar :list="tabBarList" />
  </div>
</template>

<style lang="scss">
  .layout {
    width: 100vw;
    min-height: 100vh;
  }
</style>
