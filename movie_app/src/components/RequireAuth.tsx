import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function RequireAuth() {
  const { user, loading } = useAuth();
  console.log("RequireAuth:", { user, loading });

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        Checking session...
      </div>
    );
  if (!user) return <Navigate to="/login" />;
  return <Outlet />;
}

export { RequireAuth };
