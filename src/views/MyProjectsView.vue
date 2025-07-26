<script setup lang="ts">
import { ref, onMounted } from 'vue'

import { useUserStore } from '@/stores/user'
import { getProjects } from '@/utils/myProjectElems'

import LoadingSpinner from '@/components/loading-spinner.vue'
import ProjectContainer from '@/components/project-container.vue'
import NewProjectPopup from '@/components/popups/new-project-popup.vue'

import { Project } from '@/models/Project'

const userStore = useUserStore()
const userId = userStore.getUserId as string

const projects = ref<Project[] | string>([])

const isDataLoading = ref(true)
const isProjectPopupOpen = ref(false)

const getProjectsData = async () => {
  isDataLoading.value = true

  try {
    const result = await getProjects(userId, true, false)
    projects.value = result
  } finally {
    isDataLoading.value = false
  }
}

onMounted(async () => {
  await getProjectsData()
})
</script>

<template>
  <div>
    <h1>My projects</h1>
    <LoadingSpinner v-if="isDataLoading" />
    <ul v-else class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 list-none">
      <button @click="isProjectPopupOpen = true" class="new-elem">New project</button>
      <p v-if="typeof projects === 'string'" class="flex justify-center">
        {{ projects }}
      </p>
      <p v-else-if="projects.length < 1" class="data-msg">
        You have no projects at the moment.
      </p>
      <li v-else v-for="project in projects" :key="project.id as string">
        <ProjectContainer :project="project" />
      </li>
    </ul>

    <NewProjectPopup
      :userId="userId"
      v-if="isProjectPopupOpen"
      @close="isProjectPopupOpen = false"
      @refresh="getProjectsData"
    />
  </div>
</template>
