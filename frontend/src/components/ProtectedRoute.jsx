import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { admin, loading } = useAuth();

  if (loading) {
    return (
      <div
        data-testid="auth-loading"
        className="min-h-screen grid place-items-center bg-[#FAF6EC] text-[#2D2D2D]"
      >
        <div className="text-center">
          <div className="font-display text-3xl text-[#C5A059]">Signature Style</div>
          <div className="text-[10px] tracking-[0.3em] uppercase text-[#6B6B6B] mt-2">
            Verifying session...
          </div>
        </div>
      </div>
    );
  }

  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
