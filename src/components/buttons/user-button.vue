<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { useToggleExpand } from '@/composables/useToggleExpand';

import userIcon from '@/assets/icons/user.svg';
import '@/assets/dropdown.css';

const userStore = useUserStore();
const router = useRouter();

const { expanded, toggleExpand } = useToggleExpand();

const handleClick = () => {
  toggleExpand('options');
};

const handleLogout = async () => {
  await userStore.logout();
  router.push('/sign-in');
  toggleExpand('options');
};
</script>

<template>
  <div class="relative inline-block">
    <button @click="handleClick()">
      <img
        :src="userIcon"
        alt="Profile"
        class="cursor-pointer"
      />
    </button>

    <div v-if="expanded.options" class="dropdown">
      <ul class="dropdown-options-container w-[104px] right-7 items-end list-none">
        <li @click="handleClick()">
          <router-link to="/my-account">My account</router-link>
        </li>
        <li id="logout" @click="(handleClick(), handleLogout())">
          <router-link to="/sign-in">Logout</router-link>
        </li>
      </ul>
    </div>
  </div>
</template>
