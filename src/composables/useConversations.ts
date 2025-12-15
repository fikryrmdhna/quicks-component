import { ref, type Ref } from 'vue'
import { getAllConversations, type Conversation } from '@/services/conversations'

export function useConversations() {
  const conversations: Ref<Conversation[]> = ref([])
  const loading = ref(false)
  const error: Ref<Error | null> = ref(null)

  const fetchConversations = async () => {
    loading.value = true
    error.value = null

    try {
      conversations.value = await getAllConversations()
    } catch (err) {
      error.value = err as Error
      console.error('Error in useConversations:', err)
    } finally {
      loading.value = false
    }
  }

  return {
    conversations,
    loading,
    error,
    fetchConversations,
  }
}
