const Art = require("../dataModels/Artwork.model");
const Like = require("../dataModels/Like.model");
const Comment = require("../dataModels/Comment.model");
const path = require("path");
const bcrypt = require("bcrypt");
const passport = require("passport");

const postArt = async (req, res, next) => {
  try {

    if (!req.files) {
      return res.status(400).json({ error: 'File field is required' });
    }

    const jsonDataObj = JSON.parse(req.body.json);

    const { name, desc, tags } = jsonDataObj;
    const id = req.user.id;

    const files = req.files;
    console.log(files)
    const newImageFiles = [];
    const newVideoFiles = [];
    const newFileFiles = [];

    const errors = [];
    if (!name || !desc) {
      errors.push("All fields are required!");
      return res.status(400).json({ error: errors });
    }

    files.forEach((file) => {
      const fileExtension = file.originalname.split('.').pop().toLowerCase();
      if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
        newImageFiles.push(file.filename);
      } else if (['mp4', 'mkv'].includes(fileExtension)) {
        newVideoFiles.push(file.filename);
      } else {
        newFileFiles.push(file.filename);
      }
    });

    const newArt = new Art({
      name,
      id,
      desc,
      images: newImageFiles,
      videos: newVideoFiles,
      files: newFileFiles,
      tags: tags,
    });

    await newArt.save();

    res.json({ message: 'Artwork saved successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getArtbyID = async (req, res, next) => {

  const userId = req.user.id

   try {
    const art = await Art.find({id: userId});
    res.json(art);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
  
};

const getArtDetails = async (req, res, next) => {
  const artId = req.params.id;

  try {
    // Fetch the artwork
    const art = await Art.findOne({ _id: artId });

    if (!art) {
      return res.status(404).json({ error: 'Artwork not found' });
    }

    // Fetch the number of likes for the artwork
    const likesCount = await Like.countDocuments({ artworkId: artId });

    // Fetch all comments for the artwork
    const comments = await Comment.find({ artworkId: artId });

    // Combine the artwork details, likes count, and comments
    const artDetails = {
      _id: art._id,
      name: art.name,
      desc: art.desc,
      tags: art.tags,
      images: art.images,
      videos: art.videos,
      // Include other artwork details as needed
      likesCount: likesCount,
      comments: comments,
    };

    res.json(artDetails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getLatestArtworks = async (req, res, next) => {
  try {
    const latestArtworks = await Art.find()
      .sort({ _id: -1 })
      .limit(8);

    res.json({ latestArtworks });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteArt = async (req, res) => {
  try {
    const userId = req.user.id;

    const artworkId = req.params.id;

    const artwork = await Art.findById(artworkId);

    if (!artwork) {
      return res.status(404).json({ message: 'Artwork not found' });
    }

    if (artwork.id !== userId) {
      return res.status(403).json({ message: 'You are not authorized to delete this artwork' });
    }

    await Art.deleteOne({ _id: artworkId });

    res.json({ message: 'Artwork deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const updateArt = async (req, res) => {

   try {
    const jsonDataObj = JSON.parse(req.body.json);

    const { name, desc, tags } = jsonDataObj;
    const userId = req.user.id;
    const id = req.params.id;

    const files = req.files;
    const newImageFiles = [];
    const newVideoFiles = [];
    const newFileFiles = [];

    const art = await Art.findById(id);

    if (art.id !== userId) {
      return res.status(403).json({ message: 'You are not authorized to change this artwork' });
    }

    if (name) {
      art.name = name;
    }

    if (desc) {
      art.desc = desc;
    }

    if (tags) {
      art.tags = tags;
    }

    if (files) {
      
      files.forEach((file) => {
      const fileExtension = file.originalname.split('.').pop().toLowerCase();
      if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
        console.log("here")
        newImageFiles.push(file.filename);
        art.images = newImageFiles;
      } else if (['mp4', 'mkv'].includes(fileExtension)) {
        console.log("here2")
        newVideoFiles.push(file.filename);
        art.videos = newVideoFiles;
      } else {
        newFileFiles.push(file.filename);
      }
    });
    }

    await art.save();

    res.json({ message: 'Artwork information updated successfully' });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};


const searchArtByCategory = async (req, res) => {
  try {
    const tags = req.body.tags;

    // Use a regular expression to perform a case-insensitive search
    const regexArray = tags.map(tag => new RegExp(tag, 'i'));

    // Search for artworks with the specified category
    const artworks = await Art.find({ tags: { $in: regexArray } });

    res.json({ artworks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


module.exports = {
  postArt,
  getArtbyID,
  getArtDetails,
  getLatestArtworks,
  deleteArt,
  updateArt,
  searchArtByCategory
};