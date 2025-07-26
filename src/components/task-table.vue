<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

import { useSupabase } from '@/composables/useSupabase'
import { showTaskPriority, showTaskStatus } from '@/utils/showStatusStyle'

import type { Task } from '@/models/Task'
import type { User } from '@/models/User'
import type { Project } from '@/models/Project'

import StatusIndicator from '@/components/status-indicator.vue'
import UserContainer from '@/components/user-container.vue'

const props = defineProps<{
  tasks: Task[]
  columns: {
    start_date?: boolean
    end_date?: boolean
    name?: boolean
    description?: boolean
    assignees?: boolean
    project?: boolean
    priority?: boolean
    status?: boolean
  }
}>()

const { elems: fetchedProject, fetchProjectById } = useSupabase()
const { elems: fetchedUser, fetchUserById } = useSupabase()

const userMap: Record<string, User> = {}
const projectMap: Record<string, Project> = {}

const isDataLoading = ref(true)

const activeColumns = computed(() => Object.values(props.columns).filter(Boolean).length)

onMounted(async () => {
  const userPromises: Promise<void>[] = []
  const projectPromises: Promise<void>[] = []

  for (const task of props.tasks) {
    if (props.columns.assignees) {
      for (const id of task.assignees_ids) {
        if (!userMap[id]) {
          userPromises.push(
            fetchUserById(id).then(() => {
              userMap[id] = fetchedUser.value as User
            }),
          )
        }
      }
    }

    if (props.columns.project) {
      if (!projectMap[task.project_id]) {
        projectPromises.push(
          fetchProjectById(task.project_id).then(() => {
            projectMap[task.project_id] = fetchedProject.value as Project
          }),
        )
      }
    }
  }

  await Promise.all([...userPromises, ...projectPromises])
  isDataLoading.value = false
})
</script>

<template>
  <div v-if="isDataLoading">Loading...</div>
  <div v-else>
    <table class="min-w-full">
      <thead class="border-b-2 border-gray-400 rounded-lg">
        <tr
          class="py-2 text-blue-300"
          :style="{ display: 'grid', gridTemplateColumns: `repeat(${activeColumns}, 1fr)` }"
        >
          <th v-if="columns.start_date">Start date</th>
          <th v-if="columns.end_date">Due date</th>
          <th v-if="columns.name">Name</th>
          <th v-if="columns.description">Description</th>
          <th v-if="columns.assignees">Assignees</th>
          <th v-if="columns.project">Project</th>
          <th v-if="columns.priority">Priority</th>
          <th v-if="columns.status">Status</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-500">
        <tr
          v-for="task in props.tasks"
          :key="task.id"
          class="py-4 items-center"
          :style="{ display: 'grid', gridTemplateColumns: `repeat(${activeColumns}, 1fr)` }"
        >
          <td v-if="columns.start_date" class="flex justify-center">
            {{ task.start_date }}
          </td>
          <td v-if="columns.end_date" class="flex justify-center">
            {{ task.end_date }}
          </td>
          <td v-if="columns.name">
            <router-link :to="`/workspace/task/${task.id}`" class="font-semibold">
              {{ task.name }}
            </router-link>
          </td>
          <td v-if="columns.description">{{ task.description }}</td>
          <td v-if="columns.assignees" class="flex flex-col gap-2">
            <template v-for="id in task.assignees_ids">
              <UserContainer v-if="userMap[id]" :key="id" :user="userMap[id]" />
            </template>
          </td>
          <td v-if="columns.project" class="flex justify-center">
            <router-link
              v-if="projectMap[task.project_id]"
              :to="`/workspace/project/${task.project_id}`"
              class="font-semibold"
            >
              {{ projectMap[task.project_id].name }}
            </router-link>
          </td>
          <td v-if="columns.priority" class="flex justify-center">
            <StatusIndicator v-if="task.priority" :msg="showTaskPriority()[task.priority][0]" :variant="showTaskPriority()[task.priority][1]" />
          </td>
          <td v-if="columns.status" class="flex justify-center">
            <StatusIndicator :msg="showTaskStatus()[task.status][0]" :variant="showTaskStatus()[task.status][1]" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
th,
td {
  padding: 0.5rem;
  text-align: center;
}
</style>
