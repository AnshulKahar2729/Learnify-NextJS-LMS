"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { FC } from "react";
import { ConfettiProvider } from "./providers/confetti-provider";

interface ProvidersProps {
  children: React.ReactNode;
}
const Providers: FC<ProvidersProps> = ({ children }) => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <ClerkProvider>
        <ConfettiProvider />
      </ClerkProvider>
    </QueryClientProvider>
  );
};

export default Providers;
