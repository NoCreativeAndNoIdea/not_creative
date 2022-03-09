<script setup lang="ts">
  import { useRoute } from 'vue-router'
  import { useTitle } from '~/hooks/useTitle'
  import useTheme from './hooks/useTheme'
  const route = useRoute()
  useTitle()
  useTheme()
</script>
<template><router-view :key="route.fullPath" /></template>
