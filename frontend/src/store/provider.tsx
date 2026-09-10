"use client";

import { useMemo } from "react";
import { Provider } from "react-redux";
import { makeStore } from "./index";
import { AuthBootstrap } from "@/features/auth/components/auth-bootstrap";

export default function Providers({ children }: { children: React.ReactNode }) {
  const store = useMemo(() => makeStore(), []);
  return (
    <Provider store={store}>
      <AuthBootstrap />
      {children}
    </Provider>
  );
}
