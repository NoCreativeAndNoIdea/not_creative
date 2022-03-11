<script setup lang="ts">
  import { ref } from 'vue'
  const list = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  const changeScroll = (e: unknown) => {
    console.log(e)
  }
</script>

<template>
  <div class="waterfall" @scroll="changeScroll">
    <div class="waterfall_box">
      <div v-for="(item, index) in list" :key="index" class="card">
        <img
          class="card__icon"
          :src="`https://source.unsplash.com/random?random=${item}`"
          alt=""
        />
        <div class="card__content">
          <p class="card__content__title">
            顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶
          </p>
          <div class="card__content__user">
            <img
              class="card__content__user__avatar"
              src="https://source.unsplash.com/random"
              alt=""
            />
            <span class="card__content__user__name">机器猫</span>
            <i class="card__content__user__icon iconfont icon-aixin"></i>
            <span class="card__content__user__like">10</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .waterfall {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    padding: pxToRem(4);
    background-color: var(--home-bg-color);
    &_box {
      column-count: 2;
      column-gap: pxToRem(4);
    }
  }
  .card {
    break-inside: avoid;
    width: 100%;
    margin-bottom: pxToRem(4);
    border-radius: pxToRem(6);
    overflow: hidden;
    &__icon {
      width: 100%;
      height: auto;
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
