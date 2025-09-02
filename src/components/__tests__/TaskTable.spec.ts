import { mount, VueWrapper } from '@vue/test-utils'
import { beforeEach, describe, it, expect } from 'vitest'
import { Task, TaskPriority } from '@/models/Task'
import { showTaskPriority, showTaskStatus } from '@/utils/showStatusStyle';
import TaskTable from '@/components/task-table.vue'
import StatusIndicator from '@/components/status-indicator.vue'

const tasks: Task[] = [
  new Task(
    'Task 1',
    'Project1',
    new Date('2025-01-01'),
    new Date('2026-06-02'),
    'Description 1',
    ['User1', 'User2'],
    'High' as TaskPriority,
  ),
  new Task(
    'Task 2',
    'Project2',
    new Date('2024-03-12'),
    new Date('2027-10-30'),
    'Description 2',
    ['User3', 'User4'],
    'Low' as TaskPriority,
  ),
]
tasks[0].id = 'task1'
tasks[1].id = 'task2'

const columns = {
  start_date: true,
  end_date: true,
  name: true,
  description: true,
  assignees: true,
  project: true,
  priority: true,
  status: true,
}

describe('TaskTable', () => {
  let wrapper: VueWrapper<InstanceType<typeof TaskTable>>

  beforeEach(async () => {
    wrapper = mount(TaskTable, {
      props: { columns, tasks },
      global: {
        stubs: {
          'router-link': {
            props: ['to'],
            template: '<a :href="to"><slot /></a>'
          }
        }
      }
    })

    wrapper.vm.isDataLoading = false
    await wrapper.vm.$nextTick()
  })

  it('renders the component', async () => {
    wrapper.vm.isDataLoading = true
    await wrapper.vm.$nextTick()

    expect(wrapper.findComponent(TaskTable).exists()).toBe(true)
  })

  it('renders the table when data is loaded', async () => {
    expect(wrapper.find('table').exists()).toBe(true)
    expect(wrapper.find('div').text()).not.toContain('Loading...')
  })

  it('displays the task information', () => {
    const priorityMap = showTaskPriority()
    const statusMap = showTaskStatus()

    const rows = wrapper.findAll('table tbody tr')
    expect(rows.length).toBe(tasks.length)

    tasks.forEach((task, index) => {
      const row = rows[index]
      const cells = row.findAll('td')
      expect(cells.length).toBe(Object.keys(columns).length)
      expect(cells[0].text()).toBe(task.start_date?.toString())
      expect(cells[1].text()).toBe(task.end_date?.toString())
      expect(cells[2].text()).toBe(task.name)
      expect(cells[3].text()).toBe(task.description)

      const priorityIndicator = cells[6].findComponent(StatusIndicator)
      expect(priorityIndicator.exists()).toBe(true)
      expect(priorityIndicator.props('msg')).toBe(priorityMap[task.priority as TaskPriority][0])
      expect(priorityIndicator.props('variant')).toBe(priorityMap[task.priority as TaskPriority][1])

      const statusIndicator = cells[7].findComponent(StatusIndicator)
      expect(statusIndicator.exists()).toBe(true)
      expect(statusIndicator.props('msg')).toBe(statusMap[task.status][0])
      expect(statusIndicator.props('variant')).toBe(statusMap[task.status][1])
    })
  })
})
