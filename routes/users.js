import express from 'express';
import usersController from '../controllers/usersController';
import loginController from '../controllers/loginController';
import middleware from './middleware';

const router = express.Router();

// User Routes //

router.get(
  '/',
  middleware.verifyToken,
  middleware.restrictAccess,
  usersController.index
);
router.get(
  '/:userId',
  middleware.verifyToken,
  middleware.restrictAccess,
  usersController.show
);
router.post('/', middleware.verifyToken, usersController.create);
router.put(
  '/:userId',
  middleware.verifyToken,
  middleware.restrictAccess,
  usersController.update
);
router.delete(
  '/:userId',
  middleware.verifyToken,
  middleware.restrictAccess,
  usersController.destroy
);

// Login Routes //

router.post('/login', loginController.post);

export default router;
