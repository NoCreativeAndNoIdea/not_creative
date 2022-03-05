<script setup lang="ts">
  import { useRoute } from 'vue-router'
  import { useTitle } from '~/hooks/useTitle'
  const route = useRoute()
  useTitle()
</script>
<template><router-view :key="route.fullPath" /></template>
