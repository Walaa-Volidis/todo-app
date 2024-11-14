"use client";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import TaskForm from "@/app/components/TaskForm";
import { TaskList } from "@/app/components/TaskList";
import { useTasks } from "@/app/hooks/useTasks";
import { useUser } from "@clerk/nextjs";
import { ClipLoader } from "react-spinners";

type TaskFilter = {
  search: string;
  category: string;
  date: string;
};

export default function TodoPage() {
  const { user } = useUser();
  const userId = user?.id;
  const [filters, setFilters] = useState<TaskFilter>({
    search: "",
    category: "all",
    date: "",
  });
  const { tasks, addTask, deleteTask, isLoading } = useTasks(userId, filters);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="bg-white border-b">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Task Manager
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search tasks..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters({ ...filters, search: e.target.value })
                  }
                  className="pl-10"
                />
              </div>
            </div>
            <Select
              value={filters.category}
              onValueChange={(value) =>
                setFilters({ ...filters, category: value })
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Work">Work</SelectItem>
                <SelectItem value="Personal">Personal</SelectItem>
                <SelectItem value="Shopping">Shopping</SelectItem>
                <SelectItem value="Health">Health</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="date"
              value={filters.date}
              onChange={(e) => setFilters({ ...filters, date: e.target.value })}
              className="w-[180px]"
            />
          </div>

          {userId && <TaskForm userId={userId} addTask={addTask} />}

          {isLoading ? (
            <div className="flex justify-center items-center">
              <ClipLoader size={50} color={"#123abc"} loading={isLoading} />
            </div>
          ) : (
            <TaskList tasks={tasks} onDelete={deleteTask} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
