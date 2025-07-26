<script setup lang="ts">
import { type Variants, variants } from '@/models/StatusIndicatorVariants'

defineProps<{
  msg: string
  variant: Variants
}>()

const greenBg = 'text-green-800 bg-green-100 dark:bg-emerald-900 dark:text-emerald-50'
const blueBg = 'text-blue-800 bg-blue-100 dark:bg-blue-900 dark:text-blue-50'
const yellowBg = 'text-yellow-800 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-50'
const redBg = 'text-red-800 bg-red-100 dark:bg-red-900 dark:text-red-50'
const grayBg = 'text-gray-700 bg-white dark:bg-gray-700 dark:text-gray-50'

const greenBorder = 'bg-[conic-gradient(from_90deg_at_50%_50%,#34d399_0%,#21554e_50%,#34d399_100%)]'
const blueBorder = 'bg-[conic-gradient(from_90deg_at_50%_50%,#1e3a8a_0%,#96b2ff_50%,#1e3a8a_100%)]'
const yellowBorder =
  'bg-[conic-gradient(from_90deg_at_50%_50%,#713f12_0%,#ffbd82_50%,#713f12_100%)]'
const redBorder = 'bg-[conic-gradient(from_90deg_at_50%_50%,#7f1d1d_0%,#ff8c8c_50%,#7f1d1d_100%)]'
const grayBorder = 'bg-[conic-gradient(from_90deg_at_50%_50%,#6b7280_0%,#e5e7eb_50%,#6b7280_100%)]'
</script>

<template>
  <div
    class="inline-flex items-center relative overflow-hidden rounded-full p-[1px] cursor-pointer min-w-fit"
  >
    <span
      :class="[
        'absolute inset-[-1000%] animate-[spin_2s_linear_infinite]',
        variant === variants.green
          ? greenBorder
          : variant === variants.blue
            ? blueBorder
            : variant === variants.yellow
              ? yellowBorder
              : variant === variants.red
                ? redBorder
                : grayBorder,
      ]"
    />

    <span
      :class="[
        'inline-flex items-center justify-center w-full px-3 py-1 rounded-full backdrop-blur-3xl whitespace-nowrap select-none',
        variant === variants.green
          ? greenBg
          : variant === variants.blue
            ? blueBg
            : variant === variants.yellow
              ? yellowBg
              : variant === variants.red
                ? redBg
                : grayBg,
      ]"
    >
      {{ msg }}
    </span>
  </div>
</template>
