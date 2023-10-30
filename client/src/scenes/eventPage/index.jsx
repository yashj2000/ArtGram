import { Box, Button, useMediaQuery, IconButton, Typography} from "@mui/material";
import { useSelector } from "react-redux";
import Navbar from "scenes/navbar";
import UserWidget from "scenes/widgets/UserWidget";
import MyEventWidget from "scenes/widgets/MyEventWidget";
import EventsWidget from "scenes/widgets/EventsWidget";
import AdvertWidget from "scenes/widgets/AdvertWidget";
import FriendListWidget from "scenes/widgets/FriendListWidget";
import { useNavigate } from "react-router-dom";

import {
  ManageAccountsOutlined,
  EditOutlined,
  LocationOnOutlined,
  WorkOutlineOutlined,
  Search,
  DarkMode,
  LightMode,
  Menu,
  Close,
  Home,
  NotificationsActiveOutlined,
  Message,
  Face
} from "@mui/icons-material";

const EventPage = () => {
  const navigate = useNavigate();
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const { _id, picturePath } = useSelector((state) => state.user);

  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "inline"}
        gap="0.5rem"
        justifyContent="space-between"
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <UserWidget userId={_id} picturePath={picturePath} />
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          <MyEventWidget picturePath={picturePath} />
          <Box alignItems="center" margin="auto">
          <IconButton onClick={() => navigate(`/home`)}>
              {/* <Home />  */}
              <Typography padding="8px" fontSize="16px">Posts</Typography>
            </IconButton>
            <IconButton onClick={() => navigate(`/eventHome`)}>
              {/* <Search />  */}
              <Typography padding="8px"  fontSize="16px">Events</Typography>
            </IconButton>
          </Box>
    
          <EventsWidget userId={_id} />
        </Box>
        {isNonMobileScreens && (
          <Box flexBasis="26%">
            {/* <AdvertWidget /> */}
            <Box m="2rem 0" />
            {/* <FriendListWidget userId={_id} /> */}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default EventPage;
