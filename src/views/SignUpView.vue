<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toast-notification'

import { supabase } from '@/api/supabaseClient'
import { useSupabase } from '@/composables/useSupabase'
import { getPasswordValidationMessage } from '@/utils/password'

import { User } from '@/models/User'

import '@/assets/forms.css'

const router = useRouter()
const toast = useToast()
const { userServiceInstance } = useSupabase()

const inputUser = reactive({
  first_name: '',
  last_name: '',
  email: '',
  phone_number: '',
  job_title: '',
})

const password = ref('')
const confirmPassword = ref('')

const invalidPasswordMsg = computed(() => {
  const passwordValidationMessage = getPasswordValidationMessage(password.value)
  if (!passwordValidationMessage) return ''
  return passwordValidationMessage
})

const passwordsMatch = computed(() => password.value === confirmPassword.value)

const handleSubmit = async () => {
  if (!passwordsMatch.value) {
    toast.warning('Passwords do not match!')
    return
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email: inputUser.email,
      password: password.value,
      options: {
        data: {
          first_name: inputUser.first_name,
          last_name: inputUser.last_name,
          phone_number: inputUser.phone_number,
          job_title: inputUser.job_title,
        },
      },
    })

    if (error) {
      console.error('There was an error while signing up:', error)
      toast.error('Error signing up. Please try again.')
      return
    }

    if (!data) {
      toast.error('Error signing up. Please try again.')
      return
    }

    const userId = data.user?.id as string
    const newUser: User = new User(
      userId,
      inputUser.first_name,
      inputUser.last_name,
      inputUser.email,
      inputUser.phone_number,
      inputUser.job_title,
      null
    )
    await userServiceInstance.create(newUser)

    toast.success('Check your email inbox to confirm your account!')
    router.push('/sign-in')
  } catch (error) {
    console.error('There was an error while signing up:', error)
    toast.error('Error signing up. Please try again.')
  }
}
</script>

<template>
  <div class="flex flex-col items-center justify-center h-full">
    <h1>Sign up</h1>
    <form @submit.prevent="handleSubmit()">
      <div>
        <label for="first_name"> First name <strong>*</strong> </label>
        <input
          id="first_name"
          v-model="inputUser.first_name"
          type="text"
          placeholder="First name"
          required
        />
      </div>

      <div>
        <label for="last_name"> Last name <strong>*</strong> </label>
        <input
          id="last_name"
          v-model="inputUser.last_name"
          type="text"
          placeholder="Last name"
          required
        />
      </div>

      <div>
        <label for="email"> Email <strong>*</strong> </label>
        <input id="email" v-model="inputUser.email" type="email" placeholder="Email" required />
      </div>

      <div>
        <label for="phone_number">Phone number</label>
        <input
          id="phone_number"
          v-model="inputUser.phone_number"
          type="tel"
          placeholder="Phone number"
        />
      </div>

      <div>
        <label for="job_title">Job title</label>
        <input id="job_title" v-model="inputUser.job_title" type="text" placeholder="Job title" />
      </div>

      <div>
        <label for="password">
          Password <strong>*</strong>
          <span v-if="invalidPasswordMsg" class="input-error">{{ invalidPasswordMsg }}</span>
        </label>
        <input
          id="password"
          v-model="password"
          type="password"
          placeholder="Password"
          required
        />
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
          Already have an account?
          <router-link to="/sign-in" class="text-blue-500">Sign in</router-link>
        </p>
        <button type="submit" class="submit-button">Sign up</button>
      </div>
    </form>
  </div>
</template>
