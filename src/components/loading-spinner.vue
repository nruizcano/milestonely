<template>
  <div class="flex flex-col items-center justify-center relative mt-14 w-full">
    <div class="spinner" role="status" aria-live="polite" aria-label="Loading"></div>
  </div>
</template>

<style scoped>
.spinner {
  width: 50px;
  height: 50px;

  border: 7px solid #e5e7eb;
  border-top-color: rgb(79, 172, 248);
  border-radius: 100%;

  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
