<template>
  <input
    type="text"
    class="border border-gray-400 rounded-md px-3 h-9 w-full transition-all outline-none focus:border-0 focus:ring-2 focus:ring-indigo-500"
    @input="$emit('input', $event.target.value)"
  />
</template>
