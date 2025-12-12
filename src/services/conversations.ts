import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/config/firebase'

// Define the Conversation interface based on your Firestore data structure
export interface Conversation {
  id: string
  // Add other fields from your conversations collection here
  // For example:
  // title?: string
  // messages?: Message[]
  // participants?: string[]
  // createdAt?: Date
  // updatedAt?: Date
  [key: string]: any // Allow for flexible structure
}

/**
 * Fetch all conversations from Firestore
 * @returns Promise with array of conversations
 */
export async function getAllConversations(): Promise<Conversation[]> {
  try {
    const conversationsRef = collection(db, 'conversations')
    const snapshot = await getDocs(conversationsRef)

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
