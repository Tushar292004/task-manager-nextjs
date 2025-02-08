"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { editTask } from "../app/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "react-hot-toast"
import  { Task } from "@/lib/models/Task"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";


interface TaskFormProps {
    task: Task;
    onTaskUpdated: (task: Task) => void
}

export default function UpdateTask({ task, onTaskUpdated }: TaskFormProps) {
    const [title, setTitle] = useState(task.title)
    const [description, setDescription] = useState(task.description)
    const [dueDate, setDueDate] = useState(task.dueDate)
    const [isOpen, setIsOpen] = useState(false)
    const router = useRouter()


    useEffect(() => {
        if (task) {
            setTitle(task.title);
            setDescription(task.description);
            setDueDate(task.dueDate.split("T")[0]); // Format to YYYY-MM-DD
        }
    }, [task]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const updatedTask = {
                title,
                description,
                dueDate: new Date(dueDate).toISOString(),
                completed: task.completed,
            };

            await editTask(task._id, updatedTask);

            setTitle("");
            setDescription("");
            setDueDate("");
            setIsOpen(false);
            router.refresh();
            toast.success("Task updated successfully");

            onTaskUpdated({ ...updatedTask, _id: task._id }); // Update the task in UI
        } catch (error) {
            console.error("Error:", error);
            toast.error("Failed to update task");
        }
    };



    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="default"
                    size="lg"
                    className="ml-4 font-semibold bg-yellow-600 rounded-xl"
                >
                    Edit
                </Button>
            </DialogTrigger>
            <DialogContent className="">
                <DialogHeader>
                    <DialogTitle className="font-medium">Update Task</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="New title"
                        required
                        className=""
                    />
                    <Textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="New description"
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
                        Update Task
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}

