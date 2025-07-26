<script setup lang="ts">
import { reactive } from 'vue'
import { useToast } from 'vue-toast-notification'
import { useSupabase } from '@/composables/useSupabase'

import { Team } from '@/models/Team'

import CloseButton from '@/components/buttons/close-button.vue'
import '@/assets/popup.css'
import '@/assets/forms.css'

const toast = useToast()

const { errMsg, teamServiceInstance } = useSupabase()

const props = defineProps<{
  projectId: string
}>()

const emit = defineEmits(['close', 'refresh'])

const input = reactive<Team>(new Team('', props.projectId, []))

const handleSubmit = async () => {
  if (!input.name || !input.project_id) return

  await teamServiceInstance.create(input)

  if (errMsg.value) {
    toast.error(errMsg.value)
  }

  toast.success('Team created successfully')
  emit('close')
  emit('refresh')
}
</script>

<template>
  <div class="popup-overlay">
    <div class="popup-frame">
      <h1>New team</h1>
      <CloseButton @click="emit('close')" />
      <form @submit.prevent="handleSubmit()">
        <div>
          <label htmlFor="name"> Name <strong>*</strong> </label>
          <input id="name" v-model="input.name" type="text" placeholder="Name" required />
        </div>
        <button type="submit" className="submit-button">Create team</button>
      </form>
    </div>
  </div>
</template>
