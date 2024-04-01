const Follow = require('../dataModels/Follow.model');
const Art = require('../dataModels/Artwork.model');

// Follow a user
const followUser = async (req, res) => {
    try {
        const followerId = req.user.id;
        const followingId = req.body.followingId;

        // Check if the follow record already exists
        const existingFollow = await Follow.findOne({ follower: followerId, following: followingId });
        if (existingFollow) {
            return res.status(400).json({ error: 'You are already following this user' });
        }

        const follow = new Follow({ follower: followerId, following: followingId });
        await follow.save();

        res.json({ message: 'User followed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Unfollow a user
const unfollowUser = async (req, res) => {
    try {
        const followerId = req.user.id;
        const followingId = req.body.followingId;

        // Check if the follow record exists before trying to unfollow
        const existingFollow = await Follow.findOne({ follower: followerId, following: followingId });
        if (!existingFollow) {
            return res.status(400).json({ error: 'You are not following this user' });
        }

        await Follow.findOneAndRemove({ follower: followerId, following: followingId });

        res.json({ message: 'User unfollowed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get followers for a user
const getFollowers = async (req, res) => {
    try {
        const userId = req.user.id;
        const followers = await Follow.find({ following: userId }).populate('follower');
        res.json(followers.map(follow => follow.follower));
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get users followed by a user
const getFollowing = async (req, res) => {
    try {
        const userId = req.user.id;

        // Exclude the 'password' field from the results
        const following = await Follow.find({ follower: userId })
            .populate('following', '-password'); // Exclude the 'password' field

        res.json(following.map(follow => follow.following));
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


const getArtByFolloweredUsers = async (req, res, next) => {

  try {
        const userId = req.user.id;

        // Find users that the authenticated user follows
        const followedUsers = await Follow.find({ follower: userId }).select('following');

        // Extract user IDs from the followedUsers array
        const followedUserIds = followedUsers.map(follow => follow.following);

        // Find artworks from the followed users
        const artworks = await Art.find({ id: { $in: followedUserIds } });

        res.json(artworks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
  
};


module.exports = {
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing,
    getArtByFolloweredUsers,
};
