import Dashboard from "@/components/calender/Dashboard";
import ProtectedRoute from "@/routes/ProtectedRoute";

export default function HomePage() {
  return (
    <ProtectedRoute>
      <main className="container mx-auto p-4">
        <Dashboard />
      </main>
    </ProtectedRoute>
  );
}
