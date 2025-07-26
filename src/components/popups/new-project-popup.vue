<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useToast } from 'vue-toast-notification'
import { useSupabase } from '@/composables/useSupabase'

import { Project } from '@/models/Project'

import CloseButton from '@/components/buttons/close-button.vue'
import '@/assets/popup.css'
import '@/assets/forms.css'

const toast = useToast()
const { errMsg, projectServiceInstance } = useSupabase()

const props = defineProps<{
  userId: string
}>()

const emit = defineEmits(['close', 'refresh'])

const input = reactive<Project>(new Project('', props.userId, null, null, ''))
const projectDates = ref<[Date, Date]>()

const handleSubmit = async () => {
  if (!input.owner_id || !input.name) return

  await projectServiceInstance.create(input)

  if (errMsg.value) {
    toast.error(errMsg.value)
    return
  }

  toast.success('Project created successfully')
  emit('close')
  emit('refresh')
}
</script>

<template>
  <div class="popup-overlay">
    <div class="popup-frame">
      <h1>New project</h1>
      <CloseButton @click="emit('close')" />
      <form @submit.prevent="handleSubmit()">
        <div>
          <label for="name"> Name <strong>*</strong> </label>
          <input id="name" v-model="input.name" type="text" placeholder="Name" required />
        </div>

        <div>
          <label for="description">Description</label>
          <textarea
            id="description"
            v-model="input.description"
            placeholder="Description"
            rows="4"
            class="resize-none"
          />
        </div>

        <div>
          <label for="start_date, end_date">Dates</label>
          <VueDatePicker
            v-model="projectDates"
            :range="true"
            :enable-time-picker="false"
            :clearable="true"
            :action-row="{ showCancel: true }"
            :format="'dd/MM/yyyy'"
            select-text="Select"
            @update:model-value="((input.start_date = $event[0]), (input.end_date = $event[1]))"
          />
        </div>

        <button type="submit" class="submit-button">Create project</button>
      </form>
    </div>
  </div>
</template>
