<script setup lang="ts">
import { ref } from 'vue'

const isActive = ref(false)

const toggleActive = () => {
  isActive.value = !isActive.value
}
</script>

<template>
  <button class="w-[60px] h-[60px] rounded-full flex items-center justify-center" :class="isActive ? 'bg-[#4F4F4F]' : 'bg-[#2F80ED]'" @click="toggleActive">
    <img src="/cloud-lighting.svg" alt="Cloud Lighting">
  </button>
</template>
