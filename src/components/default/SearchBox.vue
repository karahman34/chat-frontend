<template>
  <div class="search-box relative">
    <i
      class="mdi mdi-magnify text-xl absolute top-1/2 right-2 transform -translate-y-1/2"
    ></i>
    <input
      type="text"
      class="border-0 bg-gray-200 border-gray-400 rounded-md px-3 h-9 w-full transition-all outline-none focus:border focus:bg-white focus:ring-2 focus:ring-gray-600"
      placeholder="Search..."
      v-model="search"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchTimeout: null,
      search: null,
    }
  },

  watch: {
    search(val) {
      clearTimeout(this.searchTimeout)

      this.searchTimeout = setTimeout(() => this.$emit('input', val), 400)
    },
  },
}
</script>
