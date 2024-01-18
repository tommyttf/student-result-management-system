import {
  AppBar,
  Box,
  Drawer,
  Grid,
  IconButton,
  List,
  ListItem,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Link from "next/link";

import { useState } from "react";
import { MenuBook } from "@mui/icons-material";

export const TopBar = () => {
  const [open, setOpen] = useState(false);

  const toggleSlider = () => {
    setOpen(!open);
  };
  return (
    <AppBar position="static">
      <Toolbar>
        <Grid
          container
          alignItems="center"
          justifyContent="space-between"
          columns={{ md: 12 }}
        >
          <Grid item xs={6}>
            <Typography>
              <IconButton onClick={toggleSlider}>
                <MenuIcon />
              </IconButton>

              <MenuBook
                style={{ verticalAlign: "middle", marginRight: "0.2em" }}
              />
              <Link href="/" style={{ color: "#000" }}>
                Student Result Management System
              </Link>
            </Typography>
          </Grid>
        </Grid>

        <Drawer open={open} anchor="left" onClose={toggleSlider}>
          <Box component="div">
            <List>
              <ListItem>
                <Link href="/" style={{ color: "#000" }}>
                  Home
                </Link>
              </ListItem>
              {[
                { title: "Add New Students" },
                { title: "Students List" },
                { title: "Add New Courses" },
                { title: "Courses List" },
                { title: "Add New Results" },
                { title: "Results List" },
              ].map(({ title }) => (
                <ListItem key={title}>
                  <Link
                    href={"/" + title.toLowerCase().replaceAll(" ", "-")}
                    style={{ color: "#000" }}
                  >
                    {title}
                  </Link>
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
};
