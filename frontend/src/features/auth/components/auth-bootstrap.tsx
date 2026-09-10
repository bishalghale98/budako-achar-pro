"use client";

import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useMeQuery } from "@/features/auth/auth-api";
import { setCredentials, setStatus, logout } from "@/features/auth/auth-slice";

export function AuthBootstrap() {
  const dispatch = useAppDispatch();
  const { data, isLoading, isError } = useMeQuery();
  const status = useAppSelector((state) => state.auth.status);
  const didLogout = useRef(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      didLogout.current = true;
    } else if (status === "authenticated") {
      didLogout.current = false;
    }
  }, [status]);

  useEffect(() => {
    if (status === "idle") {
      dispatch(setStatus("loading"));
    }
  }, [status, dispatch]);

  useEffect(() => {
    if (data?.user && !didLogout.current) {
      dispatch(setCredentials({ user: data.user }));
    } else if (isError && !isLoading) {
      dispatch(logout());
    }
  }, [data, isLoading, isError, dispatch]);

  return null;
}
