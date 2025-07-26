<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toast-notification'

import { useUserStore } from '@/stores/user'
import { supabase } from '@/api/supabaseClient'

import '@/assets/forms.css'

const router = useRouter()
const toast = useToast()
const userStore = useUserStore()

const email = ref('')
const password = ref('')

const handleSubmit = async () => {
  if (!email.value || !password.value) {
    toast.warning('Please fill in all fields.')
    return
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    })

    if (error) {
      const errMsgs: Record<string, string> = {
        email_not_confirmed:
          'Email not confirmed. Please check your email inbox and confirm your account.',
        invalid_credentials: 'Invalid credentials. Please try again.',
      }

      console.error('There was an error while signing in:', error)
      toast.error(errMsgs[error.code as string] ?? error.message)
      return
    }

    if (!data) {
      toast.error('Error signing in. Please try again.')
      return
    }

    await userStore.setUser()
    router.push('/workspace')
  } catch (error) {
    console.error('There was an error while signing in:', error)
    toast.error('Error signing in. Please try again.')
  }
}
</script>

<template>
  <div class="flex flex-col items-center justify-center h-full">
    <h1>Sign in</h1>
    <form @submit.prevent="handleSubmit">
      <input id="email" v-model="email" type="email" placeholder="Email" required />
      <input id="password" v-model="password" type="password" placeholder="Password" required />

      <div class="flex flex-row items-center justify-between">
        <router-link to="/sign-up">Sign up</router-link>
        <router-link to="/forgot-password">Forgot password?</router-link>
        <button type="submit" class="submit-button">Sign in</button>
      </div>
    </form>
  </div>
</template>
