const User = require("./models/User");

const userTotal = async () => {
  const numberOfUsers = await User.aggregate().count("userCount");
  return numberOfUsers;
};

module.exports = {
  //get all Users
  async getUsers(req, res) {
    try {
      const users = await Student.find();

      const userObj = {
        users,
        userTotal: await userTotal(),
      };

      res.json(studentObj);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },

  //get  single user by its _id and populate thought and friend data
  async getSingleUser(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.userId })
        .select("-__v")
        .populate("thoughts")
        .populate("friends");

      if (!user) {
        return res.status(404).json({ message: "User does not exist" });
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // /api/users
  //create a new user
  async createUser(req, res) {
    try {
      const { username, email } = req.body;
      const user = await User.create({ username, email });
      res.status(201).json(user);
    } catch (err) {
      res.status(500).json({
        message: "Internal Server Error",
      });
    }
  },

  //Put to update a user by _id
  async updateUser(req, res) {
    try {
      const { username, email } = req.body;
      const updatedUser = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $set: { username: username, email: email } },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json(updatedUser);
    } catch (err) {
      res.stuatus(500).json({ error: "Internal Server Error" });
    }
  },

  //Delete to remove user by _id
  async deleteUser(req, res) {
    try {
      const deletedUser = await User.findOneAndDelete({
        _id: req.params.userId,
      });

      if (!deletedUser) {
        return res.status(404).json({ error: "User not Found " });
      }
      //Delete thoughts associated with user when deleted.
      await Thought.deleteMany({ username: deletedUser.username });

      res.json({ mesage: "User and thought deleted succesfully." });
    } catch (err) {
      res.status(500).json({ error: "Interal Server Error" });
    }
  },

  // /api/users/:userId/friends/:friendId
  // Post to add a friend to the user's friend list
  async addFriend(req, res) {
    try {
      const friendId = req.params.friendId;

      //validate user and friend exist
      const user = await User.findOne({ _id: req.params.userId });
      const friend = await User.findOne(friendId);

      if (!user || !friend) {
        return res.status(404).json({ error: "User or friend not found" });
      }

      //check if friend is already on user's friends list
      if (user.friends.includes(friendId)) {
        return res
          .status(400)
          .json({ error: "Friend already on user's friends list." });
      }

      //Add friend to user's friends list
      user.friends.push(friendId);
      await user.save();

      res.json(user);
    } catch (err) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  //Delete friend from user's friends list
  async deleteFriend(req, res) {
    try {
      const friendId = req.params.friendId;

      //check if user exists
      const user = await User.findOne({ _id: req.params.userId });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      //check friend exists in user's friend list
      const friendIndex = user.friends.indexOf(friendId);
      if (friendIndex === -1) {
        return res
          .status(400)
          .json({ error: "Friend no in the user's friend list" });
      }

      //remove the friend from user's friend list
      user.friends.splice(friendIndex, 1);
      await user.save();

      res.json(user);
    } catch (err) {
      res.status(500).json({ error: "Interal Server Error" });
    }
  },
};
