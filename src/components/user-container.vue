<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useSupabase } from '@/composables/useSupabase'

import type { User } from '@/models/User'

import emailIcon from '@/assets/icons/email.png'
import UserPopup from '@/components/popups/user-popup.vue'

const { elems: fetchedPfp, fetchUserPfp } = useSupabase()

const props = defineProps<{ user: User }>()

const pfp = computed<string>(() => fetchedPfp.value as string)

const isOpen = ref(false)

onMounted(async () => {
  await fetchUserPfp(props.user.id)
})
</script>

<template>
  <div class="inline-flex items-center justify-between group">
    <img :src="pfp" class="size-8 rounded-full mr-2" />

    <p @click="isOpen = true" class="cursor-pointer hover:text-blue-300 hover:underline">
      {{ user.first_name }} {{ user.last_name }}
    </p>

    <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ml-4">
      <a :href="`mailto:${user.email || ''}`" target="_blank">
        <img :src="emailIcon" width="20" height="20" alt="Mail" />
      </a>
    </div>

    <UserPopup v-if="isOpen" :user="user" @close="isOpen = false" />
  </div>
</template>
