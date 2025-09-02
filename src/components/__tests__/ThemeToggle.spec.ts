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
  beforeEach(() => {
    themeStoreMock.isDarkMode = false
    themeStoreMock.toggleDarkMode.mockClear()
    document.documentElement.classList.remove('dark')
  })

  it('renders the component', () => {
    const wrapper = mount(ThemeToggle)
    expect(wrapper.element).toMatchSnapshot()
  })

  it('toggles the theme', async () => {
    const wrapper = mount(ThemeToggle)
    await wrapper.find('button').trigger('click')
    expect(useThemeStore().toggleDarkMode).toHaveBeenCalled()
  })


  it('changes the icon depending on the theme', async () => {
    const wrapper = mount(ThemeToggle)
    const img = wrapper.find('img')

    expect(img.attributes('src')).toBe('/src/assets/icons/sun.png')

    useThemeStore().isDarkMode = true
    await nextTick()

    expect(img.attributes('src')).toBe('/src/assets/icons/moon.png')
  })

  it('adds the "dark" class when the theme is dark', () => {
    useThemeStore().isDarkMode = true
    mount(ThemeToggle)
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })
})
