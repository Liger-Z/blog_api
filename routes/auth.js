import express from 'express';
import middleware from './middleware';

const router = express.Router();

router.get('/', middleware.verifyToken, (req, res) => {
  req.authorized
    ? res.json({
        logged: true,
        user: {
          username: req.user.username,
          email: req.user.email,
          isAdmin: req.user.isAdmin,
          isModerator: req.user.isModerator,
          id: req.user._id,
          createdAt: req.user.createdAt
        },
      })
    : res.json({
      logged: false,
      user: null
    });
});

export default router;
