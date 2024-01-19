import {createSlice} from '@reduxjs/toolkit'

const messageSlice = createSlice({
  name: 'message',
  initialState: {
    isShow: false,
    message: ""
  },
  reducers: {
    showMessage: (state, action) => ({
      isShow: true,
      message: action.payload.message
    }),
    hideMessage: () => ({
      isShow: false,
      message: ''
    })
  },
});
export const {showMessage, hideMessage} = messageSlice.actions;
export default messageSlice.reducer;