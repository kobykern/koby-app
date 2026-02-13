import express from 'express';
import dotenv from 'dotenv';

import userRoutes from './routes/users';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 8000;

app.use('/api/users', userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get('/', (req, res) => {
  res.send('Hello, World!');
});