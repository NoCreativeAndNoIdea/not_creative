<script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import useAuthStore from '~/store/auth'
  const router = useRouter()
  const authStore = useAuthStore()
  const loginData = ref({
    username: 'admin',
    password: 'admin',
  })
  const login = async () => {
    await authStore.login(loginData.value)
    router.push({
      name: 'home',
    })
  }
</script>

<template>
  <section class="login">
    <form class="login-form">
      <div class="login__logo">LOGO</div>
      <input
        v-model="loginData.username"
        class="login-form__input"
        type="text"
        :placeholder="$t('username')"
      />
      <input
        v-model="loginData.password"
        class="login-form__input"
        type="current-password"
        :placeholder="$t('password')"
      />
      <button class="login-form__submit" @click.prevent="login">
        {{ $t('login') }}
      </button>
    </form>
  </section>
</template>

<style lang="scss">
  .login {
    &::before {
      content: '';
      display: block;
      position: fixed;
      z-index: 0;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      overflow: hidden;
      background: url('~/assets/images/background.png');
      background-position: center center;
      background-size: cover;
      filter: blur(3px);
    }

    &-form {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);

      &__input {
        width: 240px;
        border: 2px solid transparent;
        display: block;
        padding: 15px 30px;
        background-color: rgba($color: #fff, $alpha: 0.2);
        margin-bottom: 20px;
        border-radius: 20px;
        outline: none;
        color: #fff;
        caret-color: #eee;

        &:focus-visible {
          transition: 1s border;
          border: 2px solid var(--primary);
        }

        &::placeholder {
          color: #e3e3e3;
        }
      }

      &__submit {
        @extend .login-form__input;
        cursor: pointer;
        width: 300px;
        color: #fff;
        margin-top: 30px;
        padding: 10px 30px;
        background-color: var(--primary);

        &:hover {
          color: rgba($color: #fff, $alpha: 0.8);
          background-color: var(--primary-hover);
        }
      }
    }

    &__logo {
      font-size: 26px;
      color: #fff;
      margin-bottom: 60px;
      text-align: center;
    }
  }
</style>
