import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { taskApi } from "@/utils/api/userApi";
import { TaskFormData, Task } from "@/types/task";

export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async () => {
  const response = await taskApi.getAllTasks();
  return response.data;
});

export const addTask = createAsyncThunk(
  "tasks/addTask",
  async (task: TaskFormData) => {
    const response = await taskApi.createTask(task);
    return response.data;
  }
);

export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async ({ id, task }: { id: string; task: TaskFormData }) => {
    const response = await taskApi.updateTask(id, task);
    return response.data;
  }
);

export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (id: string) => {
    await taskApi.deleteTask(id);
    return id;
  }
);

export const toggleTaskCompletion = createAsyncThunk(
  "tasks/toggleCompletion",
  async (id: string) => {
    const response = await taskApi.markComplete(id);
    return { id, ...response.data };
  }
);

const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    items: [] as Task[],
    status: "idle",
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (task) => task.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.items = state.items.filter((task) => task.id !== action.payload);
      })
      .addCase(toggleTaskCompletion.fulfilled, (state, action) => {
        const task = state.items.find((task) => task.id === action.payload.id);
        if (task) {
          task.is_completed = !task.is_completed;
        }
      });
  },
});

export default taskSlice.reducer;
