<script setup lang="ts">
import { ref } from 'vue'

const isActive = ref(false)

const toggleActive = () => {
  isActive.value = !isActive.value
}
</script>

<template>
  <button class="w-[60px] h-[60px] rounded-full flex items-center justify-center" :class="isActive ? 'bg-[#F8B76B]' : 'bg-[#F2F2F2]'" @click="toggleActive">
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" :fill="isActive ? '#f2f2f2' : '#f8b76b'"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M21 4H3c-1.1 0-2 .9-2 2v13c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM3 19V6h8v13H3zm18 0h-8V6h8v13zm-7-9.5h6V11h-6zm0 2.5h6v1.5h-6zm0 2.5h6V16h-6z"/></svg>
  </button>
</template>
