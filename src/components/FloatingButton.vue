<script setup lang="ts">
import { ref } from 'vue'

import ButtonQuick from '@/components/button/ButtonQuick.vue'
import ButtonQuickTask from '@/components/button/ButtonQuickTask.vue'
import ButtonQuickInbox from '@/components/button/ButtonQuickInbox.vue'

const isQuickButtonClicked = ref(false)
const activeButton = ref<'task' | 'inbox' | null>(null)

const handleTaskClick = () => {
  activeButton.value = activeButton.value === 'task' ? null : 'task'
}

const handleInboxClick = () => {
  activeButton.value = activeButton.value === 'inbox' ? null : 'inbox'
}

const handleQuickClick = () => {
  isQuickButtonClicked.value = !isQuickButtonClicked.value
  if (!isQuickButtonClicked.value) {
    activeButton.value = null
  }
}
</script>

<template>
  <div class="fixed bottom-8 right-8 z-50 flex items-center">
    <!-- Task Button -->
    <ButtonQuickTask
      :class="[
        'transition-all duration-500 ease-out absolute',
        !isQuickButtonClicked 
          ? 'right-0 scale-0 opacity-0' 
          : activeButton === 'task'
            ? 'right-0 scale-100 opacity-100 z-30'
            : activeButton === 'inbox'
              ? 'right-20 scale-80 opacity-100 z-10'
              : 'right-40 scale-100 opacity-100 z-20'
      ]"
      :isActive="activeButton === 'task'"
      @click="handleTaskClick"
    />
    
    <!-- Inbox Button -->
    <ButtonQuickInbox
      :class="[
        'transition-all duration-500 ease-out absolute',
        !isQuickButtonClicked 
          ? 'right-0 scale-0 opacity-0' 
          : activeButton === 'inbox'
            ? 'right-0 scale-100 opacity-100 z-30'
            : activeButton === 'task'
              ? 'right-20 scale-80 opacity-100 z-10'
              : 'right-20 scale-100 opacity-100 z-20'
      ]"
      :isActive="activeButton === 'inbox'"
      @click="handleInboxClick"
    />
    
    <!-- Quick Button -->
    <ButtonQuick
      :isActive="isQuickButtonClicked"
      :class="[
        'relative transition-all duration-500 ease-out',
        activeButton ? 'z-20' : 'z-30'
      ]"
      @click="handleQuickClick"
    />
  </div>
</template>
