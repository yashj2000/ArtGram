import React, { useEffect, useState } from 'react';

import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  ShareOutlined
} from "@mui/icons-material";
import EventIcon from '@mui/icons-material/Event'; // Add this import
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import { Box, Divider, IconButton, Typography, useTheme } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useSelector, useDispatch } from "react-redux";
import { setEvent } from "state";
import moment from "moment";

const EventWidget = ({
  eventId,
  eventUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
  comments,
  createdAt
}) => {
  const [isComments, setIsComments] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;
  const timeFromNow = moment(createdAt).fromNow();
  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  const patchLike = async () => {
    const response = await fetch(`http://localhost:3001/events/${eventId}/like`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId }),
    });
    const updatedEvent = await response.json();
    dispatch(setEvent({ event: updatedEvent }));
  };

  // Fetch user information by userId
  const fetchUserInfo = async (userId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/users/${userId}`);
      const userInfo = await response.json();
      return userInfo;
    } catch (error) {
      console.error('Error fetching user info:', error);
      return { firstName: '', lastName: '' };
    }
  };

  return (
    <WidgetWrapper m="2rem 0">
      <Friend
        friendId={eventUserId}
        name={name}
        subtitle={timeFromNow}
        userPicturePath={userPicturePath}
      />
      <Typography color={main} sx={{ mt: "1rem" }}>
        {description}
      </Typography>
      {picturePath && (
        <img
          width="100%"
          height="auto"
          alt="event"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={`http://localhost:3001/assets/${picturePath}`}
        />
      )}
      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton onClick={patchLike}>
              {isLiked ? (
                <EventAvailableIcon sx={{ color: primary }} />
              ) : (
                <EventIcon />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>

          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => setIsComments(!isComments)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{comments.length}</Typography>
          </FlexBetween>
        </FlexBetween>

        <IconButton>
          <ShareOutlined />
        </IconButton>
      </FlexBetween>
      {isComments && (
        <Box mt="0.5rem">
          {comments.map((comment, i) => (
            <Box key={`${name}-${i}`}>
              <Divider />
              <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
                {comment.userId} : {comment.text} {/* Display commentor's name */}
              </Typography>
            </Box>
          ))}
          <Divider />
        </Box>
      )}

    </WidgetWrapper>
  );
};

export default EventWidget;
