<script setup lang="ts">
import { computed, onMounted } from 'vue'

import { useToggleButtonAnimation } from '@/composables/useToggleButtonAnimation'
import { useThemeStore } from '@/stores/theme'

import moonIcon from '@/assets/icons/moon.png'
import sunIcon from '@/assets/icons/sun.png'

const darkModeStore = useThemeStore()
const { scaleClass, toggleButtonAnimation } = useToggleButtonAnimation()

const currIcon = computed(() => (darkModeStore.isDarkMode ? moonIcon : sunIcon))

const toggleTheme = () => {
  toggleButtonAnimation()
  darkModeStore.toggleDarkMode()
}

onMounted(() => {
  document.documentElement.classList.toggle('dark', darkModeStore.isDarkMode)
})
</script>

<template>
  <button @click="toggleTheme">
    <img
      :src="currIcon"
      alt="change theme"
      aria-label="Toggle theme between light and dark"
      :class="[
        'cursor-pointer dark:invert opacity-55 hover:opacity-100 dark:opacity-70 dark:hover:opacity-100 duration-200 transition-transform',
        scaleClass,
      ]"
    />
  </button>
</template>
