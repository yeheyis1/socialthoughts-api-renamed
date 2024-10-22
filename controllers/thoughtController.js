const { Thought, User } = require('../models'); // Import the models

const thoughtController = {
  // Get all thoughts
  getThoughts(req, res) {
    Thought.find({})
      .then((thoughts) => {
        console.log(thoughts);  // This will log the array of thoughts fetched from the database
        res.json(thoughts);  // Then send the thoughts as a response
      })
      .catch((err) => res.status(500).json(err));
  },

  // Get a single thought by ID
  getThoughtById(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought found with this ID' })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },

  // Create a new thought and push it to the associated user's thoughts array
  createThought(req, res) {
    Thought.create(req.body)
      .then((thought) => {
        return User.findOneAndUpdate(
          { _id: req.body.userId },
          { $push: { thoughts: thought._id } },
          { new: true }
        );
      })
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'Thought created, but no user with that ID found' })
          : res.json({ message: 'Thought successfully created!' })
      )
      .catch((err) => res.status(500).json(err));
  },

  // Update a thought by its ID
  updateThought(req, res) {
    Thought.findOneAndUpdate({ _id: req.params.thoughtId }, req.body, { new: true })
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought found with this ID' })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },

  // Delete a thought by its ID
deleteThought(req, res) {
  Thought.findOneAndDelete({ _id: req.params.thoughtId })
    .then((thought) => {
      if (!thought) {
        // Return here to prevent further execution
        return res.status(404).json({ message: 'No thought found with this ID' });
      }
      // If thought is found, send the success message
      res.json({ message: 'Thought deleted!' });
    })
    .catch((err) => res.status(500).json(err));
},

  // Add a reaction to a thought
  addReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { reactions: req.body } }, // Add reaction using $addToSet to prevent duplicates
      { new: true }
    )
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought found with this ID' })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },

  // Remove a reaction by its reaction ID
  removeReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.params.reactionId } } }, // Use $pull to remove reaction by reactionId
      { new: true }
    )
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought found with this ID' })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
};

module.exports = thoughtController;
