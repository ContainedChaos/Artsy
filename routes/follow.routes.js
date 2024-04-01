const express = require("express");
const router = express.Router();
const {
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing,
    getArtByFolloweredUsers,
    } = require("../controllers/follow.controllers");

router.post('/follow', followUser);
router.post('/unfollow', unfollowUser);
router.get('/followers', getFollowers);
router.get('/following', getFollowing);
router.get('/art-by-following', getArtByFolloweredUsers);

module.exports = router;
