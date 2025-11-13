import { Navigate } from "react-router-dom";

function Protected({ children }: { children: React.ReactNode }) {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export default Protected;