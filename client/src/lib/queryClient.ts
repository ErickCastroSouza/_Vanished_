import { QueryClient, QueryFunction } from "@tanstack/react-query";

// Lança erro com mensagem mais legível
async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

// Requisição genérica com suporte a cookies (sessions)
export async function apiRequest(
  method: string,
  url: string,
  data?: unknown
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include", // importante para sessões via cookie
  });

  await throwIfResNotOk(res);
  return res;
}

// Função de busca genérica, compatível com tanstack/react-query
type UnauthorizedBehavior = "returnNull" | "throw";

export const getQueryFn =
  <T>({ on401 }: { on401: UnauthorizedBehavior }): QueryFunction<T> =>
  async ({ queryKey }) => {
    const url = queryKey[0] as string;

    const res = await fetch(url, {
      credentials: "include", // mantém cookies
    });

    if (on401 === "returnNull" && res.status === 401) {
      return null as T;
    }

    await throwIfResNotOk(res);
    return (await res.json()) as T;
  };

// Instância global do queryClient
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "returnNull" }),
      staleTime: 5 * 60 * 1000, // 5 minutos
      refetchOnWindowFocus: true,
      refetchInterval: false,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});