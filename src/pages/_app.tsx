import type { AppType } from "next/app";
import { Box, CssBaseline } from "@mui/material";
import { trpc } from "../utils/trpc";
import { TopBar } from "@/components/topBar";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <CssBaseline />
      <Box component="nav">
        <TopBar />
        <Component {...pageProps} />
      </Box>
    </>
  );
};
export default trpc.withTRPC(MyApp);
