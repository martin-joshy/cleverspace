import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function Navbar() {
  const navigate = useNavigate();
  const handleLogout = () => {
    navigate("/logout");
  };

  return (
    <nav className="bg-primary text-primary-foreground py-4 px-6 flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Task Manager</h1>
      <Button variant="secondary" onClick={handleLogout}>
        Logout
      </Button>
    </nav>
  );
}
