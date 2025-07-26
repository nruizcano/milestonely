<script setup lang="ts">
import { useSupabase } from '@/composables/useSupabase'
import { useToast } from 'vue-toast-notification'

import CloseButton from '@/components/buttons/close-button.vue'
import '@/assets/popup.css'
import '@/assets/forms.css'

const toast = useToast()

const { errMsg, teamServiceInstance } = useSupabase()

const props = defineProps<{
  teamId: string
}>()

const emit = defineEmits(['close', 'refresh'])

const deleteTeam = async () => {
  const teamId = props.teamId
  if (!teamId) return

  await teamServiceInstance.delete(teamId)

  if (errMsg.value) {
    toast.error(errMsg.value)
    return
  }

  toast.success('The team was deleted')
  emit('close')
  emit('refresh')
}
</script>

<template>
  <div class="popup-overlay">
    <div class="popup-frame">
      <CloseButton @click="emit('close')" />
      <h1>Delete team</h1>
      <p>Confirm that you want to delete this team and its members.</p>
      <p>Be mindful that this action cannot be undone.</p>
      <div>
        <button @click="deleteTeam()" class="submit-button">Confirm</button>
      </div>
    </div>
  </div>
</template>
