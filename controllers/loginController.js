import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import User from '../models/user';

const post = [
  body('username', 'Please enter your username!')
    .trim()
    .escape()
    .isLength({ min: 1 }),
  body('password', 'Please enter your password!')
    .trim()
    .escape()
    .isLength({ min: 1 }),

  // Check if user is in the database, and then check their password using bcrypt
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      let errorsObj = {
        username: '',
        password: '',
      };

      errors.array().forEach((error) => {
        errorsObj = { ...errorsObj, [error.param]: error.msg };
      });

      return res.status(400).json(errorsObj);
    } else {
      User.findOne({ username: req.body.username }).exec((err, user) => {
        if (err) return next(err);

        if (!user) {
          return res.status(400).json({ username: 'User not found!', password: '' });
        }

        bcrypt.compare(req.body.password, user.password, (err, result) => {
          if (err) return next(err);

          if (result) {
            req.user = user;
            next();
          } else {
            return res.status(400).json({ password: 'Incorrect password!', username: '' });
          }
        });
      });
    }
  },

  (req, res, next) => {
    jwt.sign({ id: req.user._id }, process.env.SECRET_JWT, (err, token) => {
      if (err) return next(err);

      return res.json({
        token,
        user: {
          username: req.user.username,
          email: req.user.email,
          isAdmin: req.user.isAdmin,
          isModerator: req.user.isModerator,
          id: req.user._id,
          createdAt: req.user.createdAt
        },
      });
    });
  },
];

export default {
  post,
};
