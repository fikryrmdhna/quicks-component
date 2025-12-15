<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick, type PropType } from 'vue'
import ChatHeader from '@/components/chat/ChatHeader.vue'
import ConnectingBadge from '@/components/chat/ConnectingBadge.vue'
import MessageInput from '@/components/chat/MessageInput.vue'
import ChatBubble from '@/components/chat/ChatBubble.vue'
import NewMessageBadge from '@/components/chat/NewMessageBadge.vue'
import type { Conversation, Message } from '@/services/conversations'

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
  showDividerBefore?: boolean
}

const props = defineProps({
  selectedChat: {
    type: Object as PropType<Conversation | null>,
    default: null,
  },
})

const emit = defineEmits(['close', 'back', 'reply'])

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

  const rawMessages = props.selectedChat.messages.map((msg: Message, index: number) => ({
    ...msg,
    uniqueId: msg.id ? (msg.id.includes('_') ? msg.id : `${msg.id}_${index}`) : `msg_${index}`,
  }))

  const msgMap = new Map(rawMessages.map((m) => [m.uniqueId, m]))

  const messages = rawMessages.map((msg): ProcessedMessage => {
    const timestamp = msg.timestamp?.seconds ? new Date(msg.timestamp.seconds * 1000) : new Date()

    let replyingTo = null
    if (msg.replyTo) {
      const parent = msgMap.get(msg.replyTo)
      if (parent) {
        replyingTo = {
          sender: parent.sender,
          text: parent.text,
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

  if (firstUnreadIndex > 0 && messages[firstUnreadIndex]) {
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
  const msg = chatMessages.value.find((m) => m.id === messageId)
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

  const colorMap: Record<string, { text: string; bg: string }> = {}
  props.selectedChat.participants.forEach((participant: string) => {
    const hash = participant.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const color = colors[hash % colors.length]
    if (color) {
      colorMap[participant] = color
    }
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

    emit('reply', newMsg)

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
    <ChatHeader :selected-chat="selectedChat" @back="emit('back')" @close="emit('close')" />

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

        <ChatBubble
          :message="message"
          :is-group="selectedChat?.type === 'group'"
          :sender-color="getSenderColor(message.sender, message.isUser)"
          :is-open="activeMessageMenu === message.id"
          @toggle-menu="toggleMessageMenu(message.id)"
          @reply="handleReply(message.id)"
          @edit="handleEdit(message.id)"
          @delete="handleDelete(message.id)"
          @share="handleShare(message.id)"
        />
      </div>

      <!-- New Message Badge (Floating) -->
      <NewMessageBadge :show="showNewMessageBadge" @click="scrollToNewMessages" />
    </div>

    <!-- Connecting Badge -->
    <ConnectingBadge :show="showConnectingBadge" />

    <!-- Message Input -->
    <MessageInput
      v-model="newMessage"
      :reply-to-message="replyToMessage"
      @send="sendMessage"
      @cancel-reply="cancelReply"
    />
  </div>
</template>
