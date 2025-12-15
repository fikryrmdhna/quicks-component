<script setup lang="ts">
import { ref, nextTick, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  task: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits([
  'toggle',
  'updateDescription',
  'updateDate',
  'updateTitle',
  'delete',
  'updateNotes',
])

const isExpanded = ref(false)
const editingDescription = ref(false)
const descriptionValue = ref(props.task.description)
const textareaRef = ref<HTMLElement | null>(null)
const showMenu = ref(false)
const menuRef = ref<HTMLElement | null>(null)
const showBookmarkMenu = ref(false)
const bookmarkRef = ref<HTMLElement | null>(null)

const notesOptions = [
  { label: 'Important ASAP', color: '#E5F1FF' },
  { label: 'Offline Meeting', color: '#FDCFA4' },
  { label: 'Virtual Meeting', color: '#F9E9C3' },
  { label: 'ASAP', color: '#AFEBDB' },
  { label: 'Client Related', color: '#CBF1C2' },
  { label: 'Self Task', color: '#CFCEF9' },
  { label: 'Appointments', color: '#F9E0FD' },
  { label: 'Court Related', color: '#9DD0ED' },
]

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}

const toggleMenu = () => {
  showMenu.value = !showMenu.value
}

const toggleBookmarkMenu = () => {
  showBookmarkMenu.value = !showBookmarkMenu.value
}

const toggleNote = (label: string) => {
  const currentNotes = props.task.notes || []
  let newNotes: string[]

  if (currentNotes.includes(label)) {
    newNotes = currentNotes.filter((n: string) => n !== label)
  } else {
    newNotes = [...currentNotes, label]
  }

  emit('updateNotes', props.task.id, newNotes)
  // Keep menu open for multiple selections
}

const getNoteStyle = (label: string) => {
  const option = notesOptions.find((opt) => opt.label === label)
  return option
    ? { backgroundColor: option.color, color: '#4F4F4F' }
    : { backgroundColor: '#E0E0E0', color: '#4F4F4F' }
}

const deleteTask = () => {
  emit('delete', props.task.id)
  showMenu.value = false
}

