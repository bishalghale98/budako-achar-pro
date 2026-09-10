import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User, AuthStatus } from "./auth-types";

export interface AuthState {
  user: User | null;
  status: AuthStatus;
}

const initialState: AuthState = {
  user: null,
  status: "idle",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<{ user: User }>) {
      state.user = action.payload.user;
      state.status = "authenticated";
    },
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    setStatus(state, action: PayloadAction<AuthStatus>) {
      state.status = action.payload;
    },
    logout(state) {
      state.user = null;
      state.status = "unauthenticated";
    },
  },
});

export const { setCredentials, setUser, setStatus, logout } = authSlice.actions;
export default authSlice.reducer;
