import { isServer, QueryClient } from "@tanstack/react-query";

export const makeQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
        retry: false,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
      },
    },
  });
};

let queryClient: QueryClient | undefined = undefined;

export const createQueryClient = () => {
  if (isServer) {
    return makeQueryClient();
  } else {
    if (!queryClient) {
      queryClient = makeQueryClient();
    }
    return queryClient;
  }
};
