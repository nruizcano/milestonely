<script setup lang="ts">
import { computed, ref, reactive, onMounted, watch } from 'vue'
import { useToast } from 'vue-toast-notification'

import { supabase } from '@/api/supabaseClient'
import { useSupabase } from '@/composables/useSupabase'

import { type User, UserStatus } from '@/models/User'

import LoadingSpinner from '@/components/loading-spinner.vue'
import uploadIcon from '@/assets/icons/upload.png'
import '@/assets/forms.css'

const toast = useToast()

const { isLoading, errMsg, elems, userServiceInstance, fetchThisUser } = useSupabase()
const { elems: fetchedPfp, fetchUserPfp } = useSupabase()

const user = computed(() => elems.value as User)
const editUser = reactive<Partial<User>>({})

const pfp = computed<string>(() => fetchedPfp.value as string)

const hasEditedUser = computed(() => Object.keys(updatedFields.value).length > 0)
const hasChangedField = (field: keyof User) => {
  return editUser[field] !== undefined && editUser[field] !== user.value[field]
}
const changedFieldStyle = 'text-green-800 bg-green-100'

const updatedFields = computed<Partial<User>>(() => {
  if (!user.value) return {}

  return (Object.keys(editUser) as (keyof User)[]).reduce(
    (acc, key) => {
      if (user.value && editUser[key] !== undefined && editUser[key] !== user.value[key]) {
        acc[key] = editUser[key] as User[typeof key]
      }

      return acc
    },
    {} as Record<keyof User, User[keyof User]>,
  )
})

const handleUpdateSubmit = async () => {
  try {
    const { data, error } = await supabase.auth.updateUser({
      data: {
        first_name: editUser.first_name,
        last_name: editUser.last_name,
        phone_number: editUser.phone_number,
        job_title: editUser.job_title,
        status: editUser.status,
      },
    })

    if (error) {
      toast.error('Error updating profile information. Please try again.')
      console.error('There was an error updating while profile information:', error)
      return
    }

    if (!data) {
      toast.error('Error updating profile information. Please try again.')
      return
    }

    await userServiceInstance.update(editUser, data.user.id)
    await fetchThisUser()
    toast.success('Profile information updated successfully!')
  } catch (error) {
    console.error('There was an error updating while profile information:', error)
    toast.error('Error updating profile information. Please try again.')
  }
}

const fileInput = ref<HTMLInputElement | null>(null)

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileInput = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  await handlePfpChange(file)
}

const handlePfpChange = async (file: File) => {
  const userId = user.value.id
  if (!userId) return

  try {
    await userServiceInstance.uploadPfp(file, userId)
    await fetchUserPfp(userId)
    toast.success('Profile picture updated successfully!')
  } catch (error) {
    console.error('There was an error while uploading pfp: ', error)
    toast.error('Error uploading pfp. Please try again.')
  }
}

const handlePasswordChange = async () => {
  try {
    await userServiceInstance.sendPasswordResetLink(user.value.email)
  } catch (error) {
    console.error('There was an error while sending reset password link:', error)
    toast.error('Error sending reset password link. Please try again.')
    return
  }

  toast.success('Password reset link sent to your email.')
}

onMounted(async () => {
  await fetchThisUser()
  await fetchUserPfp(user.value.id)
})

watch([user, pfp], ([newUser]) => {
  const { ...changes } = newUser
  Object.assign(editUser, changes)
})
</script>

<template>
  <div>
    <h1>My account</h1>
    <LoadingSpinner v-if="isLoading" />
    <p v-else-if="errMsg" class="data-msg">{{ errMsg }}</p>

    <div v-else class="flex flex-col w-full items-center justify-center">
      <div class="flex flex-row items-center gap-10 mb-12">
        <div class="relative group cursor-pointer">
          <img
            :src="pfp"
            @click="triggerFileInput()"
            class="size-36 rounded-full opacity-100 group-hover:opacity-50 group-hover:shadow-lg transition-all duration-200"
          />
          <img
            :src="uploadIcon"
            alt="Change profile picture"
            class="absolute size-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-65 dark:group-hover:opacity-80 dark:invert transition-opacity duration-200"
          />
          <input
            type="file"
            accept="image/*"
            ref="fileInput"
            class="hidden"
            @change="handleFileInput"
          />
        </div>
        <h2 class="mb-0">Hello, {{ user?.first_name + user?.last_name }}!</h2>
      </div>

      <form @submit.prevent="handleUpdateSubmit()">
        <div>
          <label for="first_name">First name</label>
          <input
            id="first_name"
            v-model="editUser.first_name"
            type="text"
            placeholder="First name"
            required
            :class="{ [changedFieldStyle]: hasChangedField('first_name') }"
          />
        </div>

        <div>
          <label for="last_name">Last name</label>
          <input
            id="last_name"
            v-model="editUser.last_name"
            type="text"
            placeholder="Last name"
            required
            :class="{ [changedFieldStyle]: hasChangedField('last_name') }"
          />
        </div>

        <div>
          <label for="email">Email</label>
          <input
            id="email"
            v-model="editUser.email"
            type="email"
            placeholder="Email"
            disabled
            class="bg-gray-100 text-gray-500 cursor-not-allowed"
          />
        </div>

        <div>
          <label for="status">Status</label>
          <select
            id="status"
            v-model="editUser.status"
            :class="{ [changedFieldStyle]: hasChangedField('status') }"
          >
            <option v-for="(lable, value) in UserStatus" :key="value" :value="value">
              {{ lable }}
            </option>
          </select>
        </div>

        <div>
          <label for="phone_number">Phone number</label>
          <input
            id="phone_number"
            v-model="editUser.phone_number"
            type="tel"
            placeholder="Phone number"
            :class="{ [changedFieldStyle]: hasChangedField('phone_number') }"
          />
        </div>

        <div>
          <label for="job_title">Job title</label>
          <input
            id="job_title"
            v-model="editUser.job_title"
            type="text"
            placeholder="Job title"
            :class="{ [changedFieldStyle]: hasChangedField('job_title') }"
          />
        </div>

        <div class="flex flex-row items-start justify-between">
          <button @click="handlePasswordChange()" type="button" class="font-semibold underline">
            Change password
          </button>
          <button v-if="hasEditedUser" type="submit" class="submit-button">Save changes</button>
        </div>
      </form>
    </div>
  </div>
</template>
