<script setup lang="ts">
defineProps({
  show: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    leave-active-class="transition-all duration-300 ease-in"
    enter-from-class="opacity-0 translate-y-4"
    enter-to-class="opacity-100 translate-y-0"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-4"
  >
    <div v-if="show" class="px-4 pb-2 bg-white sticky bottom-0 z-10 w-full">
      <div class="flex items-center gap-3 bg-[#E9F3FF] p-3 rounded-lg">
        <div
          class="w-4 h-4 border-2 border-[#2F80ED] border-t-transparent rounded-full animate-spin"
        ></div>
        <p class="text-[#4F4F4F] text-xs font-bold">
          Please wait while we connect you with one of our team ...
        </p>
      </div>
    </div>
  </Transition>
</template>
