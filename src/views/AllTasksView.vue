<script setup lang="ts">
import { ref, onMounted } from 'vue'

import { useUserStore } from '@/stores/user'
import { getTasks } from '@/utils/myProjectElems'

import LoadingSpinner from '@/components/loading-spinner.vue'
import TaskTable from '@/components/task-table.vue'

import type { Task } from '@/models/Task'

const userStore = useUserStore()
const userId = userStore.getUserId as string

const tasks = ref<Task[] | string>([])
const isDataLoading = ref(true)

onMounted(async () => {
  try {
    const result = await getTasks(userId, null, false)
    tasks.value = result
  } finally {
    isDataLoading.value = false
  }
})
</script>

<template>
  <div>
    <h1>All my tasks</h1>
    <LoadingSpinner v-if="isDataLoading" />
    <p v-else-if="typeof tasks === 'string'" class="flex justify-center">
      {{ tasks }}
    </p>
    <p v-else-if="tasks.length < 1" class="data-msg">You have no tasks assigned.</p>
    <TaskTable
      v-else
      :tasks="tasks"
      :columns="{
        start_date: true,
        end_date: true,
        name: true,
        description: true,
        project: true,
        priority: true,
        status: true,
      }"
    />
  </div>
</template>
