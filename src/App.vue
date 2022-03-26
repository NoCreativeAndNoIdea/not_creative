<script setup lang="ts">
  import { useTitle } from '~/hooks/useTitle'
  import usePxToRem from './hooks/usePxToRem'
  import useTheme from './hooks/useTheme'
  useTitle()
  useTheme()
  usePxToRem()
</script>
<template>
  <router-view />
</template>
