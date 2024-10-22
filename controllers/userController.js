const { User, Thought } = require('../models');

const userController = {
  // Get all users
  getUsers(req, res) {
    User.find({})
      .select('-__v')  // Exclude version field
      .then((users) => res.json(users))
      .catch((err) => res.status(500).json(err));
  },

  // Get a single user by its ID
  getUserById(req, res) {
    User.findOne({ _id: req.params.userId })
      .populate('thoughts')  // Populate user's thoughts
      .populate('friends')   // Populate user's friends
      .select('-__v')
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user found with this ID' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },

  // Create a new user
  createUser(req, res) {
    User.create(req.body)
      .then((user) => res.json(user))
      .catch((err) => res.status(500).json(err));
  },

  // Update an existing user by ID
  updateUser(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      req.body,
      { new: true, runValidators: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user found with this ID' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },

  // Delete a user and their associated thoughts
  deleteUser(req, res) {
    User.findOneAndDelete({ _id: req.params.userId })
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user found with this ID' })
          : Thought.deleteMany({ _id: { $in: user.thoughts } })
      )
      .then(() => res.json({ message: 'User and associated thoughts deleted!' }))
      .catch((err) => res.status(500).json(err));
  },

  // Add a friend to a user's friend list
  addFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.params.friendId } },  // Prevent duplicate friends
      { new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user found with this ID' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },

  // Remove a friend from a user's friend list
  removeFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } },
      { new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user found with this ID' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
};

module.exports = userController;
