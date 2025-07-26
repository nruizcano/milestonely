<script setup lang="ts">
import { useSupabase } from '@/composables/useSupabase'
import { useToast } from 'vue-toast-notification'

import CloseButton from '@/components/buttons/close-button.vue'
import '@/assets/popup.css'
import '@/assets/forms.css'

const toast = useToast()

const { errMsg, commentServiceInstance } = useSupabase()

const props = defineProps<{
  commentId: string
}>()

const emit = defineEmits(['close', 'refresh'])

const deleteTask = async () => {
  if (!props.commentId) return

  await commentServiceInstance.delete(props.commentId)

  if (errMsg.value) {
    toast.error(errMsg.value)
    return
  }

  toast.success('The comment was deleted')
  emit('close')
  emit('refresh')
}
</script>

<template>
  <div class="popup-overlay">
    <div class="popup-frame">
      <CloseButton @click="emit('close')" />
      <h1>Delete comment</h1>
      <p>Confirm that you want to delete this comment.</p>
      <p>Be mindful that this action cannot be undone.</p>
      <div>
        <button @click="deleteTask()" class="submit-button">Confirm</button>
      </div>
    </div>
  </div>
</template>
