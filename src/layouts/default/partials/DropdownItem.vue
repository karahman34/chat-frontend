<template>
  <div
    class="px-3 flex space-x-1 cursor-pointer "
    @click="$emit('click', $event)"
  >
    <slot></slot>
  </div>
</template>
