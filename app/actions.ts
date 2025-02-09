"use server"

import { revalidatePath } from "next/cache"
import clientPromise from "../lib/mongodb"
import type { Task, ServerTask } from "../lib/models/Task"
import { ObjectId } from "mongodb"

//This will give us the array of task "eventually {promise}"
export async function getTasks(): Promise<Task[]> {
  try {
    const client = await clientPromise
    const collection = client.db().collection<ServerTask>("tasks")
    const serverTasks = await collection.find({}).sort({ dueDate: 1 }).toArray()

    //returning the array of tasks
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

// create task but with Typescript utility type Omit _id of task from interface
export async function createTask(task: Omit<Task, "_id">) {
  try {
    const client = await clientPromise
    const collection = client.db().collection("tasks")

    //adding new task to database
    const result = await collection.insertOne({
      ...task,
      dueDate: new Date(task.dueDate),
    })
    //to refresh the UI (ensures Next.js fetches updated data).
    revalidatePath("/")
    return { success: true, message: "Task created successfully", id: result.insertedId.toString() }
  } catch (error) {
    console.error("Failed to create task:", error)
    throw new Error("Failed to create task")
  }
}

//For updating task status we use Omit typescript utility type to make other field omited. 
export async function updateTask(id: string, updates: Omit<Task, "dueDate" | "_id" | "title" | "description">) {
  try {
    const client = await clientPromise
    const collection = client.db().collection("tasks")

    //updatinh the task status respective to that id and seting the new status
    await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updates },
    )

    //to refresh the UI (ensures Next.js fetches updated data).
    revalidatePath("/")
    return { success: true, message: "Task updated successfully" }
  } catch (error) {
    console.error("Failed to update task:", error)
    throw new Error("Failed to update task")
  }
}

//For editing task description, title, duedate except id using combination of Partial and Omit typescript utility types
export async function editTask(id: string, updatedFields: Partial<Omit<Task, "_id">>){
  try{
    const client = await clientPromise
    const collection = client.db().collection("tasks")

    if (!ObjectId.isValid(id)) {
      throw new Error("Invalid Task ID");
    }
    //updatinh the task  respective to that id and seting the new inputs
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

//Function to simple delete the task
export async function deleteTask(id: string) {
  try {
    const client = await clientPromise
    const collection = client.db().collection("tasks")

    //Deleting the task of the respective id
    await collection.deleteOne({ _id: new ObjectId(id) })

    //to refresh the UI (ensures Next.js fetches updated data).
    revalidatePath("/")
    return { success: true, message: "Task deleted successfully" }
  } catch (error) {
    console.error("Failed to delete task:", error)
    throw new Error("Failed to delete task")
  }
}

