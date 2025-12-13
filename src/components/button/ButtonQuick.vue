<script setup lang="ts">

const props = defineProps({
  isActive: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <button class="w-[68px] h-[68px] rounded-full flex items-center justify-center" :class="isActive ? 'bg-[#4F4F4F]' : 'bg-[#2F80ED]'">
    <img src="/cloud-lighting.svg" alt="Cloud Lighting">
  </button>
</template>
