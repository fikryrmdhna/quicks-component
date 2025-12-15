<script setup lang="ts">
defineProps({
  show: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['click'])
</script>

<template>
  <Transition
    enter-active-class="transition-all duration-200 ease-out"
    leave-active-class="transition-all duration-200 ease-in"
    enter-from-class="opacity-0 translate-y-2"
    enter-to-class="opacity-100 translate-y-0"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-2"
  >
    <button
      v-if="show"
      @click="$emit('click')"
      class="absolute flex items-center bottom-20 left-1/2 -translate-x-1/2 px-3 py-2 bg-[#E9F3FF] text-[#2F80ED] text-sm font-bold rounded-[5px] transition-colors z-20"
    >
      New Message
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="ml-2"
        height="18px"
        viewBox="0 0 24 24"
        width="18px"
        fill="#f2f2f2"
      >
        <path d="M0 0h24v24H0V0z" fill="none" />
        <path d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z" />
      </svg>
    </button>
  </Transition>
</template>
