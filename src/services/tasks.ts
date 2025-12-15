import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/config/firebase'

export interface Tasks {
  id: string
  notes?: string[]
  [key: string]: any
}

export async function getAllTask(): Promise<Tasks[]> {
  try {
    const tasksRef = collection(db, 'tasks')
    const snapshot = await getDocs(tasksRef)

    const tasks: Tasks[] = []
    snapshot.forEach((doc) => {
      tasks.push({
        id: doc.id,
        ...doc.data(),
      } as Tasks)
    })

    console.log('getAllTasks:', tasks)

    return tasks
  } catch (error) {
    console.error('Error fetching tasks:', error)
    throw error
  }
}
