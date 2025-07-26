<script setup lang="ts">
import { ref, onMounted } from 'vue'

import { useUserStore } from '@/stores/user'
import { getTasks, getProjects } from '@/utils/myProjectElems'

import LoadingSpinner from '@/components/loading-spinner.vue'
import TaskTable from '@/components/task-table.vue'
import ProjectContainer from '@/components/project-container.vue'
import NewProjectPopup from '@/components/popups/new-project-popup.vue'

import type { Project } from '@/models/Project'
import type { Task } from '@/models/Task'

const userStore = useUserStore()
const userId = userStore.getUserId as string

const tasks = ref<Task[] | string>([])
const projects = ref<Project[] | string>([])

const isTasksLoading = ref(true)
const isProjectsLoading = ref(true)

const isProjectPopupOpen = ref(false)

const fetchTasks = async () => {
  try {
    const result = await getTasks(userId, null, true)
    tasks.value = result
  } finally {
    isTasksLoading.value = false
  }
}

const fetchProjects = async () => {
  try {
    const result = await getProjects(userId, false, true)
    projects.value = result
  } finally {
    isProjectsLoading.value = false
  }
}

onMounted(async () => {
  await Promise.all([fetchTasks(), fetchProjects()])
})
</script>

<template>
  <div class="flex flex-col gap-10">
    <section>
      <h1>Tasks for this week</h1>
      <LoadingSpinner v-if="isTasksLoading" />
      <p v-else-if="typeof tasks === 'string'" class="flex justify-center">
        {{ tasks }}
      </p>
      <p v-else-if="tasks.length < 1" class="flex justify-center">
        You have no tasks for this week.
      </p>
      <TaskTable
        v-else
        :tasks="tasks"
        :columns="{
          end_date: true,
          name: true,
          description: true,
          project: true,
          priority: true,
          status: true,
        }"
      />
    </section>

    <section>
      <h1>Currently working on</h1>
      <LoadingSpinner v-if="isProjectsLoading" />
      <ul v-else class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 list-none">
        <button @click="isProjectPopupOpen = true" class="new-elem">New project</button>
        <p v-if="typeof projects === 'string'" class="flex justify-center">
          {{ projects }}
        </p>
        <p v-else-if="projects.length < 1" class="flex self-center justify-center">
          You are not working on any on going projects at the moment.
        </p>
        <li v-else v-for="project in projects" :key="project.id as string">
          <ProjectContainer :project="project" />
        </li>
      </ul>
    </section>

    <NewProjectPopup
      v-if="isProjectPopupOpen"
      :userId="userId"
      @close="isProjectPopupOpen = false"
    />
  </div>
</template>
