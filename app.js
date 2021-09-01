import 'dotenv/config';
import express from 'express';
import cors from 'cors';

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000'
}));

// Mongoose stuff //

import mongoose from 'mongoose';

mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

// Routes //

import router from './routes/index';

app.use('/users', router.users);
app.use('/posts', router.posts);
app.use('/auth', router.auth);

// Error handler //

app.use((err, req, res, next) => {
  console.log(err);
  res.status(400).json(err)
})



// Open server //

db.on('open', function () {
  app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}!`); 
  });
});