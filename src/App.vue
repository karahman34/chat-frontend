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

  mounted() {
    this.setAppTitle()
  },

  watch: {
    $route() {
      this.setAppTitle()
    },
  },

  methods: {
    setAppTitle() {
      const title = 'Chat App'
      const routeTitle = this.$route.meta?.title

      document.title = routeTitle ? `${routeTitle} | ${title}` : title
    },
  },
}
</script>

<style lang="scss">
@import '@/assets/sass/app';
</style>
