<script setup lang="ts">
import { ref } from 'vue'

import ButtonQuick from '@/components/button/ButtonQuick.vue'
import ButtonQuickTask from '@/components/button/ButtonQuickTask.vue'
import ButtonQuickInbox from '@/components/button/ButtonQuickInbox.vue'
import ModalInbox from '@/components/modal/ModalInbox.vue'
import ModalTask from '@/components/modal/ModalTask.vue'

const isQuickButtonClicked = ref(false)
const activeButton = ref<'task' | 'inbox' | null>(null)
const showInboxPopup = ref(false)
const showTaskPopup = ref(false)

const handleTaskClick = () => {
  if (activeButton.value === 'task') {
    showTaskPopup.value = false
    activeButton.value = null
  } else {
    activeButton.value = 'task'
    showTaskPopup.value = true
    showInboxPopup.value = false
  }
}

const handleInboxClick = () => {
  if (activeButton.value === 'inbox') {
    showInboxPopup.value = false
    activeButton.value = null
  } else {
    activeButton.value = 'inbox'
    showInboxPopup.value = true
    showTaskPopup.value = false
  }
}

const handleQuickClick = () => {
  isQuickButtonClicked.value = !isQuickButtonClicked.value
  if (!isQuickButtonClicked.value) {
    activeButton.value = null
    showInboxPopup.value = false
    showTaskPopup.value = false
  }
}

const closeInboxPopup = () => {
  showInboxPopup.value = false
  activeButton.value = null
}

const closeTaskPopup = () => {
  showTaskPopup.value = false
  activeButton.value = null
}
</script>

<template>
  <div>
    <!-- Task Popup -->
    <ModalTask :isOpen="showTaskPopup" @close="closeTaskPopup" />

    <!-- Inbox Popup -->
    <ModalInbox :isOpen="showInboxPopup" @close="closeInboxPopup" />

    <div class="fixed bottom-8 right-8 z-50 flex items-center">
      <!-- Task Button -->
      <div
        class="absolute bottom-0"
        :class="[
          'transition-all duration-500 ease-out flex flex-col items-center',
          !isQuickButtonClicked
            ? 'right-0 bottom-0 scale-0 opacity-0'
            : activeButton === 'task'
              ? 'right-0 bottom-0 scale-100 opacity-100 z-30'
              : activeButton === 'inbox'
                ? 'right-20 scale-80 opacity-100 z-10'
                : 'right-40 scale-100 opacity-100 z-20',
        ]"
      >
        <p
          v-if="!activeButton"
          class="absolute -top-8 left-1/2 -translate-x-1/2 text-[#F2F2F2] font-bold"
        >
          Task
        </p>
        <ButtonQuickTask :isActive="activeButton === 'task'" @click="handleTaskClick" />
      </div>

      <!-- Inbox Button -->
      <div
        class="absolute bottom-0"
        :class="[
          'transition-all duration-500 ease-out flex flex-col items-center',
          !isQuickButtonClicked
            ? 'right-0 bottom-0 scale-0 opacity-0'
            : activeButton === 'inbox'
              ? 'right-0 bottom-0 scale-100 opacity-100 z-30'
              : activeButton === 'task'
                ? 'right-20 scale-80 opacity-100 z-10'
                : 'right-20 scale-100 opacity-100 z-20',
        ]"
      >
        <p
          v-if="!activeButton"
          class="absolute -top-8 left-1/2 -translate-x-1/2 text-[#F2F2F2] font-bold"
        >
          Inbox
        </p>
        <ButtonQuickInbox :isActive="activeButton === 'inbox'" @click="handleInboxClick" />
      </div>

      <!-- Quick Button -->
      <ButtonQuick
        :isActive="activeButton !== null"
        :class="['relative transition-all duration-500 ease-out', activeButton ? 'z-20' : 'z-30']"
        @click="handleQuickClick"
      />
    </div>
  </div>
</template>
