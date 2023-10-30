  import User from "../models/User.js";

  /* READ */
  export const getUser = async (req, res) => {
    try {
      const { id } = req.params; // grab id from request parameters
      const user = await User.findById(id); // grab info using id 
      res.status(200).json(user);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  };

  export const getUserFriends = async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findById(id);

      const friends = await Promise.all(  // we will make multiple API calls at once
        user.friends.map((id) => User.findById(id))
      );
      const formattedFriends = friends.map(
        ({ _id, firstName, lastName, occupation, location, picturePath }) => {
          return { _id, firstName, lastName, occupation, location, picturePath };
        }
      );
      res.status(200).json(formattedFriends);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  };

  /* UPDATE */
  export const addRemoveFriend = async (req, res) => {
    try {
      const { id, friendId } = req.params;
      
      if (id === friendId) {
        return;
      }
    
      const user = await User.findById(id);
      const friend = await User.findById(friendId);
    
      if (!user || !friend) {
        res.status(404).json({ message: "User or friend not found." });
        return;
      }
    
      if (user.friends.includes(friendId)) {
        user.friends = user.friends.filter((friend) => friend.toString() !== friendId);
      } else {
        user.friends.push(friendId);
      }
    
      await Promise.all([user.save(), friend.save()]);
    
      const friends = await User.find({ _id: { $in: user.friends } });
    
      const formattedFriends = friends.map(({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      });
    
      res.status(200).json(formattedFriends);
    } catch (err) {
      res.status(500).json({ message: "An error occurred." });
    }
    
  };