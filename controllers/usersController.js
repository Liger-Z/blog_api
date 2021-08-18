import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import models from '../models/index';

const index = (req, res, next) => {
  models.User.find().exec((err, users) => {
    if (err) return next(err);

    res.send(users);
  });
};

const show = (req, res, next) => {
  models.User.findById(req.params.userId).exec((err, user) => {
    if (err) return next(err);

    res.send(user);
  });
};

const create = [
  body('username', 'Please enter a username!')
    .trim()
    .escape()
    .isLength({ min: 1 }),
  body('email', 'Please enter an e-mail!').trim().escape().isEmail(),
  body('password', 'Password must be at least 8 characters long!')
    .trim()
    .escape()
    .isLength({ min: 8 }),
  body('passwordConfirmation')
    .trim()
    .escape()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match!');
      }

      return true;
    }),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      let formattedErrors = {};
      errors.array().forEach((error) => {
        formattedErrors[error.param] = error.msg;
      });

      return res.status(400).send(formattedErrors);
    } else {
      bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
        if (err) return next(err);

        const user = new models.User({
          username: req.body.username,
          email: req.body.email,
          password: hashedPassword,
        });

        user.save((err, user) => {
          if (err) return next(err);

          res.json({ msg: `User ${user.username} successfully created!` });
        });
      });
    }
  },
];

const update = [
  body('username', 'Please enter a username!')
    .trim()
    .escape()
    .isLength({ min: 1 })
    .custom((value, { req }) => {
      // Must input a different username from their current username
      if (value === req.user.username)
        throw new Error("You didn't change your username...");

      return true;
    }),

  (req, res, next) => {
    const errors = validationResult(req);

    // Cannot change a username if you are not logged in as that user
    if (req.user.id !== req.params.userId) {
      return res.status(403).send('Forbidden');
    }

    if (!errors.isEmpty()) {
      return res.status(400).send(
        errors.array().map((error) => {
          return error.msg;
        })
      );
    } else {
      models.User.updateOne(
        { username: req.user.username },
        { username: req.body.username },
        (err, updateResult) => {
          if (err) return next(err);

          return res.send(`Username changed to ${req.body.username}!`);
        }
      );
    }
  },
];

const destroy = async (req, res, next) => {
  if (req.user.isAdmin) {
    await models.User.deleteOne({ _id: req.params.userId }).exec();

    return res.send('User deleted');
  }

  const user = await models.User.findById(req.params.userId).exec();

  if (req.user.id !== user.id) {
    return res.status(403).send('FORBIDDEN');
  } else {
    await models.User.deleteOne({ _id: req.params.userId }).exec();

    return res.send('User deleted');
  }
};

export default {
  index,
  show,
  create,
  update,
  destroy,
};
