import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
  name: "message",
  initialState: {
    isShow: false,
    isError: false,
    message: "",
  },
  reducers: {
    showMessage: (state, action) => ({
      isShow: true,
      isError: false,
      message: action.payload.message,
    }),
    showErrorMessage: (state, action) => ({
      isShow: true,
      isError: true,
      message: action.payload.message,
    }),
    hideMessage: () => ({
      isShow: false,
      isError: false,
      message: "",
    }),
  },
});
export const { showMessage, showErrorMessage, hideMessage } =
  messageSlice.actions;
export default messageSlice.reducer;
