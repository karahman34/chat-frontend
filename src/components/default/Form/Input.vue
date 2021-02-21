<template>
  <input
    type="text"
    class="border rounded-md px-3 h-9 w-full transition-all outline-none focus:border-gray-300 focus:bg-white focus:ring-2 focus:ring-gray-600"
    :class="{
      'border-gray-300': !error,
      'border-red-500': error,
    }"
    @input="$emit('input', $event.target.value)"
  />
</template>

<script>
export default {
  props: {
    error: {
      type: Boolean,
      default: null,
    },
  },
}
</script>
