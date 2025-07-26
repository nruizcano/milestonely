<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useSupabase } from '@/composables/useSupabase'
import { useToast } from 'vue-toast-notification'

import CloseButton from '@/components/buttons/close-button.vue'
import '@/assets/popup.css'
import '@/assets/forms.css'

const router = useRouter()
const toast = useToast()

const { errMsg, taskServiceInstance } = useSupabase()

const props = defineProps<{
  taskId: string
  projectId: string
}>()

const emit = defineEmits(['close'])

const deleteTask = async () => {
  if (!props.taskId) return

  await taskServiceInstance.delete(props.taskId)

  if (errMsg.value) {
    toast.error(errMsg.value)
    return
  }

  toast.success('The task was deleted')
  router.push(`/workspace/project/${props.projectId}`)
}
</script>

<template>
  <div class="popup-overlay">
    <div class="popup-frame">
      <CloseButton @click="emit('close')" />
      <h1>Delete task</h1>
      <p>Confirm that you want to delete this task and its comments.</p>
      <p>Be mindful that this action cannot be undone.</p>
      <div>
        <button @click="deleteTask()" class="submit-button">Confirm</button>
      </div>
    </div>
  </div>
</template>
