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
        { $set: {username: username, email: email} },
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
    try{
        const deletedUser = await User.findOneAndDelete({_id: req.params.userId});

        if(!deletedUser) {
            return res.status(404).json({ error: "User not Found " });
        }
        //Delete thoughts associated with user when deleted. 
        await Thought.deleteMany({ username: deletedUser.username });

        res.json({mesage: "User and thought deleted succesfully."})
    } catch (err) {
        res.status(500).json({ error: "Interal Server Error" });
    }
  },

  

};
