<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useSupabase } from '@/composables/useSupabase'
import { showUserStatus } from '@/utils/showStatusStyle'

import type { User } from '@/models/User'

import CloseButton from '@/components/buttons/close-button.vue'
import StatusIndicator from '@/components/status-indicator.vue'
import '@/assets/popup.css'

const { elems: fetchedPfp, fetchUserPfp } = useSupabase()

const props = defineProps<{
  user: User
}>()

const pfp = computed<string>(() => fetchedPfp.value as string)

const emit = defineEmits(['close'])

onMounted(async () => {
  await fetchUserPfp(props.user.id)
})
</script>

<template>
  <div class="popup-overlay">
    <div class="popup-frame">
      <CloseButton @click="emit('close')" />
      <article class="flex flex-col justify-center h-auto gap-4">
        <section class="flex flex-row items-start gap-4">
          <img :src="pfp" class="size-20 rounded-full mb-4" />
          <div>
            <h1 class="mb-0">{{ user.first_name }} {{ user.last_name }}</h1>
            <div class="flex flex-row items-center gap-4">
              <h2>{{ user.job_title }}</h2>
              <StatusIndicator :msg="showUserStatus()[user.status][0]" :variant="showUserStatus()[user.status][1]" />
            </div>
          </div>
        </section>

        <section>
          <h3>Contact details:</h3>
          <ul class="list-disc list-inside ml-3 mt-2">
            <li>
              Email:
              <a :href="`mailto:${user.email || ''}`" target="_blank">
                {{ user.email }}
              </a>
            </li>
            <li v-if="user.phone_number">Phone number: {{ user.phone_number }}</li>
          </ul>
        </section>
      </article>
    </div>
  </div>
</template>
