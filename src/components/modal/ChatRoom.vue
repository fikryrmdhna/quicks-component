<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import TextInput from '../form/TextInput.vue'
import ButtonNormal from '../button/ButtonNormal.vue'

const props = defineProps({
  selectedChat: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['close', 'back'])

const newMessage = ref('')
const chatContainer = ref<HTMLElement | null>(null)
const showNewMessageBadge = ref(false)
const firstUnreadElement = ref<HTMLElement | null>(null)
const activeMessageMenu = ref<string | null>(null)
const replyToMessage = ref<{ id: string; sender: string; text: string } | null>(null)
const showConnectingBadge = ref(false)

const chatMessages = computed(() => {
  if (!props.selectedChat || !props.selectedChat.messages) {
    return []
  }

  const rawMessages = props.selectedChat.messages.map((msg: any, index: number) => ({
    ...msg,
    uniqueId: msg.id ? (msg.id.includes('_') ? msg.id : `${msg.id}_${index}`) : `msg_${index}`,
  }))

  const msgMap = new Map(rawMessages.map((m: any) => [m.uniqueId, m]))

  const messages = rawMessages.map((msg: any) => {
    const timestamp = msg.timestamp?.seconds ? new Date(msg.timestamp.seconds * 1000) : new Date()

    let replyingTo = null
    if (msg.replyTo) {
      const parent = msgMap.get(msg.replyTo)
      if (parent) {
        replyingTo = {
          sender: (parent as any).sender,
          text: (parent as any).text,
        }
      }
    }

    return {
      id: msg.uniqueId,
      originalId: msg.id,
      sender: msg.sender,
      text: msg.text,
      time: timestamp.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }),
      isUser: msg.isOwn || msg.sender === 'You',
      unread: msg.unread,
      timestamp: msg.timestamp?.seconds || 0,
      replyingTo,
    }
  })

  messages.sort((a, b) => a.timestamp - b.timestamp)

  const firstUnreadIndex = messages.findIndex((msg) => msg.unread)

  if (firstUnreadIndex > 0) {
    messages[firstUnreadIndex].showDividerBefore = true
  }

  return messages
})

const toggleMessageMenu = (messageId: string) => {
  if (activeMessageMenu.value === messageId) {
    activeMessageMenu.value = null
  } else {
    activeMessageMenu.value = messageId
  }
}

const closeMessageMenu = () => {
  activeMessageMenu.value = null
}

const handleEdit = (messageId: string) => {
  console.log('Edit message:', messageId)
  closeMessageMenu()
}

const handleDelete = (messageId: string) => {
  console.log('Delete message:', messageId)
  closeMessageMenu()
}

const handleShare = (messageId: string) => {
  console.log('Share message:', messageId)
  closeMessageMenu()
}

const handleReply = (messageId: string) => {
  console.log('Reply to message:', messageId)
  const msg = chatMessages.value.find((m: any) => m.id === messageId)
  if (msg) {
    replyToMessage.value = {
      id: msg.id,
      sender: msg.sender,
      text: msg.text,
    }
  }
  closeMessageMenu()
}

const cancelReply = () => {
  replyToMessage.value = null
}

const participantColors = computed(() => {
  if (!props.selectedChat?.participants) return {}

  const colors = [
    { text: 'text-[#E5A443]', bg: '#FCEED3' },
    { text: 'text-[#43A26B]', bg: '#D2F2EA' },
  ]

  const colorMap: Record<string, any> = {}
  props.selectedChat.participants.forEach((participant: string) => {
    const hash = participant.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    colorMap[participant] = colors[hash % colors.length]
  })

  return colorMap
})

const getSenderColor = (sender: string, isUser: boolean) => {
  if (isUser) {
    return { text: 'text-[#9B51E0]', bg: '#EEDCFF' }
  }
  return participantColors.value[sender] || { text: 'text-gray-600', bg: '#F5F5F5' }
}

const formatDate = computed(() => {
  if (!props.selectedChat?.timestamp?.seconds) return 'Today'
  const date = new Date(props.selectedChat.timestamp.seconds * 1000)
  const options: Intl.DateTimeFormatOptions = { month: 'long', day: '2-digit', year: 'numeric' }
  return date.toLocaleDateString('en-US', options)
})

