const { User, Thought } = require("../models");

const userController = {
  //get all users
  getAllUsers(req, res) {
    User.find({})
      .populate({
        path: "Thought",
        select: "-__v",
      })
      .select("-__v")
      .sort({ _id: -1 })
      .then(dbUserData => res.json(dbUserData))
      .catch(err => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  //get one user by id
  getUserById({ params }, res) {
    User.findOne({ _id: params.id })
      .populate({
        path: "thoughts",
        select: "-__v",
      })
      .select("-__v")
      .then(dbUserData => res.json(dbUserData))
      .catch(err => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  //createUser
  createUser({ body }, res) {
    User.create(body)
      .then(dbUserData => res.json(dbUserData))
      .catch(err => res.json(err));
  },

  //update user by id
  updateUser({ params, body }, res) {
    User.findOneAndUpdate({ _id: params.id }, body, {
      new: true,
      runValidators: true,
    })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: "No user found with this id" });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.status(400).json(err));
  },

  //delete user
  deleteUser({ params }, res) {
    User.findOneAndDelete({ _id: params.id })
      .then(dbUserData => res.json(dbUserData))
      .catch(err => res.json(err));
    //remove associated thoughts
  },

  // add friend
  addFriend({ params }, res) {
    //add Friend to user
    User.findOneAndUpdate(
      { _id: params.userId },
      { $addToSet: { friends: params.friendId } },
      { new: true, runValidators: true }
    )
      .select("-__v")
      .then(dbFriendData => {
        if (!dbFriendData) {
          res.status(404).json({ message: "No user found with this id" });
          return;
        }
        //add user to friend
        User.findOneAndUpdate(
          { _id: params.friendId },
          { $addToSet: { friends: params.userId } },
          { new: true, runValidators: true }
        )
          .then(dbFriendData2 => {
            if (!dbFriendData2) {
              res.status(404).json({ message: "No user found with this id" });
              return;
            }
            res.json(dbFriendData);
          })
          .catch(err => {
            console.log(err);
            res.status(400).json(err);
          });
      })
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },
  //remove friend
  deleteFriend({ params }, res) {
    //remove friend from user
    User.findByIdAndUpdate(
      { _id: params.userId },
      { $pull: { friends: params.friendId } },
      { new: true, runValidators: true }
    )
      .then(dbFriendData => {
        if (!dbFriendData) {
          res.status(404).json({ message: "No user found with that id" });
          return;
        }
        // remove user from friend
        User.findByIdAndUpdate(
          { _id: params.friendId },
          { $pull: { friends: params.userId } },
          { new: true, runValidators: true }
        )
          .then(dbFriendData => {
            if (!dbFriendData) {
              res.status(404).json({ message: "No user found with that id" });
              return;
            }
            res.json({ message: "Friend removed successfully!" });
          })
          .catch(err => {
            console.log(err);
            res.status(400).json(err);
          });
      })
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },
};

module.exports = userController;
