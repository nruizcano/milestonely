<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toast-notification'

import { useUserStore } from '@/stores/user'
import { useToggleExpand } from '@/composables/useToggleExpand'
import { useSupabase } from '@/composables/useSupabase'
import { showTaskPriority, showTaskStatus } from '@/utils/showStatusStyle'

import type { Task } from '@/models/Task'
import { TaskPriority, TaskStatus } from '@/models/Task'
import type { Project } from '@/models/Project'
import type { Team } from '@/models/Team'
import type { User } from '@/models/User'
import { Comment } from '@/models/Comment'

import LoadingSpinner from '@/components/loading-spinner.vue'
import EditButton from '@/components/buttons/edit-button.vue'
import DeleteButton from '@/components/buttons/delete-button.vue'
import SmallTextButton from '@/components/buttons/small-text-button.vue'
import StatusIndicator from '@/components/status-indicator.vue'
import UserContainer from '@/components/user-container.vue'
import DelTaskPopup from '@/components/popups/del-task-popup.vue'
import DelCommentPopup from '@/components/popups/del-comment-popup.vue'
import AddAssigneePopup from '@/components/popups/add-assignee-popup.vue'
import DelAssigneePopup from '@/components/popups/del-assignee-popup.vue'
import '@/assets/dropdown.css';

const route = useRoute()
const router = useRouter()
const toast = useToast()
const userStore = useUserStore()

const { expanded, toggleExpand } = useToggleExpand()

const { errMsg: taskErr, elems: fetchedTask, taskServiceInstance, fetchTaskById } = useSupabase()
const { errMsg: projectErr, elems: fetchedProject, fetchProjectById } = useSupabase()
const { elems: fetchedTeams, fetchTeamsByProject } = useSupabase()
const { elems: fetchedUser, fetchUserById } = useSupabase()
const { errMsg: commentsErr, elems: fetchedComments, fetchCommentsByTask } = useSupabase()
const { errMsg: newCommentErr, commentServiceInstance } = useSupabase()

const task = computed(() => fetchedTask.value as Task)
const taskDates = ref<[Date | undefined, Date | undefined]>([undefined, undefined])
const project = computed(() => fetchedProject.value as Project)
const user = computed(() => fetchedUser.value as User)
const comments = computed(() => fetchedComments.value as Comment[])

const taskId = route.params.id as string
const userId = userStore.getUserId as string
const usersMap = ref<Record<string, User>>({})
const editTask = reactive<Partial<Task>>({})
const inputCommentText = ref('')
const assigneeIdToRemove = ref<string>('')
const commentIdToDelete = ref<string>('')

const isOwner = computed(() => userId === project.value.owner_id)
const isAssignee = computed(() => userId && task.value.assignees_ids?.includes(userId))
const userBelongsToProject = computed(() => {
  for (const team of fetchedTeams.value as Team[]) {
    if (team.members_ids.includes(userId)) {
      return true
    }
  }
  return false
})

const isTaskLoading = ref(true)
const isAssigneesLoading = ref(true)
const isCommentsLoading = ref(true)
const isAuthorsLoading = ref(true)

const isEditingTaskName = ref(false)
const isEditingTaskDescription = ref(false)

const isDeleteTaskPopupOpen = ref(false)
const isDeleteCommentPopupOpen = ref(false)
const isAddAssigneePopupOpen = ref(false)
const isDelAssigneePopupOpen = ref(false)

const getAssignees = async () => {
  const usersIds = task.value?.assignees_ids
  if (!usersIds) return

  isAssigneesLoading.value = true

  try {
    for (const userId of usersIds) {
      if (!usersMap.value[userId]) {
        await fetchUserById(userId)
        usersMap.value[userId] = user.value
      }
    }
  } finally {
    isAssigneesLoading.value = false
  }
}

const getCommentSection = async () => {
  isCommentsLoading.value = true

  try {
    await fetchCommentsByTask(taskId)

    if (!commentsErr.value && comments.value.length > 0) {
      for (const comment of comments.value) {
        const userId = comment.user_id
        if (usersMap.value[userId]) {
          await fetchUserById(userId)
          usersMap.value[userId] = user.value
        }
      }
      isAuthorsLoading.value = false
    }
  } finally {
    isCommentsLoading.value = false
  }
}

