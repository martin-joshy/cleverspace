import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "@/app/HomePage";
import LoginPage from "@/app/LoginPage";
import RegisterationPage from "@/app/RegisterationPage";
import Logout from "@/components/authentication/Logout";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/logout",
    element: <Logout />,
  },
  {
    path: "/register",
    element: <RegisterationPage />,
  },
  {
    path: "/home",
    element: <HomePage />,
  },
]);
function App() {
  return <RouterProvider router={router} />;
}
export default App;
