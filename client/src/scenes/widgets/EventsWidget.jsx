import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts, setEvents } from "state";
import EventWidget from "./EventWidget";
import moment from "moment";

const EventsWidget = ({ userId, isProfile = false }) => {
  const dispatch = useDispatch();
  const events = useSelector((state) => state.events);
  const token = useSelector((state) => state.token);

  const getEvents = async () => {
    const response = await fetch("http://localhost:3001/events", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    console.log(data);
    // sort data by date
    data.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return dateB - dateA;
    });
    dispatch(setEvents({ events: data }));
  };

  const getUserEvents = async () => {
    const response = await fetch(
      `http://localhost:3001/events/${userId}/events`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    dispatch(setEvents({ events: data }));
  };

  useEffect(() => {
    if (isProfile) {
      getUserEvents();
    } else {
      getEvents();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {events.map(
        ({
          _id,
          userId,
          firstName,
          lastName,
          description,
          location,
          picturePath,
          userPicturePath,
          likes,
          comments,
          createdAt,
        }) => (
          <EventWidget
            key={_id}
            eventId={_id}
            eventUserId={userId}
            name={`${firstName} ${lastName}`}
            description={description}
            location={location}
            picturePath={picturePath}
            userPicturePath={userPicturePath}
            likes={likes}
            comments={comments}
            createdAt={createdAt}
          />
        )
      )}
    </>
  );
};

export default EventsWidget;
