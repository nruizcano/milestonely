<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toast-notification'

import { useUserStore } from '@/stores/user'
import { useToggleExpand } from '@/composables/useToggleExpand'
import { showProjectStatus } from '@/utils/showStatusStyle'
import { useSupabase } from '@/composables/useSupabase'

import type { Project } from '@/models/Project'
import { ProjectStatus } from '@/models/Project'
import type { User } from '@/models/User'
import type { Task } from '@/models/Task'
import { TaskStatus } from '@/models/Task'
import type { Team } from '@/models/Team'

import LoadingSpinner from '@/components/loading-spinner.vue'
import EditButton from '@/components/buttons/edit-button.vue'
import DeleteButton from '@/components/buttons/delete-button.vue'
import SmallTextButton from '@/components/buttons/small-text-button.vue'
import StatusIndicator from '@/components/status-indicator.vue'
import UserContainer from '@/components/user-container.vue'
import TaskTable from '@/components/task-table.vue'
import TeamContainer from '@/components/team-container.vue'
import NewTaskPopup from '@/components/popups/new-task-popup.vue'
import NewTeamPopup from '@/components/popups/new-team-popup.vue'
import AddMemberPopup from '@/components/popups/add-member-popup.vue'
import DelProjectPopup from '@/components/popups/del-project-popup.vue'

import searchIcon from '@/assets/icons/search.png'
import '@/assets/dropdown.css';

const route = useRoute()
const router = useRouter()
const toast = useToast()
const userStore = useUserStore()

const { expanded, toggleExpand } = useToggleExpand()

const {
  errMsg: projectErr,
  elems: fetchedProject,
  projectServiceInstance,
  fetchProjectById,
} = useSupabase()
const { errMsg: ownerErr, elems: fetchedUser, fetchUserById } = useSupabase()
const { errMsg: tasksErr, elems: fetchedTasks, fetchTasksByProject } = useSupabase()
const { errMsg: teamsErr, elems: fetchedTeams, fetchTeamsByProject } = useSupabase()
const { errMsg: searchedUsersErr, elems: fetchedSearchedUsers, fetchSearchUser } = useSupabase()

const project = computed(() => fetchedProject.value as Project)
const projectDates = ref<[Date | undefined, Date | undefined]>([undefined, undefined])
const user = computed(() => fetchedUser.value as User)
const tasks = computed(() => fetchedTasks.value as Task[])
const teams = computed(() => fetchedTeams.value as Team[])
const searchedUsers = computed(() => fetchedSearchedUsers.value as User[])

const projectId = route.params.id as string
const userId = userStore.getUserId as string
const usersMap = ref<Record<string, User>>({})
const editProject = reactive<Partial<Project>>({})
const tasksFilter = ref<TaskStatus | 'All'>('All')
const inputUserInfoToSearch = ref<string>('')
const newTeamMemberId = ref<string>('')

const isOwner = computed(() => userId === project.value.owner_id)
const userBelongsToProject = computed(() => {
  for (const team of teams.value) {
    if (team.members_ids.includes(userId)) {
      return true
    }
  }
  return false
})

const isProjectLoading = ref(true)
const isOwnerLoading = ref(true)
const isTeamsLoading = ref(true)
const isTeamMembersLoading = ref(true)
const isTasksLoading = ref(true)
const isTaskAssigneesLoading = ref(true)
const isSearchLoading = ref(false)

const isEditingProjectName = ref(false)
const isEditingProjectDescription = ref(false)

const isDeleteProjectPopupOpen = ref(false)
const isTaskPopupOpen = ref(false)
const isTeamPopupOpen = ref(false)
const isAddMemberPopupOpen = ref(false)

const getTeamMembers = async () => {
  isTeamMembersLoading.value = true

  try {
    for (const team of teams.value) {
      for (const memberId of team.members_ids) {
        if (!usersMap.value[memberId]) {
          await fetchUserById(memberId)
          usersMap.value[memberId] = user.value
        }
      }
      isTeamMembersLoading.value = false
    }
  } finally {
    isTeamsLoading.value = false
  }
}

const getTasks = async () => {
  isTasksLoading.value = true

  try {
    await fetchTasksByProject(projectId)

    if (!tasksErr.value && tasks.value.length > 0) {
      for (const task of tasks.value) {
        for (const assigneeId of task.assignees_ids) {
          if (!usersMap.value[assigneeId]) {
            await fetchUserById(assigneeId)
            usersMap.value[assigneeId] = user.value
          }
        }
      }
      isTaskAssigneesLoading.value = false
    }
  } finally {
    isTasksLoading.value = false
  }
}

