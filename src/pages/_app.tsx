import type { AppType } from "next/app";
import { Provider } from "react-redux";

import { Box, CssBaseline } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { enCA } from "date-fns/locale/en-CA";

import { trpc } from "@/utils/trpc";
import { TopBar } from "@/components/topBar";
import { wrapper } from "@/store";
import MessageBar from "@/components/messageBar";

const MyApp: AppType = ({ Component, ...rest }) => {
  const { store, props } = wrapper.useWrappedStore(rest);
  return (
    <Provider store={store}>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enCA}>
        <CssBaseline />
        <Box component="nav">
          <TopBar />
          <Component {...props.pageProps} />
          <MessageBar />
        </Box>
      </LocalizationProvider>
    </Provider>
  );
};
export default trpc.withTRPC(MyApp);
