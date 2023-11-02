import {
  ChatBubbleOutlineOutlined,
} from "@mui/icons-material";
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import AddCommentIcon from '@mui/icons-material/AddComment';
import { Box, Divider, IconButton, Input, Typography, useTheme } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
  const [comment, setComment] = useState(''); // State to store the comment text
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const loggedInUserName = useSelector((state) => state.user.firstName + " " + state.user.lastName);
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

  const eventComment = async () => {
    // Send a request to event the comment
    const response = await fetch(`http://localhost:3001/events/${eventId}/comment`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: loggedInUserName, text: comment }),
    });
    const updatedEvent = await response.json();
    dispatch(setEvent({ event: updatedEvent }));

    // Clear the comment input field
    setComment('');
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
        <IconButton onClick={() => window.open("https://www.google.com/maps?s=web&rlz=1C1CHBF_enIN958IN958&daddr=VRG5%2BFHW,+Jawahar+Kala+Kendra,+JAWAHAR+KALA+KENDRA,+Gandhi+Nagar,+Jaipur,+Rajasthan+302015", "_blank")}>
          <LocationOnIcon />
        </IconButton>
      </FlexBetween>
      {isComments && (
        <Box mt="0.5rem">
          {comments.map((comment, i) => (
            <Box key={`${name}-${i}`}>
              <Divider />
              <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
              {/* {fetchUser} */}
              {comment.userId} : {comment.text} {/* Display commentor's name */}
              </Typography>
            </Box>
          ))}
          <Divider />
          
          {/* Comment input field */}
          <Box sx={{ pl: "1rem" }}>
            <Input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a comment"
              fullWidth
            />
            <IconButton onClick={eventComment}><AddCommentIcon /></IconButton>
          </Box>
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default EventWidget;
