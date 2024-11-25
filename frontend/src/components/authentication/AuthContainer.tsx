import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function AuthContainer({
  children,
}: {
  children?: React.ReactNode;
}) {
  const location = useLocation();
  const currentPage = location.pathname.split("/")[1];

  return (
    <div className="min-h-screen bg-background flex">
      <div className="flex-1 hidden lg:block relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-l from-background" />
        <img
          src="https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80"
          alt="Organized desk with notebook and coffee"
          className="w-full h-full object-cover dark:opacity-30 transition-opacity duration-300 ease-in-out"
        />
        <div className="absolute inset-0 bg-background/30 dark:bg-background/70 z-20" />
      </div>
      <div className="flex-1 flex flex-col">
        <header className=" bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 items-center justify-end p-3">
            <div className="flex items-center space-x-2 ">
              <nav className="flex items-center space-x-2 ">
                <Button
                  variant={currentPage === "login" ? "default" : "ghost"}
                  asChild
                >
                  <Link to="/login">Login</Link>
                </Button>
                <Button
                  variant={currentPage === "register" ? "default" : "ghost"}
                  asChild
                >
                  <Link to="/register">Register</Link>
                </Button>
              </nav>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto py-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container max-w-md mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
