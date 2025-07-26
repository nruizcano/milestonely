<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useToast } from 'vue-toast-notification'
import { useUserStore } from '@/stores/user'
import { useSupabase } from '@/composables/useSupabase'

import type { Team } from '@/models/Team'
import type { Project } from '@/models/Project'
import type { User } from '@/models/User'

import EditButton from '@/components/buttons/edit-button.vue'
import DeleteButton from '@/components/buttons/delete-button.vue'
import UserContainer from '@/components/user-container.vue'
import DelTeamPopup from './popups/del-team-popup.vue'
import DelMemberPopup from './popups/del-member-popup.vue'

const route = useRoute()
const toast = useToast()
const userStore = useUserStore()

const props = defineProps<{ team: Team; showProjectName?: boolean }>()

const { errMsg: teamErr, teamServiceInstance } = useSupabase()
const { elems: fetchedProject, fetchProjectById } = useSupabase()
const { elems: fetchedUser, fetchUserById } = useSupabase()

const project = computed(() => fetchedProject.value as Project)
const user = computed(() => fetchedUser.value as User)

const teamId = props.team.id as string

const userId = userStore.getUserId as string
const isOwner = computed(() => userId === project?.value?.owner_id)
const isProjectPage = computed(() => route.path.includes('/workspace/project/'))

const memberToRemove = ref<string>('')
const memberCount = ref<number>(props.team.members_ids?.length ?? 0)

const usersMap = ref<Record<string, User>>({})

const isDataLoading = ref(true)

const isDeleteTeamPopupOpen = ref(false)
const isDelMemberPopupOpen = ref(false)
const isEditingTeamName = ref(false)

const editTeam = reactive<Partial<Team>>({ name: props.team.name })

const getProjectData = async () => {
  const projectId = props.team.project_id
  if (!projectId) return
  await fetchProjectById(projectId)
}

const getUsersData = async () => {
  const membersIds = props.team.members_ids
  if (!membersIds) return

  for (const memberId of membersIds) {
    await fetchUserById(memberId)
    usersMap.value[memberId] = user.value
  }
}

onMounted(async () => {
  await Promise.all([getProjectData(), getUsersData()])
  isDataLoading.value = false
})

const handleEditTeam = async () => {
  await teamServiceInstance.update(editTeam, teamId)

  if (teamErr.value) {
    toast.error(teamErr.value)
    return
  }

  toast.success('Team updated successfully')
  isEditingTeamName.value = false
}

const reloadPage = () => {
  window.location.reload()
}
</script>

<template>
  <div
    class="flex flex-col border-2 bg-white border-gray-200 dark:bg-slate-700 dark:border-0 rounded-lg p-8"
  >
    <DeleteButton v-if="isOwner && isProjectPage" @click="isDeleteTeamPopupOpen = true" class="flex self-end" />

    <form v-if="isEditingTeamName" class="flex flex-row gap-2" @submit.prevent="handleEditTeam()">
      <input v-model="editTeam.name" type="text" placeholder="Name" class="edit-elem" />
      <EditButton variant="save" type="submit" class="flex self-end" />
    </form>

    <div v-else class="flex items-end justify-center gap-1">
      <h2>{{ editTeam.name || 'Team' }}</h2>
      <EditButton v-if="isOwner && isProjectPage" variant="edit" @click="isEditingTeamName = true" />
    </div>

    <router-link
      v-if="showProjectName"
      :to="`/workspace/project/${project?.id}`"
      class="flex justify-center text-gray-300">
      {{ project?.name }}
    </router-link>

    <div class="my-8">
      <hr />
      <span class="flex justify-center text-gray-400 text-sm mt-2">
        {{ memberCount }} members
      </span>
    </div>

    <ul class="flex flex-col gap-2">
      <li v-for="user in usersMap" :key="user.id" class="flex items-center justify-between">
        <UserContainer :user="user" />
        <button
          v-if="isOwner && isProjectPage"
          @click="((memberToRemove = user.id), (isDelMemberPopupOpen = true))"
          class="remove-button"
        >
          Remove
        </button>
      </li>
    </ul>

    <DelMemberPopup
      v-if="isDelMemberPopupOpen"
      :team="team"
      :userId="memberToRemove"
      @close="isDelMemberPopupOpen = false"
      @refresh="reloadPage()"
    />

    <DelTeamPopup
      v-if="isDeleteTeamPopupOpen"
      :teamId="teamId"
      @close="isDeleteTeamPopupOpen = false"
      @refresh="reloadPage()"
    />
  </div>
</template>
