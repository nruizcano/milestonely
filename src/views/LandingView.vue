<script setup lang="ts">
import { onMounted } from 'vue'
import { useUserStore } from '@/stores/user'

import ThemeToggle from '@/components/buttons/theme-toggle.vue'

const userStore = useUserStore()

onMounted(() => {
  userStore.logout()
})
</script>

<template>
  <div class="grid grid-cols-1 grid-rows-[2px,1fr,20px]">
    <header class="flex items-center justify-between w-full">
      <img src="/favicon.ico" alt="Milestonely logo" width="46" height="46" />
      <div class="flex gap-4 items-center">
        <p>
          Already have an account?
          <router-link to="/sign-in" class="text-blue-500"> Sign in </router-link>
        </p>
        <ThemeToggle class="w-5 h-5" />
      </div>
    </header>
    <div class="flex flex-col justify-center items-center xl:grid xl:grid-cols-2 justify-self-center gap-16 w-full 2xl:w-[60%]">
      <section class="text-center xl:text-start">
        <p class="text-5xl font-bold text-emerald-400">
          Welcome to <span class="md:text-7xl font-extrabold">Milestonely</span>
        </p>
        <p class="text-2xl text-gray-400 mt-6">
          A simple yet powerful project management tool for teams.
        </p>
      </section>
      <section>
        <p class="text-center xl:text-end">
          <router-link to="/sign-up" class="text-blue-500"> Sign up </router-link>
          for free and start managing your work effectively!
        </p>
      </section>
    </div>
  </div>
</template>
