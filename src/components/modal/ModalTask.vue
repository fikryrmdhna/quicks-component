<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import TaskItem from './TaskItem.vue'
import { useTasks } from '@/composables/useTasks'
import ButtonNormal from '../button/ButtonNormal.vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close'])

const selectedFilter = ref('My Tasks')
const showDropdown = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)
const taskListRef = ref<HTMLElement | null>(null)

const filterOptions = ['Personal Errands', 'Urgent To-Do']

const { tasks, loading, fetchTasks } = useTasks()

watch(
  () => props.isOpen,
  () => {
    if (props.isOpen) {
      fetchTasks()
    }
  },
)

const selectFilter = (filter: string) => {
  selectedFilter.value = filter
  showDropdown.value = false
}

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    showDropdown.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const toggleTask = (taskId: string) => {
  const task = tasks.value.find((t) => t.id === taskId)
  if (task) {
    task.completed = !task.completed
  }
}

const updateTaskTitle = (taskId: string, title: string) => {
  const task = tasks.value.find((t) => t.id === taskId)
  if (task) {
    task.title = title
  }
}

const updateTaskDescription = (taskId: string, description: string) => {
  const task = tasks.value.find((t) => t.id === taskId)
  if (task) {
    task.description = description
  }
}

const updateTaskDate = (taskId: string, date: string) => {
  const task = tasks.value.find((t) => t.id === taskId)
  if (task) {
    task.date = date
  }
}

const deleteTask = (taskId: string) => {
  tasks.value = tasks.value.filter((t) => t.id !== taskId)
}

const updateTaskNotes = (taskId: string, notes: string[]) => {
  const task = tasks.value.find((t) => t.id === taskId)
  if (task) {
    task.notes = notes
  }
}

const addNewTask = async () => {
  const newTask = {
    id: String(Date.now()),
    title: '',
    date: '',
    description: '',
    completed: false,
    daysLeft: 0,
  }
  tasks.value.push(newTask as any)

  await nextTick()
  if (taskListRef.value) {
    taskListRef.value.scrollTo({
      top: taskListRef.value.scrollHeight,
      behavior: 'smooth',
    })
  }
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
      <!-- Header -->
      <div class="pt-6 px-[32px] flex items-center justify-between">
        <div class="relative" ref="dropdownRef">
          <button
            @click="showDropdown = !showDropdown"
            class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 flex items-center gap-2 hover:bg-gray-50"
          >
            {{ selectedFilter }}
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
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
              v-if="showDropdown"
              class="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-50"
            >
              <div class="py-1">
                <button
                  v-for="option in filterOptions"
                  :key="option"
                  @click="selectFilter(option)"
                  class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  :class="selectedFilter === option ? 'bg-gray-50 font-medium' : ''"
                >
                  {{ option }}
                </button>
              </div>
            </div>
          </Transition>
        </div>
        <ButtonNormal @click="addNewTask"> New Task </ButtonNormal>
      </div>

      <div v-if="loading" class="flex items-center justify-center flex-1 h-full">
        <div class="flex flex-col items-center justify-center">
          <div
            class="w-[40px] h-[40px] border-4 border-[#f8f8f8] border-t-[#c4c4c4] rounded-full animate-spin"
          />
          <p class="text-[#4F4F4F] text-sm font-bold mt-3">Loading Task List ...</p>
        </div>
      </div>

      <!-- Task List -->
      <div
        v-if="!loading"
        ref="taskListRef"
        class="overflow-y-auto h-[calc(100%-80px)] px-[32px] space-y-3"
      >
        <TaskItem
          v-for="task in tasks"
          :key="task.id"
          :task="task"
          @toggle="toggleTask"
          @updateDescription="updateTaskDescription"
          @updateDate="updateTaskDate"
          @updateTitle="updateTaskTitle"
          @delete="deleteTask"
          @updateNotes="updateTaskNotes"
        />
      </div>
    </div>
  </Transition>
</template>
