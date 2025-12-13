<script setup lang="ts">
import { onMounted } from 'vue'
import { useConversations } from '@/composables/useConversations'
import FloatingButton from '@/components/FloatingButton.vue'
import ButtonNormal from '@/components/button/ButtonNormal.vue'
import ButtonQuick from '@/components/button/ButtonQuick.vue'
import ButtonQuickTask from '@/components/button/ButtonQuickTask.vue'
import ButtonQuickInbox from '@/components/button/ButtonQuickInbox.vue'
import TextInput from '@/components/form/TextInput.vue'
import SearchInput from '@/components/form/SearchInput.vue'
import SingleUser from '@/components/user/SingleUser.vue'
import MultipleUser from '@/components/user/MultipleUser.vue'

const { conversations, loading, error, fetchConversations } = useConversations()

onMounted(() => {
  fetchConversations()
})
</script>

<template>
  <div class="p-8 max-w-7xl mx-auto">
    <!-- <ButtonNormal class="mx-2">Send</ButtonNormal>
    <ButtonNormal class="mx-2">New Task</ButtonNormal>
    <ButtonQuick />
    <ButtonQuickTask />
    <ButtonQuickInbox />
    <TextInput />
    <SearchInput />
    <SingleUser>F</SingleUser>
    <MultipleUser /> -->
    <h1 class="mb-8 text-[var(--color-heading)]">Conversations</h1>

    <!-- Loading State -->
    <div v-if="loading" class="text-center p-12 bg-[var(--color-background-soft)] rounded-lg">
      <p>Loading conversations...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center p-12 bg-[var(--color-background-soft)] rounded-lg">
      <p class="text-red-600">Error loading conversations: {{ error.message }}</p>
      <button 
        @click="fetchConversations"
        class="mt-4 px-6 py-2 bg-red-600 text-white border-none rounded cursor-pointer text-base transition-colors hover:bg-red-700"
      >
        Retry
      </button>
    </div>

    <!-- Empty State -->
    <div v-else-if="conversations.length === 0" class="text-center p-12 bg-[var(--color-background-soft)] rounded-lg">
      <p>No conversations found.</p>
    </div>

    <!-- Conversations List -->
    <div v-else class="grid gap-6">
      <div class="p-6 bg-[var(--color-background-soft)] rounded-lg border border-[var(--color-border)]">
        <!-- <h3>Conversation ID: {{ conversation.id }}</h3> -->
        <pre class="bg-[var(--color-background-mute)] p-4 rounded overflow-x-auto text-sm">{{ conversations }}</pre>
      </div>
    </div>
    
    <!-- Floating Button -->
    <FloatingButton />
  </div>
</template>

