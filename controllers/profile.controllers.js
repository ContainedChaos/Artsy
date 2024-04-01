const User = require("../dataModels/User.model");
const Art = require("../dataModels/Artwork.model");
const path = require("path");
const bcrypt = require("bcrypt");
const passport = require("passport");
const nodemailer=require('nodemailer');
var crypto = require('crypto');

const getProfileInfos = async (req, res) => {
  try {
    const userId = req.user.id
    console.log(userId)
    const user = await User.find({_id: userId}).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, currentPassword, newPassword, bio  } = req.body;
    console.log(newPassword)
    
    const userId = req.user.id
    const user = await User.findById(userId);
    console.log(user)

    // Update the password if provided
    if (newPassword) {
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

      if (!isPasswordValid) {
        return res.status(400).json({ error: 'Current password is incorrect' });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
    }

    // Update the designation if provided
    if (bio) {
      user.bio = bio;
    }


    if (name) {
      user.name = name
    }

    await user.save();

    res.json({ message: 'User information updated successfully' });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

const getArtistProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    // Find the user excluding the password field
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find artworks by the user
    const artworks = await Art.find({ id: userId });

    // Combine user profile and artworks
    const artistProfile = {
      user: user.toObject(),
      artworks,
    };

    res.json(artistProfile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getProfileInfos,
  updateProfile,
  getArtistProfile
};
