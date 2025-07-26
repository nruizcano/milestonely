import { ref } from 'vue'

export const useToggleButtonAnimation = () => {
  const scaleClass = ref('scale-100')

  const toggleButtonAnimation = () => {
    scaleClass.value = 'scale-0'
    setTimeout(() => {
      scaleClass.value = 'scale-100'
    }, 200)
  }

  return {
    scaleClass,
    toggleButtonAnimation,
  }
}