const sendMessage = () => {
  console.log('Sending message:', newMessage.value)
  if (newMessage.value.trim() && props.selectedChat) {
    const timestamp = {
      type: 'firestore/timestamp/1.0',
      seconds: Math.floor(Date.now() / 1000),
      nanoseconds: 0,
    }

    const newMsg = {
      id: `msg_${Date.now()}`,
      sender: 'You',
      text: newMessage.value,
      isOwn: true,
      unread: false,
      timestamp,
      replyTo: replyToMessage.value ? replyToMessage.value.id : null,
    }

    console.log('Sending message:', newMsg)

    if (props.selectedChat.messages) {
      props.selectedChat.messages.push(newMsg)
    }

    if (props.selectedChat?.type !== 'group') {
      showConnectingBadge.value = true
    }

    newMessage.value = ''
    replyToMessage.value = null
  }
}

const handleScroll = () => {
  if (!chatContainer.value) {
    showNewMessageBadge.value = false
    return
  }

  const hasUnreadMessages = chatMessages.value.some((msg) => msg.unread)

  if (!hasUnreadMessages) {
    showNewMessageBadge.value = false
    return
  }

  if (firstUnreadElement.value) {
    const containerRect = chatContainer.value.getBoundingClientRect()
    const unreadRect = firstUnreadElement.value.getBoundingClientRect()

    showNewMessageBadge.value = unreadRect.top > containerRect.bottom
  } else {
    showNewMessageBadge.value = hasUnreadMessages
  }
}

