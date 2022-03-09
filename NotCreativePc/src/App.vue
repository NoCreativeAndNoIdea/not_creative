<script setup lang="ts">
  import { useTitle } from '~/hooks/useTitle'
  import useTheme from './hooks/useTheme'
  useTitle()
  useTheme()
</script>
<template>
  <router-view />
</template>
