import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "@/utils/api/publicApi";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "@/utils/constants";
import { useState, useEffect } from "react";

interface Props {
  children: React.ReactNode;
  authPage?: boolean;
}

export default function ProtectedRoute({ children, authPage = false }: Props) {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    auth().catch(() => setIsAuthorized(false));
  }, []);

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    try {
      const res = await api.post("/api/user/token/refresh/", {
        refresh: refreshToken,
      });
      if (res.status === 200) {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
    } catch (error) {
      console.log(error);
      setIsAuthorized(false);
    }
  };

  const auth = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      setIsAuthorized(false);
      return;
    }
    const decoded = jwtDecode(token);
    const tokenExpiration = decoded.exp;

    if (tokenExpiration !== undefined && tokenExpiration < Date.now() / 1000) {
      await refreshToken();
    } else {
      setIsAuthorized(true);
    }
  };

  if (isAuthorized === null) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background/50">
        <p>Loading...</p>
      </div>
    );
  }

  if (authPage && isAuthorized) {
    return <Navigate to="/home" replace={true} />;
  }

  if (!authPage && !isAuthorized) {
    return <Navigate to="/login" replace={true} />;
  }

  return children;
}
