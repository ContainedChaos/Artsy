const express = require("express");
const passport = require('passport')
const router = express.Router();

const {
    updateProfile,
    getProfileInfos,
    getArtistProfile,
    } = require("../controllers/profile.controllers");

router.get("/profiles", getProfileInfos);
router.patch("/update-profile",  updateProfile);
router.get("/get-artist-profile/:id", getArtistProfile);

module.exports = router;