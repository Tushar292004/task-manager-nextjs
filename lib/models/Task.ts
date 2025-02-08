import type { ObjectId } from "mongodb"

export interface Task {
  _id: string
  title: string
  description: string
  dueDate: string
  completed: boolean
}

export interface ServerTask {
  _id: ObjectId
  title: string
  description: string
  dueDate: Date
  completed: boolean
}

