const { Schema, model } = require("mongoose");
const reactionSchema = require("./Reaction");

const thoughtSchema = new Schema({
  thoughtText: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 280,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  username: {
    type: String,
    required: true,
  },
  reactions: [reactionSchema],
});

//Create a virtual property for reactionCount
thoughtSchema.virtual("reactionCount").get(function () {
  return this.reactions.length;
});

//Getter method to format timestamp
thoughtSchema.virtual("formattedCreatedAt").get(function () {
  const options = {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };
  return this.createdAt.toLocaleString("en-US", options);
});

const Thought = model("thought", thoughtSchema);

module.exports = Thought;
