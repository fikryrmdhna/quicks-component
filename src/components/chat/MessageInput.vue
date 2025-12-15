<script setup lang="ts">
import { type PropType } from 'vue'
import TextInput from '@/components/form/TextInput.vue'
import ButtonNormal from '@/components/button/ButtonNormal.vue'

defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  replyToMessage: {
    type: Object as PropType<{ sender: string; text: string } | null>,
    default: null,
  },
})

defineEmits(['update:modelValue', 'send', 'cancelReply'])
</script>

<template>
  <div class="p-4 pt-0 border-t-0 flex items-end gap-2">
    <div class="flex-1 border border-[#E0E0E0] rounded-lg overflow-hidden bg-white">
      <!-- Reply Preview -->
      <div v-if="replyToMessage" class="bg-[#F2F2F2] p-3 border-b border-[#E0E0E0] relative">
        <div class="flex justify-between items-start mb-1">
          <h3 class="font-bold text-[#4F4F4F] text-sm">Replying to {{ replyToMessage.sender }}</h3>
          <button @click="$emit('cancelReply')" class="text-[#4F4F4F] hover:text-[#333]">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div class="text-sm text-[#4F4F4F]">{{ replyToMessage.text }}</div>
      </div>

      <TextInput
        :model-value="modelValue"
        @update:model-value="$emit('update:modelValue', $event)"
        placeholder="Type a new message"
        class="w-full px-4 py-3 outline-none focus:outline-none bg-transparent"
        @keyup.enter="$emit('send')"
      />
    </div>

    <ButtonNormal @click="$emit('send')" class="mb-[1px]"> Send </ButtonNormal>
  </div>
</template>
