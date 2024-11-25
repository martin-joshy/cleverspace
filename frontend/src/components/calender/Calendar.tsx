import { useState, useEffect } from "react";
import {
  Calendar as BigCalendar,
  momentLocalizer,
  Event,
  EventProps,
} from "react-big-calendar";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Task } from "@/types/task";
import { RootState, AppDispatch } from "@/store";
import { fetchTasks } from "./taskSlice";
import { cn } from "@/lib/utils";

const localizer = momentLocalizer(moment);

interface CalendarEvent extends Event {
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  resource: Task;
}

const EventComponent = ({ event }: EventProps<CalendarEvent>) => (
  <div className="p-1 bg-primary/10 rounded-sm border border-primary/20 text-primary-foreground">
    <strong className="text-xs font-medium">{event.title}</strong>
    <br />
    <span className="text-[10px] opacity-75">
      {moment(event.start).format("h:mm A")}
    </span>
  </div>
);

export default function Calendar() {
  const dispatch = useDispatch<AppDispatch>();
  const [selectedEvent, setSelectedEvent] = useState<Task | null>(null);
  const tasks = useSelector((state: RootState) => state.tasks.items);
  const status = useSelector((state: RootState) => state.tasks.status);
  const error = useSelector((state: RootState) => state.tasks.error);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchTasks());
    }
  }, [status, dispatch]);

  const events: CalendarEvent[] = tasks.map((task) => ({
    title: task.title,
    start: new Date(task.scheduled_on),
    end: new Date(task.scheduled_on),
    allDay: false,
    resource: task,
  }));

  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedEvent(event.resource);
  };

  if (status === "loading") {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[600px] w-full" />
        <Skeleton className="h-[200px] w-full" />
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
    <div className="flex flex-col lg:flex-row gap-6">
      <Card className="w-full lg:w-3/4">
        <CardHeader>
          <CardTitle>Task Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[600px]">
            <BigCalendar<CalendarEvent>
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: "100%" }}
              onSelectEvent={handleSelectEvent}
              components={{
                event: EventComponent,
              }}
              tooltipAccessor={(event: CalendarEvent) => event.title}
              popup
              views={["month", "week", "day"]}
              className="rounded-md border shadow-sm"
            />
          </div>
        </CardContent>
      </Card>
      <Card className="w-full lg:w-1/4">
        <CardHeader>
          <CardTitle>Selected Task</CardTitle>
        </CardHeader>
        <CardContent>
          {selectedEvent ? (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{selectedEvent.title}</h3>
              <p className="text-sm text-muted-foreground">
                {selectedEvent.description}
              </p>
              <div className="text-sm space-y-2">
                <p className="flex items-center gap-2">
                  <span className="font-medium">Due:</span>
                  <span>
                    {moment(selectedEvent.scheduled_on).format(
                      "MMMM D, YYYY h:mm A"
                    )}
                  </span>
                </p>
                <Badge
                  variant={selectedEvent.is_completed ? "secondary" : "default"}
                  className={cn(
                    "mt-2",
                    selectedEvent.is_completed
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  )}
                >
                  {selectedEvent.is_completed ? "Completed" : "Pending"}
                </Badge>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">
              Select a task to view details
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
