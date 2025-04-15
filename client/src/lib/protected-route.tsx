import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";

// Temporary solution until auth is fixed
export function ProtectedRoute({
  path,
  component: Component,
}: {
  path: string;
  component: () => React.JSX.Element;
}) {
  // Temporarily allow all routes without auth check
  const isLoading = false;
  const user = { id: 1, username: "temporaryUser" }; // Mock user to allow access

  if (isLoading) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-border" />
        </div>
      </Route>
    );
  }

  if (!user) {
    return (
      <Route path={path}>
        <Redirect to="/auth" />
      </Route>
    );
  }

  return <Route path={path} component={Component} />;
}
