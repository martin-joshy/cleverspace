import AuthContainer from "@/components/authentication/AuthContainer";
import { Login } from "@/components/authentication/Login";
import ProtectedRoute from "@/routes/ProtectedRoute";
export default function LoginPage() {
  return (
    <ProtectedRoute authPage>
      <AuthContainer>
        <Login />
      </AuthContainer>
    </ProtectedRoute>
  );
}
