import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";
import Calendar from "./Calendar";
import { Navbar } from "./Navbar";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-6">
        <Tabs defaultValue="list" className="space-y-6">
          <TabsList>
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          </TabsList>
          <TabsContent value="list" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold tracking-tight">
                  Create Task
                </h2>
                <TaskForm />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold tracking-tight">
                  Your Tasks
                </h2>
                <TaskList />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="calendar">
            <Calendar />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
