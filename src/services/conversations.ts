import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/config/firebase'
export interface Message {
  id: string
  text: string
  sender: string
  timestamp: {
    seconds: number
    nanoseconds: number
  }
  isOwn?: boolean
  unread?: boolean
  replyTo?: string | null
}

export interface Conversation {
  id: string
  title: string
  participants: string[]
  type: 'group' | 'single'
  unread: boolean
  lastMessage: {
    sender: string
    message: string
  }
  timestamp: {
    seconds: number
    nanoseconds: number
  }
  messages?: Message[]
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
