import AuthContainer from "@/components/authentication/AuthContainer";
import { Registration } from "@/components/authentication/Registration";
import ProtectedRoute from "@/routes/ProtectedRoute";
export default function RegisterationPage() {
  return (
    <ProtectedRoute authPage>
      <AuthContainer>
        <Registration />
      </AuthContainer>
    </ProtectedRoute>
  );
}
