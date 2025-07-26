import { ref } from 'vue'

import { GenericService } from '@/api/services/GenericService'
import { UserService } from '@/api/services/UserService'
import { ProjectService } from '@/api/services/ProjectService'
import { TeamService } from '@/api/services/TeamService'
import { TaskService } from '@/api/services/TaskService'
import { CommentService } from '@/api/services/CommentService'

import type { User } from '@/models/User'
import type { Project, ProjectStatus } from '@/models/Project'
import type { Team } from '@/models/Team'
import type { Task, TaskStatus } from '@/models/Task'
import type { Comment } from '@/models/Comment'

type Types = User | User[] | Project | Project[] | Team | Team[] | Task | Task[] | Comment | Comment[] | unknown

export const useSupabase = () => {
  const userService = new GenericService<User>('users')
  const projectService = new GenericService<Project>('projects')
  const teamService = new GenericService<Team>('teams')
  const taskService = new GenericService<Task>('tasks')
  const commentService = new GenericService<Comment>('comments')

  const userServiceInstance = UserService.instance
  const projectServiceInstance = ProjectService.instance
  const teamServiceInstance = TeamService.instance
  const taskServiceInstance = TaskService.instance
  const commentServiceInstance = CommentService.instance

  const isLoading = ref<boolean>(true)
  const errMsg = ref<string>()
  const elems = ref<Types>([])

  const fetchData = async (serviceMethod: () => Promise<Types>, errMsgPrefix: string) => {
    try {
      isLoading.value = true
      elems.value = await serviceMethod()
    } catch (error: unknown) {
      if (error instanceof Error) {
        errMsg.value = `${errMsgPrefix}: ${error.message}`
      } else {
        errMsg.value = `${errMsgPrefix}: An unknown error occurred`
      }
      console.error(error)
    } finally {
      isLoading.value = false
    }
  }

  const fetchAllUsers =
    async () => {
      await fetchData(
        () => userService.getAll(),
        'Error fetching all users',
      )
    }

  const fetchUserById =
    async (id: string) => {
      await fetchData(
        () => userService.getById(id),
        'Error fetching user by id',
      )
    }

  const fetchThisUser =
    async () => {
      await fetchData(
        () => userServiceInstance.getThisUser(),
        'Error fetching this user',
      )
    }

  const fetchUserByEmailOrName =
    async (emailOrName: string) => {
      await fetchData(
        () => userServiceInstance.getByEmailOrName(emailOrName),
        'Error fetching user by email or name',
      )
    }

  const fetchSearchUser =
    async (info: string) => {
      await fetchData(
        () => userServiceInstance.searchUser(info),
        'Error fetching user by email or name',
      )
    }

  const fetchUserPfp =
    async (userId: string) => {
      await fetchData(
        () => userServiceInstance.getUserPfp(userId),
        'Error fetching user pfp',
      )
    }

  const fetchAllProjects =
    async () => {
      await fetchData(
        () => projectService.getAll(),
        'Error fetching all projects',
      )
    }

  const fetchProjectById =
    async (id: string) => {
      await fetchData(
        () => projectService.getById(id),
        'Error fetching project by id',
      )
    }

  const fetchProjectsByOwner =
    async (ownerId: string) => {
      await fetchData(
        () => projectServiceInstance.getProjectsByOwner(ownerId),
        'Error fetching projects by owner',
      )
    }

  const fetchProjectsByStatus =
    async (status: ProjectStatus) => {
      await fetchData(
        () => projectServiceInstance.getProjectsByStatus(status),
        'Error fetching projects by status',
      )
    }

  const fetchAllTeams =
    async () => {
      await fetchData(
        () => teamService.getAll(),
        'Error fetching all teams',
      )
    }

  const fetchTeamById =
    async (id: string) => {
      await fetchData(
        () => teamService.getById(id),
        'Error fetching team by id',
      )
    }

  const fetchTeamsByProject =
    async (projectId: string) => {
      await fetchData(
        () => teamServiceInstance.getTeamsByProject(projectId),
        'Error fetching teams by project',
      )
    }

  const fetchTeamsByMember =
    async (memberId: string) => {
      await fetchData(
        () => teamServiceInstance.getTeamsByMember(memberId),
        'Error fetching teams by member',
      )
    }

  const fetchAllTasks =
    async () => {
      await fetchData(
        () => taskService.getAll(),
        'Error fetching all tasks',
      )
    }

  const fetchTaskById =
    async (id: string) => {
      await fetchData(
        () => taskService.getById(id),
        'Error fetching task by id',
      )
    }

  const fetchTasksByProject =
    async (projectId: string) => {
      await fetchData(
        () => taskServiceInstance.getTasksByProject(projectId),
        'Error fetching tasks by project',
      )
    }

  const fetchTasksByProjectAndStatus =
    async (projectId: string, status: TaskStatus) => {
      await fetchData(
        () => taskServiceInstance.getTasksByProjectAndStatus(projectId, status),
        'Error fetching tasks by project and status',
      )
    }

  const fetchTasksByAssignee =
    async (assigneeId: string) => {
      await fetchData(
        () => taskServiceInstance.getTasksByAssignee(assigneeId),
        'Error fetching tasks by assignee',
      )
    }

  const fetchTasksByAssigneeAndWithDueDateThisWeek =
    async (assigneeId: string) => {
      await fetchData(
        () => taskServiceInstance.getTasksByAssigneeAndWithDueDateThisWeek(assigneeId),
        'Error fetching tasks by assignee and with due date this week',
      )
    }

  const fetchAllComments =
    async () => {
      await fetchData(
        () => commentService.getAll(),
        'Error fetching all comments',
      )
    }

  const fetchCommentById =
    async (id: string) => {
      await fetchData(
        () => commentService.getById(id),
        'Error fetching comment by id',
      )
    }

  const fetchCommentsByTask =
    async (taskId: string) => {
      await fetchData(
        () => commentServiceInstance.getCommentsByTask(taskId),
        'Error fetching comments by task',
      )
    }

  return {
    userService,
    projectService,
    teamService,
    taskService,
    commentService,

    userServiceInstance,
    projectServiceInstance,
    teamServiceInstance,
    taskServiceInstance,
    commentServiceInstance,

    isLoading,
    errMsg,
    elems,

    fetchAllUsers,
    fetchUserById,
    fetchThisUser,
    fetchUserByEmailOrName,
    fetchSearchUser,
    fetchUserPfp,

    fetchAllProjects,
    fetchProjectById,
    fetchProjectsByOwner,
    fetchProjectsByStatus,

    fetchAllTeams,
    fetchTeamById,
    fetchTeamsByProject,
    fetchTeamsByMember,

    fetchAllTasks,
    fetchTaskById,
    fetchTasksByProject,
    fetchTasksByProjectAndStatus,
    fetchTasksByAssignee,
    fetchTasksByAssigneeAndWithDueDateThisWeek,

    fetchAllComments,
    fetchCommentById,
    fetchCommentsByTask,
  }
}
