<script setup lang="ts">
import { Project } from '@/models/Project'
import { showProjectStatus } from '@/utils/showStatusStyle';
import StatusIndicator from '@/components/status-indicator.vue'

defineProps<{
  project: Project
}>()
</script>

<template>
  <router-link
    :to="`/workspace/project/${project.id}`"
    class="flex flex-col h-full items-center gap-4 rounded-lg p-6 border-2 bg-gray-50 border-gray-300 hover:border-gray-200 hover:bg-white dark:bg-slate-900 dark:border-gray-600 dark:hover:border-gray-500"
  >
    <h3>{{ project.name }}</h3>
    <p class="text-center">{{ project.description }}</p>
    <StatusIndicator
      :msg="showProjectStatus()[project.status][0]"
      :variant="showProjectStatus()[project.status][1]"
    />
  </router-link>
</template>
