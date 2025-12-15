import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/config/firebase'
export interface Conversation {
  id: string
  [key: string]: any
}

export async function getAllConversations(): Promise<Conversation[]> {
  console.log('getAllConversations')
  try {
    const conversationsRef = collection(db, 'conversations')
    const snapshot = await getDocs(conversationsRef)

    console.log('snapshot:', snapshot)

    const conversations: Conversation[] = []
    snapshot.forEach((doc) => {
      conversations.push({
        id: doc.id,
        ...doc.data(),
      } as Conversation)
    })

    console.log('getAllConversations:', conversations)

    return conversations
  } catch (error) {
    console.error('Error fetching conversations:', error)
    throw error
  }
}
