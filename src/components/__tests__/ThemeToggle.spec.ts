import { reactive, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, it, expect, vi } from 'vitest'
import { useThemeStore } from '@/stores/theme'
import ThemeToggle from '@/components/buttons/theme-toggle.vue'

const themeStoreMock = reactive({
  isDarkMode: false,
  toggleDarkMode: vi.fn(),
})

vi.mock('@/stores/theme', () => ({
  useThemeStore: () => themeStoreMock,
}))

describe('ThemeToggle', () => {
  let wrapper: ReturnType<typeof mount>

  beforeEach(() => {
    themeStoreMock.isDarkMode = false
    themeStoreMock.toggleDarkMode.mockClear()
    document.documentElement.classList.remove('dark')
    wrapper = mount(ThemeToggle)
  })

  it('renders the component', () => {
    expect(wrapper.findComponent(ThemeToggle).exists()).toBe(true)
  })

  it('toggles the theme', async () => {
    await wrapper.find('button').trigger('click')
    expect(useThemeStore().toggleDarkMode).toHaveBeenCalled()
  })


  it('changes the icon depending on the theme', async () => {
    const img = wrapper.find('img')

    expect(img.attributes('src')).toBe('/src/assets/icons/sun.png')

    useThemeStore().isDarkMode = true
    await nextTick()

    expect(img.attributes('src')).toBe('/src/assets/icons/moon.png')
  })

  it('adds the "dark" class when the theme is dark', () => {
    useThemeStore().isDarkMode = true
    wrapper = mount(ThemeToggle)
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })
})
