<script setup lang="ts">
import { ref } from 'vue'
import { useSupabase } from '@/composables/useSupabase'
import { useToast } from 'vue-toast-notification'

import type { Task } from '@/models/Task'

import CloseButton from '@/components/buttons/close-button.vue'
import '@/assets/popup.css'
import '@/assets/forms.css'

const toast = useToast()

const { errMsg, taskServiceInstance } = useSupabase()

const props = defineProps<{
  task: Task
  userId: string
}>()

const emit = defineEmits(['close', 'refresh'])

const editTask = ref<Partial<Task>>({})

const removeAssignee = async () => {
  const task = props.task
  const taskId = task.id
  const userId = props.userId

  if (!taskId || !userId) return

  editTask.value = { assignees_ids: task.assignees_ids?.filter((id) => id !== userId) }

  await taskServiceInstance.update(editTask.value, taskId)

  if (errMsg.value) {
    toast.error(errMsg.value)
    return
  }

  toast.success('User was removed from the assignees successfully')
  emit('close')
  emit('refresh')
}
</script>

<template>
  <div class="popup-overlay">
    <div class="popup-frame">
      <CloseButton @click="emit('close')" />
      <h1>Remove assignee</h1>
      <p>Confirm that you want to remove this member from the assignees.</p>
      <button @click="removeAssignee()" class="submit-button">Confirm</button>
    </div>
  </div>
</template>
