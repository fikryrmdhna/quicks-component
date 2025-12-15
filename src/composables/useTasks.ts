import { ref, type Ref } from 'vue'
import { getAllTask, type Tasks } from '@/services/tasks'

export function useTasks() {
  const tasks: Ref<Tasks[]> = ref([])
  const loading = ref(false)
  const error: Ref<Error | null> = ref(null)

  const fetchTasks = async () => {
    loading.value = true
    error.value = null

    try {
      tasks.value = await getAllTask()
    } catch (err) {
      error.value = err as Error
      console.error('Error in useTasks:', err)
    } finally {
      loading.value = false
    }
  }

  return {
    tasks,
    loading,
    error,
    fetchTasks,
  }
}
