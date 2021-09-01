import { body, validationResult } from 'express-validator';
import models from '../models/index';

const index = (req, res, next) => {
  models.Comment.find({ post: req.params.postId })
    .populate('user', 'username')
    .exec((err, comments) => {
      if (err) return next(err);

      res.send(comments);
    });
};

const show = (req, res, next) => {
  models.Comment.findById(req.params.commentId).exec((err, comment) => {
    if (err) return next(err);

    return res.send(comment);
  });
};

const create = [
  body('body', "You didn't write anything bruv...")
    .trim()
    .escape()
    .isLength({ min: 1 }),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.send(errors.array()[0].msg);
    } else {
      const comment = new models.Comment({
        body: req.body.body,
        user: req.user ? req.user._id : null,
        post: req.params.postId,
      });

      comment.save((err, comment) => {
        if (err) return next(err);

        res.send(comment);
      });
    }
  },
];

const update = [
  body('body', 'Please provide a comment!')
    .trim()
    .escape()
    .isLength({ min: 1 }),

  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).send(errors.array()[0].msg);
    } else {
      const comment = await models.Comment.findById(req.params.commentId)
        .populate('user')
        .exec();

      if (req.user.id !== comment.user.id) {
        //
        res.status(403).send({ msg: 'Forbidden!' });
      } else {
        comment.updateOne({ body: req.body.body }).exec();

        res.send({ msg: 'Comment updated!' });
      }
    }
  },
];

const destroy = async (req, res, next) => {
  const comment = await models.Comment.findById(req.params.commentId)
    .populate('user')
    .exec();

  if (req.user.isModerator || req.user.isAdmin) {
    // admins and moderators can unconditionally delete comments
    await models.Comment.deleteOne({ _id: req.params.commentId });

    res.send({ msg: 'Comment deleted!' });
  } else if (comment.user === null || req.user.id !== comment.user.id) {
    return res.status(403).send('FORBIDDEN');
  } else {
    await models.Comment.deleteOne({ _id: req.params.commentId }).exec();

    res.send({ msg: 'Comment deleted!' });
  }
};

export default {
  index,
  show,
  create,
  update,
  destroy,
};
