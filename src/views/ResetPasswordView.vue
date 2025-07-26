<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toast-notification'

import { supabase } from '@/api/supabaseClient'
import { getPasswordValidationMessage } from '@/utils/password'

const router = useRouter()
const toast = useToast()

const password = ref('')
const confirmPassword = ref('')

const invalidPasswordMsg = computed(() => {
  const passwordValidationMessage = getPasswordValidationMessage(password.value)
  if (!passwordValidationMessage) return ''
  return passwordValidationMessage
})

const passwordsMatch = computed(() => password.value === confirmPassword.value)

const handleSubmit = async () => {
  try {
    const { error } = await supabase.auth.updateUser({
      password: password.value,
    })

    if (error) {
      console.error('There was an error while changing password:', error)
      toast.error('Error changing password. Please try again.')
      return
    }

    toast.success('Password changed successfully')
    await router.push('/sign-in')
  } catch (error) {
    console.error('There was an error while changing password: ', error)
    toast.error('Error changing password. Please try again.')
  }
}
</script>

<template>
  <div class="flex flex-col items-center justify-center h-full">
    <h1>Reset password</h1>
    <form @submit.prevent="handleSubmit">
      <div>
        <label for="password">
          Password <strong>*</strong>
          <span v-if="invalidPasswordMsg" class="input-error">{{ invalidPasswordMsg }}</span>
        </label>
        <input id="password" v-model="password" type="password" placeholder="Password" required />
      </div>

      <div>
        <label for="confirmPassword">
          Confirm password <strong>*</strong>
          <span v-if="confirmPassword && !passwordsMatch" class="input-error">
            Passwords do not match!
          </span>
        </label>
        <input
          id="confirmPassword"
          v-model="confirmPassword"
          type="password"
          placeholder="Confirm password"
          :disabled="!password"
          required
        />
      </div>

      <div class="flex flex-row items-center justify-between">
        <p>
          Back to
          <router-link to="/sign-in" class="text-blue-500">sign in</router-link>
        </p>
        <button type="submit" class="submit-button">Reset password</button>
      </div>
    </form>
  </div>
</template>
