import express from 'express';
import postsController from '../controllers/postsController';
import commentsController from '../controllers/commentsController';
import middleware from './middleware';

const router = express.Router();

// Posts endpoints //

router.get('/', middleware.verifyToken, postsController.index);
router.get('/:postId', middleware.verifyToken, postsController.show);
router.post('/', middleware.verifyToken, middleware.restrictAccess, postsController.create);
router.put('/:postId', middleware.verifyToken, middleware.restrictAccess, postsController.update);
router.delete('/:postId', middleware.verifyToken, middleware.restrictAccess, postsController.destroy);

// Comments endpoints //

router.get('/:postId/comments', middleware.verifyToken, commentsController.index);
router.get('/:postId/comments/:commentId', middleware.verifyToken, commentsController.show);
router.post('/:postId/comments', middleware.verifyToken, commentsController.create);
router.put('/:postId/comments/:commentId', middleware.verifyToken, middleware.restrictAccess, commentsController.update);
router.delete('/:postId/comments/:commentId', middleware.verifyToken, middleware.restrictAccess, commentsController.destroy);

export default router;