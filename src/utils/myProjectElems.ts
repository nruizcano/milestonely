import { useSupabase } from '@/composables/useSupabase'

import { Project, ProjectStatus } from '@/models/Project'
import type { Team } from '@/models/Team'
import type { Task } from '@/models/Task'

const { errMsg: projectsErr, elems: fetchedProjects, fetchProjectById, fetchProjectsByOwner } = useSupabase()
const { errMsg: teamsErr, elems: fetchedTeams, fetchTeamsByMember, fetchTeamsByProject } = useSupabase()
const { errMsg: tasksErr, elems: fetchedTasks, fetchTasksByProject, fetchTasksByAssignee, fetchTasksByAssigneeAndWithDueDateThisWeek } = useSupabase()

export const getProjects = async (userId: string, isOwner: boolean, isOnGoing: boolean) => {
  const projectsMap: Record<string, Project> = {}
  const errMsg = "Error fetching your projects"

  await fetchProjectsByOwner(userId)
  if (projectsErr.value) return errMsg

  for (const project of fetchedProjects.value as Project[]) {
    const projectId = project.id as string
    if (!projectsMap[projectId]) {
      projectsMap[projectId] = project
    }
  }

  if (!isOwner) {
    await fetchTeamsByMember(userId)

    if (teamsErr.value) return errMsg
    const teams = fetchedTeams.value as Team[]

    for (const team of teams) {
      const projectId = team.project_id
      if (!projectsMap[projectId]) {
        await fetchProjectById(projectId)
        if (projectsErr.value) return errMsg
        const project = fetchedProjects.value as Project
        projectsMap[projectId] = project
      }
    }
  }

  if (isOnGoing) {
    const statusKey = "OnGoing" as keyof typeof ProjectStatus;
    return Object.values(projectsMap).filter((project) => project.status === statusKey)
  }

  return Object.values(projectsMap)
}

export const getTeams = async (userId: string | null, projectId: string | null) => {
  const teamsMap: Record<string, Team> = {}

  if (userId) {
    await fetchTeamsByMember(userId)
    if (teamsErr.value) return 'Error fetching your teams'
  } else if (projectId) {
    await fetchTeamsByProject(projectId)
    if (teamsErr.value) return "Error fetching project teams"
  }

  for (const team of fetchedTeams.value as Team[]) {
    const teamId = team.id as string
    if (!teamsMap[teamId]) {
      teamsMap[teamId] = team
    }
  }

  return Object.values(teamsMap)
}

export const getTasks = async (userId: string | null, projectId: string | null, isDueThisWeek: boolean) => {
  const tasksMap: Record<string, Task> = {}
  const errMsg = "Error fetching your tasks"

  if (userId) {
    if (isDueThisWeek) {
      await fetchTasksByAssigneeAndWithDueDateThisWeek(userId)
    } else {
      await fetchTasksByAssignee(userId)
    }
  } else if (projectId) {
    await fetchTasksByProject(projectId)
  }

  if (tasksErr.value) return errMsg

  for (const task of fetchedTasks.value as Task[]) {
    const taskId = task.id as string
    if (!tasksMap[taskId]) {
      tasksMap[taskId] = task
    }
  }

  return Object.values(tasksMap)
}
