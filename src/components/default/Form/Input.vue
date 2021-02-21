<template>
  <input
    type="text"
    class="border border-gray-300 rounded-md px-3 h-9 w-full transition-all outline-none focus:bg-white focus:ring-2 focus:ring-gray-600"
    @input="$emit('input', $event.target.value)"
  />
</template>
