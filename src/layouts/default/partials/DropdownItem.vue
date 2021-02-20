<template>
  <div
    class="px-3 py-1 flex space-x-1 cursor-pointer transition-colors hover:bg-gray-700"
    @click="$emit('click', $event)"
  >
    <slot></slot>
  </div>
</template>
