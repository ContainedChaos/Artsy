const express = require("express");
const router = express.Router();
const {
    likeArt,
    unlikeArt,
    getTotalLikes
    } = require("../controllers/like.controllers");

router.post('/like', likeArt);
router.delete('/unlike/:id', unlikeArt);
router.get('/getlikes/:id', getTotalLikes);

module.exports = router;