<template>
  <button
    type="submit"
    class="block my-3 py-1 rounded bg-indigo-500 w-full text-white text-center focus:outline-none disabled:bg-opacity-70 disabled:cursor-not-allowed"
    :disabled="loading"
  >
    <i class="mdi mdi-loading mdi-spin" v-if="loading"></i>

    <template v-else>
      <slot></slot>
    </template>
  </button>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
