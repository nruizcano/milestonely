<script setup lang="ts">
defineProps<{
  msg: string
  variant: 'green' | 'blue' | 'orange'
}>()

const green =
  'text-emerald-900 bg-emerald-300 hover:text-white hover:bg-emerald-400 dark:bg-emerald-300 dark:hover:text-emerald-900 dark:hover:bg-emerald-200'
const blue =
  'text-blue-900 bg-blue-300 hover:text-white hover:bg-blue-500 dark:bg-blue-400 dark:text-blue-950 dark:hover:text-blue-900 dark:hover:bg-blue-300'
const orange =
  'text-orange-900 bg-orange-300 hover:text-white hover:bg-orange-400 dark:bg-orange-300 dark:hover:text-orange-900 dark:hover:bg-orange-200'
</script>

<template>
  <button
    :class="[
      'rounded-full px-2 text-sm',
      variant === 'green' ? green : variant === 'blue' ? blue : orange,
    ]"
  >
    {{ msg }}
  </button>
</template>
