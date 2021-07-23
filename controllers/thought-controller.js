const { User, Thought } = require("../models");

const thoughtController = {
  //get all thoughts
  getAllThoughts(req, res) {
    User.find({})
      .populate({
        path: "reactions",
        select: "-__v",
      })
      .select("-__v")
      .sort({ _id: -1 })
      .then(dbThoughtData => res.json(dbThoughtData))
      .catch(err => {
        console.log(err);
        res.sendStatus(400);
      });
  },
  //get a single thought by id
  getThoughtById({ params }, res) {
    Thought.findOne({ _id: params.id })
      .populate({
        path: "user",
        select: "-__v",
      })
      .select("-__v")
      .then(dbThoughtData => res.json(dbThoughtData))
      .catch(err => {
        console.log(err);
        res.sendStatus(400);
      });
  },
  //create a new thought
  addThought({ params, body }, res) {
    console.log(body);
    Thought.create(body)
      .then(({ _id }) => {
        return User.findOneAndUpdate(
          { _id: params.userId },
          { $push: { thoughts: _id } },
          { new: true }
        );
      })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: "No user found with this id!" });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.json(err));
  },
  //add reaction to thought
  addReaction({ params, body }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $push: { reactions: body } },
      { new: true, runValidators: true }
    )
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          res.status(404).json({ message: "No thought found with this id!" });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch(err => res.json(err));
  },
  //update thought by id
  updateThought({ params, body }, res) {
    Thought.findByIdAndUpdate({ _id: params.id }, body, { new: true })
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          res.status(404).json({
            message: "no user found with this id!",
          });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },
  //remove thought
  deleteThought({ params }, res) {
    Thought.findOneAndDelete({ _id: params.thoughtId })
      .then(deletedThought => {
        if (!deletedThought) {
          return res.status(404).json({ message: "No thought with this id!" });
        }
        return User.findOneAndUpdate(
          { _id: params.userId },
          { $pull: { thoughts: params.thoughtId } },
          { new: true }
        );
      })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: "no user found with this id!" });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.json(err));
  },
  //remove reaction
  deleteReaction({ params }, res) {
    Thought.findOneAndUpdate(
      { _id: params.ThoughtId },
      { $pull: { reactions: { _id: params.reactionId } } },
      { new: true }
    )
      .then(dbThoughtData => res.json(dbThoughtData))
      .catch(err => res.json(err));
  },
};

module.exports = thoughtController;
