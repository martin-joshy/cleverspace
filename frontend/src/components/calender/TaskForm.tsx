import { useState } from "react";
import { useDispatch } from "react-redux";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { addTask, updateTask } from "./taskSlice";
import { AppDispatch } from "@/store";
import { Task, TaskFormData } from "@/types/task";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type TaskFormProps = {
  initialTask?: Task;
  onComplete?: () => void;
};

export default function TaskForm({ initialTask, onComplete }: TaskFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [title, setTitle] = useState(initialTask?.title || "");
  const [description, setDescription] = useState(
    initialTask?.description || ""
  );
  const [dueDate, setDueDate] = useState<Date | null>(
    initialTask?.scheduled_on ? new Date(initialTask.scheduled_on) : null
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dueDate) return;

    const taskData: TaskFormData = {
      title,
      description,
      scheduled_on: dueDate.toISOString(),
    };

    if (initialTask) {
      await dispatch(updateTask({ id: initialTask.id, task: taskData }));
    } else {
      await dispatch(addTask(taskData));
    }

    if (!initialTask) {
      setTitle("");
      setDescription("");
      setDueDate(null);
    }

    onComplete?.();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialTask ? "Update Task" : "Create New Task"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="h-9"
            />
          </div>
          <div className="space-y-2">
            <Textarea
              placeholder="Task description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px] resize-none"
            />
          </div>
          <div className="relative">
            <DatePicker
              selected={dueDate}
              onChange={(date: Date | null) => setDueDate(date)}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="MMMM d, yyyy h:mm aa"
              customInput={
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "PPP p") : "Pick a date and time"}
                </Button>
              }
            />
          </div>
          <Button type="submit" className="w-full">
            {initialTask ? "Update Task" : "Create Task"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
