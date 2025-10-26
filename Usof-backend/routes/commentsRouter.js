const Router = require('express');
const router = new Router();
const CommentController = require('../controllers/commentController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, CommentController.getAllComments); // Get all comments (admin)
router.get('/:comment_id/replies', CommentController.getRepliesForComment); // OK
router.post(
  '/:comment_id/like',
  authMiddleware,
  CommentController.createLikeForComment
); // OK
router.delete(
  '/:comment_id/like',
  authMiddleware,
  CommentController.deleteLikeForComment
); // OK
router.get('/:comment_id/like', CommentController.getAllLikesForComment); // OK
router.patch('/:comment_id', authMiddleware, CommentController.updateComment); // OK
router.delete('/:comment_id', authMiddleware, CommentController.deleteComment); // OK
router.get('/:comment_id', CommentController.getComment); // OK

module.exports = router;
