<template>
  <div
    v-show="value"
    class="dialog z-50 min-h-screen w-full fixed left-0 top-0 bg-gray-800 bg-opacity-50 flex items-center justify-center py-4 px-3"
  >
    <!-- Slot -->
    <transition name="scale">
      <slot v-if="value"></slot>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      required: true,
    },
  },

  model: {
    prop: 'value',
    event: 'change',
  },

  watch: {
    value: {
      immediate: true,
      handler(val) {
        val ? this.listenClickOutside() : this.removeClickOutside()
      },
    },
  },

  methods: {
    emitChangeEvent(val) {
      this.$emit('change', val)
    },
    clickOutsideHandler(e) {
      const target = e.target
      if (this.$el.isSameNode(target)) {
        this.emitChangeEvent(false)
      }
    },
    listenClickOutside() {
      document.addEventListener('click', this.clickOutsideHandler)
    },
    removeClickOutside() {
      document.removeEventListener('click', this.clickOutsideHandler)
    },
  },

  beforeDestroy() {
    this.removeClickOutside()
  },
}
</script>

<style lang="scss" scoped>
.scale-enter-active,
.scale-leave-active {
  transition: transform 0.3s;
}

.scale-enter,
.scale-leave-to {
  transform: scale(0);
}
</style>
