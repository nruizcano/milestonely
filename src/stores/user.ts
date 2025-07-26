import { defineStore } from 'pinia'

import { supabase } from '@/api/supabaseClient'
import { useSupabase } from '@/composables/useSupabase'
import { setUserCookie, getUserCookie, removeUserCookie } from '@/helpers/cookieHelper.ts'

import type { User } from '@/models/User'

const { userServiceInstance } = useSupabase()

export const useUserStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
  }),

  getters: {
    isLoggedIn: (state) => !!state.user,
    getUserId: (state) => state.user?.id ?? null,
  },

  actions: {
    async setUser() {
      try {
        const userFromCookie = getUserCookie()
        if (userFromCookie) {
          this.user = userFromCookie
          return
        }

        const fetchedUser = await userServiceInstance.getThisUser()
        if (fetchedUser) {
          this.user = fetchedUser
          setUserCookie(fetchedUser)
        }
      } catch (error) {
        console.error('Error while setting user: ', error)
      }
    },

    async logout() {
      try {
        await supabase.auth.signOut()
        this.user = null
        removeUserCookie()
      } catch (error) {
        console.error('Error while logging out: ', error)
      }
    },
  },
})


/*import { defineStore } from 'pinia'
import { supabase } from '@/api/supabaseClient'
import { useSupabase } from '@/composables/useSupabase'

import type { User } from '@/models/User'

const { userServiceInstance } = useSupabase()

export const useUserStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
  }),

  getters: {
    isLoggedIn: (state) => !!state.user,
    getUserId: (state) => state.user?.id ?? null,
  },

  actions: {
    async setUser() {
      try {
        this.user = await userServiceInstance.getThisUser()
      } catch (error) {
        console.error('Error while fetching user:', error)
      }
    },

    async logout() {
      try {
        await supabase.auth.signOut()
        this.user = null
      } catch (error) {
        console.error('Error while logging out:', error)
      }
    },
  },
})
*/
