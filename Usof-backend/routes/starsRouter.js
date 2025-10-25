const Router = require('express');
const router = new Router();
const StarController = require('../controllers/starController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/:post_id/star', authMiddleware, StarController.giveStars); // OK
router.get(
  '/:post_id/star/status',
  authMiddleware,
  StarController.getStarStatus
); // OK

module.exports = router;