onMounted(async () => {
  if (!projectId) return

  await Promise.all([
    fetchProjectById(projectId)
      .then(async () => {
        if (projectErr.value || !project.value) return
        const ownerId = project.value?.owner_id
        await fetchUserById(ownerId)
        usersMap.value[ownerId] = user.value
      })
      .finally(() => {
        isOwnerLoading.value = false
      }),
    fetchTeamsByProject(projectId),
  ])
    .then(() => {
      if (!isOwner.value && !userBelongsToProject.value) {
        toast.error('You do not have permission to view this project.')
        router.push('/workspace')
        return
      }
      projectDates.value = [
        project.value?.start_date ? new Date(project.value?.start_date) : undefined,
        project.value?.end_date ? new Date(project.value?.end_date) : undefined,
      ]
    })
    .finally(() => {
      isProjectLoading.value = false
    })

  await Promise.all([getTasks(), getTeamMembers()])
})

const handleEditProject = async () => {
  await projectServiceInstance.update(editProject, projectId)

  if (projectErr.value) {
    toast.error(projectErr.value)
    return
  }

  toast.success('Project updated successfully')

  isEditingProjectName.value = false
  isEditingProjectDescription.value = false

  await fetchProjectById(projectId)
}

const handleSearchedUsers = async () => {
  if (!inputUserInfoToSearch.value) return
  isSearchLoading.value = true

  try {
    await fetchSearchUser(inputUserInfoToSearch.value)
    expanded.value.searchResults = true
  } finally {
    isSearchLoading.value = false
  }
}

const filteredTasks = computed(() => {
  if (!tasks.value) return []

  const auxTasks = tasks.value

  return auxTasks.filter((task) =>
    tasksFilter.value === 'All'
      ? true
      : TaskStatus[task.status as keyof typeof TaskStatus] === tasksFilter.value,
  )
})
</script>

