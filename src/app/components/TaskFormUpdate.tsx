import React, { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "react-toastify";
import { Task } from "../types/task";

const Categories_List = ["choose", "Work", "Personal", "Health", "Other"];

interface TaskUpdateFormProps {
  task: Task;
  updateTask: (formData: FormData, id: string) => Promise<void>;
  onClose: () => void;
}

export default function TaskUpdateForm({
  task,
  updateTask,
  onClose,
}: TaskUpdateFormProps) {
  const [updatedTask, setUpdatedTask] = useState(task);
  updatedTask.date = new Date(task.date).toISOString().split("T")[0];

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.append("userId", task.userId);
    try {
      await updateTask(formData, task.id);
      toast.success("Task updated successfully.");
      onClose();
    } catch (error) {
      toast.error("Error submitting task. Please try again.");
      console.error("Error submitting task:", error);
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <Input
            placeholder="Title"
            name="title"
            value={updatedTask.title}
            onChange={(e) =>
              setUpdatedTask((prev) => ({ ...prev, title: e.target.value }))
            }
            required
          />
          <Input
            placeholder="Description"
            name="description"
            value={updatedTask.description}
            onChange={(e) =>
              setUpdatedTask((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            required
          />
          <Select
            name="category"
            value={updatedTask.category}
            onValueChange={(value) =>
              setUpdatedTask((prev) => ({ ...prev, category: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {Categories_List.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            name="date"
            type="date"
            value={updatedTask.date}
            onChange={(e) =>
              setUpdatedTask((prev) => ({ ...prev, date: e.target.value }))
            }
            required
          />
          <Button type="submit" className="w-full">
            Update Task
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
