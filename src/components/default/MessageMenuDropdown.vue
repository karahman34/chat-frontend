<template>
  <div class="message-menu-dropdown relative opacity-0">
    <!-- Trigger -->
    <button
      ref="trigger"
      class="trigger rounded-full px-1 focus:outline-none hover:bg-gray-300"
      @click="dropdown = !dropdown"
    >
      <i class="mdi mdi-dots-vertical text-xl"></i>
    </button>

    <!-- Menus -->
    <div
      v-show="dropdown"
      class="z-50 absolute mt-1 rounded shadow-lg py-1 w-max overflow-hidden"
      :class="{
        'right-0 left-auto bg-white': senderIsMe,
        'right-auto left-0 bg-gray-800 text-white': !senderIsMe,
      }"
    >
      <div
        class="px-3 py-1 cursor-pointer flex space-x-1"
        :class="{
          'hover:bg-gray-200': senderIsMe,
          'hover:bg-gray-700': !senderIsMe,
        }"
        @click="$emit('delete')"
      >
        <i
          class="mdi"
          :class="[loadingDelete ? 'mdi-loading mdi-spin' : 'mdi-trash-can']"
        ></i>
        <span>Delete</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    senderIsMe: {
      type: Boolean,
      required: true,
    },
    loadingDelete: {
      type: Boolean,
      required: true,
    },
  },

  data() {
    return {
      dropdown: false,
    }
  },
}
</script>
