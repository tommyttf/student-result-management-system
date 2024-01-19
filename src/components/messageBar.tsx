import { Alert, Snackbar } from "@mui/material";
import React from "react";
import { useDispatch } from "react-redux";

import { hideMessage } from "@/store/message";
import { useAppSelector } from "@/store";

export default function MessageBar() {
  const { isShow, isError, message } = useAppSelector((state) => state.message);
  const dispatch = useDispatch();

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === "clickaway") {
      return;
    }

    dispatch(hideMessage());
  };

  return (
    <Snackbar open={isShow} autoHideDuration={6000} onClose={handleClose}>
      <Alert
        onClose={handleClose}
        severity={!isError ? "success" : "error"}
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
