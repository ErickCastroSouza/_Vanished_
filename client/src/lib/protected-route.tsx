import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";
import { useAuth } from "@/hooks/use-auth";

export function ProtectedRoute({
  path,
  component: Component,
}: {
  path: string;
  component: () => React.JSX.Element;
}) {
  const { user, isLoading } = useAuth();
  
  console.log("Protected route check:", { path, isLoading, userExists: !!user, userData: user ? { id: user.id, username: user.username } : null });

  return (
    <Route path={path}>
      {() => {
        if (isLoading) {
          return (
            <div className="flex items-center justify-center min-h-screen">
              <Loader2 className="h-8 w-8 animate-spin text-border" />
            </div>
          );
        }

        if (!user) {
          console.log("User not authenticated, redirecting to /auth");
          return <Redirect to="/auth" />;
        }

        console.log("User authenticated, rendering protected component");
        return <Component />;
      }}
    </Route>
  );
}
