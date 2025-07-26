<script setup lang="ts">
import { ref, onMounted } from 'vue'

import { useUserStore } from '@/stores/user'
import { getTeams } from '@/utils/myProjectElems'

import LoadingSpinner from '@/components/loading-spinner.vue'
import TeamContainer from '@/components/team-container.vue'

import type { Team } from '@/models/Team'

const userStore = useUserStore()
const userId = userStore.getUserId

const teams = ref<Team[] | string>([])
const isDataLoading = ref(true)

onMounted(async () => {
  try {
    const result = await getTeams(userId, null)
    teams.value = result
  } finally {
    isDataLoading.value = false
  }
})
</script>

<template>
  <div>
    <h1>Teams</h1>
    <LoadingSpinner v-if="isDataLoading" />
    <p v-else-if="typeof teams === 'string'" class="data-msg">{{ teams }}</p>
    <p v-else-if="teams.length < 1" class="data-msg">You are in no teams.</p>
    <ul v-else class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 min-w-full">
      <li v-for="team in teams" :key="team.id as string">
        <TeamContainer :team="team" :showProjectName="true" />
      </li>
    </ul>
  </div>
</template>
