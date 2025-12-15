<script setup lang="ts">
import { type PropType } from 'vue'

interface ProcessedMessage {
  id: string
  originalId: string
  sender: string
  text: string
  time: string
  isUser: boolean
  unread?: boolean
  timestamp: number
  replyingTo: { sender: string; text: string } | null
}

defineProps({
  message: {
    type: Object as PropType<ProcessedMessage>,
    required: true,
  },
  isGroup: {
    type: Boolean,
    default: false,
  },
  senderColor: {
    type: Object as PropType<{ text: string; bg: string }>,
    default: () => ({ text: 'text-gray-600', bg: '#F5F5F5' }),
  },
  isOpen: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['reply', 'edit', 'delete', 'share', 'toggleMenu'])
</script>

<script lang="ts">
export default {
  name: 'ChatBubble',
}
</script>

<template>
  <div :class="message.isUser ? 'flex flex-col items-end' : 'flex flex-col items-start'">
    <p
      class="text-sm font-bold mb-1"
      :class="[senderColor.text, message.isUser ? 'text-right' : 'text-left']"
    >
      {{ message.sender }}
    </p>

    <div class="relative group max-w-[70%]">
      <div
        v-if="message.replyingTo"
        class="bg-[#F2F2F2] border border-[#E0E0E0] text-[#4F4F4F] p-3 rounded mb-2"
      >
        <p class="text-sm">{{ message.replyingTo.text }}</p>
      </div>

      <div class="relative">
        <!-- Three dots menu -->
        <button
          @click.stop="$emit('toggleMenu')"
          :class="message.isUser ? 'absolute -left-8 top-2' : 'absolute -right-8 top-2'"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5 text-[#4F4F4F]"
            viewBox="0 0 24 24"
            fill="#4f4f4f"
          >
            <path d="M0 0h24v24H0V0z" fill="none" />
            <path
              d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
            />
          </svg>
        </button>

        <!-- Dropdown Menu -->
        <Transition
          enter-active-class="transition-all duration-200 ease-out"
          leave-active-class="transition-all duration-150 ease-in"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-if="isOpen"
            :class="[
              'absolute top-8 bg-white border border-[#BDBDBD] rounded-md shadow-lg z-20 py-1 w-32',
              message.isUser ? '-left-32' : '-right-8',
            ]"
            @click.stop
          >
            <template v-if="message.isUser">
              <div
                @click="$emit('edit')"
                class="w-full cursor-pointer border-b border-[#BDBDBD] text-left px-4 py-2 text-sm text-[#2F80ED] hover:bg-gray-100 transition-colors"
                role="button"
                tabindex="0"
              >
                Edit
              </div>
              <div
                @click="$emit('delete')"
                class="w-full cursor-pointer text-left px-4 py-2 text-sm text-[#EB5757] hover:bg-gray-100 transition-colors"
                role="button"
                tabindex="0"
              >
                Delete
              </div>
            </template>
            <template v-else>
              <div
                @click="$emit('share')"
                class="w-full cursor-pointer border-b border-[#BDBDBD] text-left px-4 py-2 text-sm text-[#2F80ED] hover:bg-gray-100 transition-colors"
                role="button"
                tabindex="0"
              >
                Share
              </div>
              <div
                @click="$emit('reply')"
                class="w-full cursor-pointer text-left px-4 py-2 text-sm text-[#2F80ED] hover:bg-gray-100 transition-colors"
                role="button"
                tabindex="0"
              >
                Reply
              </div>
            </template>
          </div>
        </Transition>

        <div class="rounded-lg p-3" :style="{ backgroundColor: senderColor.bg }">
          <p class="text-sm text-[#4F4F4F]">{{ message.text }}</p>
          <p class="text-xs text-[#4F4F4F] mt-1">{{ message.time }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
