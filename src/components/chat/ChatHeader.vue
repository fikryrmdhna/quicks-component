<script setup lang="ts">
import { type PropType } from 'vue'
import type { Conversation } from '@/services/conversations'

defineProps({
  selectedChat: {
    type: Object as PropType<Conversation | null>,
    default: null,
  },
})

defineEmits(['back', 'close'])
</script>

<template>
  <div class="flex items-center justify-between p-4 border-b">
    <div class="flex items-center gap-3 w-full">
      <button @click="$emit('back')" class="text-[#333333]">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <div class="w-full">
        <h2
          class="text-[#2F80ED] font-bold text-sm"
          :class="{ 'w-[80%] line-clamp-1': selectedChat?.type === 'group' }"
        >
          {{ selectedChat?.type === 'group' ? selectedChat?.title : selectedChat?.participants[0] }}
        </h2>
        <p v-if="selectedChat?.type === 'group'" class="text-xs text-[#333333]">
          {{ selectedChat?.participants?.length || 0 }} Participants
        </p>
      </div>
    </div>
    <button @click="$emit('close')" class="text-[#333333]">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  </div>
</template>
