import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import morgan from 'morgan';
import routes from './routes';

const app = express();

const PORT = process.env.PORT || 8000;

// Disable ETag caching — forces auth middleware to run every time
app.set('etag', false);

app.use(morgan('dev'));
app.use(express.json());

// Prevent all response caching
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    next();
});

// All routes under /api
app.use('/api', routes);

app.get('/', (req, res) => {
  res.send(`
      <div>
        <h1>Welcome to the Koby App API</h1>
        <p>Endpoints:</p>
        <ul>
          <li><strong>POST /api/auth/register</strong> - Register</li>
          <li><strong>POST /api/auth/login</strong> - Login</li>
          <li><strong>POST /api/auth/refresh</strong> - Refresh token</li>
          <li><strong>POST /api/auth/logout</strong> - Logout</li>
          <li><strong>GET /api/users</strong> - Get all users (protected)</li>
          <li><strong>GET /api/users/:id</strong> - Get user by ID (protected)</li>
        </ul>
      </div>
    `);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});