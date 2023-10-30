import Post from "../models/Post.js";
import User from "../models/User.js";
import Event from "../models/Event.js";
/* CREATE */
export const createEvent = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body;
    const user = await User.findById(userId);
    const newEvent = new Event({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      comments: [],
    });
    await newEvent.save();

    const event = await Event.find();
    res.status(201).json(event);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

/* READ */
export const getFeedEvents = async (req, res) => {
  try {
    const event = await Event.find();
    res.status(200).json(event);
    // console.log(event);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserEvents = async (req, res) => {
  try {
    const { userId } = req.params;
    const event = await Event.find();
    res.status(200).json(event);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const rsvpEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const event = await Event.findById(id);
    const isLiked = event.likes.get(userId);

    if (isLiked) {
      event.likes.delete(userId);
    } else {
      event.likes.set(userId, true);
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      { likes: event.likes },
      { new: true }
    );

    res.status(200).json(updatedEvent);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const commentEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId , firstName, lastName, text } = req.body;
    const event = await Event.findById(id);

    // Create a new comment object
    const newComment = {
      userId,
      firstName, lastName,
      text,
    };
    // console.log(userId, text);
    // Add the new comment to the post's comments array
    event.comments.push(newComment);

    // Save the updated post
    const updatedEvent = await event.save();

    res.status(200).json(updatedEvent);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};