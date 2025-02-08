"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createTask } from "../app/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "react-hot-toast"
import type { Task } from "@/lib/models/Task"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";


interface TaskFormProps {
  onTaskAdded: (task: Task) => void
}

export default function TaskForm({ onTaskAdded }: TaskFormProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [dueDate, setDueDate] = useState("");
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const newTask = {
        title,
        description,
        dueDate: new Date(dueDate).toISOString(),
        completed: false,
      }
      const result = await createTask(newTask)
      setTitle("")
      setDescription("")
      setDueDate("")
      setIsOpen(false)
      router.refresh()
      toast.success("Task created successfully")
      onTaskAdded({ ...newTask, _id: result.id })
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to create task")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-xl hover:bg-white/55">Add New Task</Button>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle className="font-medium">Add New Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title"
            required
            className=""
          />
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Task description"
            className=""
          />
          <DatePicker
            selected={dueDate ? new Date(dueDate) : null}
            onChange={(date) => setDueDate(date ? format(date, "yyyy-MM-dd") : "")}
            dateFormat="dd-MM-yyyy"
            placeholderText="DD-MM-YYYY"
            className=" text-white bg-transparent border p-2 w-full rounded-md cursor-pointer"
          />
          <Button type="submit" variant="outline" className="w-full">
            Add Task
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