const handleClickOutside = (event: MouseEvent) => {
  if (menuRef.value && !menuRef.value.contains(event.target as Node)) {
    showMenu.value = false
  }
  if (bookmarkRef.value && !bookmarkRef.value.contains(event.target as Node)) {
    showBookmarkMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const startEditDescription = async () => {
  editingDescription.value = true
  descriptionValue.value = props.task.description
  await nextTick()
  if (textareaRef.value) {
    textareaRef.value.focus()
  }
}

const saveDescription = () => {
  emit('updateDescription', props.task.id, descriptionValue.value)
  editingDescription.value = false
}

const cancelEdit = () => {
  editingDescription.value = false
  descriptionValue.value = props.task.description
}

function formatDateForInput(date: any) {
  if (!date) return ''
  if (date?.seconds) {
    const d = new Date(date.seconds * 1000)
    return d.toISOString().split('T')[0]
  }
  return typeof date === 'string' ? date : ''
}

function handleDateInput(e: Event) {
  const value = (e.target as HTMLInputElement).value
  emit('updateDate', props.task.id, value)
}

function formatDate(date: any) {
  if (!date) return ''
  const dateFormat = new Date(date?.seconds ? date.seconds * 1000 : date)
  const day = dateFormat.getDate().toString().padStart(2, '0')
  const month = (dateFormat.getMonth() + 1).toString().padStart(2, '0')
  const year = dateFormat.getFullYear()

  return `${day}/${month}/${year}`
}
</script>

<template>
  <div class="border-b border-[#828282] bg-white py-[22px]">
    <!-- Task Header -->
    <div class="flex items-start gap-3">
      <!-- Checkbox -->
      <input
        type="checkbox"
        :checked="task.completed"
        @change="emit('toggle', task.id)"
        class="mt-[5px] w-4 h-4 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
        :class="
          task.completed ? 'text-[#828282] accent-[#828282]' : 'text-[#2F80ED] accent-[#2F80ED]'
        "
      />

      <!-- Task Content -->
      <div class="flex-1 min-w-0">
        <div class="flex items-start justify-between gap-2 mb-2">
          <div class="flex-1">
            <input
              :value="task.title"
              @input="(e) => emit('updateTitle', task.id, (e.target as HTMLInputElement).value)"
              type="text"
              placeholder="Type Task Title"
              class="w-full !outline-none flex-1 text-sm text-[#4F4F4F] focus:border focus:border-[#2F80ED] rounded px-1 focus:!outline-none focus:ring-2 focus:ring-transparent font-bold"
              :class="task.completed ? 'line-through text-[#828282]' : ''"
              @keydown.enter="($event.target as HTMLInputElement).blur()"
            />
          </div>
          <div class="flex items-center gap-2">
            <span
              v-if="task.daysLeft && !task.completed"
              class="text-xs text-[#EB5757] px-2 py-1 rounded"
            >
              {{ task.daysLeft }} Days Left
            </span>
            <span class="text-xs text-[#4F4F4F]">{{ formatDate(task.date) }}</span>
            <button class="text-[#4F4F4F] hover:text-gray-600" @click="toggleExpand">
              <svg
                class="w-5 h-5 transition-transform"
                :class="isExpanded ? 'rotate-180' : ''"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            <div class="relative" ref="menuRef">
              <button class="text-[#4F4F4F] hover:text-gray-600" @click="toggleMenu">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
                  />
                </svg>
              </button>

              <!-- Dropdown Menu -->
              <div
                v-if="showMenu"
                class="absolute right-0 top-full mt-1 w-32 bg-white border border-[#828282] rounded shadow-lg z-10"
              >
                <button
                  @click="deleteTask"
                  class="w-full text-left px-4 py-2 text-sm text-[#EB5757] hover:bg-gray-50 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Expanded Details -->
        <Transition
          enter-active-class="transition-all duration-200 ease-out overflow-hidden"
          leave-active-class="transition-all duration-200 ease-in overflow-hidden"
          enter-from-class="opacity-0 max-h-0"
          enter-to-class="opacity-100 max-h-96"
          leave-from-class="opacity-100 max-h-96"
          leave-to-class="opacity-0 max-h-0"
        >
          <div v-if="isExpanded" class="mt-3 space-y-3">
            <!-- Date Picker -->
            <div class="flex items-center gap-2 p-[7px] px-[10px]">
              <svg
                class="w-5 h-5"
                :class="task.date ? 'text-[#2F80ED]' : 'text-[#4F4F4F]'"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <input
                type="date"
                :value="formatDateForInput(task.date)"
                @input="handleDateInput"
                class="px-3 py-1 border border-[#4F4F4F] rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <!-- Description -->
            <div class="flex items-start gap-2 p-[7px] px-[10px]">
              <span @click="startEditDescription">
                <svg
                  class="w-5 h-5 mt-0.5 flex-shrink-0"
                  :class="descriptionValue ? 'text-[#2F80ED]' : 'text-[#4F4F4F]'"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </span>

              <!-- Edit Mode -->
              <textarea
                v-if="editingDescription"
                ref="textareaRef"
                v-model="descriptionValue"
                @blur="saveDescription"
                @keydown.esc="cancelEdit"
                class="!outline-none flex-1 text-sm text-[#4F4F4F] border border-[#2F80ED] rounded px-2 py-1 focus:!outline-none focus:ring-2 focus:ring-transparent min-h-[110px] resize-none"
                autofocus
              />

              <!-- View Mode -->
              <div
                v-else
                @click="startEditDescription"
                class="flex-1 text-sm text-[#4F4F4F] cursor-pointer hover:bg-gray-50 rounded px-2 py-1 -ml-2 transition-colors"
              >
                {{ descriptionValue || 'No Description' }}
              </div>
            </div>

            <!-- Notes / Bookmarks Section -->
            <div class="bg-[#F9F9F9] rounded p-[7px] px-[10px] mt-3">
              <div
                class="flex items-center gap-2 relative cursor-pointer"
                ref="bookmarkRef"
                @click="toggleBookmarkMenu"
              >
                <button
                  class="hover:bg-gray-200 rounded transition-colors pointer-events-none"
                  :class="showBookmarkMenu ? 'bg-gray-200' : ''"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-5 h-5"
                    :class="
                      (task.notes && task.notes.length > 0) || showBookmarkMenu
                        ? 'text-[#2F80ED]'
                        : 'text-[#4f4f4f]'
                    "
                    viewBox="0 0 24 24"
                    :fill="
                      (task.notes && task.notes.length > 0) || showBookmarkMenu
                        ? '#2F80ED'
                        : '#4f4f4f'
                    "
                  >
                    <path d="M0 0h24v24H0V0z" fill="none" />
                    <path
                      d="M15 7v12.97l-4.21-1.81-.79-.34-.79.34L5 19.97V7h10m4-6H8.99C7.89 1 7 1.9 7 3h10c1.1 0 2 .9 2 2v13l2 1V3c0-1.1-.9-2-2-2zm-4 4H5c-1.1 0-2 .9-2 2v16l7-3 7 3V7c0-1.1-.9-2-2-2z"
                    />
                  </svg>
                </button>

                <!-- Active Notes Badges -->
                <div class="flex flex-wrap gap-2 pointer-events-none">
                  <span
                    v-for="note in task.notes"
                    :key="note"
                    class="px-3 py-1 rounded text-xs font-bold"
                    :style="getNoteStyle(note)"
                  >
                    {{ note }}
                  </span>
                </div>

                <!-- Notes Dropdown -->
                <div
                  v-if="showBookmarkMenu"
                  @click.stop
                  class="absolute top-full left-0 mt-2 w-64 bg-white border border-[#828282] rounded shadow-lg z-20 p-3 space-y-2 cursor-default"
                >
                  <button
                    v-for="option in notesOptions"
                    :key="option.label"
                    @click="toggleNote(option.label)"
                    class="w-full text-left px-3 py-1.5 rounded text-sm font-bold transition-colors border"
                    :class="
                      task.notes?.includes(option.label)
                        ? 'border-[#2F80ED]'
                        : 'border-transparent hover:border-[#2F80ED]'
                    "
                    :style="{ backgroundColor: option.color, color: '#4F4F4F' }"
                  >
                    {{ option.label }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>
