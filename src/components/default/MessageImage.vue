<template>
  <img :src="image" class="message-image w-full rounded-lg object-cover" />
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
  min-height: 220px;
  max-height: 220px;
  min-width: 150px;
  max-width: 400px;
}
</style>
