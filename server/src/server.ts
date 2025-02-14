import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs, resolvers } from './schemas/index.js';
import mongoose from 'mongoose';
import { authenticateToken } from './services/auth.js';  

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Start Apollo Server
await server.start();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Apply Apollo Server middleware
app.use('/graphql', expressMiddleware(server, {
  context: async ({ req }) => {
    // Get the token from the headers
    const token = req.headers.authorization?.split(' ')[1] || '';
    // Add user to context if token is valid
    try {
      const user = token ? authenticateToken(token) : null;
      return { user };
    } catch (err) {
      return {};
    }
  }
}));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../client/dist')));
  
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
  });
}

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/googlebooks')
  .then(() => {
    console.log('✅ Successfully connected to MongoDB.');
    app.listen(PORT, () => {
      console.log(`🚀 Server ready at http://localhost:${PORT}`);
      console.log(`🎮 GraphQL Playground available at http://localhost:${PORT}/graphql`);
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
  });