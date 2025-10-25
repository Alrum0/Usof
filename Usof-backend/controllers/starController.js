const ApiError = require('../error/ApiError');
const User = require('../models/user');
const Post = require('../models/postModel');
const PostStars = require('../models/postStarsModel');
const db = require('../db');

class StarController {
  async giveStars(req, res, next) {
    try {
      const { post_id } = req.params;
      const { stars } = req.body;
      const userId = req.user.id;

      if (!stars || stars <= 0) {
        return next(ApiError.badRequest('Stars must be more than 0'));
      }

      const post = await Post.findById(post_id);
      if (!post) {
        return next(ApiError.badRequest('Post not found'));
      }

      await User.updateStarsBalance(userId, -stars);
      await PostStars.create({ postId: post_id, userId, stars });
      await User.updateStarsBalance(post.authorId, stars);

      return res.json({ message: 'Зірки успішно надано' });
    } catch (err) {
      console.error(err);
      return next(ApiError.internal('У вас недостатньо зірок'));
    }
  }
  async getStarStatus(req, res, next) {
    try {
      const { post_id } = req.params;
      const userId = req.user?.id;

      if (!userId) return res.json({ hasStarred: false });

      const starRecord = await PostStars.findOne({ userId, postId: post_id });
      const hasStarred = !!starRecord;
      return res.json({ hasStarred });
    } catch (err) {
      console.error('getStarStatus error:', err);
      return next(ApiError.internal('Error fetching star status'));
    }
  }
}

module.exports = new StarController();
