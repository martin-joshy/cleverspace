import { useNavigate } from "react-router-dom";

export default function AuthContainer({
  children,
}: {
  children?: React.ReactNode;
}) {
  const nagivate = useNavigate();
  const currentPage = window.location.pathname.split("/")[1];
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-800">My App</h1>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => nagivate("/login")}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  currentPage === "login"
                    ? "bg-gray-900 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => nagivate("/register")}
                className={`ml-4 px-3 py-2 rounded-md text-sm font-medium ${
                  currentPage === "register"
                    ? "bg-gray-900 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main>{children}</main>
    </div>
  );
}
