"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { createQueryClient } from "@/utils/query-client";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export const ReactQueryClient = ({ children }: { children: React.ReactNode }) => {
  const queryClient = createQueryClient();
  const isServer = process.env.NODE_ENV === "production";

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {!isServer && <ReactQueryDevtools />}
    </QueryClientProvider>
  );
};