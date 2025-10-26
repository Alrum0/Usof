const Router = require('express');
const router = new Router();
const PostController = require('../controllers/postController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', PostController.getAllPosts); // OK
router.get('/following', authMiddleware, PostController.findFollowingPosts); // OK
router.get('/:post_id/comments', PostController.getAllCommentsForPost); // OK
router.post(
  '/:post_id/comments',
  authMiddleware,
  PostController.createCommentForPost
); // OK
router.get('/:post_id/categories', PostController.getAllCategories); // OK
router.post('/:post_id/like', authMiddleware, PostController.createLike); // OK
router.get('/:post_id/like', PostController.getAllLikesForPost); // OK
router.post('/', authMiddleware, PostController.createPost); // OK

router.get(
  '/:post_id/like/status',
  authMiddleware,
  PostController.getLikeStatus
); // OK

router.delete('/:post_id/like', authMiddleware, PostController.deleteLike); // OK
router.get('/user/:user_id', PostController.getAllPostsByUser); // OK

// Repost routes
router.post('/:post_id/repost', authMiddleware, PostController.createRepost); // Create repost
router.delete('/:post_id/repost', authMiddleware, PostController.deleteRepost); // Remove repost
router.get(
  '/:post_id/repost/status',
  authMiddleware,
  PostController.getRepostStatus
); // Check repost status
router.get('/user/:user_id/reposts', PostController.getUserReposts); // Get user's reposts

router.get('/:post_id', PostController.getPost); // OK
router.patch('/:post_id', authMiddleware, PostController.updatePost); // OK
router.delete('/:post_id', authMiddleware, PostController.deletePost); // OK
module.exports = router;
