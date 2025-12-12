<script setup lang="ts">
import { onMounted } from 'vue'
import { useConversations } from '@/composables/useConversations'

const { conversations, loading, error, fetchConversations } = useConversations()

onMounted(() => {
  fetchConversations()
})
</script>

<template>
  <div class="conversations-view">
    <h1>Conversations</h1>

    <!-- Loading State -->
    <div v-if="loading" class="loading">
      <p>Loading conversations...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error">
      <p>Error loading conversations: {{ error.message }}</p>
      <button @click="fetchConversations">Retry</button>
    </div>

    <!-- Empty State -->
    <div v-else-if="conversations.length === 0" class="empty">
      <p>No conversations found.</p>
    </div>

    <!-- Conversations List -->
    <div v-else class="conversations-list">
      <div class="conversation-card">
        <!-- <h3>Conversation ID: {{ conversation.id }}</h3> -->
        <pre>{{ conversations }}</pre>
      </div>
    </div>
  </div>
</template>

<style scoped>
.conversations-view {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  margin-bottom: 2rem;
  color: var(--color-heading);
}

.loading,
.error,
.empty {
  text-align: center;
  padding: 3rem;
  background: var(--color-background-soft);
  border-radius: 8px;
}

.error {
  color: #dc3545;
}

.error button {
  margin-top: 1rem;
  padding: 0.5rem 1.5rem;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.error button:hover {
  background: #c82333;
}

.conversations-list {
  display: grid;
  gap: 1.5rem;
}

.conversation-card {
  padding: 1.5rem;
  background: var(--color-background-soft);
  border-radius: 8px;
  border: 1px solid var(--color-border);
}

.conversation-card h3 {
  margin-bottom: 1rem;
  color: var(--color-heading);
}

.conversation-card pre {
  background: var(--color-background-mute);
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 0.875rem;
}
</style>