onMounted(async () => {
  if (!taskId) return
  await fetchTaskById(taskId)
  if (taskErr.value || !task.value) return

  const projectId = task.value?.project_id

  await Promise.all([
    fetchProjectById(projectId).then(async () => {
      if (projectErr.value || !project.value) return
      const ownerId = project.value?.owner_id
      await fetchUserById(ownerId)
      usersMap.value[ownerId] = user.value
    }),
    fetchTeamsByProject(projectId),
  ])
    .then(() => {
      if (!isOwner.value && !userBelongsToProject.value) {
        toast.error('You do not have permission to view this task.')
        router.push('/workspace')
        return
      }
      taskDates.value = [
        task.value?.start_date ? new Date(task.value?.start_date) : undefined,
        task.value?.end_date ? new Date(task.value?.end_date) : undefined,
      ]
    })
    .finally(() => {
      isTaskLoading.value = false
    })

  await Promise.all([
    getAssignees(),
    getCommentSection().finally(() => {
      if (comments.value.length > 0) {
        comments.value.sort(
          (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
        )
      }
    }),
  ])
})

const handleEditTask = async () => {
  await taskServiceInstance.update(editTask, taskId)

  if (taskErr.value) {
    toast.error(taskErr.value)
    return
  }

  toast.success('Task updated successfully')

  isEditingTaskName.value = false
  isEditingTaskDescription.value = false

  await fetchTaskById(taskId)
  await getAssignees()
}

const handleCommentSubmit = async () => {
  const newComment = new Comment(inputCommentText.value, userId, taskId)

  await commentServiceInstance.create(newComment)

  if (newCommentErr.value) {
    toast.error(newCommentErr.value)
    return
  }

  toast.success('Comment posted successfully!')

  inputCommentText.value = ''
  await getCommentSection()
}
</script>

<template>
  <div class="flex items-center">
    <div class="flex flex-col gap-12 sm:gap-24 w-full xl:w-3/4 2xl:w-1/2 3xl:w-2/5">
      <LoadingSpinner v-if="isTaskLoading" />
      <p v-else-if="taskErr" class="data-msg">{{ taskErr }}</p>
      <section v-else class="flex flex-col gap-12">
        <div>
          <form
            v-if="isEditingTaskName"
            class="flex flex-row gap-2"
            @submit.prevent="handleEditTask()"
          >
            <input v-model="editTask.name" type="text" placeholder="Name" class="edit-elem" />
            <EditButton variant="save" type="submit" class="flex self-end" />
          </form>

          <div v-else class="flex items-end gap-2">
            <h1 class="!mb-0">{{ task.name }}</h1>
            <EditButton
              v-if="isOwner"
              variant="edit"
              @click="
                ((isEditingTaskName = true),
                (isEditingTaskDescription = false),
                (editTask.name = task.name))
              "
            />
          </div>
        </div>

        <div>
          <router-link
            :to="`/workspace/project/${task.project_id}`"
            class="flex mb-4 text-xl font-semibold"
          >
            {{ project ? project.name : 'Go to project' }}
          </router-link>

          <form
            v-if="isEditingTaskDescription"
            class="flex flex-row gap-2 w-full"
            @submit.prevent="handleEditTask()"
          >
            <textarea
              id="description"
              v-model="editTask.description"
              placeholder="Description"
              rows="3"
              class="edit-elem w-full resize-none"
            />
            <EditButton variant="save" type="submit" class="flex self-end" />
          </form>
          <p v-else>
            {{ task.description }}
            <EditButton
              v-if="isOwner"
              variant="edit"
              @click="
                ((isEditingTaskDescription = true),
                (isEditingTaskName = false),
                (editTask.description = task.description))
              "
            />
          </p>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <VueDatePicker
              v-if="isOwner"
              v-model="taskDates"
              :range="true"
              :enable-time-picker="false"
              :clearable="true"
              :action-row="{ showCancel: true }"
              :format="'dd/MM/yyyy'"
              select-text="Select"
              @update:model-value="
                ((editTask.start_date = $event[0]),
                (editTask.end_date = $event[1]),
                handleEditTask())
              "
            />
            <p v-else>
              Start date: {{ task.start_date }}
              <br />
              Due date: {{ task.end_date }}
            </p>
            <DeleteButton v-if="isOwner" @click="isDeleteTaskPopupOpen = true" />
          </div>

          <span class="flex items-center gap-4">
            <div class="relative inline-block">
              <StatusIndicator
                :msg="
                  task.priority
                    ? showTaskPriority()[task.priority][0] + ' priority'
                    : 'Add priority'
                "
                :variant="task.priority ? showTaskPriority()[task.priority][1] : 'gray'"
                @click="isOwner ? toggleExpand('taskPriority') : null"
              />

              <div v-if="expanded.taskPriority" class="dropdown">
                <ul class="dropdown-options-container items-center list-none">
                  <li v-for="priority in Object.keys(TaskPriority)" :key="priority">
                    <StatusIndicator
                      v-if="priority !== task.priority"
                      :msg="showTaskPriority()[priority][0]"
                      :variant="showTaskPriority()[priority][1]"
                      @click="
                        (toggleExpand('taskPriority'),
                        (editTask.priority = priority as TaskPriority),
                        handleEditTask())
                      "
                    />
                  </li>
                </ul>
              </div>
            </div>
            <div class="relative inline-block">
              <StatusIndicator
                :msg="showTaskStatus()[task.status][0]"
                :variant="showTaskStatus()[task.status][1]"
                @click="isOwner || isAssignee ? toggleExpand('taskStatus') : null"
              />
              <div v-if="expanded.taskStatus" class="dropdown">
                <ul class="dropdown-options-container items-center list-none">
                  <li v-for="status in Object.keys(TaskStatus)" :key="status">
                    <StatusIndicator
                      v-if="status !== task.status"
                      :msg="showTaskStatus()[status][0]"
                      :variant="showTaskStatus()[status][1]"
                      @click="
                        (toggleExpand('taskStatus'),
                        (editTask.status = status as TaskStatus),
                        handleEditTask())
                      "
                    />
                  </li>
                </ul>
              </div>
            </div>
          </span>
        </div>

        <div>
          <div class="flex items-center gap-4 mb-4">
            <p class="font-semibold text-lg mr-4">Assignees:</p>
            <SmallTextButton
              v-if="isOwner"
              msg="Add assignees"
              variant="blue"
              @click="isAddAssigneePopupOpen = true"
            />
            <SmallTextButton
              v-if="task.assignees_ids?.includes(userId)"
              msg="Remove me"
              variant="orange"
              @click="
                ((editTask.assignees_ids = task.assignees_ids.filter((id) => id !== userId)),
                handleEditTask())
              "
            />
            <SmallTextButton
              v-else
              msg="Add me"
              variant="green"
              @click="
                ((editTask.assignees_ids = task.assignees_ids),
                !editTask.assignees_ids || editTask.assignees_ids.length === 0
                  ? (editTask.assignees_ids = [userId])
                  : editTask.assignees_ids.push(userId),
                handleEditTask())
              "
            />
          </div>

          <ul
            v-if="task.assignees_ids?.length > 0"
            class="flex flex-col list-inside gap-2 mt-2 w-80"
          >
            <li
              v-for="id in task.assignees_ids"
              :key="id"
              class="flex items-center justify-between"
            >
              <UserContainer v-if="!isAssigneesLoading" :user="usersMap[id]" />
              <button
                v-if="isOwner"
                @click="((assigneeIdToRemove = id), (isDelAssigneePopupOpen = true))"
                class="remove-button"
              >
                Remove
              </button>
            </li>
          </ul>
        </div>
      </section>

      <hr />

      <section v-if="!taskErr">
        <LoadingSpinner v-if="isCommentsLoading" class="w-full h-full" />
        <div v-else>
          <h2 class="mb-6">Comments</h2>
          <ol class="flex flex-col gap-8 mb-16">
            <li
              v-for="({ id, created_at, text, user_id }, index) in comments"
              :key="index"
              class="border-2 border-gray-300 bg-gray-100 dark:border-gray-500 dark:bg-transparent rounded-lg p-4"
            >
              <article class="flex flex-col w-full">
                <DeleteButton
                  v-if="isOwner || userId === user_id"
                  @click="((commentIdToDelete = id as string), (isDeleteCommentPopupOpen = true))"
                  class="flex self-end size-7"
                />
                <p class="mb-4 dark:text-gray-200">{{ text }}</p>
                <div class="flex justify-between text-gray-500 dark:text-gray-400">
                  <UserContainer v-if="!isAuthorsLoading" :user="usersMap[user_id]" />
                  <p class="italic">{{ new Date(created_at).toLocaleString() }}</p>
                </div>
              </article>
            </li>
          </ol>
          <form @submit.prevent="handleCommentSubmit()" class="flex items-end w-full gap-2">
            <textarea
              id="comment"
              v-model="inputCommentText"
              placeholder="Add a comment"
              rows="4"
              class="edit-elem w-full resize-none !bg-white dark:!bg-slate-900"
              required
            />
            <button type="submit" class="submit-button">Send</button>
          </form>
        </div>
      </section>

      <DelTaskPopup
        v-if="isDeleteTaskPopupOpen"
        :taskId="taskId"
        :projectId="task.project_id"
        @close="isDeleteTaskPopupOpen = false"
      />

      <AddAssigneePopup
        v-if="isAddAssigneePopupOpen"
        :task="task"
        @close="isAddAssigneePopupOpen = false"
        @refresh="(fetchTaskById(taskId), getAssignees())"
      />

      <DelAssigneePopup
        v-if="isDelAssigneePopupOpen"
        :task="task"
        :userId="assigneeIdToRemove"
        @close="isDelAssigneePopupOpen = false"
        @refresh="
          (task.assignees_ids.splice(task.assignees_ids.indexOf(assigneeIdToRemove), 1),
          getAssignees())
        "
      />

      <DelCommentPopup
        v-if="isDeleteCommentPopupOpen"
        :commentId="commentIdToDelete"
        @close="isDeleteCommentPopupOpen = false"
        @refresh="getCommentSection()"
      />
    </div>
  </div>
</template>
