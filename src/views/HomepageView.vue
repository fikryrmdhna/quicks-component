<script setup lang="ts">
import FloatingButton from '@/components/FloatingButton.vue'
</script>

<template>
  <div class="flex w-[100vw] h-[100vh]">
    <div class="w-[15%] h-[100%] border-r border-[#f4f4f4]" />
    <div class="w-[85%] h-[100%]">
      <div class="flex items-center bg-[#4F4F4F] h-[58px] px-[26px]">
        <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 0 24 24" width="18px" fill="#f2f2f2"><path d="M0 0h24v24H0V0z" fill="none"/>
          <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
        </svg>
        <input type="text" class="w-2/3 text-base ml-2 text-[#f2f2f2] bg-transparent border-none outline-none" />
      </div>
      <!-- Floating Button -->
      <FloatingButton />
    </div>
  </div>
</template>

