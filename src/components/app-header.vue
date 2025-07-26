<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import ThemeToggle from '@/components/buttons/theme-toggle.vue'
import UserButton from '@/components/buttons/user-button.vue'

const route = useRoute()
const currentPath = computed(() => route.path)

const navLinks = [
  { href: '/workspace', label: 'Home' },
  { href: '/workspace/all-projects', label: 'All projects' },
  { href: '/workspace/my-projects', label: 'My projects' },
  { href: '/workspace/all-tasks', label: 'All tasks' },
  { href: '/workspace/teams', label: 'Teams' },
]

const buttonsSize = 'w-6 h-6'
</script>

<template>
  <header class="flex items-center justify-between w-full">
    <div>
      <RouterLink to="/workspace" class="flex items-center gap-4 cursor-pointer">
        <img src="/favicon.ico" width="46" height="46" alt="Milestonely logo" />
        <span class="text-3xl font-extrabold text-emerald-400">Milestonely</span>
      </RouterLink>
    </div>

    <nav>
      <ul class="flex flex-col lg:flex-row items-center justify-center lg:divide-x divide-gray-500">
        <li v-for="{ href, label } in navLinks" :key="href" class="list-none">
          <RouterLink
            :to="href"
            class="px-3"
            :class="{
              'text-blue-400 dark:text-blue-400 font-semibold': currentPath === href
            }"
          >
            {{ label }}
          </RouterLink>
        </li>
      </ul>
    </nav>

    <div class="flex gap-4 items-center">
      <ThemeToggle :class=buttonsSize />
      <UserButton :class=buttonsSize />
    </div>
  </header>
</template>
