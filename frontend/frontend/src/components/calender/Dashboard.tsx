import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RootState, AppDispatch } from "@/store";
import { fetchTasks } from "./taskSlice";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";
import Calendar from "./Calendar";
import { Navbar } from "./Navbar";

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const tasks = useSelector((state: RootState) => state.tasks.items);
  const status = useSelector((state: RootState) => state.tasks.status);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchTasks());
    }
  }, [status, dispatch]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4">
        <Tabs defaultValue="list" className="w-full">
          <TabsList>
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          </TabsList>
          <TabsContent value="list">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-2xl font-semibold mb-4">Add New Task</h2>
                <TaskForm />
              </div>
              <div>
                <h2 className="text-2xl font-semibold mb-4">Task List</h2>
                <TaskList />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="calendar">
            <Calendar tasks={tasks} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
