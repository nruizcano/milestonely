<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useUserStore } from '@/stores/user'
import AppHeader from './components/app-header.vue'

const userStore = useUserStore()
</script>

<template>
  <main class="flex flex-col min-w-full min-h-dvh p-8 lg:px-12 lg:pt-10 lg:py-16 xl:px-16 xl:pb-20">
    <AppHeader v-if="userStore.isLoggedIn" class="mb-16" />
    <RouterView class="flex flex-col flex-1 min-w-full h-full px-8 sm:px-16" />
  </main>
</template>
