<script setup lang="ts">
import editIcon from '@/assets/icons/edit.png'

defineProps<{
  variant: 'edit' | 'save'
}>()

const edit = 'bg-blue-300 hover:bg-blue-400 dark:bg-blue-400 dark:hover:bg-blue-300'
const save = 'bg-emerald-300 hover:bg-emerald-400 dark:bg-emerald-400 dark:hover:bg-emerald-300'
</script>

<template>
  <button
    :class="[
      'group inline-flex items-center justify-center p-1 rounded-full shadow-sm outline-none cursor-pointer duration-100',
      variant === 'edit' ? edit : save,
    ]"
  >
    <img
      :src="editIcon"
      alt="Delete"
      width="16"
      height="16"
      class="opacity-100 duration-100"
    />
  </button>
</template>
