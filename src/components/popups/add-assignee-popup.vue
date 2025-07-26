<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useToast } from 'vue-toast-notification'
import { useSupabase } from '@/composables/useSupabase'

import type { Task } from '@/models/Task'
import type { Team } from '@/models/Team'
import type { User } from '@/models/User'

import CloseButton from '@/components/buttons/close-button.vue'
import '@/assets/popup.css'
import '@/assets/forms.css'

const toast = useToast()

const { errMsg, taskServiceInstance } = useSupabase()
const { errMsg: teamsErr, elems: fetchedTeams, fetchTeamsByProject } = useSupabase()
const { elems: fetchedUser, fetchUserById } = useSupabase()

const teams = computed(() => fetchedTeams.value as Team[])
const user = computed(() => fetchedUser.value as User)

const props = defineProps<{
  task: Task
}>()

const emit = defineEmits(['close', 'refresh'])

const input = ref<string[]>([])
const membersMap = ref<Record<string, User>>({})

const getUnassignedMembers = async () => {
  for (const team of teams.value) {
    if (!team.members_ids) continue
    for (const member of team.members_ids) {
      if (!props.task.assignees_ids?.includes(member) && !membersMap.value[member]) {
        await fetchUserById(member)
        membersMap.value[member] = user.value
      }
    }
  }
}

onMounted(async () => {
  await fetchTeamsByProject(props.task.project_id)
  if (teamsErr.value) {
    toast.error("Error fetching project's participants")
    return
  }
  await getUnassignedMembers()
})

const handleSubmit = async () => {
  const updatedTask = props.task

  updatedTask.assignees_ids.push(...input.value)

  await taskServiceInstance.update(updatedTask, updatedTask.id as string)

  if (errMsg.value) {
    toast.error(errMsg.value)
    return
  }

  toast.success('Assignee added successfully')
  emit('close')
  emit('refresh')
}
</script>

<template>
  <div class="popup-overlay">
    <div class="popup-frame">
      <h1>Add assignees</h1>
      <CloseButton @click="emit('close')" />
      <form @submit.prevent="handleSubmit()">
        <div>
          <label for="id" class="italic">(Project participants)</label>
          <select id="id" v-model="input" multiple required class="flex w-full min-h-48">
            <option v-if="Object.keys(membersMap).length === 0" value="" disabled>
              No more assignees available
            </option>
            <option v-else v-for="member in membersMap" :key="member.id" :value="member.id">
              {{ member.first_name }} {{ member.last_name }}
            </option>
          </select>
        </div>
        <button type="submit" className="submit-button">Add</button>
      </form>
    </div>
  </div>
</template>
