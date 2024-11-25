import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RootState, AppDispatch } from "@/store";
import { Task } from "@/types/task";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import TaskForm from "./TaskForm";
import { deleteTask, toggleTaskCompletion } from "./taskSlice";

export default function TaskList() {
  const dispatch = useDispatch<AppDispatch>();
  const tasks = useSelector((state: RootState) => state.tasks.items);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <Card key={task.id} className={task.is_completed ? "bg-muted" : ""}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Checkbox
                checked={task.is_completed}
                onCheckedChange={() => dispatch(toggleTaskCompletion(task.id))}
              />
              <span className={task.is_completed ? "line-through" : ""}>
                {task.title}
              </span>
            </CardTitle>
            <CardDescription>
              Due: {format(new Date(task.scheduled_on), "PPP")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>{task.description}</p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" onClick={() => setEditingTask(task)}>
                  Edit
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Task</DialogTitle>
                </DialogHeader>
                <TaskForm
                  initialTask={editingTask || undefined}
                  onComplete={() => setEditingTask(null)}
                />
              </DialogContent>
            </Dialog>
            <Button
              variant="destructive"
              onClick={() => dispatch(deleteTask(task.id))}
            >
              Delete
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
