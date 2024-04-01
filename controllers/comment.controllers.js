const Comment = require('../dataModels/Comment.model');

const addComment = async (req, res) => {
  const userId = req.user.id;
  const { artworkId, text } = req.body;

  try {
    const newComment = await Comment.create({
      userId: userId,
      artworkId: artworkId,
      text: text,
    });

    res.json({ message: 'Comment added successfully', newComment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


const getCommentsByArtwork = async (req, res) => {
  const artworkId = req.params.id;
  try {
    const comments = await Comment.find({ artworkId: artworkId });
    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


const updateComment = async (req, res) => {
  const commentId = req.params.id;
  const { text } = req.body;

  try {
    // Find the comment by ID
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // Update the comment content
    comment.text = text;
    await comment.save();

    res.json({ message: 'Comment updated successfully', comment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteComment = async (req, res) => {
  const commentId = req.params.id;
  const userId = req.user.id;

  try {
    // Find the comment by ID
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (comment.userId == userId) {
        await Comment.findByIdAndRemove(commentId);
        res.json({ message: 'Comment deleted successfully' });
    } else {
      res.json({message: "You are not authorized to delete this comment"})
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = {
    addComment,
    getCommentsByArtwork,
    updateComment,
    deleteComment,
};

