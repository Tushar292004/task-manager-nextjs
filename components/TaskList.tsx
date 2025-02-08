"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { Task } from "@/lib/models/Task"
import { updateTask, deleteTask } from "../app/actions"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "react-hot-toast"
import { motion, AnimatePresence } from "framer-motion"
import TaskForm from "./TaskForm"
import UpdateTask from './UpdateTask';

export default function TaskList({ initialTasks }: { initialTasks: Task[] }) {
  const [tasks, setTasks] = useState(initialTasks)
  const router = useRouter()

  useEffect(() => {
    setTasks(initialTasks)
  }, [initialTasks])

  const handleComplete = async (id: string, completed: boolean) => {
    try {
      await updateTask(id, { completed })
      setTasks(tasks.map((task) => (task._id?.toString() === id ? { ...task, completed } : task)))
      router.refresh()
      toast.success("Task status updated successfully")
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to update task")
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteTask(id)
      setTasks(tasks.filter((task) => task._id?.toString() !== id))
      router.refresh()
      toast.success("Task deleted successfully")
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to delete task")
    }
  }

  const addTask = (newTask: Task) => {
    setTasks([newTask, ...tasks])
  }

  const editTask = (updatedTask: Task) => {
    setTasks(tasks.map((task) => (task._id === updatedTask._id ? updatedTask : task))) 
  }
  

  return (
    <div className="space-y-8 p-4">
      <TaskForm onTaskAdded={addTask} />
      <AnimatePresence>
        {tasks.map((task) => (
          <motion.div
            key={task._id?.toString()}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Card className=" hover:bg-gray-750 transition-colors duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={(checked) => handleComplete(task._id!.toString(), checked as boolean)}
                      className="border-gray-400"
                    />
                    <div>
                      <h3
                        className={`font-semibold text-lg ${task.completed ? "line-through text-gray-500" : "text-white"}`}
                      >
                        {task.title}
                      </h3>
                      <p className="text-sm text-gray-400 mt-2 max-h-28 overflow-y-auto">{task.description}</p>
                      <p className="text-sm text-green-500 mt-2">Due Date: {new Date(task.dueDate).toISOString().split("T")[0]}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 " >
                  <Button
                    variant="destructive"
                    size="lg"
                    onClick={() => handleDelete(task._id!.toString())}
                    className="ml-4 rounded-xl"
                  >
                    Delete
                  </Button>
                  <UpdateTask task={task} onTaskUpdated={editTask}/>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

