<script setup lang="ts">
  import { useRoute } from 'vue-router'
  const route = useRoute()
  import api from '~/api'
  api.login({
    username: '123',
    password: '123',
  })
</script>
<template><router-view :key="route.fullPath" /></template>
