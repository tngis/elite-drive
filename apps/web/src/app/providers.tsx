"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { AuthProvider } from "@/features/auth/auth-context";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: false },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
      <Toaster
        position="top-center"
        theme="light"
        toastOptions={{
          classNames: {
            toast: "!rounded-xl !border-0 !bg-white !shadow-lg",
            title: "!text-inherit !font-medium",
            description: "!text-muted-foreground",
            default: "!text-foreground",
            success: "!text-emerald-600",
            error: "!text-red-600",
            info: "!text-foreground",
            warning: "!text-amber-600",
            loading: "!text-foreground",
          },
        }}
      />
    </QueryClientProvider>
  );
}
