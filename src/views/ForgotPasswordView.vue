<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toast-notification'

import { useSupabase } from '@/composables/useSupabase'

const router = useRouter()
const toast = useToast()

const { userServiceInstance } = useSupabase()

const email = ref('')

const handleSubmit = async () => {
  try {
    await userServiceInstance.sendPasswordResetLink(email.value)
  } catch (error) {
    console.error('There was an error while sending reset password link:', error)
    toast.error('Error sending reset password link. Please try again.')
    return
  }

  toast.success('Password reset link sent to your email.')
  router.push('/sign-in')
}
</script>

<template>
  <div class="flex flex-col items-center justify-center h-full">
    <h1>Forgot password?</h1>
    <form @submit.prevent="handleSubmit">
      <input id="email" v-model="email" type="email" placeholder="Email" required />

      <div class="flex flex-row items-center justify-between">
        <router-link to="/sign-in">Back to sign in</router-link>
        <button type="submit" class="submit-button">Send reset link</button>
      </div>
    </form>
  </div>
</template>
