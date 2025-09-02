Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => { },    // deprecated
    removeListener: () => { }, // deprecated
    addEventListener: () => { },
    removeEventListener: () => { },
    dispatchEvent: () => false,
  }),
})

import type { ComponentPublicInstance } from 'vue'
import { createRouter, createWebHistory, RouterLink, type RouterLinkProps } from 'vue-router'
import { mount, VueWrapper } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import { beforeEach, describe, it, expect } from 'vitest'
import AppHeader from '@/components/app-header.vue'
import ThemeToggle from '@/components/buttons/theme-toggle.vue'
import UserButton from '@/components/buttons/user-button.vue'

describe('AppHeader', () => {
  const pinia = createPinia()
  let router: ReturnType<typeof createRouter>
  let wrapper: ReturnType<typeof mount>

  beforeEach(() => {
    setActivePinia(pinia)

    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/workspace', component: { template: '<div>Home</div>' } },
        { path: '/workspace/all-projects', component: { template: '<div>All projects</div>' } },
        { path: '/workspace/my-projects', component: { template: '<div>My projects</div>' } },
        { path: '/workspace/all-tasks', component: { template: '<div>All tasks</div>' } },
        { path: '/workspace/teams', component: { template: '<div>Teams</div>' } },
      ]
    })

    wrapper = mount(AppHeader, {
      global: {
        plugins: [pinia, router]
      }
    })
  })

  it('renders the component', () => {
    expect(wrapper.findComponent(AppHeader).exists()).toBe(true)

    expect(wrapper.find('img[alt="Milestonely logo"]').exists()).toBe(true)
    expect(wrapper.find('span').text()).toBe('Milestonely')
    expect(wrapper.findComponent(ThemeToggle).exists()).toBe(true)
    expect(wrapper.findComponent(UserButton).exists()).toBe(true)
  })

  it('renders the correct links', () => {
    const navLinks = [
      { href: '/workspace', label: 'Home' },
      { href: '/workspace/all-projects', label: 'All projects' },
      { href: '/workspace/my-projects', label: 'My projects' },
      { href: '/workspace/all-tasks', label: 'All tasks' },
      { href: '/workspace/teams', label: 'Teams' },
    ]

    const links = wrapper.find('nav').findAllComponents(RouterLink)
    expect(links.length).toBe(navLinks.length)

    links.forEach((link: VueWrapper<ComponentPublicInstance<RouterLinkProps>>, index: number) => {
      expect(link.props('to')).toBe(navLinks[index].href)
      expect(link.text()).toBe(navLinks[index].label)
    })
  })

  it('applies active class to the current link', async () => {
    router.push('/workspace/all-projects')
    await router.isReady()

    const link = wrapper.find('a[href="/workspace/all-projects"]')

    expect(link.classes()).toContain('font-semibold')
    expect(link.classes()).toContain('text-blue-400')
  })
})
