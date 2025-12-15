<script setup lang="ts">
import { ref, watch } from 'vue'
import { useConversations } from '@/composables/useConversations'
import SingleUser from '@/components/user/SingleUser.vue'
import MultipleUser from '@/components/user/MultipleUser.vue'
import SearchInput from '../form/SearchInput.vue'
import ChatRoom from './ChatRoom.vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close'])

const showChatRoom = ref(false)
const selectedChat = ref(null)

const { conversations, loading, error, fetchConversations } = useConversations()

watch(
  () => props.isOpen,
  () => {
    if (props.isOpen) {
      fetchConversations()
    }
  },
)

function formatDate(date: number) {
  if (!date) return ''
  const dateFormat = new Date(date * 1000)
  const day = dateFormat.getDate().toString().padStart(2, '0')
  const month = (dateFormat.getMonth() + 1).toString().padStart(2, '0')
  const year = dateFormat.getFullYear()
  const hour = dateFormat.getHours().toString().padStart(2, '0')
  const minute = dateFormat.getMinutes().toString().padStart(2, '0')

  return `${day}/${month}/${year} ${hour}:${minute}`
}

const openChatRoom = (item: any) => {
  console.log(item)
  selectedChat.value = item
  showChatRoom.value = true
}

const closeChatRoom = () => {
  showChatRoom.value = false
  selectedChat.value = null
}
</script>

<template>
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    leave-active-class="transition-all duration-300 ease-in"
    enter-from-class="translate-y-full opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="translate-y-full opacity-0"
  >
    <div
      v-if="isOpen"
      class="fixed bottom-32 right-8 w-[600px] h-[600px] bg-white rounded-lg shadow-2xl overflow-hidden z-40"
    >
      <!-- Inbox List View -->
      <Transition
        enter-active-class="transition-opacity duration-300 ease-out"
        leave-active-class="transition-opacity duration-300 ease-in"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
        mode="out-in"
      >
        <div v-if="!showChatRoom" class="h-full flex flex-col">
          <!-- Header with Search -->
          <div class="pt-6 px-[32px]">
            <SearchInput />
          </div>

          <div v-if="loading" class="flex items-center justify-center flex-1">
            <div class="flex flex-col items-center justify-center">
              <div
                class="w-[40px] h-[40px] border-4 border-[#f8f8f8] border-t-[#c4c4c4] rounded-full animate-spin"
              />
              <p class="text-[#4F4F4F] text-sm font-bold mt-3">Loading Chats ...</p>
            </div>
          </div>

          <!-- Inbox List -->
          <div v-if="!loading" class="overflow-y-auto flex-1">
            <div
              v-for="conversation in conversations"
              :key="conversation.id"
              class="py-[22px] px-[32px] border-b hover:bg-gray-50 cursor-pointer transition-colors"
              @click="openChatRoom(conversation)"
            >
              <div class="flex items-start gap-3">
                <!-- Avatar -->
                <MultipleUser v-if="conversation.type === 'group'" />
                <SingleUser v-else>
                  {{ conversation.participants[0].split('')[0].charAt(0) }}
                </SingleUser>

                <!-- Content -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between gap-2 mb-1">
                    <h3 class="text-[#2F80ED] font-bold text-sm line-clamp-2 w-[70%]">
                      <template v-if="conversation.type === 'group'">
                        {{ conversation.title }}
                      </template>
                      <template v-else>
                        {{ conversation.participants[0] }}
                      </template>
                    </h3>
                    <span class="text-xs text-[#4F4F4F] whitespace-nowrap">
                      {{ formatDate(conversation.timestamp.seconds) }}
                    </span>
                  </div>
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="text-sm text-[#4F4F4F] font-bold mb-1">
                        {{ conversation.lastMessage.sender }}:
                      </p>
                      <p class="text-sm text-[#4F4F4F] line-clamp-1">
                        {{ conversation.lastMessage.message }}
                      </p>
                    </div>
                    <!-- Notification Dot -->
                    <div
                      v-if="conversation.unread"
                      class="w-[10px] h-[10px] bg-[#EB5757] rounded-full flex-shrink-0 mt-1"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Chat Room View -->
        <ChatRoom
          v-else
          :selectedChat="selectedChat"
          @close="emit('close')"
          @back="closeChatRoom"
        />
      </Transition>
    </div>
  </Transition>
</template>
