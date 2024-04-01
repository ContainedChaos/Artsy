const mongoose = require('mongoose');

const LikeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  artworkId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artwork', // Reference to the Artwork model
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Like = mongoose.model('Like', LikeSchema);

module.exports = Like;
