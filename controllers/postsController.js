import { body, validationResult } from 'express-validator';
import models from '../models/index';

const index = (req, res, next) => {
  models.Post.find()
    .populate('user', 'username')
    .exec((err, posts) => {
      if (err) return next(err);

      res.send(posts);
    });
};

const show = (req, res, next) => {
  models.Post.findById(req.params.postId).exec((err, post) => {
    if (err) return res.status(400).send(err);

    res.json(post);
  });
};

const create = [
  body('title', 'Please enter a title!').trim().escape().isLength({ min: 1 }),
  body('body', 'Your post needs a body!').trim().escape().isLength({ min: 1 }),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).send(
        errors.array().map((error) => {
          return error.msg;
        })
      );
    } else {
      const post = new models.Post({
        title: req.body.title,
        body: req.body.body,
        user: req.user._id,
      });

      post.save((err, post) => {
        if (err) return next(err);

        res.json(post);
      });
    }
  },
];

const update = [
  body('title').trim().escape(),
  body('body').trim().escape(),

  // figure out how to conditionally update a value
  async (req, res, next) => {
    const post = await models.Post.findById(req.params.postId)
      .populate('user')
      .exec();

    console.log(req.user, post.user.id);

    if (req.user.id !== post.user.id) {
      return res.status(403).send('FORBIDDEN');
    } else {
      post
        .updateOne({
          title: req.body.title,
          body: req.body.body,
        })
        .exec();

      res.json('Blog post updated!');
    }
  },
];

const destroy = async (req, res, next) => {
  const post = await models.Post.findById(req.params.postId)
    .populate('user')
    .exec();

  if (req.user.isAdmin) {
    await models.Post.deleteOne({ _id: req.params.postId });

    res.json({ msg: 'Post deleted!' });
  } else if (req.user.id !== post.user.id) {
    res.status(403).send('FORBIDDEN');
  } else {
    await models.Post.deleteOne({ _id: req.params.postId });

    res.json({ msg: 'Post deleted!' });
  }
};

export default {
  index,
  show,
  create,
  update,
  destroy,
};
