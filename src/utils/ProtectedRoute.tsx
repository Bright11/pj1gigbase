// components/ProtectedRoute.tsx
import { JSX, ReactNode } from "react";
import { Redirect, usePathname } from "expo-router";
import { useAuthStore } from "@/store/auth.store";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps): JSX.Element | null {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const pathname = usePathname();

  // Auth state is still hydrating from SecureStore; don't decide yet.
  if (isLoading) return null;

  if (!isAuthenticated) {
    return (
      <Redirect href={{ pathname: "/login", params: { redirectTo: pathname } }} />
    );
  }

  return <>{children}</>;
}