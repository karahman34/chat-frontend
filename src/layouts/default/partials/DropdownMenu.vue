<template>
  <div class="relative">
    <!-- Trigger -->
    <i
      class="mdi mdi-dots-vertical text-2xl cursor-pointer dropdown-trigger"
      @click="model = !model"
    ></i>

    <!-- Dropdown Menus -->
    <div
      v-if="model"
      class="w-max z-50 absolute left-auto right-0 bg-gray-800 text-white rounded shadow-lg py-1"
    >
      <!-- Dropdown Item -->
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      model: false,
    }
  },

  watch: {
    model(val) {
      if (val) {
        this.listenClickOutside()
      } else {
        this.removeListenClickOutside()
      }
    },
  },

  methods: {
    listenClickOutsideHandler(e) {
      const target = e.target
      const trigger = this.$el.querySelector('.dropdown-trigger')

      if (!trigger.isSameNode(target)) {
        this.model = false
      }
    },
    listenClickOutside() {
      document.addEventListener('click', this.listenClickOutsideHandler)
    },
    removeListenClickOutside() {
      document.removeEventListener('click', this.listenClickOutsideHandler)
    },
  },

  beforeDestroy() {
    this.removeListenClickOutside()
  },
}
</script>