<template>
  <div class="flex gap-12 sm:gap-24 w-full">
    <LoadingSpinner v-if="isProjectLoading" />
    <p v-else-if="projectErr" class="data-msg">{{ projectErr }}</p>
    <section v-else class="flex flex-col self-center gap-12 w-full lg:w-3/4 xl:w-1/2">
      <div>
        <form
          v-if="isEditingProjectName"
          class="flex flex-row gap-2"
          @submit.prevent="handleEditProject()"
        >
          <input v-model="editProject.name" type="text" placeholder="Name" class="edit-elem" />
          <EditButton variant="save" type="submit" class="flex self-end" />
        </form>
        <div v-else class="flex items-end gap-2">
          <h1 class="!mb-0">{{ project.name }}</h1>
          <EditButton
            v-if="isOwner"
            variant="edit"
            @click="
              ((isEditingProjectName = true),
              (isEditingProjectDescription = false),
              (editProject.name = project.name))
            "
          />
        </div>
      </div>

      <div>
        <form
          v-if="isEditingProjectDescription"
          class="flex flex-row gap-2 w-full"
          @submit.prevent="handleEditProject()"
        >
          <textarea
            id="description"
            v-model="editProject.description"
            placeholder="Description"
            rows="3"
            class="edit-elem w-full resize-none"
          />
          <EditButton variant="save" type="submit" class="flex self-end" />
        </form>
        <p v-else>
          {{ project.description }}
          <EditButton
            v-if="isOwner"
            variant="edit"
            @click="
              ((isEditingProjectDescription = true),
              (isEditingProjectName = false),
              (editProject.description = project.description))
            "
          />
        </p>
      </div>

      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <VueDatePicker
            v-if="isOwner"
            v-model="projectDates"
            :range="true"
            :enable-time-picker="false"
            :clearable="true"
            :action-row="{ showCancel: true }"
            :format="'dd/MM/yyyy'"
            select-text="Select"
            @update:model-value="
              ((editProject.start_date = $event[0]),
              (editProject.end_date = $event[1]),
              handleEditProject())
            "
          />
          <p v-else>
            Start date: {{ project.start_date }}
            <br />
            Due date: {{ project.end_date }}
          </p>
          <DeleteButton v-if="isOwner" @click="isDeleteProjectPopupOpen = true" />
        </div>

        <div class="relative inline-block">
          <StatusIndicator
            :msg="showProjectStatus()[project.status][0]"
            :variant="showProjectStatus()[project.status][1]"
            @click="isOwner ? toggleExpand('projectStatus') : null"
          />
          <div v-if="expanded.projectStatus" class="dropdown">
            <ul class="dropdown-options-container items-center list-none">
              <li v-for="status in Object.keys(ProjectStatus)" :key="status">
                <StatusIndicator
                  v-if="status !== project.status"
                  :msg="showProjectStatus()[status][0]"
                  :variant="showProjectStatus()[status][1]"
                  @click="
                    (toggleExpand('projectStatus'),
                    (editProject.status = status as ProjectStatus),
                    handleEditProject())
                  "
                />
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="flex items-center">
        <div v-if="!isOwnerLoading && !ownerErr" class="flex items-center">
          <p class="font-semibold text-lg mr-4">Owner:</p>
          <UserContainer :user="usersMap[project.owner_id]" />
        </div>
        <p v-else class="data-msg">{{ ownerErr }}</p>
      </div>
    </section>

    <hr />

    <div class="flex flex-col lg:flex-row gap-16">
      <section class="w-full">
        <span class="flex flex-row items-center gap-12 mb-6">
          <h2>Tasks</h2>
          <ul class="flex flex-row gap-4">
            <li v-for="option in ['All', ...Object.values(TaskStatus)]" :key="option">
              <button
                @click="tasksFilter = option as TaskStatus | 'All'"
                :disabled="isTasksLoading || tasksErr ? true : false"
                :class="[
                  'px-2 py-1 hover:text-red-300',
                  tasksFilter === option ? 'hover:text-white bg-red-200 hover:bg-red-300 text-black' : '',
                ]"
              >
                {{ option === 'All' ? 'All' : option.replace('_', ' ') }}
              </button>
            </li>
          </ul>
        </span>
        <LoadingSpinner v-if="isTasksLoading" />
        <p v-else-if="tasksErr" class="data-msg">{{ tasksErr }}</p>
        <p v-else-if="filteredTasks.length === 0" class="data-msg">There are no tasks.</p>
        <TaskTable
          v-else
          :tasks="filteredTasks"
          :columns="{
            start_date: true,
            end_date: true,
            name: true,
            description: true,
            assignees: true,
            priority: true,
            status: true,
          }"
        />
        <button
          v-if="isOwner && !isTasksLoading"
          @click="isTaskPopupOpen = true"
          class="new-elem flex justify-self-center mt-4 px-4 py-2"
        >
          New task
        </button>
      </section>

      <section class="max-w-[350px] grid grid-cols-1 w-full gap-8 self-center">
        <div v-if="isOwner && !isTeamsLoading" class="relative inline-block">
          <div class="flex">
            <input
              v-model="inputUserInfoToSearch"
              placeholder="Search user"
              @keyup.enter="handleSearchedUsers()"
              class="w-full rounded-r-none"
            />
            <button
              @click="handleSearchedUsers()"
              class="bg-blue-300 hover:bg-blue-400 dark:bg-blue-400 dark:hover:bg-blue-300 py-1 px-2 rounded-r"
            >
              <img :src="searchIcon" alt="Search" class="w-7 h-6 opacity-70" />
            </button>
          </div>
          <div v-if="expanded.searchResults" class="dropdown w-full">
            <ul
              v-if="!isSearchLoading"
              class="dropdown-options-container items-center justify-center list-none flex"
            >
              <p v-if="searchedUsersErr" class="data-msg">
                {{ searchedUsersErr }}
              </p>
              <p v-else-if="searchedUsers.length === 0" class="data-msg">User not found.</p>
              <li
                v-else
                v-for="user in searchedUsers"
                :key="user.id"
                class="flex items-center justify-between w-full px-2"
              >
                <UserContainer :user="user" />
                <SmallTextButton
                  msg="Add"
                  variant="green"
                  @click="
                    ((newTeamMemberId = user.id),
                    (isAddMemberPopupOpen = true),
                    toggleExpand('searchResults'))
                  "
                />
              </li>
            </ul>
          </div>
        </div>
        <div>
          <LoadingSpinner v-if="isTeamsLoading" />
          <p v-else-if="teamsErr" class="data-msg">{{ teamsErr }}</p>
          <p v-else-if="teams.length === 0" class="data-msg">
            There are no teams for this project.
          </p>
          <ul v-else class="flex flex-col gap-6">
            <li v-for="team in teams" :key="team.id">
              <TeamContainer :team="team" />
            </li>
          </ul>
          <button
            v-if="isOwner && !isTeamsLoading"
            @click="isTeamPopupOpen = true"
            class="new-elem flex justify-self-center mt-4 px-4 py-2"
          >
            New team
          </button>
        </div>
      </section>
    </div>

    <NewTaskPopup
      v-if="isTaskPopupOpen"
      :userId="userId"
      :projectId="projectId"
      @close="isTaskPopupOpen = false"
      @refresh="fetchTasksByProject(projectId)"
    />

    <NewTeamPopup
      v-if="isTeamPopupOpen"
      :userId="userId"
      :projectId="projectId"
      @close="isTeamPopupOpen = false"
      @refresh="fetchTeamsByProject(projectId)"
    />

    <AddMemberPopup
      v-if="isAddMemberPopupOpen"
      :teams="teams"
      :userId="newTeamMemberId"
      @close="isAddMemberPopupOpen = false"
      @refresh="fetchTeamsByProject(projectId)"
    />

    <DelProjectPopup
      v-if="isDeleteProjectPopupOpen"
      :projectId="projectId"
      @close="isDeleteProjectPopupOpen = false"
    />
  </div>
</template>
