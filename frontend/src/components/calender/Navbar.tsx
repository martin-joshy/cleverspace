import { CalendarDays, ListTodo, Menu } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Navbar() {
  const navigate = useNavigate();
  return (
    <nav className="border-b bg-background">
      <div className="container flex h-14 items-center">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" className="mr-2 px-2 md:hidden">
              <Menu className="h-4 w-4" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Navigation</SheetTitle>
              <SheetDescription>
                Access your tasks and calendar
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-2 py-6">
              <Link
                to={"/home"}
                className="flex items-center gap-2 text-sm font-medium"
              >
                <ListTodo className="h-4 w-4" />
                Tasks
              </Link>
              <Link
                to={"/home"}
                className="flex items-center gap-2 text-sm font-medium"
              >
                <CalendarDays className="h-4 w-4" />
                Calendar
              </Link>
            </div>
          </SheetContent>
        </Sheet>
        <div className="mr-4 hidden md:flex">
          <Link to={"/home"} className="mr-6 flex items-center space-x-2">
            <ListTodo className="h-6 w-6" />
            <span className="font-bold inline-block">Task Manager</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none"></div>
        </div>
        <Button
          variant="ghost"
          className="justify-start px-2"
          onClick={() => navigate("/logout")}
        >
          Logout
        </Button>
      </div>
    </nav>
  );
}
