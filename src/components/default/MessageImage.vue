<template>
  <img
    :src="image"
    class="message-image w-full rounded-lg object-cover max-h-80"
  />
</template>

<script>
export default {
  props: {
    image: {
      type: String,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.message-image {
  min-height: 320px;
}
</style>
