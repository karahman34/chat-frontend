<template>
  <div id="app">
    <!-- Layout -->
    <component :is="layout">
      <!-- View -->
      <router-view></router-view>
    </component>
  </div>
</template>

<script>
import AuthLayout from '@/layouts/auth/Layout'
import DefaultLayout from '@/layouts/default/Layout'

export default {
  components: {
    AuthLayout,
    DefaultLayout,
  },

  computed: {
    layout() {
      return this.$route.meta?.layout
        ? `${this.$route.meta.layout}-layout`
        : 'default-layout'
    },
  },
}
</script>

<style lang="scss">
@import '@/assets/sass/app';
</style>