const scrollToNewMessages = () => {
  if (firstUnreadElement.value && chatContainer.value) {
    firstUnreadElement.value.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}

watch(
  () => props.selectedChat,
  () => {
    showNewMessageBadge.value = false
    nextTick(() => {
      if (chatContainer.value) {
        chatContainer.value.scrollTop = 0
        setTimeout(() => handleScroll(), 100)
      }
    })
  },
  { immediate: true },
)

onMounted(() => {
  if (chatContainer.value) {
    chatContainer.value.addEventListener('scroll', handleScroll)
  }

  window.addEventListener('click', closeMessageMenu)

  setTimeout(() => handleScroll(), 100)
})

onUnmounted(() => {
  if (chatContainer.value) {
    chatContainer.value.removeEventListener('scroll', handleScroll)
  }
  window.removeEventListener('click', closeMessageMenu)
})
</script>

<template>
  <div class="h-full flex flex-col">
    <!-- Header -->
    <div class="flex items-center justify-between p-4 border-b">
      <div class="flex items-center gap-3 w-full">
        <button @click="emit('back')" class="text-[#333333]">
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
            {{
              selectedChat?.type === 'group' ? selectedChat?.title : selectedChat?.participants[0]
            }}
          </h2>
          <p v-if="selectedChat?.type === 'group'" class="text-xs text-[#333333]">
            {{ selectedChat?.participants?.length || 0 }} Participants
          </p>
        </div>
      </div>
      <button @click="emit('close')" class="text-[#333333]">
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

    <!-- Chat Messages -->
    <div ref="chatContainer" class="flex-1 overflow-y-auto p-4 space-y-4">
      <!-- Date Divider -->
      <div class="flex items-center gap-4 my-6">
        <div class="flex-1 h-px bg-[#4F4F4F]"></div>
        <span class="text-sm text-[#4F4F4F] font-bold">{{ formatDate }}</span>
        <div class="flex-1 h-px bg-[#4F4F4F]"></div>
      </div>

      <!-- Messages -->
      <div v-for="message in chatMessages" :key="message.id" class="space-y-2">
        <!-- New Message Divider -->
        <div
          v-if="message.showDividerBefore"
          :ref="
            (el) => {
              if (el) firstUnreadElement = el as HTMLElement
            }
          "
          class="flex items-center gap-4 my-6"
        >
          <div class="flex-1 h-px bg-[#EB5757]"></div>
          <span class="text-sm text-[#EB5757] font-bold flex items-center">
            New Message
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="ml-2"
              height="20px"
              viewBox="0 0 24 24"
              width="20px"
              fill="#f2f2f2"
            >
              <path d="M0 0h24v24H0V0z" fill="none" />
              <path d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z" />
            </svg>
          </span>
          <div class="flex-1 h-px bg-[#EB5757]"></div>
        </div>

        <p
          class="text-sm font-bold"
          :class="[
            message.isUser
              ? getSenderColor(message.sender, true).text
              : getSenderColor(message.sender, false).text,
            message.isUser ? 'text-right' : 'text-left',
          ]"
        >
          {{ message.sender }}
        </p>

        <!-- Message Bubble -->
        <div :class="message.isUser ? 'flex flex-col items-end' : 'flex flex-col items-start'">
          <div class="relative group max-w-[70%]">
            <div
              v-if="message.replyingTo"
              class="bg-[#F2F2F2] border border-[#E0E0E0] text-[#4F4F4F] p-3 rounded mb-2"
            >
              <p class="text-sm">{{ message.replyingTo.text }}</p>
            </div>
          </div>
          <div class="relative group max-w-[70%]">
            <!-- Three dots menu -->
            <button
              @click.stop="toggleMessageMenu(message.id)"
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
                v-if="activeMessageMenu === message.id"
                :class="[
                  'absolute top-8 bg-white border border-[#BDBDBD] rounded-md shadow-lg z-20 py-1 w-32',
                  message.isUser ? '-left-32' : '-right-8',
                ]"
                @click.stop
              >
                <template v-if="message.isUser">
                  <div
                    @click="handleEdit(message.id)"
                    class="w-full cursor-pointer border-b border-[#BDBDBD] text-left px-4 py-2 text-sm text-[#2F80ED] hover:bg-gray-100 transition-colors"
                  >
                    Edit
                  </div>
                  <div
                    @click="handleDelete(message.id)"
                    class="w-full cursor-pointer text-left px-4 py-2 text-sm text-[#EB5757] hover:bg-gray-100 transition-colors"
                  >
                    Delete
                  </div>
                </template>
                <template v-else>
                  <div
                    @click="handleShare(message.id)"
                    class="w-full cursor-pointer border-b border-[#BDBDBD] text-left px-4 py-2 text-sm text-[#2F80ED] hover:bg-gray-100 transition-colors"
                  >
                    Share
                  </div>
                  <div
                    @click="handleReply(message.id)"
                    class="w-full cursor-pointer text-left px-4 py-2 text-sm text-[#2F80ED] hover:bg-gray-100 transition-colors"
                  >
                    Reply
                  </div>
                </template>
              </div>
            </Transition>

            <div
              class="rounded-lg p-3"
              :style="{ backgroundColor: getSenderColor(message.sender, message.isUser).bg }"
            >
              <p class="text-sm text-[#4F4F4F]">{{ message.text }}</p>
              <p class="text-xs text-[#4F4F4F] mt-1">{{ message.time }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- New Message Badge (Floating) -->
      <Transition
        enter-active-class="transition-all duration-200 ease-out"
        leave-active-class="transition-all duration-200 ease-in"
        enter-from-class="opacity-0 translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 translate-y-2"
      >
        <button
          v-if="showNewMessageBadge"
          @click="scrollToNewMessages"
          class="absolute flex items-center bottom-20 left-1/2 -translate-x-1/2 px-3 py-2 bg-[#E9F3FF] text-[#2F80ED] text-sm font-bold rounded-[5px] transition-colors"
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
    </div>

    <!-- Connecting Badge -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      leave-active-class="transition-all duration-300 ease-in"
      enter-from-class="opacity-0 translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-4"
    >
      <div v-if="showConnectingBadge" class="px-4 pb-2 bg-white">
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

    <!-- Message Input -->
    <div class="p-4 pt-0 border-t-0 flex items-end gap-2">
      <div class="flex-1 border border-[#E0E0E0] rounded-lg overflow-hidden bg-white">
        <!-- Reply Preview -->
        <div v-if="replyToMessage" class="bg-[#F2F2F2] p-3 border-b border-[#E0E0E0] relative">
          <div class="flex justify-between items-start mb-1">
            <h3 class="font-bold text-[#4F4F4F] text-sm">
              Replying to {{ replyToMessage.sender }}
            </h3>
            <button @click="cancelReply" class="text-[#4F4F4F] hover:text-[#333]">
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
          v-model="newMessage"
          placeholder="Type a new message"
          class="w-full px-4 py-3 outline-none focus:outline-none bg-transparent"
          @keyup.enter="sendMessage"
        />
      </div>

      <ButtonNormal @click="sendMessage" class="mb-[1px]"> Send </ButtonNormal>
    </div>
  </div>
</template>
