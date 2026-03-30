import { createSlice } from "@reduxjs/toolkit";

const defaultValue = {
  access_token: null,
  user: null,
};

const userSlice = createSlice({
  name: "userSlice",
  initialState: defaultValue,
  reducers: {
    setToken: (state, action) => {
      return {
        ...state,
        access_token: action.payload,
      };
    },
    setUser: (state, action) => {
      return {
        ...state,
        user: action.payload,
      };
    },
    setUpdateUser: (state, action) => {
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload,
        },
      };
    },
  },
});

export const { setToken, setUser, setUpdateUser } = userSlice.actions;

export default userSlice.reducer;
