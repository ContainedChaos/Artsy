const Like = require('../dataModels/Like.model');

const likeArt = async (req, res) => {

    const userId = req.user.id;
    const artworkId = req.body.artworkId;

    try {
        const existingLike = await Like.findOne({ userId, artworkId });

        if (existingLike) {
            res.json({ message: 'You already liked this artwork' });
        } 
        else {
            const newLike = new Like({ userId, artworkId });
            await newLike.save();
            res.json({ message: 'Artwork liked successfully' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


const unlikeArt = async (req, res) => {
    const userId = req.user.id;
    const artworkId = req.params.id;

    try {
        // Check if the user has already liked the artwork
        const existingLike = await Like.findOne({ userId: userId, artworkId: artworkId });
        console.log(existingLike)

        if (existingLike) {
            // User has already liked the artwork, consider this as an unlike action
            await Like.findOneAndRemove({ userId: userId, artworkId: artworkId });
            res.json({ message: 'Artwork unliked successfully' });
        } else {
            res.json({ message: 'You did not like this artwork' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


const getTotalLikes = async (req, res) => {

    const id = req.params.id;

    try {
        const totalLikes = await Like.countDocuments({ artworkId: id });
        res.json({ totalLikes: totalLikes });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


module.exports = {
    likeArt,
    unlikeArt,
    getTotalLikes,
};
