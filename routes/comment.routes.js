const express = require("express");
const router = express.Router();
const {
    addcomment, addComment, getCommentsByArtwork, updateComment, deleteComment,
    } = require("../controllers/comment.controllers");

router.post('/comment', addComment);
router.get('/getcomments/:id', getCommentsByArtwork)
router.patch('/updatecomment/:id', updateComment);
router.delete('/deletecomment/:id', deleteComment);

module.exports = router;