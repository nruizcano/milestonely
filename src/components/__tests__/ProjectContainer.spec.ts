import { mount } from '@vue/test-utils'
import { beforeEach, describe, it, expect } from 'vitest'
import { Project, ProjectStatus } from '@/models/Project'
import { showProjectStatus } from '@/utils/showStatusStyle';
import ProjectContainer from '@/components/project-container.vue'
import StatusIndicator from '@/components/status-indicator.vue'

const project = new Project(
  'Test Project',
  'Owner1',
  new Date('2025-01-01'),
  new Date('2026-06-02'),
  'Very cool project'
)
project.id = 'proj1'
project.status = 'OnGoing' as ProjectStatus

describe('ProjectContainer', () => {
  let wrapper: ReturnType<typeof mount>

  beforeEach(() => {
    wrapper = mount(ProjectContainer, {
      props: { project },
      global: {
        stubs: {
          'router-link': {
            props: ['to'],
            template: '<a :href="to"><slot /></a>'
          }
        }
      }
    })
  })

  it('renders the component', () => {
    expect(wrapper.element).toMatchSnapshot()
    expect(wrapper.findComponent(ProjectContainer).exists()).toBe(true)
  })

  it('displays the project information', () => {
    const statusMap = showProjectStatus()

    const link = wrapper.find('a')
    expect(link.exists()).toBe(true)
    expect(link.attributes('href')).toBe(`/workspace/project/${project.id}`)

    expect(wrapper.find('h3').text()).toBe(project.name)
    expect(wrapper.find('p').text()).toBe(project.description)

    const statusIndicator = wrapper.findComponent(StatusIndicator)
    expect(statusIndicator.exists()).toBe(true)
    expect(statusIndicator.props('msg')).toBe(statusMap[project.status][0])
    expect(statusIndicator.props('variant')).toBe(statusMap[project.status][1])
  })
})
