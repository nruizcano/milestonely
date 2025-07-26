import type { Variants } from '@/models/StatusIndicatorVariants'
import { ProjectStatus } from '@/models/Project';
import { TaskPriority, TaskStatus } from '@/models/Task';
import { UserStatus } from '@/models/User';

export const showProjectStatus = (): Record<string, [ProjectStatus, Variants]> => {
  return {
    NotStarted: [ProjectStatus.NotStarted, 'gray'],
    OnHold: [ProjectStatus.OnHold, 'yellow'],
    Blocked: [ProjectStatus.Blocked, 'red'],
    OnGoing: [ProjectStatus.OnGoing,'blue'],
    Finished: [ProjectStatus.Finished, 'green'],
  }
}

export const showTaskPriority = (): Record<string, [TaskPriority, Variants]> => {
  return {
    High: [TaskPriority.High, 'red'],
    Medium: [TaskPriority.Medium, 'yellow'],
    Low: [TaskPriority.Low, 'green'],
  }
}

export const showTaskStatus = (): Record<string, [TaskStatus, Variants]> => {
  return {
    ToDo: [TaskStatus.ToDo, 'gray'],
    OnHold: [TaskStatus.OnHold, 'yellow'],
    Blocked: [TaskStatus.Blocked, 'red'],
    InProgress: [TaskStatus.InProgress, 'blue'],
    Done: [TaskStatus.Done, 'green'],
  }
}

export const showUserStatus = (): Record<string, [UserStatus, Variants]> => {
  return {
    Available: [UserStatus.Available, 'green'],
    NotAvailable: [UserStatus.NotAvailable, 'red'],
  }
}
