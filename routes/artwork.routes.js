const express = require("express");
const {uploadArtImage, uploadAudioFile, uploadVideoFile, uploadFile} = require("../middlewares/media.middleware")
const router = express.Router();
const {
    postArt, getArtbyID, getArtDetails, getLatestArtworks, deleteArt, updateArt, searchArtByCategory
    } = require("../controllers/artwork.controllers");

router.post("/post-artwork", uploadFile.array('files', 8), postArt);
router.get("/get-artworks", getArtbyID);
router.get("/get-artwork-details/:id", getArtDetails);
router.get("/get-latest-artworks", getLatestArtworks);
router.delete("/delete-artwork/:id", deleteArt);
router.patch("/update-artwork/:id", uploadFile.array('files', 8), updateArt);
router.get('/search', searchArtByCategory);

module.exports = router;