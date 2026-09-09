import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../../types";
import { storage } from "../../utils/storage";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: storage.getUser(),
  isAuthenticated: storage.getUser() !== null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      storage.setUser(action.payload);
    },

    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      storage.removeUser();
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;