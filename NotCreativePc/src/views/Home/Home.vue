<script setup lang="ts">
  import { ref } from 'vue'
  import SeasonList from '~/components/List'
  const list = ref(
    new Array(10).fill(0).map((v, i) => ({
      url: `https://source.unsplash.com/random?random=${i}`,
      title: `顶呱呱${i}`,
      avatar: 'https://source.unsplash.com/random',
      name: '机器猫',
      like: Math.floor(Math.random() * 10000),
    }))
  )
  const loading = ref(false)
  const finished = ref(false)

  const handleLoad = () => {
    let timer
    clearTimeout(timer)
    timer = setTimeout(() => {
      list.value.push({
        url: `https://source.unsplash.com/random?random=${
          list.value.length + 1
        }`,
        title: `顶呱呱${list.value.length + 1}`,
        avatar: 'https://source.unsplash.com/random',
        name: '机器猫',
        like: Math.floor(Math.random() * 10000),
      })
      loading.value = false
      if (list.value.length >= 20) {
        finished.value = true
      }
    }, 1000)
  }
</script>

<template>
  <season-list
    v-model:loading="loading"
    :finished="finished"
    class="waterfall"
    finished-text="没有更多了"
    @on-load="handleLoad"
  >
    <template #default>
      <div class="waterfall__wrapper">
        <div v-for="item in list" :key="item.like" class="card">
          <img class="card__icon" :src="item.url" alt="" />
          <div class="card__content">
            <p class="card__content__title">{{ item.title }}</p>
            <div class="card__content__user">
              <img
                class="card__content__user__avatar"
                :src="item.avatar"
                alt=""
              />
              <span class="card__content__user__name">{{ item.name }}</span>
              <i class="card__content__user__icon iconfont icon-aixin"></i>
              <span class="card__content__user__like">{{ item.like }}</span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </season-list>
</template>

<style lang="scss">
  .waterfall {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    overflow-y: scroll;
    padding: pxToRem(4);
    background-color: var(--home-bg-color);
    &__wrapper {
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
