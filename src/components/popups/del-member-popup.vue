<script setup lang="ts">
import { ref } from 'vue'
import { useSupabase } from '@/composables/useSupabase'
import { useToast } from 'vue-toast-notification'

import type { Team } from '@/models/Team'

import CloseButton from '@/components/buttons/close-button.vue'
import '@/assets/popup.css'
import '@/assets/forms.css'

const toast = useToast()

const { errMsg, teamServiceInstance } = useSupabase()

const props = defineProps<{
  team: Team
  userId: string
}>()

const emit = defineEmits(['close', 'refresh'])

const editTeam = ref<Partial<Team>>({})

const removeMember = async () => {
  const team = props.team
  const teamId = team.id
  const userId = props.userId

  if (!teamId || !userId) return

  editTeam.value = { members_ids: team.members_ids?.filter((id) => id !== userId) }

  await teamServiceInstance.update(editTeam.value, teamId)

  if (errMsg.value) {
    toast.error(errMsg.value)
    return
  }

  toast.success('User was removed from the team successfully')
  emit('close')
  emit('refresh')
}
</script>

<template>
  <div class="popup-overlay">
    <div class="popup-frame">
      <CloseButton @click="emit('close')" />
      <h1>Remove member</h1>
      <p>Confirm that you want to remove this member from the team.</p>
      <button @click="removeMember()" class="submit-button">Confirm</button>
    </div>
  </div>
</template>
