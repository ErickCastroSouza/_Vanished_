import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import SearchPage from "@/pages/search-page";
import RegisterMissingPage from "@/pages/register-missing-page";
import MissingDetailPage from "@/pages/missing-detail-page";
import AboutPage from "@/pages/about-page";
import { ProtectedRoute } from "./lib/protected-route";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/search" component={SearchPage} />
      <Route path="/about" component={AboutPage} />
      <ProtectedRoute path="/register-missing" component={RegisterMissingPage} />
      <Route path="/missing/:id">
        {(params) => <MissingDetailPage id={parseInt(params.id)} />}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Router />
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}

export default App;
