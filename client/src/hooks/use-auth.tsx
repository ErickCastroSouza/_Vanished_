import { createContext, ReactNode, useContext } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import { insertUserSchema, User as SelectUser, InsertUser } from "@shared/schema";
import { getQueryFn, queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";



type AuthContextType = {
  user: SelectUser | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<SelectUser, Error, LoginData>;
  logoutMutation: UseMutationResult<void, Error, void>;
  registerMutation: UseMutationResult<SelectUser, Error, InsertUser>;
};

type LoginData = Pick<InsertUser, "username" | "password">;

export const AuthContext = createContext<AuthContextType | null>(null);

async function apiRequest<T>(method: string, path: string, data?: any): Promise<T> {
  const res = await fetch(path, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include", // necessário para cookies de sessão
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }

  return await res.json();
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();

  // Query para buscar o usuário atual
  const {
    data: user,
    error,
    isLoading,
  } = useQuery<SelectUser | null, Error>({
    queryKey: ["/api/user"],
    queryFn: async () => {
      console.log("🔐 Buscando usuário logado...");
      const res = await fetch("/api/user", {
        credentials: "include",
      });

      if (res.status === 401) {
        console.log("🔓 Usuário não autenticado (401)");
        return null;
      }

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || res.statusText);
      }

      const user = await res.json();
      console.log("✅ Usuário logado:", { ...user, password: "[REDACTED]" });
      return user;
    },
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  const [, navigate] = useLocation();


  // Login
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData) =>
      await apiRequest<SelectUser>("POST", "/api/login", credentials),
    onSuccess: (user) => {
  queryClient.setQueryData(["/api/user"], user);
  toast({
    title: "Login realizado",
    description: `Bem-vindo(a), ${user.name || user.username}!`,
  });
  navigate("/"); // ou vá para dashboard, perfil, etc.
  window.location.reload();
},
    onError: (error) => {
      toast({
        title: "Erro no login",
        description: error.message || "Usuário ou senha inválidos",
        variant: "destructive",
      });
    },
  });

  // Registro
  const registerMutation = useMutation({
    mutationFn: async (newUser: InsertUser) =>
      await apiRequest<SelectUser>("POST", "/api/register", newUser),
    onSuccess: (user) => {
  queryClient.setQueryData(["/api/user"], user);
  toast({
    title: "Conta criada",
    description: `Bem-vindo(a) ao Vanished, ${user.name || user.username}!`,
  });
  navigate("/"); // Redireciona após registro
  window.location.reload();
},
    onError: (error) => {
      toast({
        title: "Erro ao registrar",
        description: error.message || "Não foi possível criar sua conta",
        variant: "destructive",
      });
    },
  });

  // Logout
const logoutMutation = useMutation({
  mutationFn: async () => {
    const res = await fetch("/api/logout", {
      method: "POST",
      credentials: "include",
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || res.statusText);
    }

    // Não tenta interpretar JSON na resposta do logout
    return; 
  },
  onSuccess: () => {
  queryClient.setQueryData(["/api/user"], null);
  toast({
    title: "Logout realizado",
    description: "Você saiu da sua conta",
  });
  navigate("/"); // Redireciona para home (ou login, se preferir)
  window.location.reload();
},
  onError: (error: Error) => {
    toast({
      title: "Erro ao sair",
      description: error.message,
      variant: "destructive",
    });
  },
});

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        error,
        loginMutation,
        logoutMutation,
        registerMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}