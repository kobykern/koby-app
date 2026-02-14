import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import userRoutes from './routes/users';

const app = express();

const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.send(`
      <div>
        <h1>Welcome to the Koby App API</h1>
        <p>Use the following endpoints to interact with the API:</p>
        <ul>
          <li><strong>GET /api/users</strong> - Get all users</li>
          <li><strong>POST /api/users</strong> - Create a new user</li>
          <li><strong>GET /api/users/:id</strong> - Get user details by ID</li>
        </ul>
      </div>
    `);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});