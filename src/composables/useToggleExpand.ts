import { ref } from 'vue'

export const useToggleExpand = () => {
  const expanded = ref<Record<string, boolean>>({})

  const toggleExpand = (key: string) => {
    if (expanded.value[key]) {
      expanded.value[key] = false
    } else {
      expanded.value = { [key]: true }
    }
  }

  return { expanded, toggleExpand }
}
