import jwt from 'jsonwebtoken';
import User from '../models/user';

// Run this middleware before a controller to restrict access to a route

const verifyToken = (req, res, next) => {
  // bearerToken is a string of form "Bearer <token>"
  const bearerToken = req.headers['authorization'];
  const token = bearerToken && bearerToken.split(' ')[1]

  jwt.verify(token, process.env.SECRET_JWT, (err, decoded) => {
    if (err) {
      req.authorized = false;
      return next();
    }

    User.findById(decoded.id).exec((err, user) => {
      if (err) return next(err);

      req.authorized = true;
      req.user = user;
     return next();
    });
  });
};

const restrictAccess = (req, res, next) => {
  if (!req.authorized) {
    return res.status(401).json({msg: 'UNAUTHORIZED'});
  };

  next();
};

export default { verifyToken, restrictAccess };