import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import {
  CheckCircle2,
  Circle,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { RootState, AppDispatch } from "@/store";
import { Task } from "@/types/task";
import {
  Card,
  CardContent,
  CardDescription,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import TaskForm from "./TaskForm";
import { deleteTask, toggleTaskCompletion, fetchTasks } from "./taskSlice";

export default function TaskList() {
  const dispatch = useDispatch<AppDispatch>();
  const tasks = useSelector((state: RootState) => state.tasks.items);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const status = useSelector((state: RootState) => state.tasks.status);
  const error = useSelector((state: RootState) => state.tasks.error);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchTasks());
    }
  }, [status, dispatch]);

  if (status === "loading") {
    return (
      <div className="space-y-4">
        <Skeleton className="h-full w-full" />
        <Skeleton className="h-full w-full" />
      </div>
    );
  }

  if (status === "failed" && error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Failed to load tasks: {error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <Card key={task.id} className={task.is_completed ? "bg-muted/50" : ""}>
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <div className="flex items-start space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 -ml-2 mt-0.5"
                onClick={() => dispatch(toggleTaskCompletion(task.id))}
              >
                {task.is_completed ? (
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                ) : (
                  <Circle className="h-5 w-5" />
                )}
              </Button>
              <div>
                <CardTitle
                  className={`text-base ${
                    task.is_completed
                      ? "line-through text-muted-foreground"
                      : ""
                  }`}
                >
                  {task.title}
                </CardTitle>
                <CardDescription>
                  Due: {format(new Date(task.scheduled_on), "PPP")}
                </CardDescription>
              </div>
            </div>
            <Dialog>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DialogTrigger asChild>
                    <DropdownMenuItem onSelect={() => setEditingTask(task)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={() => dispatch(deleteTask(task.id))}
                    className="text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Task</DialogTitle>
                </DialogHeader>
                <TaskForm
                  initialTask={task}
                  onComplete={() => setEditingTask(null)}
                />
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <p
              className={`text-sm ${
                task.is_completed ? "text-muted-foreground" : ""
              }`}
            >
              {task.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
