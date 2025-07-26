<script setup lang="ts">
import { computed, reactive } from 'vue'
import { useToast } from 'vue-toast-notification'
import { useSupabase } from '@/composables/useSupabase'

import type { Team } from '@/models/Team'

import CloseButton from '@/components/buttons/close-button.vue'
import '@/assets/popup.css'
import '@/assets/forms.css'

const toast = useToast()

const { errMsg, teamServiceInstance } = useSupabase()

const props = defineProps<{
  teams: Team[]
  userId: string
}>()

const emit = defineEmits(['close', 'refresh'])

const input = reactive<Partial<Team>>({})

const filteredTeams = computed(() => {
  return props.teams.filter((team) => !team.members_ids?.includes(props.userId))
})

const handleSubmit = async () => {
  const teamId = input.id
  if (!teamId) return

  const team = filteredTeams.value.find((team) => team.id === teamId)
  if (!team) return

  input.members_ids = [...team.members_ids, props.userId]

  await teamServiceInstance.update(input, teamId)

  if (errMsg.value) {
    toast.error(errMsg.value)
    return
  }

  toast.success('Team updated successfully')
  emit('close')
  emit('refresh')
}
</script>

<template>
  <div class="popup-overlay">
    <div class="popup-frame">
      <h1>Add to team</h1>
      <CloseButton @click="emit('close')" />
      <form @submit.prevent="handleSubmit()">
        <div>
          <label for="id">Team <strong>*</strong></label>
          <select id="id" v-model="input.id" required>
            <option v-if="filteredTeams.length === 0" value="">No teams available</option>
            <option v-else v-for="team in filteredTeams" :key="team.id" :value="team.id">
              {{ team.name }}
            </option>
          </select>
        </div>
        <button type="submit" className="submit-button">Add</button>
      </form>
    </div>
  </div>
</template>
