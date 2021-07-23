const router = require("express").Router();
const {
  getAllThoughts,
  getThoughtById,
  addThought,
  addReaction,
  updateThought,
  deleteThought,
  deleteReaction,
} = require("../../controllers/thought-controller");

// /api/thoughts
router.route("/").get(getAllThoughts).post(addThought);

// /api/thoughts/:id
router
  .route("/:id")
  .get(getThoughtById)
  .put(updateThought)
  .delete(deleteThought);

// /api/thoughts/:id/reactions
router.route("/:thoughtId/reactions").post(addReaction);

// /api/thoughts/:id/reactions/:id
router.route("/:thoughtId/reactions/:reactionId").delete(deleteReaction);
