import { ref, nextTick } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { config, mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import { beforeEach, describe, it, expect, vi } from 'vitest'
import UserButton from '@/components/buttons/user-button.vue'
import { useUserStore } from '@/stores/user'
import { User } from '@/models/User'

vi.mock('@composables/useToggleExpand', () => {
  const expanded = ref<Record<string, boolean>>({
    options: false,
  })
  const toggleExpand = vi.fn((key: string) => {
    expanded.value[key] = !expanded.value[key]
  })
  return {
    useToggleExpand: () => ({ expanded, toggleExpand })
  }
})

config.global.components['router-link'] = {
  props: ['to'],
  setup(_, { slots }) {
    return () => slots.default?.()
  }
}

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/sign-in', component: { template: '<div>Sign In</div>' } },
    { path: '/my-account', component: { template: '<div>My Account</div>' } },
  ]
})

describe('UserButton', () => {
  let wrapper: ReturnType<typeof mount>
  let userStore: ReturnType<typeof useUserStore>
  const routerPushSpy = vi.spyOn(router, 'push')

  beforeEach(async () => {
    setActivePinia(createPinia())
    userStore = useUserStore()

    vi.spyOn(userStore, 'logout').mockImplementation(async () => {
      userStore.user = null
    })

    wrapper = mount(UserButton, {
      global: {
        plugins: [router]
      }
    })

    userStore.user = new User('123', 'Test User', 'Testing', 'test@example.com', null, null, null)

    if (!router.isReady) await router.isReady()
  })

  it('renders the component', async () => {
    expect(wrapper.element).toMatchSnapshot()
    expect(wrapper.find('img').attributes('alt')).toBe('Profile')
  })

  it('toggles the dropdown when the button is clicked', async () => {
    expect(wrapper.find('.dropdown').exists()).toBe(false)

    await wrapper.find('button').trigger('click')
    await nextTick()

    expect(wrapper.find('.dropdown').exists()).toBe(true)
  })

  it('logs out the user and redirects when the logout button is clicked', async () => {
    await wrapper.find('button').trigger('click')
    await nextTick()

    const logoutItem = wrapper.find('li#logout')
    expect(logoutItem.exists()).toBe(true)

    await logoutItem.trigger('click')
    await nextTick()

    expect(userStore.logout).toHaveBeenCalled()
    expect(userStore.user).toBeNull()
    expect(userStore.isLoggedIn).toBe(false)
    expect(routerPushSpy).toHaveBeenCalledWith('/sign-in')
  })
})
