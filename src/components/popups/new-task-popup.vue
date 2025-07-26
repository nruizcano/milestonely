<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useToast } from 'vue-toast-notification'
import { useSupabase } from '@/composables/useSupabase'

import { Task, TaskPriority } from '@/models/Task'

import CloseButton from '@/components/buttons/close-button.vue'
import '@/assets/popup.css'
import '@/assets/forms.css'

const toast = useToast()

const { errMsg, taskServiceInstance } = useSupabase()

const props = defineProps<{
  projectId: string
}>()

const emit = defineEmits(['close', 'refresh'])

const input = reactive<Task>(new Task('', props.projectId, null, null, '', [], null))
const taskDates = ref<[Date, Date]>()

const handleSubmit = async () => {
  if (!input.name || !input.project_id) return

  await taskServiceInstance.create(input)

  if (errMsg.value) {
    toast.error(errMsg.value)
  }

  toast.success('Task created successfully')
  emit('close')
  emit('refresh')
}



</script>

<template>
  <div class="popup-overlay">
    <div class="popup-frame">
      <h1>New task</h1>
      <CloseButton @click="emit('close')" />
      <form @submit.prevent="handleSubmit()">
        <div>
          <label for="name">Name <strong>*</strong></label>
          <input id="name" v-model="input.name" type="text" placeholder="Name" required />
        </div>

        <div>
          <label for="description">Description</label>
          <textarea
            id="description"
            v-model="input.description"
            placeholder="Description"
            rows="4"
            class="text-slate-800 bg-white rounded-md p-4 shadow-md resize-none"
          />
        </div>

        <div>
          <label for="priority">Priority</label>
          <select id="priority" v-model="input.priority">
            <option :value="null">-</option>
            <option v-for="priority in Object.values(TaskPriority)" :key="priority">
              {{ priority }}
            </option>
          </select>
        </div>

        <div>
          <label for="start_date, end_date">Dates</label>
          <VueDatePicker
            v-model="taskDates"
            :range="true"
            :enable-time-picker="false"
            :clearable="true"
            :action-row="{ showCancel: true }"
            :format="'dd/MM/yyyy'"
            select-text="Select"
            @update:model-value="((input.start_date = $event[0]), (input.end_date = $event[1]))"
          />
        </div>

        <button type="submit" className="submit-button">Create task</button>
      </form>
    </div>
  </div>
</template>
