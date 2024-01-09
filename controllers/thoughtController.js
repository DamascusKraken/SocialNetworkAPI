const { Thought, User } = require("./models");

module.exports = {
  /*Get all thoughts
    /api/thoughts */
  async getThoughts(req, res) {
    try {
      const thoughts = await Thought.find({});
      res.json(thoughts);
    } catch (err) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  /*GET to get one thought by _id
  /api/thoughts/:thoughtId */
  async getSingleThought(req, res) {
    try {
      const thought = await Thought.findOne({ thoughtId: req.params.thougtId });

      if (!thought) {
        return res.status(404).json({ error: "Thought not found" });
      }

      res.json(thought);
    } catch (err) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  /*Post to create a new thought 
  /api/thoughts */
  async createThought(req, res) {
    try {
      const { thoughtText, username, userId } = req.body;

      //check if user exists
      const user = await User.findOne(userId);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const newThought = await Thought.create({ thoughtText, username });

      //Push the newthougt's id to the user's thoughts array
      user.thought.push(newThought._id);
      await user.save();

      res.status(201).json(newThought);
    } catch (err) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  /*Put to update a thought by _id
  /api/thoughts/:thoughtId */
  async updateThought(req, res) {
    try {
        const thoughtId = req.params.thoughtId;
        const { thoughtText } = req.body;

        const updatedThought = await Thought.findOneAndUpdate(thoughtId, { thoughtText }, { new: true });

        
        if(!updatedThought) {
            return res.status(404).json({ error: "Thought not found" });
        }

        res.json(updatedThought);
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
  },

  /*Delete to remove a though by _id
  /api/thoughts/:thoughtId */
  async deleteThought(req, res) {
    try { 
        const thoughtId = req.params.thoughtId;

        const deletedThought = await Thought.deleteOne(thoughtId);

        if(!deletedThought) {
            return res.status(404).json({ error: "Thought not found" });
        }

        //remove the thoughtId from user's thoughts array
        const user = await User.findOne(deletedThought.userId);
        user.thought.pull(thoughtId);
        await user.save();
        
        res.json({ message: "Thought deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
  },

};
