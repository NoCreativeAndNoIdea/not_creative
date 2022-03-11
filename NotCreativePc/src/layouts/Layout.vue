<script setup lang="ts">
  import { reactive } from 'vue'
  import { useRoute } from 'vue-router'
  import TabBar from '~/components/TabBar/index.vue'

  const route = useRoute()

  // TODO: 后期改造成可以配置菜单
  const tabBarList = reactive([
    { name: 'home', icon: 'icon-shouye', routeName: 'home' },
    { name: 'find', icon: 'icon-faxian', routeName: 'find' },
    { name: 'member', icon: 'icon-qinghuiyuan', routeName: 'member' },
    { name: 'mine', icon: 'icon-wode', routeName: 'mine' },
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
    height: 100vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    &-main {
      flex: 1;
      overflow: hidden;
    }
  }
</style>
