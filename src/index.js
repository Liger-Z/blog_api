import 'dotenv/config';
import express from 'express';
import cors from 'cors';

const app = express();
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('GET REQUEST RECEIVED!');
})

app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}!`); 
});