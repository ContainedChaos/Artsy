const mongoose = require("mongoose");

const ArtworkSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
  },
//   project_image: {
//     type: String,
//     default:'',
//   },
  images: {
    type: [String],
    default:[],
  },
  videos: {
    type: [String],
    default:[],
  },
//   audios: {
//     type: [String],
//     default: [],
//   }
});

const Artwork = mongoose.model("Artwork", ArtworkSchema);
module.exports = Artwork;