import { ref, watchEffect, onMounted } from 'vue'
import { defineStore } from 'pinia'

export const useThemeStore = defineStore('darkMode', () => {
  const getStoredTheme = () => localStorage.getItem('theme')
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

  const isDarkMode = ref(getStoredTheme() === 'dark' || (!getStoredTheme() && systemPrefersDark))

  const toggleDarkMode = () => {
    isDarkMode.value = !isDarkMode.value
    localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light')
  }

  onMounted(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const updateTheme = () => {
      if (!getStoredTheme()) {
        isDarkMode.value = mediaQuery.matches
      }
    }
    mediaQuery.addEventListener('change', updateTheme)
  })

  watchEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode.value)
  })

  return { isDarkMode, toggleDarkMode }
})
