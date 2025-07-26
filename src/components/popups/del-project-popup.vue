<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useSupabase } from '@/composables/useSupabase'
import { useToast } from 'vue-toast-notification'

import CloseButton from '@/components/buttons/close-button.vue'
import '@/assets/popup.css'
import '@/assets/forms.css'

const router = useRouter()
const toast = useToast()

const { errMsg, projectServiceInstance } = useSupabase()

const props = defineProps<{
  projectId: string
}>()

const emit = defineEmits(['close'])

const deleteProject = async () => {
  if (!props.projectId) return

  await projectServiceInstance.delete(props.projectId)

  if (errMsg.value) {
    toast.error(errMsg.value)
    return
  }

  toast.success('The project was deleted')
  router.push('/workspace')
}
</script>

<template>
  <div class="popup-overlay">
    <div class="popup-frame">
      <CloseButton @click="emit('close')" />
      <h1>Delete project</h1>
      <p>Confirm that you want to delete this project and all of its information.</p>
      <p>Be mindful that this action cannot be undone.</p>
      <button @click="deleteProject()" class="submit-button">Confirm</button>
    </div>
  </div>
</template>
