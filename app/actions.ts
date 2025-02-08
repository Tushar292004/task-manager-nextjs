"use server"

import { revalidatePath } from "next/cache"
import clientPromise from "../lib/mongodb"
import type { Task, ServerTask } from "../lib/models/Task"
import { ObjectId } from "mongodb"

export async function getTasks(): Promise<Task[]> {
  try {
    const client = await clientPromise
    const collection = client.db().collection<ServerTask>("tasks")
    const serverTasks = await collection.find({}).sort({ dueDate: 1 }).toArray()

    return serverTasks.map((task) => ({
      ...task,
      _id: task._id.toString(),
      dueDate: new Date(task.dueDate).toISOString(),
    }))
  } catch (error) {
    console.error("Failed to fetch tasks:", error)
    throw new Error("Failed to fetch tasks")
  }
}

export async function createTask(task: Omit<Task, "_id">) {
  try {
    const client = await clientPromise
    const collection = client.db().collection("tasks")
    const result = await collection.insertOne({
      ...task,
      dueDate: new Date(task.dueDate),
    })
    revalidatePath("/")
    return { success: true, message: "Task created successfully", id: result.insertedId.toString() }
  } catch (error) {
    console.error("Failed to create task:", error)
    throw new Error("Failed to create task")
  }
}

export async function updateTask(id: string, updates: Partial<Task>) {
  try {
    const client = await clientPromise
    const collection = client.db().collection("tasks")
    await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updates.dueDate ? { ...updates, dueDate: new Date(updates.dueDate) } : updates },
    )
    revalidatePath("/")
    return { success: true, message: "Task updated successfully" }
  } catch (error) {
    console.error("Failed to update task:", error)
    throw new Error("Failed to update task")
  }
}

export async function editTask(id: string, updatedFields: Partial<{ title: string; description: string; dueDate: string; completed: boolean }>){
  try{
    const client = await clientPromise
    const collection = client.db().collection("tasks")
    if (!ObjectId.isValid(id)) {
      throw new Error("Invalid Task ID");
    }
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedFields }
    );

    if (result.modifiedCount === 0) {
      throw new Error("Task not found or no changes made");
    }
    return { success: true, message: "Task updated successfully" };
  }
  catch (error) {
    console.error("Error updating task:", error);
    throw new Error("Failed to update task");
  }
}

export async function deleteTask(id: string) {
  try {
    const client = await clientPromise
    const collection = client.db().collection("tasks")
    await collection.deleteOne({ _id: new ObjectId(id) })
    revalidatePath("/")
    return { success: true, message: "Task deleted successfully" }
  } catch (error) {
    console.error("Failed to delete task:", error)
    throw new Error("Failed to delete task")
  }
}

