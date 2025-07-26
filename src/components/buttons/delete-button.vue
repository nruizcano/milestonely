<script setup lang="ts">
import trashbinIcon from '@/assets/icons/trashbin.png'
</script>

<template>
  <button
      class="group inline-flex items-center justify-center p-2 bg-red-300 hover:bg-red-500 dark:bg-red-400 dark:hover:bg-red-500 rounded-lg shadow-sm outline-none cursor-pointer duration-100"
    >
      <img
        :src="trashbinIcon"
        alt="Delete"
        width="16"
        height="16"
        class="opacity-80 dark:opacity-100 group-hover:invert group-hover:opacity-100 duration-100"
      />
    </button>
</template>
