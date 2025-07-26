import { createRouter, createWebHistory } from 'vue-router'

import { useUserStore } from '@/stores/user'

import LandingView from '@/views/LandingView.vue'
import SignUpView from '@/views/SignUpView.vue'
import SignInView from '@/views/SignInView.vue'
import ForgotPasswordView from '@/views/ForgotPasswordView.vue'
import ResetPasswordView from '@/views/ResetPasswordView.vue'
import MyAccountView from '@/views/MyAccountView.vue'
import HomeView from '@/views/HomeView.vue'
import AllProjectsView from '@/views/AllProjectsView.vue'
import MyProjectsView from '@/views/MyProjectsView.vue'
import AllTasksView from '@/views/AllTasksView.vue'
import TeamsView from '@/views/TeamsView.vue'
import ProjectView from '@/views/ProjectView.vue'
import TaskView from '@/views/TaskView.vue'

const router = createRouter({
  history: createWebHistory('/'),
  routes: [
    {
      path: '/',
      component: LandingView,
      meta: {
        requiresLoggedOut: true,
      },
    },

    {
      path: '/sign-up',
      component: SignUpView,
      meta: {
        requiresLoggedOut: true,
      },
    },
    {
      path: '/sign-in',
      component: SignInView,
      meta: {
        requiresLoggedOut: true,
      },
    },
    {
      path: '/forgot-password',
      component: ForgotPasswordView,
      meta: {
        requiresLoggedOut: true,
      },
    },
    {
      path: '/reset-password',
      component: ResetPasswordView,
    },
    {
      path: '/my-account',
      component: MyAccountView,
      meta: {
        requiresLoggedIn: true,
      },
    },
    {
      path: '/workspace',
      meta: {
        requiresLoggedIn: true,
      },
      children: [
        {
          path: '',
          component: HomeView,
        },
        { path: 'all-projects', component: AllProjectsView },
        {
          path: 'my-projects',
          component: MyProjectsView,
        },
        { path: 'all-tasks', component: AllTasksView },
        { path: 'teams', component: TeamsView },
        { path: 'project/:id', component: ProjectView },
        { path: 'task/:id', component: TaskView },
      ]
    }
  ],
})

router.beforeEach(async (to) => {
  const userStore = useUserStore()

  await userStore.setUser()

  if (to.meta.requiresLoggedIn && !userStore.isLoggedIn) {
    return { path: '/sign-in' }
  }
  if (to.meta.requiresLoggedOut && userStore.isLoggedIn) {
    return { path: '/workspace' }
  }
})

export default router
