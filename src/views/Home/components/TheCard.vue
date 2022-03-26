<script lang="ts" setup>
  import { defineProps } from 'vue'
  import { ListItem } from '../type'
  import IImg from '~/components/IImg/IImg'
  interface CardProps {
    item: ListItem
  }
  defineProps<CardProps>()
</script>

<template>
  <div class="card">
    <i-img class="card__cover" :url="item.url" alt="123123" />
    <div class="card__content">
      <p class="card__content__title">{{ item.title }}</p>
      <div class="card__content__user">
        <i-img
          class="card__content__user__avatar"
          :url="item.avatar"
          :alt="item.name"
        />
        <span class="card__content__user__name">{{ item.name }}</span>
        <i class="card__content__user__icon iconfont icon-aixin"></i>
        <span class="card__content__user__like">{{ item.like }}</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  .card {
    break-inside: avoid;
    width: 100%;
    margin-bottom: pxToRem(4);
    border-radius: pxToRem(6);
    overflow: hidden;
    min-height: 100px;
    &__cover {
      width: 100%;
      height: auto;
      min-height: 100px;
      display: block;
    }
    &__content {
      box-sizing: border-box;
      width: 100%;
      padding: 10px;
      background-color: var(--bg-color);
      &__title {
        font-size: pxToRem(14);
        color: var(--text-sub-title);
        font-weight: bold;
      }
      &__user {
        margin-top: pxToRem(6);
        display: flex;
        align-items: center;
        font-size: pxToRem(12);
        &__avatar {
          width: pxToRem(20);
          height: pxToRem(20);
          border-radius: pxToRem(10);
          background-color: #eee;
        }
        &__name {
          margin-left: pxToRem(6);
          color: var(--text-desc);
          flex: 1;
        }
        &__icon {
          position: relative;
          top: pxToRem(1);
          margin-right: pxToRem(1);
        }
      }
    }
  }
</style>
